# Mama Tee AI Concierge

This workflow is an AI-powered restaurant concierge for handling inbound calls and converting them into structured orders, reservations, and customer records.

## What it does

- Receives a webhook payload representing a customer call transcript.
- Filters out non-actionable end-of-call events.
- Extracts important call data like customer number, transcript, and metadata.
- Uses Gemini to interpret the transcript and return structured JSON.
- Builds a customer profile from the discovered information.
- Routes the request by intent:
  - Order
  - Reservation
  - Escalation
  - Enquiry
- Logs order and reservation data into Google Sheets.
- Uses a customer lookup to detect returning customers and update their profile.

## Flow overview

1. Webhook receives the incoming call payload.
2. If filters for the relevant end-of-call report type.
3. Extract Data pulls the call details and metadata.
4. Message a model uses Gemini to read the transcript and identify the customer intent.
5. Parse Gemini Output converts the AI output into usable JSON.
6. Build Customer Profile checks whether the caller is already a customer.
7. Route by Intent chooses the correct downstream action.
8. Relevant Google Sheets nodes log the order, reservation, or follow-up details.

## Main integrations

- Webhook
- Google Gemini
- Google Sheets
- Customer lookup and profile logic

## Setup requirements

- A webhook endpoint from the voice/call system.
- Google Gemini API access.
- Google Sheets with Customers, Orders, and Reservations tabs.
- Matching column structures for the target data model.

## Typical use case

This workflow is designed for a restaurant or food brand that wants to use AI to handle customer calls, capture orders, and maintain a structured customer and sales database.

