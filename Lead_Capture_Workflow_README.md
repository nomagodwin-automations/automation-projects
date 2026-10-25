# Lead Capture Workflow

This workflow is a lightweight lead capture system built around a Tally form and Google Sheets logging.

## What it does

- Triggers when a Tally form is submitted.
- Normalizes the values into a clean set of fields.
- Checks whether the required fields are present.
- Appends valid leads to a Google Sheet.
- Sends suspicious or incomplete entries to an Error Logs sheet.

## Flow overview

1. Tally Trigger starts when a form is submitted.
2. Edit Fields maps the incoming fields into a consistent data model.
3. If checks for required data such as name and phone number.
4. Valid entries are written to the main lead sheet.
5. Invalid entries are sent to the error log sheet for review.

## Main integrations

- Tally Forms
- Google Sheets

## Setup requirements

- A live Tally form connected to the workflow.
- Google Sheets access to the target workbook.
- A separate sheet for error logging if you want to monitor invalid data.

## Typical use case

This workflow is useful for sales or marketing teams that need to capture leads from website forms and keep a clean, auditable record of both valid and invalid submissions.

