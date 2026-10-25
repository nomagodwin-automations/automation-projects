# Client Lead Workflow

This workflow is a lead intake automation for collecting leads from a client inquiry form and sending them into a CRM-style workflow.

## What it does

- Receives form submissions from a webhook.
- Extracts the key contact data:
  - Full Name
  - Email Address
  - Phone Number
  - Company Name
  - Message
  - Submitted At
- Validates that required fields are present.
- Writes valid submissions to a Google Sheet.
- Writes incomplete or invalid entries to an error log sheet.
- Sends an email notification when a valid lead arrives.

## Flow overview

1. Webhook receives the incoming request.
2. Edit Fields restructures payload values into a more usable format.
3. If checks that required contact fields are not empty.
4. Valid submissions are appended to the lead sheet.
5. A Gmail message alerts the team about the new inquiry.
6. Invalid submissions are routed to an error log sheet.

## Main integrations

- Webhook trigger
- Gmail
- Google Sheets

## Setup requirements

- A webhook endpoint exposed by n8n.
- An email account configured for outbound alerts.
- A Google Sheet for valid leads and another for errors.
- A source form or webhook sender that posts the required payload structure.

## Typical use case

This workflow is ideal for agencies, consultants, or service providers who want to receive new client submissions and immediately push them into a pipeline or notifications workflow.

