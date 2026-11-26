/* Qualicon 2026 workshop guide: one step at a time, gated, with Path A (Jira MCP) and Path B (repo fallback).
   Needs a registration and a submitted quiz. Only step progress is saved, through the workshop_* RPCs. No secrets. */
(() => {
  'use strict';

  // ---------- tiny content helpers ----------
  const p = (text) => ({ t: 'p', text });
  const ol = (items, start) => ({ t: 'ol', items, start });
  const prompt = (text, label, extra) => Object.assign({ t: 'prompt', text, label: label || 'Paste into Bob' }, extra);
  const cmd = (text, label) => ({ t: 'cmd', text, label: label || 'Command (if you prefer a terminal)' });
  const callout = (kind, title, text) => ({ t: 'callout', kind, title, text });
  const only = (path, block) => Object.assign({}, block, { only: path });
  const switchBtn = () => ({ t: 'switch' });

  // ---------- the steps (numbering matches the printable runbook) ----------
  const STEPS = [
    {
      id: 's1', num: 1, who: 'you', title: 'Create an empty folder and open it in Bob',
      confirm: 'Bob is open on my new empty folder and I have trusted it.',
      blocks: [
        ol(['Create an empty `workshop` folder in your Documents folder. Run the command below in a terminal, or create it manually.']),
        cmd('mkdir -p ~/Documents/workshop', 'macOS or Linux terminal'),
        cmd('New-Item -ItemType Directory -Force -Path "$HOME\\Documents\\workshop"', 'Windows PowerShell'),
        ol(['In IBM Bob, choose **File > Open Folder...**, select the new `workshop` folder (`Documents/workshop`), then confirm to open it as your workspace.',
            'The folder opens in **Restricted Mode** with no Bob chat panel. Click **Manage** in the banner at the top, then **Trust** on the Workspace Trust page. The chat panel then appears on the right.'], 2),
      ],
    },
    {
      id: 's2', num: 2, who: 'bob', title: 'Check tools and clone the repo',
      confirm: 'Bob reported Node 20+ and Git, and I opened the cloned UKI-QUALI-CON folder as my workspace.',
      blocks: [
        prompt('Check that Node.js 20 or later and Git are installed and tell me the versions. Then clone https://github.com/satishkumar-sarathi-pillai/UKI-QUALI-CON.git into this workspace. Tell me the result of each command and stop if any step fails. Do not change any files.'),
        callout('expect', 'You should see', 'Node 20+ and a Git version, then a new `UKI-QUALI-CON` folder.'),
        callout('warn', 'If Node or Git is missing', 'Install them yourself (this usually needs admin rights), then paste the prompt again.'),
        p("Then **open the cloned 'UKI-QUALI-CON' folder as your Bob workspace** so the next prompts can see the tests: **File > Open Folder...**, select 'UKI-QUALI-CON' inside 'Documents/workshop', then confirm."),
      ],
    },
    {
      id: 's3', num: 3, who: 'bob', title: 'Install dependencies',
      confirm: 'npm install and the Chromium download both finished without errors.',
      blocks: [
        prompt('In this workspace, run npm install, then run npx playwright install chromium. Tell me the result of each command and stop if any step fails. Do not change any files.'),
        callout('expect', 'You should see', 'Packages installed with 0 vulnerabilities, then Chromium downloaded. The browser is a few hundred MB, so this is often the slowest step.'),
        callout('warn', 'If it fails with a network or proxy error', 'Tell the facilitator. They can share an offline bundle (a zip of `node_modules` and the Playwright browser folder).'),
      ],
    },
    {
      id: 's4', num: 4, who: 'bob', title: 'Verify the install',
      confirm: 'Bob showed Playwright 1.65.1 and listed 2 tests.',
      blocks: [
        prompt('Run npx playwright --version and list the tests with npx playwright test --list. Do not run the tests.'),
        callout('expect', 'You should see', 'Playwright 1.65.1 and 2 tests: `UKIQC-2 TC1 cart badge` and `UKIQC-3 TC2 checkout totals`.'),
      ],
    },
    {
      id: 's5', num: 5, who: 'you', only: 'A', title: 'Create a Jira API token',
      confirm: 'I have created a token and stored it somewhere private (not in Bob).',
      blocks: [
        ol(['Sign in at [ibm-consulting-sandbox003.atlassian.net](https://ibm-consulting-sandbox003.atlassian.net) with your **IBM credentials** (your IBM email address). On the "Choose an account to continue" screen, pick your IBM account and click **Continue**.',
            'Join the Jira project **UKI-Quali-Con-2026**. Use the **Search** box at the top of Jira (or **Spaces > View all spaces**) to find it, open it and join if prompted. If you cannot find it, or cannot join, ask the facilitator to add you to the project. Open the project to confirm you can see its board.',
            'Open [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens) and click **Create API token**.',
            'In the **Name** field, enter a relevant name for the token, for example `UKIQUALICON-26`, and keep the default **Expires on** date (tokens last no longer than 365 days). Click **Create**.',
            'Copy the token somewhere private. It is shown only once, and may take up to a minute to start working.']),
        callout('warn', 'Never paste your token into a Bob chat', 'You type it into the settings file yourself in Step 7. Do not screen-share that file afterwards.'),
      ],
    },
    {
      id: 's6', num: 6, who: 'bob', only: 'A', title: 'Install the Jira MCP package and get the config entry',
      confirm: 'Bob gave me a JSON snippet with the correct path for my machine.',
      blocks: [
        prompt('Check that uv is installed by running "uv --version", then run "which uvx" (or "where uvx" on Windows). Do not install anything. If uv is missing, tell me how to install it and stop. Otherwise show me the atlassian-jira entry I need to add to my Bob MCP settings file, using the PyPI package mcp-atlassian (the sooperset/mcp-atlassian server) with "command" set to the full path of uvx and "args" set to ["mcp-atlassian"]. Use these environment variable names: JIRA_URL set to https://ibm-consulting-sandbox003.atlassian.net, JIRA_USERNAME set to YOUR_EMAIL_HERE and JIRA_API_TOKEN set to YOUR_TOKEN_HERE. Do not ask me for the token and do not write anything to any file.'),
        callout('warn', 'Leave the placeholders as they are', 'Keep `YOUR_EMAIL_HERE` and `YOUR_TOKEN_HERE` in the prompt. Bob never needs your real values.'),
        callout('expect', 'You should see', 'A JSON snippet to copy. The `uvx` path differs per machine, so use the path Bob found, not someone else\'s.'),
        callout('warn', 'If uv is missing', 'Install it yourself from [docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/), open a new terminal, then paste the prompt again.'),
        p('The server downloads automatically the first time Bob starts it, so Step 7 may take a minute on first reload. The package is community-maintained, so treat it as workshop-only.'),
      ],
    },
    {
      id: 's7', num: 7, who: 'you', only: 'A', title: 'Add the entry and your real credentials, then reload',
      confirm: 'I saved the settings file with my own email and token, and reloaded the MCP server.',
      blocks: [
        ol(['In Bob, click the **Settings** icon in the Bob panel and open the **MCP** tab.',
            'Click the **+** (Add MCP Server) button above the server list. In the **Configuration Scope** box choose **Global (All Workspaces)**, not the `UKI-QUALI-CON` workspace option.',
            'Click **Open Configuration File**. This opens `~/.bob/settings/mcp.json`.',
            'Paste the `atlassian-jira` entry from Step 6 into this file. If the file is empty, the whole file is the `{ "mcpServers": { ... } }` block. If it already lists other servers, add only the `"atlassian-jira": { ... }` part inside the existing `mcpServers` and keep a comma between entries. Do not replace the other servers.',
            'Replace `YOUR_EMAIL_HERE` and `YOUR_TOKEN_HERE` with your real email and token, then save the file.',
            'Reload the MCP servers: click the **refresh** icon next to **+** in the MCP tab. The first start downloads the server, so allow a minute.',
            'Check the connection: `atlassian-jira` should appear in the server list with a green dot, status **Connected** and scope **Global**.']),
        callout('expect', 'You should see', '`atlassian-jira` shown as **Connected** with scope **Global**.'),
        callout('quiz', 'Quiz callback: MCP menu path', 'Settings icon, then the **MCP** tab, then **+** and pick a scope. Global is `~/.bob/settings/mcp.json` and applies to every workspace. Project is `.bob/mcp.json` in the project folder, and it wins if the same server name is in both. Put the token in the **global** file, because a project file can end up in version control.'),
        callout('warn', 'Most common failure', 'A wrong base URL, or a token from a different Jira site. Symptoms: `Cannot read properties of undefined (reading \'map\')`, or a profile URL that does not contain `ibm-consulting-sandbox003`.'),
        callout('warn', 'If it does not show Connected', 'Check that the email and token have no extra spaces or quotes, that the `uvx` path is the one Bob found in Step 6, and that the token was created at least a minute ago. Then refresh again, or ask the facilitator.'),
      ],
    },
    {
      id: 's8', num: 8, who: 'bob', only: 'A', title: 'Smoke test',
      confirm: 'Bob named me and read the UKIQC-1 summary from Jira.',
      blocks: [
        prompt('Using the Jira MCP server, tell me who I am logged in as and confirm you can read ticket UKIQC-1.'),
        callout('expect', 'You should see', 'Your name, a profile URL on `ibm-consulting-sandbox003.atlassian.net`, and the UKIQC-1 summary.'),
        callout('path', 'Cannot make this pass quickly?', 'Do not lose time. Switch to Path B: the same tickets are saved in the repo, and your steps 1 to 4 count as done.'),
        switchBtn(),
      ],
    },
    {
      id: 's9', num: 9, who: 'bob', title: 'Retrieve the user story and acceptance criteria',
      confirm: 'Bob summarised UKIQC-1 and flagged what is not specified.',
      blocks: [
        only('A', prompt('Using the Jira MCP server, read UKIQC-1. Summarise the user journey, list the acceptance criteria and highlight anything not specified. Do not infer missing requirements.', 'Paste into Bob (Path A, reads from Jira)')),
        only('B', prompt('Read requirements/UKIQC-1.md. Summarise the user journey, list the acceptance criteria and highlight anything not specified. Do not infer missing requirements.', 'Paste into Bob (Path B, reads from the repo)')),
        callout('expect', 'You should see', 'The story, 5 acceptance criteria, and a flagged gap: the expected Item Total, Tax and Total values and the tax rule are not specified.'),
        callout('quiz', 'Quiz callback: Ask mode', 'Try this step in **Ask** mode. It explains without changing any files.'),
      ],
    },
    {
      id: 's10', num: 10, who: 'bob', title: 'Look at the associated test cases',
      confirm: 'Bob showed TC1, TC2 and TC3 next to the acceptance criteria.',
      blocks: [
        only('A', prompt('Read UKIQC-2, UKIQC-3 and UKIQC-4 with the Jira MCP server. These are test cases for UKIQC-1. Show their steps and expected results side by side with the acceptance criteria and note any gaps.', 'Paste into Bob (Path A, reads from Jira)')),
        only('B', prompt('Read requirements/UKIQC-2.md, requirements/UKIQC-3.md and requirements/UKIQC-4.md. These are test cases for UKIQC-1 (requirements/UKIQC-1.md). Show their steps and expected results side by side with the acceptance criteria and note any gaps.', 'Paste into Bob (Path B, reads from the repo)')),
        callout('expect', 'You should see', 'TC1 (cart badge), TC2 (price relationships) and TC3 (blank Postal Code, the mid-sprint change).'),
        only('A', callout('tip', 'Name the keys explicitly', 'JQL search does not work with this MCP server, so "find the tests linked to UKIQC-1" will fail.')),
      ],
    },
    {
      id: 's11', num: 11, who: 'bob', title: 'Review and run the existing Playwright tests',
      confirm: 'Both tests passed and I could see the HTML report.',
      blocks: [
        prompt('Open tests/checkout-calculation.spec.js and briefly explain what the two tests check and why they do not assert fixed price or tax values. Then run the file in headed Chromium and open the HTML report. Summarise the results from the actual output, including any failures and likely causes. Do not claim a test passed unless the run confirms it.'),
        callout('expect', 'You should see', '2 passed, a headed browser slowed by `slowMo`, and an HTML report with a video under each test\'s Attachments.'),
        cmd('npx playwright test tests/checkout-calculation.spec.js --headed\nnpx playwright show-report'),
        p('If the report page will not load, run `npx playwright show-report` in a terminal in the project folder. It must stay running in the foreground.'),
      ],
    },
    {
      id: 's12', num: 12, who: 'bob', title: 'Add the negative test',
      confirm: 'Bob explained the change first, then added the UKIQC-4 test.',
      blocks: [
        only('A', prompt('The product owner has added a requirement. Read UKIQC-4 with the Jira MCP server. Add a third test to tests/checkout-calculation.spec.js for it: leave Postal Code blank at checkout and assert that "Error: Postal Code is required" is displayed and the user stays on the checkout information page. Name it "UKIQC-4 TC3 postal code required" and keep it inside the existing UKIQC-1 describe block. Use data-test locators. Keep the existing tests unchanged and explain the change before you apply it.', 'Paste into Bob (Path A, reads from Jira)')),
        only('B', prompt('The product owner has added a requirement. Read requirements/UKIQC-4.md. Add a third test to tests/checkout-calculation.spec.js for it: leave Postal Code blank at checkout and assert that "Error: Postal Code is required" is displayed and the user stays on the checkout information page. Name it "UKIQC-4 TC3 postal code required" and keep it inside the existing UKIQC-1 describe block. Use data-test locators. Keep the existing tests unchanged and explain the change before you apply it.', 'Paste into Bob (Path B, reads from the repo)')),
        callout('expect', 'You should see', 'An explanation first, then a new test that reuses the same helpers (`login`, `addItemsToCart`).'),
        callout('quiz', 'Quiz callback: Plan then Agent', 'Start in **Plan** mode and ask Bob to plan the test, then switch to **Agent** mode to apply it. This shows why Bob has separate modes.'),
        callout('warn', 'Keep it local', 'Do not push this test to the shared repo. The reference suite stays at 2 tests for the live demo.'),
      ],
    },
    {
      id: 's13', num: 13, who: 'bob', title: 'Run only the new test',
      confirm: 'The UKIQC-4 test ran on its own and passed.',
      blocks: [
        prompt('Run only the UKIQC-4 test in headed Chromium using the -g flag, then summarise the result from the actual output. Do not claim it passed unless the run confirms it.'),
        cmd('npx playwright test tests/checkout-calculation.spec.js --headed -g "UKIQC-4"', 'Equivalent command'),
        callout('expect', 'You should see', '1 passed. SauceDemo shows `Error: Postal Code is required` for a blank postal code.'),
      ],
    },
    {
      id: 's14', num: 14, who: 'you', title: 'Check Bobcoins, tokens and Bobalytics',
      confirm: 'I found my Bobcoin gauge and noted the Bobcoins this chat used.',
      blocks: [
        ol(['**Budget gauge:** hover over the gauge in the top-right corner of the Bob panel to see your remaining Bobcoins.',
            '**This chat:** with the conversation open, look at the top-right of the chat for the tokens and Bobcoins used so far. Note what the whole workshop cost you.',
            '**Bobalytics:** at bob.ibm.com choose **Admin**, then the **Bobalytics** tab. It is an Enterprise feature for admins, so the presenter demos it unless you are an admin.']),
        callout('quiz', 'Quiz callback: Bobcoins and Bobalytics', 'Tokens are what the model uses. Bobcoins are the budget Bob converts them into. Bobalytics shows three KPIs: **Adoption rate**, **Bob factor** (the percentage of committed lines of code that Bob created) and **Bobcoin spend**.'),
        p('Write down the Bobcoins used. It is a good number to quote when you tell stakeholders what the workshop cost.'),
      ],
    },
    {
      id: 's15', num: 15, who: 'bob', only: 'A', optional: true, title: 'Draft a Jira bug',
      confirm: 'Bob drafted a bug and I did not let it create anything in Jira.',
      blocks: [
        prompt('Draft a Jira bug for the last failing test in project UKIQC, with steps, expected result and actual result. Show me the draft and do not create anything in Jira until I say so.'),
        p('This is only useful if something failed. Bob must not create issues unless you explicitly tell it to.'),
      ],
    },
  ];

  // ---------- state ----------
  // Progress lives on the server (workshop_get / workshop_save), keyed by the registration made on the home page.
  const IDS = new Set(STEPS.map((s) => s.id));
  const api = window.QuizApi;
  let sess = null;
  let state = blank();

  function blank() { return { path: null, done: {}, view: null, startedAt: null, finishedAt: null }; }

  function fromServer(s) {
    const st = blank();
    if (s.path === 'A' || s.path === 'B') st.path = s.path;
    (Array.isArray(s.done) ? s.done : []).forEach((k) => { if (IDS.has(k)) st.done[k] = true; });
    const t0 = Date.parse(s.started_at), t1 = Date.parse(s.finished_at);
    if (st.path && Number.isFinite(t0)) st.startedAt = t0;
    if (Number.isFinite(t1)) st.finishedAt = t1;
    return st;
  }

  // Saves are queued so they reach the server in order. A failure shows a banner but never blocks the guide.
  let saving = Promise.resolve();
  function save() {
    if (!sess) return;
    const path = state.path, done = Object.keys(state.done), finished = !!state.finishedAt;
    saving = saving.then(() => api.workshopSave(sess.token, path, done, finished))
      .then(() => showError(''))
      .catch((e) => {
        if (e.code === 'invalid_token') { api.session.clear(); renderGate('register'); return; }
        showError(e.message + ' Your progress on this page is kept, but it may not be saved yet. It will retry on your next click.');
      });
  }

  function showError(msg) {
    const e = $('error');
    e.textContent = msg || '';
    e.classList.toggle('hidden', !msg);
  }

  const list = () => STEPS.filter((s) => !s.only || s.only === state.path);
  const firstUnfinished = (steps) => steps.findIndex((s) => !state.done[s.id]);

  // ---------- DOM helpers ----------
  const $ = (id) => document.getElementById(id);

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === false || v == null) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    kids.flat().forEach((k) => { if (k != null) el.append(k); });
    return el;
  }

  // Minimal inline markup: `code`, **bold**, [text](https://link). Built with DOM nodes, never innerHTML.
  function inline(parent, text) {
    const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^)\s]+\))/g;
    text.split(re).forEach((part) => {
      if (!part) return;
      let m;
      if (part[0] === '`') parent.append(h('code', { text: part.slice(1, -1) }));
      else if (part.startsWith('**')) parent.append(h('strong', { text: part.slice(2, -2) }));
      else if ((m = /^\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/.exec(part))) {
        parent.append(h('a', { href: m[2], target: '_blank', rel: 'noopener noreferrer', text: m[1] }));
      } else parent.append(document.createTextNode(part));
    });
    return parent;
  }

  async function copyText(text, btn) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = h('textarea', { 'aria-hidden': 'true' });
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = ok ? 'Copied' : 'Select and copy manually';
    setTimeout(() => { btn.textContent = old; }, 1600);
  }

  // ---------- block renderers ----------
  function renderBlock(b) {
    if (b.only && b.only !== state.path) return null;
    switch (b.t) {
      case 'p': return inline(h('p'), b.text);
      case 'ol': return h('ol', b.start ? { start: String(b.start) } : null, b.items.map((i) => inline(h('li'), i)));
      case 'prompt':
      case 'cmd': {
        const btn = h('button', { class: 'btn secondary copy', type: 'button', text: 'Copy' });
        btn.addEventListener('click', () => copyText(b.text, btn));
        return h('div', { class: 'promptbox' + (b.t === 'cmd' ? ' cmd' : '') },
          h('div', { class: 'plabel' }, h('span', { text: b.label }), btn),
          h('pre', { text: b.text }));
      }
      case 'callout':
        return h('div', { class: 'callout ' + b.kind }, h('span', { class: 'ctitle', text: b.title }), inline(h('span'), b.text));
      case 'switch': {
        const btn = h('button', { class: 'btn secondary', type: 'button', text: 'Switch to Path B' });
        btn.addEventListener('click', () => setPath('B'));
        return h('p', null, btn);
      }
      default: return null;
    }
  }

  // ---------- actions ----------
  function setPath(path) {
    state.path = path;
    if (!state.startedAt) state.startedAt = Date.now();
    state.finishedAt = null;
    const steps = list();
    const i = firstUnfinished(steps);
    state.view = i === -1 ? steps[steps.length - 1].id : steps[i].id;
    save(); render(true);
  }

  function complete(step) {
    state.done[step.id] = true;
    const steps = list();
    const i = firstUnfinished(steps);
    if (i === -1) { state.finishedAt = state.finishedAt || Date.now(); state.view = null; }
    else state.view = steps[i].id;
    save(); render(true);
  }

  function view(id) { state.view = id; save(); render(true); }

  function restart() {
    if (!window.confirm('Start over? This clears your saved workshop progress.')) return;
    state = blank(); save(); render(true);
  }

  // ---------- views ----------
  function renderWelcome(app) {
    const a = h('button', { class: 'choice a', type: 'button' },
      h('b', { text: 'Path A: Jira MCP' }),
      h('span', { class: 'muted', text: 'I will connect Bob to IBM Jira and read the tickets live. Needs your own Jira token (Steps 5 to 8).' }));
    const b = h('button', { class: 'choice b', type: 'button' },
      h('b', { text: 'Path B: no MCP needed' }),
      h('span', { class: 'muted', text: 'Bob reads the same tickets from the repo\'s requirements folder. Choose this if MCP is not set up or is giving you trouble.' }));
    a.addEventListener('click', () => setPath('A'));
    b.addEventListener('click', () => setPath('B'));
    app.append(h('section', { class: 'card welcome' },
      h('h2', { text: 'Welcome to the hands-on' }),
      inline(h('p'), 'You will use IBM Bob to read a Jira story, run Playwright tests on SauceDemo and add a new negative test. It takes about 15 minutes after the quiz.'),
      h('ul', { class: 'rules' },
        h('li', { text: 'One step is shown at a time. The next step unlocks when you tick the box and continue.' }),
        h('li', { text: 'Steps 1 to 4 are the same on both paths. Path B skips Steps 5 to 8. From Step 9 the journeys rejoin.' }),
        inline(h('li'), 'Step numbers match the printable runbook.')),
      callout2('warn', 'Never paste your Jira token into a Bob chat', 'You type it into the settings file yourself.'),
      h('h2', { text: 'Choose your path' }),
      h('div', { class: 'choices' }, a, b)));
  }

  // Shown instead of the guide when the person is not registered, has not finished the quiz, or the server is unreachable.
  function renderGate(kind, detail) {
    $('topbar').classList.add('hidden');
    const app = $('app');
    app.replaceChildren();
    let title, text, link;
    if (kind === 'register') {
      title = 'Register first';
      text = 'Register once on the home page with your name and IBM email. Then take the quiz, and the workshop unlocks when you submit it.';
      link = h('a', { class: 'btn big', href: '../', text: 'Go to the home page' });
    } else if (kind === 'quiz') {
      title = 'Finish the quiz to unlock the workshop';
      text = detail === 'in_progress'
        ? 'Your quiz is still in progress. Submit it and this page unlocks.'
        : 'You have not taken the quiz yet. It takes about three minutes, and this page unlocks when you submit it.';
      link = h('a', { class: 'btn big', href: '../quiz/', text: detail === 'in_progress' ? 'Resume the quiz' : 'Start the quiz' });
    } else {
      title = 'Could not load your progress';
      text = detail || 'Check your connection and try again.';
      const retry = h('button', { class: 'btn big', type: 'button', text: 'Try again' });
      retry.addEventListener('click', boot);
      link = retry;
    }
    app.append(h('section', { class: 'card finish' },
      h('div', { class: 'big-emoji', text: kind === 'error' ? '⚠️' : '🔒' }),
      h('h2', { text: title }),
      h('p', { class: 'muted', text }),
      h('div', { class: 'row center' }, link)));
  }

  function callout2(kind, title, text) { return renderBlock(callout(kind, title, text)); }

  function renderFinish(app) {
    const mins = state.startedAt && state.finishedAt ? Math.max(1, Math.round((state.finishedAt - state.startedAt) / 60000)) : null;
    const again = h('button', { class: 'btn secondary', type: 'button', text: 'Review the steps' });
    again.addEventListener('click', () => view(list()[0].id));
    app.append(h('section', { class: 'card finish' },
      h('div', { class: 'big-emoji', text: '🏁' }),
      h('h2', { text: 'Workshop complete' }),
      h('p', { text: 'You used Bob to read requirements, run tests and add a new test.' + (mins ? ' Time on this guide: about ' + mins + ' minute' + (mins === 1 ? '' : 's') + '.' : '') }),
      callout2('tip', 'Before you leave', 'Write down the Bobcoins your session used (Step 14), and do not push the new UKIQC-4 test to the shared repo.'),
      h('div', { class: 'row center' }, again, h('a', { class: 'btn secondary', href: '../', text: 'Back to home' }))));
  }

  function renderStep(app, steps, idx, current) {
    const step = steps[idx];
    const isDone = !!state.done[step.id];
    const whoTag = step.who === 'you' ? h('span', { class: 'who you', text: 'You do this' }) : h('span', { class: 'who bob', text: 'Paste into Bob' });
    const heading = h('h2', { tabindex: '-1', id: 'step-title', text: step.title });
    const card = h('section', { class: 'card stepcard' },
      h('div', { class: 'stepmeta' },
        h('span', { class: 'stepno', text: 'Step ' + step.num }), whoTag,
        step.optional ? h('span', { class: 'who opt-tag', text: 'Optional' }) : null,
        isDone ? h('span', { class: 'who bob', text: 'Done' }) : null),
      heading,
      step.blocks.map(renderBlock));

    const gate = h('div', { class: 'gate' });
    if (isDone) {
      const goCurrent = h('button', { class: 'btn', type: 'button', text: current === -1 ? 'Finish' : 'Go to my current step' });
      goCurrent.addEventListener('click', () => (current === -1 ? render(true) : view(steps[current].id)));
      gate.append(h('p', { class: 'lockedmsg', text: 'You already completed this step.' }), goCurrent);
    } else {
      const box = h('input', { type: 'checkbox', id: 'confirm' });
      const next = h('button', { class: 'btn big', type: 'button', disabled: true, text: idx === steps.length - 1 ? 'Finish' : 'Done, unlock next step' });
      box.addEventListener('change', () => { next.disabled = !box.checked; });
      next.addEventListener('click', () => { if (box.checked) complete(step); });
      gate.append(h('label', { class: 'check', for: 'confirm' }, box, h('span', { text: step.confirm })));
      const row = h('div', { class: 'row' }, next);
      if (step.optional) {
        const skip = h('button', { class: 'btn secondary', type: 'button', text: 'Skip this step' });
        skip.addEventListener('click', () => complete(step));
        row.append(skip);
      }
      gate.append(row);
      gate.append(h('p', { class: 'lockedmsg', text: idx < steps.length - 1 ? 'The next step stays locked until you continue.' : 'This is the last step.' }));
    }
    card.append(gate);
    app.append(card);

    const prev = steps[idx - 1];
    if (prev) {
      const back = h('button', { class: 'btn secondary', type: 'button', text: 'Back to Step ' + prev.num });
      back.addEventListener('click', () => view(prev.id));
      app.append(h('div', { class: 'row' }, back));
    }
  }

  function renderTopbar(steps, current) {
    const bar = $('topbar');
    bar.classList.remove('hidden');
    const pl = $('path-label');
    pl.textContent = state.path === 'A' ? 'Path A: Jira MCP' : 'Path B: requirements from the repo';
    pl.className = 'pathpill' + (state.path === 'B' ? ' b' : '');
    const sw = $('switch-path');
    sw.textContent = state.path === 'A' ? 'MCP not working? Switch to Path B' : 'Switch to Path A (Jira MCP)';
    const doneCount = steps.filter((s) => state.done[s.id]).length;
    $('progress-text').textContent = doneCount + ' of ' + steps.length + ' steps done';
    $('progress-fill').style.width = Math.round((doneCount / steps.length) * 100) + '%';

    const nav = $('stepper');
    nav.replaceChildren();
    steps.forEach((s, i) => {
      const isDone = !!state.done[s.id];
      const accessible = current === -1 || i <= current;
      const cls = 'pip' + (isDone ? ' done' : '') + (i === current ? ' current' : '') + (state.view === s.id ? ' viewing' : '');
      const b = h('button', { class: cls, type: 'button', disabled: !accessible,
        'aria-label': 'Step ' + s.num + (isDone ? ' (done)' : i === current ? ' (current)' : ' (locked)'), text: String(s.num) });
      b.addEventListener('click', () => view(s.id));
      nav.append(b);
    });
  }

  function render(focus) {
    const app = $('app');
    app.replaceChildren();
    if (!state.path) { $('topbar').classList.add('hidden'); renderWelcome(app); return; }

    const steps = list();
    const current = firstUnfinished(steps);
    let idx = steps.findIndex((s) => s.id === state.view);
    // A step is viewable only if it is at or before the current (first unfinished) step.
    if (idx === -1 || (current !== -1 && idx > current)) idx = current;
    state.view = idx === -1 ? null : steps[idx].id;
    renderTopbar(steps, current);

    if (idx === -1) renderFinish(app);
    else renderStep(app, steps, idx, current);
    if (focus) {
      window.scrollTo(0, 0);
      const t = $('step-title'); if (t) t.focus({ preventScroll: true });
    }
  }

  async function boot() {
    showError('');
    if (!api || !api.isConfigured()) return renderGate('error', 'This portal is not configured yet.');
    sess = api.session.get();
    if (!sess) return renderGate('register');
    $('app').replaceChildren(h('p', { class: 'muted', text: 'Loading your progress...' }));
    try {
      const s = await api.workshopGet(sess.token);
      if (s.quiz_state !== 'submitted') return renderGate('quiz', s.quiz_state);
      state = fromServer(s);
      render(false);
    } catch (e) {
      if (e.code === 'invalid_token') { api.session.clear(); return renderGate('register'); }
      renderGate('error', e.message);
    }
  }

  $('switch-path').addEventListener('click', () => setPath(state.path === 'A' ? 'B' : 'A'));
  $('restart').addEventListener('click', restart);
  boot();
})();
