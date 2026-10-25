# Banking Services Workflow

This workflow is a banking customer support intake automation built in n8n. It is designed to convert a customer inquiry form into a structured service request and send a personalized response.

## What it does

- Receives a Tally submission from the banking inquiry form.
- Extracts the applicant's name, email, phone number, service requested, and any extra details.
- Routes the request based on the selected service such as:
  - Account Opening
  - Loans
  - Card Issues
  - Transfers
  - Chat with Customer Agent
- Sends a service-specific email reply to the customer.
- Saves the submission to a Google Sheet for tracking.

## Flow overview

1. Tally Trigger fires when a customer submits the form.
2. Edit Fields normalizes the values and creates a clean record.
3. Switch checks the `Service Required` field and decides which response branch to use.
4. The matching Gmail node sends a tailored email.
5. The Google Sheets node logs the lead or request for operations and reporting.

## Main integrations

- Tally Forms
- Gmail
- Google Sheets

## Setup requirements

Before importing or running this workflow in n8n, make sure you have:

- The connected Tally form and correct form ID.
- Gmail credentials with permission to send messages.
- A Google Sheet for request logging.
- Access to the same service categories used in the workflow logic.

## Typical use case

This is useful for a bank or financial services brand that wants to turn website or landing page inquiries into a controlled, fast response workflow without manual triage.

