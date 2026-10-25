# Client Lead Workflow

This project folder contains the documentation for the client lead automation.

## Workflow asset

The live workflow file for this project remains in the repository root as:

- `../Client_Lead_Workflow.json`

## What this automation does

- Receives a webhook submission from a client inquiry form.
- Maps the incoming fields to a clean lead record.
- Validates required lead information such as name and email.
- Appends valid leads to Google Sheets.
- Logs invalid submissions to an error sheet.
- Sends a Gmail notification when a valid lead arrives.

## Typical use case

This is used by consulting, agency, and service businesses to collect inbound client leads from a form or website and route them into a simple pipeline.
