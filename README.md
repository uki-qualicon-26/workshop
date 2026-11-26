# Bob Workshop Guide (Qualicon 2026)

Interactive, step-by-step guide for the hands-on session: IBM Bob, the Jira MCP server and Playwright on SauceDemo.

Live at **https://uki-qualicon-26.github.io/workshop/** (people arrive from the home page, https://uki-qualicon-26.github.io/).

## How it works

- One step is shown at a time. The next step unlocks only when the participant ticks the confirmation box and continues.
- **Path A** uses the Jira MCP server (Steps 1 to 8, then 9 to 14).
- **Path B** needs no MCP. Bob reads the same tickets from the `requirements/` folder of the workshop repo (Steps 1 to 4, then 9 to 14).
- Participants can switch path at any time. Completed shared steps stay done.
- Every Bob prompt has a Copy button.
- The guide needs the one registration made on the home page, and it opens only after the quiz has been submitted. The server checks this too: `workshop_save` rejects anyone who has not submitted the quiz.
- Progress (path and completed step ids) is saved to Supabase through `workshop_get` and `workshop_save`, so people can resume on another device. Nothing else is stored.
- Step numbers match the printable runbook.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell with a strict Content Security Policy |
| `assets/guide.js` | Step content and gating logic (edit `STEPS` to change content) |
| `assets/api.js`, `config.js` | Same Supabase client and publishable key as the quiz (copy; keep identical) |
| `assets/guide.css` | Guide-specific styles |
| `assets/styles.css` | Qualicon 2026 theme shared with the quiz |

## Editing the content

Steps live in the `STEPS` array at the top of `assets/guide.js`. A step with `only: 'A'` appears on Path A only. Inside a step, a block with `only: 'A'` or `only: 'B'` appears on that path only.

After any change, update the `?v=` stamp on the asset links in `index.html` because GitHub Pages caches for about 10 minutes:

```bash
V=$(date +%Y%m%d%H%M) && sed -i '' -E "s/\?v=[0-9]+/?v=$V/g" index.html
```

Do not edit the site while participants have it open.

## Security notes

- No secrets or keys are stored in this repo or in the page.
- The guide tells participants never to paste their Jira token into a Bob chat.
- Content is built with DOM text nodes, never `innerHTML`. The CSP allows only same-origin scripts and styles, and connections to Supabase.
- Only the publishable key is in the browser. Step ids are validated server-side (`s1` to `s99`).

## Related

- Home page (register once): https://uki-qualicon-26.github.io/
- Quiz: https://uki-qualicon-26.github.io/quiz/
- Workshop code and requirements: https://github.com/satishkumar-sarathi-pillai/UKI-QUALI-CON
