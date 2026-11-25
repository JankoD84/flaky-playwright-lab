# Changelog

## 1.0.0 — 2026-11-25
- Demo shop page with simulated backend latency (1 in 10 requests slow)
- Three flaky patterns in `tests/flaky`: fixed sleep, non-retrying count, `isVisible()` snapshot
- Fixed versions in `tests/fixed`, plus an assertion driven by `waitForResponse`
- GitHub Actions: fixed tests must pass 10x; flaky demo runs 20x with `continue-on-error`
