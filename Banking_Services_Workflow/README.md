# Banking Services Workflow

This project folder contains the documentation for the banking service automation.

## Workflow asset

The live workflow file for this project remains in the repository root as:

- `../Banking_Services_Workflow.json`

## What this automation does

- Captures customer banking service requests from a Tally form.
- Extracts the customer’s full name, email, phone number, service type, and extra request details.
- Routes requests by service category such as account opening, loans, transfers, and card issues.
- Sends a personalized response through Gmail.
- Stores the request in Google Sheets for tracking and follow-up.

## Typical use case

This is used for banking or financial service teams that want to collect service requests and respond quickly without manual queueing.
