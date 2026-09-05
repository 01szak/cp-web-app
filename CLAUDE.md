# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Angular 21 (standalone components, zoneless-style signals, SSR) marketing + booking site for a camper park ("Camperpark Stary Folwark"). It has a public landing page and a multi-step reservation flow that talks to a separate backend API.

## Commands

```bash
npm start            # ng serve — dev server on http://localhost:4200, proxies /api to backend (see proxy.conf.json)
npm run build        # ng build (production config: SSR + prerender via outputMode: server)
npm run watch        # ng build --watch --configuration development
npm test             # ng test — runs Vitest via @angular/build:unit-test
npm run serve:ssr:cp-web-app   # run the built SSR server (node dist/cp-web-app/server/server.mjs)
```

To run a single test file, pass it through to the underlying builder, e.g.:
```bash
ng test -- src/app/features/reservation/components/reservation-form/reservation-form.spec.ts
```

There is currently no `*.spec.ts` file in the repo (schematics default to `skipTests: true`, see `angular.json`), so `npm test` has nothing to run yet.

Backend API is expected on `http://localhost:8080`; `proxy.conf.json` rewrites `/api/*` → that host with the prefix stripped. Run the backend separately before exercising reservation-flow HTTP calls locally.

## Architecture

### Routing / feature layout
- `src/app/app.routes.ts` — all routes are lazy (`loadComponent`) at the page level. Only two real pages exist: `''` (landing) and `/reservation` (+ `/reservation/verify/:targetId` for email-verification deep links, same component).
- Code is organized by feature under `src/app/features/<feature>/{pages|components}`, with cross-cutting UI in `src/app/shared/components` and app-wide singletons in `src/app/core/{services,directives,translations}`.
- Components follow the schematics default in `angular.json`: standalone, inline template + inline style, SCSS.

### Reservation flow (the main stateful feature)
`ReservationPageComponent` (`src/app/features/reservation/reservation-page/reservation-page.component.ts`) is a single-page wizard driven by a `currentView` state machine (`START` → `FORM` → `VERIFY_MESSAGE`), with an in-form sub-state (`isGuestForm` / `isAuthoriseMessage`) that slides between three horizontally-stacked panes (CSS transform, no router) for: pick pitch/dates → guest details → email-verification pending screen.

- `ReservationForm` (`.../components/reservation-form/reservation-form.ts`) owns pitch selection, date-range picking, and price calculation. It uses the Angular Signal Forms API (`form()`/`FormField` from `@angular/forms/signals`, not `ReactiveFormsModule`) and reports validity/value up to the parent via `output()`.
- `GuestFormComponent` (`.../components/guest-form.component/`) is the same signal-forms pattern for guest contact details.
- Parent and children communicate one-way up via `formValid`/`formValue` outputs (no shared form group); the parent composes the final DTO in `buildReservationDTO`.
- `ReservationDTO` is defined in `reservation-page.component.ts` and imported back into `reservation-form.ts` — be aware of this reverse import when refactoring either file.
- All backend calls use `HttpClient` + `rxResource()` (reactive resources keyed off signals, e.g. camper place occupancy reloads when the selected pitch changes) rather than manual subscribe/unsubscribe.
- Every request currently sends hardcoded headers (`X-org-id: 2`, `X-api-key: 123abc`) — this is WIP backend integration, not a pattern to imitate blindly; check with the user before spreading it further.
- Note: `provideHttpClient()` is not currently registered in `app.config.ts` — this is part of the same in-progress backend-connection work.

### Translations
No i18n library — a hand-rolled `TranslationService` (`src/app/core/services/translation.service.ts`) holds a `currentLang` signal (`'pl' | 'en'`, persisted to `localStorage`, defaults to `pl`), and components read strings via `ts.t.<section>.<key>` where `ts = inject(TranslationService)`. All copy and its TypeScript shape lives in `src/app/core/translations/translations.ts` (interfaces per section, e.g. `NavTranslations`, `ReservationTranslations`, plus a `TRANSLATIONS` map keyed by language) — add new copy there, typed, for both languages at once. `MAT_DATE_LOCALE` is wired to the same `localStorage` key so Material datepicker locale follows the chosen language.

### SSR
Server rendering is enabled (`outputMode: "server"`, entry `src/server.ts`, hydration via `provideClientHydration(withEventReplay())`). Code that touches browser-only APIs (e.g. `localStorage`) must guard with `isPlatformBrowser(inject(PLATFORM_ID))` as done in `TranslationService` and `app.config.ts`.

### Styling
Global SCSS lives in `src/styles.scss` plus `src/styles/{variables,layout,typography}.scss`; Angular Material is themed via `mat.theme()` (Material 3, blue palette). Custom CSS variables (`--color-bg-light`, `--spacing-lg`, `--transition-smooth`, etc.) are used throughout component styles instead of Material tokens directly — reuse these rather than hardcoding values.

### Formatting
Prettier is configured (`.prettierrc`): 100-char width, single quotes, Angular parser for `.html`. `.editorconfig` enforces 2-space indent and single-quote TS.
