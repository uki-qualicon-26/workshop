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
- The workshop is time boxed to 20 minutes. The countdown in the path bar starts when the participant first chooses a path and keeps running through refreshes and Start over (it uses the stored `started_at`). It is a soft limit: at zero it shows "Time is up" and the guide stays open. Change `WORKSHOP_MINUTES` in `assets/guide.js` to adjust it.

## Live progress screen

Project **https://uki-qualicon-26.github.io/workshop/live.html** during the hands-on. It refreshes every 5 seconds and shows how many people finished the quiz, are working, finished the workshop or have made no progress for 5 minutes. It also shows how many people have ticked each step (to spot where the room is stuck), the fastest finishers and who is furthest along. It needs the `workshop_stats()` function from `supabase/schema.sql` in the quiz repo. Host test runs are excluded. No emails or tokens are shown, only names and counts.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell with a strict Content Security Policy |
| `assets/guide.js` | Step content and gating logic (edit `STEPS` to change content) |
| `assets/api.js`, `config.js` | Same Supabase client and publishable key as the quiz (copy; keep identical) |
| `assets/guide.css` | Guide-specific styles |
| `live.html`, `assets/live.js`, `assets/live.css` | Facilitator big screen: live counters, step funnel and top 10 tables (reads `workshop_stats`) |
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
