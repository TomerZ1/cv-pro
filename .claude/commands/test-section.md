Test the $ARGUMENTS section end-to-end.

1. Start the backend if not running (`docker-compose up`).
2. Send a test request to the relevant `/api/tools/` endpoint with sample CV and JD data.
3. Verify the response structure matches the expected format in `docs/API.md`.
4. Check that the response parser correctly converts Claude's output to JSON.
5. Report any errors or format mismatches.
