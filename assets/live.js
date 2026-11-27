/* Workshop big screen: polls workshop_stats every 5 seconds and draws counters, a step funnel and two tables.
   Built with DOM nodes and textContent only, never innerHTML. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var STEPS = [
    'Create a folder, open it in Bob', 'Check tools, clone the repo', 'Install dependencies', 'Verify the install',
    'Create a Jira API token', 'Install the Jira MCP package', 'Add the entry and credentials', 'Smoke test',
    'Retrieve the user story', 'Look at the test cases', 'Run the existing tests', 'Add the negative test',
    'Run only the new test', 'Bobcoins and Bobalytics'
  ];
  var PATH_A_ONLY = { 5: 1, 6: 1, 7: 1, 8: 1 };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text != null) { e.textContent = text; }
    return e;
  }

  function showErr(msg) { var e = $('err'); e.textContent = msg || ''; e.classList.toggle('hidden', !msg); }

  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function renderFunnel(steps, started) {
    var box = $('funnel');
    box.textContent = '';
    var max = Math.max(1, started);
    STEPS.forEach(function (title, i) {
      var n = i + 1, count = Number(steps['s' + n]) || 0;
      var row = el('div', 'frow' + (PATH_A_ONLY[n] ? ' pathA' : ''));
      row.appendChild(el('span', 'fnum', String(n)));
      row.appendChild(el('span', 'ftitle', title));
      var track = el('div', 'ftrack'), fill = el('div', 'ffill');
      fill.style.width = Math.min(100, Math.round(100 * count / max)) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('span', 'fcount', String(count)));
      box.appendChild(row);
    });
  }

  function renderTable(wrapId, heads, rows, emptyText) {
    var wrap = $(wrapId);
    wrap.textContent = '';
    var tbl = el('table', 'lb'), thead = document.createElement('thead'), hr = document.createElement('tr');
    heads.forEach(function (h) { hr.appendChild(el('th', h[1], h[0])); });
    thead.appendChild(hr); tbl.appendChild(thead);
    var tb = document.createElement('tbody');
    rows.forEach(function (cells) {
      var tr = document.createElement('tr');
      cells.forEach(function (c, i) { tr.appendChild(c instanceof Node ? c : el('td', heads[i][1] === 'num' ? 'num' : '', c)); });
      tb.appendChild(tr);
    });
    if (!rows.length) {
      var tr0 = document.createElement('tr'), td0 = el('td', 'muted', emptyText);
      td0.colSpan = heads.length; tr0.appendChild(td0); tb.appendChild(tr0);
    }
    tbl.appendChild(tb); wrap.appendChild(tbl);
  }

  function tag(path) { var td = el('td', ''); td.appendChild(el('span', 'pathtag', path || '-')); return td; }

  function render(s) {
    $('c-quiz').textContent = s.quiz_done;
    $('c-work').textContent = Math.max(0, s.started - s.finished);
    $('c-done').textContent = s.finished;
    $('c-stall').textContent = s.stalled;
    $('paths').textContent = 'Path A (Jira MCP): ' + s.path_a + '   |   Path B (no MCP): ' + s.path_b;
    renderFunnel(s.steps || {}, s.started);

    var medals = ['🥇', '🥈', '🥉'];
    renderTable('lb-fast', [['#', ''], ['Name', ''], ['Path', ''], ['Time', 'num']],
      (s.leaders || []).map(function (r, i) { return [medals[i] || String(i + 1), r.name, tag(r.path), fmt(r.seconds)]; }),
      'Waiting for the first finisher...');
    renderTable('lb-active', [['Name', ''], ['Path', ''], ['Steps', 'num']],
      (s.active || []).map(function (r) { return [r.name, tag(r.path), Math.min(r.steps_done, r.path === 'B' ? 10 : 14) + '/' + (r.path === 'B' ? 10 : 14)]; }),
      'Nobody is working right now.');
    $('updated').textContent = 'Updated ' + new Date().toLocaleTimeString() + '. Refreshes every 5 seconds.';
  }

  function refresh() {
    window.QuizApi.workshopStats().then(function (s) { showErr(''); render(s); })
      .catch(function (e) { showErr(e.message); });
  }

  if (!window.QuizApi.isConfigured()) { showErr('Not configured yet - see README.'); }
  else { refresh(); setInterval(refresh, 5000); }
})();
