# Transaction Intelligence System - TIP

This project is a transaction intelligence tool that turns a PDF bank statement into a readable financial story and useful spending insights.

## Project structure

- `index.html` — frontend experience for identity capture and upload
- `tip-frontend.css` — styling for the app UI
- `tip-frontend.js` — frontend logic for upload flow, story cards, and PDF export
- `backend/Fin_Intel_Workflow.json` — main n8n workflow for statement processing
- `backend/TIP_User_Identity_.json` — identity and user lookup workflow
- `backend/Error_Trigger.json` — Telegram error notification workflow

## What it does

- Collects the user's name and phone number.
- Accepts a PDF bank statement upload.
- Stores and retrieves the user in Supabase.
- Extracts text and transactions from the uploaded PDF.
- Uses Gemini to classify merchants, categories, and spending patterns.
- Aggregates transactions and prepares insight cards.
- Creates a narrative summary of the user's financial behavior for the month.
- Displays swipeable financial story cards in the browser.
- Shows a transaction breakdown and supports PDF report download.

## Frontend flow

1. The user enters their name and phone number.
2. The identity webhook creates or finds the user in Supabase.
3. The user uploads a PDF bank statement.
4. The frontend sends the file to the main upload webhook.
5. The UI renders a story view and a transaction table.
6. The user can download a generated PDF report.

## Backend workflow flow

1. `TIP_User_Identity_.json` checks whether the user exists and creates them if needed.
2. `Fin_Intel_Workflow.json` receives the PDF upload.
3. The PDF is extracted and converted to readable text.
4. Gemini identifies transactions and classifies them into categories.
5. Merchant patterns are upserted into a Supabase map.
6. Spending patterns are detected and summarized.
7. The workflow builds a story object with cards such as income, spending, behaviour, and advice.
8. The final response is sent back to the frontend and rendered in the app.

## Main integrations

- n8n webhooks
- Supabase
- Google Gemini
- PDF extraction
- Browser UI with local storage
- Telegram error notifications

## Setup requirements

- A hosted static front-end or local static server for `index.html`
- n8n workflows imported and connected to the proper webhook URLs
- Supabase tables for `users`, `transactions`, `merchant_map`, and insight/history data
- Gemini API access with valid keys
- Telegram credentials if using error notifications

## Typical use case

This is a personal finance assistant for helping users understand spending behaviour, detect recurring payment patterns, and produce a concise financial narrative from bank statement uploads.

## How to run

1. Host the `Transaction Intelligence System- TIP` folder as a static web app.
2. Import the backend workflows into n8n.
3. Replace the webhook URLs in `tip-frontend.js` with your deployed n8n endpoints.
4. Add the required Supabase and Gemini credentials.
5. Upload a PDF statement and review the generated story and breakdown.

