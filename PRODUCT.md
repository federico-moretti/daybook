# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individual workers who want to plan upcoming work and keep a record of what they have done. They use the record to recall progress, including for daily standup updates.

## Product Purpose

Daybook helps people capture both upcoming tasks and completed activities in one place. Planning what comes next and recalling what was accomplished are equally important outcomes.

## Positioning

A lightweight personal work log that keeps pending to-dos alongside dated completed work, so planning and daily recaps draw from the same record. This describes the current product, not a claim of market exclusivity.

## Operating Context

Users add short notes as to-dos or completed activities during the workday, mark to-dos done, and review today's progress, the previous workday, or the last seven workdays when preparing a recap. Entries can be edited or deleted. The app is a single-page browser experience.

## Capabilities and Constraints

- Current entries are stored in the browser's local storage; there are no accounts or cross-device sync in the current implementation. Browser-only storage is an MVP implementation choice, not a long-term product commitment.
- The previous-workday recap selects the preceding weekday. The history view includes today and recent weekdays; it shows completed activities separately from pending to-dos.
- Development mode can populate sample activities; these are illustrative examples, not customer evidence.

## Brand Commitments

The current product name is Daybook. The app uses the line “Small notes. Better recaps.” and credits Federico Moretti. Existing identity assets include `public/favicon.svg`; their future use has not been confirmed as a requirement.

## Evidence on Hand

The implemented interface and its copy in `src/App.tsx`, the browser title and description in `index.html`, and the favicon in `public/favicon.svg` are the available product materials. No testimonials, customer metrics, or external proof are established by the repository.

## Product Principles

- Make it easy to record work while it is still fresh.
- Give planning and completed-work recall equal standing.
- Make recent work quick to retrieve for a useful daily recap.
- Be accurate about where entries are stored and avoid implying sync or sharing that does not exist.
