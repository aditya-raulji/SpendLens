# Test Suite — SpendLens

The SpendLens core audit engine is verified using Jest to ensure savings calculations and tool recommendations are accurate.

## Running Tests
To run the full test suite locally:
```bash
npm test
```

## Test Files
1. **[lib/auditEngine.test.ts](file:///c:/Users/acer/Desktop/SpendLens/lib/auditEngine.test.ts)**
    - Covers core logic in `lib/auditEngine.ts`.
    - **Scenario 1:** Downgrading Cursor Business to Pro for small teams.
    - **Scenario 2:** Switching ChatGPT Team to Plus for solo users.
    - **Scenario 3:** Identifying redundancy between OpenAI API and ChatGPT Plus.
    - **Scenario 4:** Verifying "Already Optimal" state for efficient users.
    - **Scenario 5:** Credex high-savings threshold detection (>$500).

## CI/CD Testing
Every push to the `main` branch triggers an automated test run via GitHub Actions.
- Workflow: `.github/workflows/ci.yml`
- Status: **Passing**

## Manual Verification Checklist
- [x] Form persistence: Verify `localStorage` stores data on input change.
- [x] Share link: Verify `/audit/[id]` loads correctly in incognito mode.
- [x] Lead Capture: Verify Resend email is triggered on form submission.
- [x] Mobile UI: Verify responsiveness at 375px (iPhone SE).
