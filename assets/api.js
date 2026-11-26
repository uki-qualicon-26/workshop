/* Thin client for the Supabase RPC functions defined in supabase/schema.sql */
(function () {
  "use strict";

  var cfg = window.BOB_QUIZ_CONFIG || {};
  var ERRORS = {
    invalid_name: "Please enter your full name (2 to 60 characters).",
    invalid_email: "Please use your IBM email address (ending in ibm.com).",
    invalid_host_code: "That host code is not valid.",
    reset_locked: "Clearing is locked (the quiz is live). Unlock it first.",
    already_taken: "This email has already completed the quiz. Each person gets one attempt.",
    quiz_closed: "The quiz is closed right now. Please check with your host.",
    invalid_token: "Your session expired. Please register again.",
    not_started: "The quiz has not been started yet.",
    not_submitted: "You have not submitted the quiz yet.",
    invalid_answers: "Your answers could not be read. Please try again.",
    quiz_not_done: "Finish the quiz first. The hands-on workshop unlocks when you have submitted it.",
    invalid_progress: "Your progress could not be saved. Please try again.",
    network: "Could not reach the quiz server. Check your connection and try again.",
    not_configured: "This portal is not configured yet (see README, step 4).",
    unknown: "Something went wrong. Please try again."
  };

  function isConfigured() {
    return cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
      cfg.SUPABASE_URL.indexOf("YOUR-PROJECT-REF") === -1 &&
      cfg.SUPABASE_ANON_KEY.indexOf("YOUR-SUPABASE") === -1;
  }

  function QuizError(code) {
    var e = new Error(ERRORS[code] || ERRORS.unknown);
    e.code = code;
    return e;
  }

  function rpc(name, args) {
    if (!isConfigured()) { return Promise.reject(QuizError("not_configured")); }
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 15000);
    var headers = { "Content-Type": "application/json", "apikey": cfg.SUPABASE_ANON_KEY };
    // Legacy anon keys are JWTs and may be sent as a bearer token. New sb_publishable_ keys are not JWTs
    // and must only be sent in the apikey header.
    if (cfg.SUPABASE_ANON_KEY.indexOf("eyJ") === 0) { headers.Authorization = "Bearer " + cfg.SUPABASE_ANON_KEY; }
    return fetch(cfg.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(args || {}),
      signal: ctrl.signal
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (body) {
        if (!res.ok) {
          var code = body && body.message && ERRORS[body.message] ? body.message : "unknown";
          throw QuizError(code);
        }
        return body;
      });
    }, function () {
      throw QuizError("network");
    }).then(function (v) { clearTimeout(timer); return v; },
            function (e) { clearTimeout(timer); throw e; });
  }

  // One session shared by the hub, the quiz and the workshop (same origin, same key).
  var SESSION_KEY = "bobquiz.session.v1";
  var session = {
    get: function () {
      try { var s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); return s && s.token ? s : null; }
      catch (e) { return null; }
    },
    set: function (token, name) {
      try { localStorage.setItem(SESSION_KEY, JSON.stringify({ token: token, name: name })); } catch (e) { /* storage blocked */ }
    },
    clear: function () { try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } }
  };

  window.QuizApi = {
    isConfigured: isConfigured,
    session:     session,
    workshopGet:  function (token)          { return rpc("workshop_get", { p_token: token }); },
    workshopSave: function (token, path, done, finished) {
      return rpc("workshop_save", { p_token: token, p_path: path, p_done: done, p_finished: !!finished });
    },
    config:      function ()               { return rpc("quiz_config"); },
    register:    function (name, email, hostCode) {
      var args = { p_name: name, p_email: email };
      if (hostCode) { args.p_host_code = hostCode; }   // only host test runs send this
      return rpc("quiz_register", args);
    },
    status:      function (token)          { return rpc("quiz_status", { p_token: token }); },
    start:       function (token)          { return rpc("quiz_start", { p_token: token }); },
    submit:      function (token, answers) { return rpc("quiz_submit", { p_token: token, p_answers: answers }); },
    result:      function (token)          { return rpc("quiz_result", { p_token: token }); },
    leaderboard: function (limit)          { return rpc("quiz_leaderboard", { p_limit: limit || 10 }); },
    stats:       function ()               { return rpc("quiz_stats"); },
    hostReset:   function (hostCode, action) { return rpc("quiz_host_reset", { p_host_code: hostCode, p_action: action }); }
  };
})();
