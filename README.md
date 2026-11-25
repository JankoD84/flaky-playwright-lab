# flaky-playwright-lab

Three classic flaky Playwright patterns, a way to reproduce them on your laptop, and the fix for each.

Every test in `tests/flaky/` **passes most of the time on a single run** and **fails under repeated, parallel runs**, which is exactly how flaky tests behave in CI. The same checks in `tests/fixed/` stay green no matter how often you run them.

```text
$ npm run test:flaky            # usually green
$ npm run test:flaky:stress     # 20x each, 8 workers → some runs fail
$ npm run test:fixed:stress     # 20x each, 8 workers → always green
```

Measured on a laptop, 20 repeats × 3 tests, 8 workers: flaky project failed 2 of 60 runs; fixed project passed 80 of 80.

## The app

`site/index.html` is a tiny shop page. It fetches `/api.json` and then renders a price, three items and a Buy button. About 1 in 10 requests is slow (400 ms instead of 40 ms). That simulates what a shared CI runner, a cold cache or a busy test database does to response times.

## The three patterns

| # | Flaky pattern | Why it fails | Fix |
|---|---|---|---|
| 1 | `waitForTimeout(120)` then `toHaveText(..., { timeout: 30 })` | A fixed sleep guesses how long the app needs. The guess is wrong whenever the app is slower than usual. | Remove the sleep. Use the default web-first assertion timeout: `await expect(locator).toHaveText('19 EUR')` |
| 2 | `expect(await locator.count()).toBe(3)` | `count()` reads the DOM **once**. If the data has not arrived yet, the count is 0. | `await expect(locator).toHaveCount(3)` retries until the count matches |
| 3 | `expect(await locator.isVisible()).toBe(true)` | `isVisible()` is a snapshot, not an assertion that waits | `await expect(locator).toBeVisible()` |

Bonus in `tests/fixed`: assert against the API response itself with `page.waitForResponse(...)`, so the test follows the data instead of the clock.

## Run it

```bash
npm ci
npx playwright install chromium
npm test                    # fixed tests
npm run test:flaky:stress   # watch the flaky ones fail
```

Requires Node 20+ and Python 3 (the demo site is served with `python3 -m http.server`).

## CI

`.github/workflows/ci.yml` runs two jobs:

- **fixed**: every fixed test 10 times; must be green.
- **flaky-demo**: every flaky test 20 times with `continue-on-error`, so you can see real CI failures without breaking the build. HTML reports with traces are uploaded as artifacts.

## How to find these in your own suite

1. Search for `waitForTimeout`, `.count()`, `.isVisible()`, `.textContent()` used inside `expect(await ...)`.
2. Run the suspicious spec with `--repeat-each=20 --workers=<CPU count>`.
3. Replace snapshot reads with web-first assertions (`toHaveText`, `toHaveCount`, `toBeVisible`, `toHaveURL`).
4. Rerun the same stress command. Green 20 times out of 20 is the bar.

## About

Built by **Ján Ďuriš**, QA Automation Engineer (Playwright, Python, CI/CD). I help teams make their test suites trustworthy again.

- Articles: [A Green Pipeline Is Not a Release Decision](https://coderlegion.com/35947/a-green-pipeline-is-not-a-release-decision)
- Flaky tests or CI you can't trust? Find me on [Upwork](https://www.upwork.com/freelancers/~0198692795e824559b) or [LinkedIn](https://www.linkedin.com/in/jduris).

MIT License.
