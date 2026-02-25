# React Native SeatMap Component

Production-ready SDK for SeatMaps.com

## 1. Project Overview

We are developing a **React Native component** that replicates the functionality of the existing web library:

`@seatmaps.com/react-lib`

The goal is to provide client developers with a drop-in SDK that allows them to render and manage interactive aircraft seat maps inside React Native applications (iOS & Android), with full feature parity to the web version.

The component will:

* Render an interactive aircraft seat map
* Support seat selection and unselection
* Process availability and pricing data
* Support multi-deck aircraft
* Emit consistent event callbacks
* Integrate with backend (Quicket GmbH API)
* Be published as an installable NPM package
* Include comprehensive tests and documentation
* Be production-grade (CI/CD, security workflows, Apache license)

---

## 2. Feature Parity Requirement

The React Native version must preserve full behavioral compatibility with the web component.

### Required Functional Areas

* Rendering of aircraft layout
* Seat state handling (available, selected, unavailable, etc.)
* Multi-deck support
* Built-in tooltip support
* External passenger management support
* Seat jump-to functionality
* Availability reconciliation (including reporting missing seats)
* Event callbacks with identical payload structure
* Custom component overrides (where applicable)
* Configurable styling
* RTL and layout options (if applicable)

All callback payload structures must match the web library contract.

---

## 3. Public API (React Native Component)

### Props

| Prop               | Description                                 |
| ------------------ | ------------------------------------------- |
| `flight`           | Aircraft configuration and flight details   |
| `availability`     | Seat availability and pricing data          |
| `passengers`       | Passenger information                       |
| `config`           | Visual and behavioral configuration options |
| `currentDeckIndex` | Current deck index for multi-deck aircraft  |
| `seatJumpTo`       | Scroll and open tooltip for a specific seat |

### Event Callbacks

| Callback                | Description                           |
| ----------------------- | ------------------------------------- |
| `onSeatMapInited`       | Fired when seat map is initialized    |
| `onSeatSelected`        | Fired when a seat is selected         |
| `onSeatUnselected`      | Fired when a seat is unselected       |
| `onLayoutUpdated`       | Fired after layout updates            |
| `onTooltipRequested`    | Fired when tooltip interaction occurs |
| `onAvailabilityApplied` | Returns seats not present on seat map |

---

## 4. Architecture

### High-Level Structure

```
/src
  /components
    SeatMap.tsx
    Deck.tsx
    Row.tsx
    Seat.tsx
    Tooltip.tsx
    DeckSelector.tsx
  /core
    SeatMapService.ts
    layoutEngine.ts
    availabilityProcessor.ts
  /hooks
    useSeatMap.ts
  /types
    index.ts
  /utils
    helpers.ts
```

### Design Principles

* Business logic separated from UI
* Core logic fully testable without rendering
* Minimal dependencies
* TypeScript only
* Performance-first rendering strategy

---

## 5. Development Phases

---

# Phase 0 — Compatibility Specification

### Goals

* Extract web component public API contract
* Define TypeScript interfaces
* Create feature parity checklist

### Deliverables

* `types/index.ts`
* Web-to-RN feature parity document
* Documented callback payload schemas

---

# Phase 1 — Core Logic Layer

### Goals

Port and adapt the core business logic from web implementation:

* SeatMapService equivalent
* Layout processing
* Availability application
* Passenger-seat matching
* Seat selection rules
* Multi-deck logic
* Jump-to-seat handling
* Missing seat reconciliation

### Requirements

* Pure TypeScript
* No UI dependencies
* Fully unit-testable

### Deliverables

* `/core` module
* Unit tests (Jest)
* > 80% logic coverage

---

# Phase 2 — Rendering Layer (React Native)

### Goals

Implement UI components using React Native primitives:

* `View`
* `ScrollView`
* `TouchableOpacity`
* `Animated` (if needed)

### Responsibilities

* Render seats based on layout engine output
* Manage scaling/scrolling
* Handle touch interactions
* Ensure responsiveness

### Performance Considerations

* Use `React.memo`
* Stable keys
* Minimize rerenders
* Avoid large state mutations

---

# Phase 3 — Interaction Layer

### Goals

Implement full interaction support:

* Seat selection/unselection
* Tooltip display logic
* External passenger mode
* Multi-deck switching
* Seat jump-to logic
* Emitting proper callback payloads

### Deliverables

* Full event compatibility
* Integration tests

---

# Phase 4 — Performance Optimization

### Validation Areas

* Large aircraft (300+ seats)
* Lower-end Android devices
* Rapid scrolling
* Orientation changes

### Potential Enhancements

* Virtualization (if required)
* Layout batching
* Ref-based state optimization

---

# Phase 5 — Testing & Quality Assurance

## Unit Tests (Jest)

* Layout calculations
* Availability merging
* Seat selection logic
* Jump-to-seat logic
* Edge cases (invalid data, empty state)

## Integration Tests (React Native Testing Library)

* Tap seat
* Unselect seat
* Switch decks
* Trigger tooltip
* Trigger callbacks

### CI

* Tests must run on every commit
* PR must not merge if tests fail

---

# Phase 6 — Documentation

## README Must Include

* Installation instructions
* Basic usage example
* Advanced configuration example
* Full props reference
* Full event reference
* Testing instructions
* Publishing instructions

## Demo Application

* Separate RN demo app
* Showcase:

  * Multi-deck aircraft
  * Seat selection
  * Pricing
  * Tooltip behavior
  * External passenger management

---

# Phase 7 — GitHub & CI/CD

### Repository Requirements

* Apache License
* Full documentation
* Tests included

### GitHub Workflows

* Publish to NPM
* Open Source Security Scoring
* Secret Scanning
* Code Scanning
* Dependabot Security Updates

---

# Phase 8 — Code Review & Finalization

### Peer Review

* Cross-check against web implementation
* Validate feature parity
* Validate payload consistency

### Final QA

* All tests passing
* Demo validated
* Documentation finalized
* NPM publish tested

---

# Non-Functional Requirements

| Area         | Requirement                   |
| ------------ | ----------------------------- |
| Language     | TypeScript only               |
| Code Style   | Prettier                      |
| Dependencies | Minimal                       |
| Platform     | iOS + Android                 |
| Performance  | Smooth scroll and interaction |
| Distribution | Installable via NPM           |

---

# Success Criteria

The project is considered complete when:

* React Native component matches web behavior
* All events emit correct payload structure
* Performance validated on real devices
* 100% documented API
* CI/CD fully functional
* Package published to NPM
* Demo app validated

---

If you want, next I can prepare:

* A **6–8 week timeline with resource estimation**
* A **technical risk assessment**
* Or a **feature parity checklist table (web vs RN)** for internal tracking.
