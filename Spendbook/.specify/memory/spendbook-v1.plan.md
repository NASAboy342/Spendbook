# Implementation Plan: Spendbook v1 - Financial Management Tool

**Branch**: `v1-spendbook-financial-management` | **Date**: 2025-12-08 | **Spec**: [spendbook-v1.spec.md](.specify/memory/spendbook-v1.spec.md)

## Summary

Spendbook v1 is a financial management tool built with Vue 3 + TypeScript that enables users to track income/expenses across multiple accounts with categorization via tracking topics. The application integrates with an existing REST API backend and uses Composition API with DaisyUI components for the UI. Key features include user authentication, multi-account management with balance summaries across time periods (daily/weekly/monthly/yearly), transaction processing with overdraft protection, and transaction reporting.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Vue 3 (latest stable)  
**Primary Dependencies**: Vue 3, Vite, Tailwind CSS, DaisyUI, Axios (for API calls)  
**Storage**: Remote API (no local persistence - API handles all data)  
**Testing**: None (per constitution - no testing infrastructure)  
**Target Platform**: Web browser (responsive - mobile + desktop)  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: Dashboard loads within 2 seconds, account switching within 1 second  
**Constraints**: TypeScript strict mode, Composition API only, DaisyUI components mandatory  
**Scale/Scope**: Single user per session, ~10 components, ~5 composables, 4 main views

## Constitution Check

✅ **PASS** - All requirements align with constitution:
- ✅ Vue 3 Composition API with `<script setup>` syntax
- ✅ TypeScript strict mode enabled
- ✅ DaisyUI components for all UI elements
- ✅ Composables pattern for reusable logic
- ✅ No testing infrastructure required

**Re-check Required After**: Phase 1 design (ensure no Options API creep)

## API Integration Overview

### Base URL Structure
- API Base: `https://apini.ppiinn.net`
- All endpoints use POST method
- Authentication via username in request body (no token/session management visible in API)

### Available Endpoints (11 total)

#### Authentication & User Management
1. `POST /api/spendbook/create-user` - User registration
2. `POST /api/spendbook/login` - User login

#### Dashboard & Summary
3. `POST /api/spendbook/get-user-summary-status` - Get all accounts + tracking topic summaries

#### Account Management
4. `POST /api/spendbook/create-account` - Create new account
5. `POST /api/spendbook/update-account` - Update account name

#### Tracking Topics
6. `POST /api/spendbook/create-tracking-topic` - Create new topic
7. `POST /api/spendbook/get-tracking-topic` - Get all topics
8. `POST /api/spendbook/update-tracking-topic` - Update topic name/status

#### Transactions
9. `POST /api/spendbook/payin` - Record income/deposit
10. `POST /api/spendbook/payout` - Record expense/withdrawal
11. `POST /api/spendbook/get-transaction` - Get transaction history

### Key API Features Noted
- **Transaction Summaries Pre-calculated**: API returns `dailyPayIn`, `dailyPayOut`, etc. on Account objects
- **Topic Status Management**: API supports `EnumPaymentTrackingTopicStatus` (Active=0, Completed=1, Failed=2, Cancelled=3, Unknown=4)
- **Balance Tracking**: Transactions include `balanceBefore` and `balanceAfter`
- **Currency Support**: API has currency fields (v1 uses USD only)
- **No Overdraft Check in API**: Client-side validation required before calling `/payout`
- **UTC Timestamps**: All dates must be converted to UTC before sending to API

## Project Structure

### Documentation (this feature)

```text
.specify/
└── memory/
    ├── constitution.md                    # Project constitution
    ├── spendbook-v1.spec.md              # Feature specification
    ├── spendbook-v1.clarifications.md    # Clarifications document
    ├── spendbook-v1.plan.md              # This file
    ├── spendbook-v1.research.md          # Phase 0 research (to be created)
    ├── spendbook-v1.data-model.md        # Phase 1 data models (to be created)
    ├── spendbook-v1.api-integration.md   # Phase 1 API contracts (to be created)
    └── spendbook-v1.tasks.md             # Phase 2 tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
Spendbook/
├── src/
│   ├── main.ts                    # App entry point
│   ├── App.vue                    # Root component with router-view
│   ├── style.css                  # Global styles (Tailwind imports)
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── api.types.ts          # API request/response types (from OpenAPI)
│   │   ├── entities.types.ts     # Domain entity types
│   │   └── enums.ts              # Enums (TopicStatus, TransactionType)
│   │
│   ├── composables/               # Reusable composition functions
│   │   ├── useAuth.ts            # Authentication logic
│   │   ├── useAccount.ts         # Account management
│   │   ├── useTrackingTopic.ts   # Topic management
│   │   ├── useTransaction.ts     # Transaction operations
│   │   └── useApi.ts             # API client wrapper
│   │
│   ├── services/                  # API service layer
│   │   ├── api.service.ts        # Base API configuration (axios instance)
│   │   ├── auth.service.ts       # Auth API calls
│   │   ├── account.service.ts    # Account API calls
│   │   ├── topic.service.ts      # Topic API calls
│   │   └── transaction.service.ts # Transaction API calls
│   │
│   ├── utils/                     # Utility functions
│   │   ├── currency.ts           # Currency formatting ($X.XX)
│   │   ├── datetime.ts           # Date/time helpers
│   │   └── validation.ts         # Form validation helpers
│   │
│   ├── views/                     # Page-level components
│   │   ├── LoginView.vue         # Login page
│   │   ├── RegisterView.vue      # Registration page
│   │   ├── CreateAccountView.vue # First account creation
│   │   ├── DashboardView.vue     # Main dashboard
│   │   └── TransactionsView.vue  # Transaction report page
│   │
│   ├── components/                # Reusable components
│   │   ├── layout/
│   │   │   ├── NavBar.vue        # Top navigation
│   │   │   └── PageContainer.vue # Page wrapper
│   │   │
│   │   ├── dashboard/
│   │   │   ├── UserProfileCard.vue       # User info card
│   │   │   ├── AccountSelectorCard.vue   # Account dropdown card
│   │   │   ├── BalanceCard.vue          # Current balance display
│   │   │   ├── SummaryCard.vue          # Time-period summary card
│   │   │   ├── TrackingTopicsSection.vue # Topics grid
│   │   │   └── TrackingTopicCard.vue    # Individual topic card
│   │   │
│   │   ├── transaction/
│   │   │   ├── TransactionForm.vue       # Pay-in/Pay-out form
│   │   │   ├── TransactionList.vue       # Transaction table/list
│   │   │   └── TransactionDetailModal.vue # Transaction details popup
│   │   │
│   │   ├── account/
│   │   │   └── CreateAccountForm.vue     # Account creation form
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.vue        # DaisyUI loading component
│   │       ├── ErrorAlert.vue            # DaisyUI alert component
│   │       └── EmptyState.vue            # Empty state message
│   │
│   ├── router/                    # Vue Router configuration
│   │   └── index.ts              # Route definitions + guards
│   │
│   └── assets/                    # Static assets
│       └── logo.svg              # App logo (if any)
│
├── public/                        # Public static files
│   └── favicon.ico
│
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config (strict mode)
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind + DaisyUI config
├── postcss.config.js              # PostCSS config
└── README.md                      # Project documentation
```

**Structure Decision**: Single-page web application using Vue 3 SPA pattern. The structure separates concerns into clear layers: services (API communication), composables (business logic), views (pages), and components (UI elements). This aligns with Vue 3 best practices and the constitution's requirement for composables-based architecture.

## Phase 0: Research & Discovery

### Research Tasks

#### 1. API Integration Strategy
- **Objective**: Understand API authentication, error handling, and response patterns
- **Questions to Answer**:
  - Does API require session tokens after login or username-per-request? ✅ Username per request
  - What HTTP status codes does API return for errors?
  - How are API errors structured (errorCode, errorMessage fields)? ✅ Standard wrapper
  - What is the actual API base URL? ✅ `https://apini.ppiinn.net`
  - Does API support CORS for local development? ✅ Yes
- **Deliverable**: API integration guide document

#### 2. TypeScript Type Generation
- **Objective**: Create accurate TypeScript types from OpenAPI spec
- **Questions to Answer**:
  - Should we auto-generate types or manually define?
  - How to handle nested response structures (ApiBaseResponse wrapper)?
  - How to type enum values (EnumPaymentTrackingTopicStatus: 0-4)?
- **Deliverable**: Complete `api.types.ts` file with all request/response types

#### 3. DaisyUI Component Inventory
- **Objective**: Map UI requirements to specific DaisyUI components
- **Questions to Answer**:
  - Which DaisyUI theme to use (default, light, dark)?
  - How to structure card layouts for dashboard?
  - Best DaisyUI components for forms (input, select, datetime picker)?
  - How to implement account dropdown selector?
  - Modal vs drawer for transaction details?
- **Deliverable**: Component mapping document

#### 4. State Management Strategy
- **Objective**: Determine state persistence approach
- **Questions to Answer**:
  - Store username in localStorage for auth persistence?
  - Cache account/topic lists to reduce API calls?
  - How to manage "active account" selection across sessions?
  - Should we use Pinia for global state or composables only?
- **Deliverable**: State management architecture document

#### 5. Date/Time Handling ✅ CLARIFIED
- **Objective**: Plan date/time input and display strategy
- **Questions to Answer**:
  - Which library for date/time picker (native, vue-datepicker, flatpickr)?
  - How to convert between local timezone and UTC for API? ✅ Always convert local to UTC before API call
  - Date format for display vs submission? ✅ Display: local time, Submit: UTC ISO string
  - How to handle "default to now" in transaction form? ✅ Default to current UTC if user doesn't input
- **Deliverable**: Date/time utilities specification with UTC conversion helpers

#### 6. Router & Navigation Flow
- **Objective**: Design navigation structure and route guards
- **Questions to Answer**:
  - Route structure (/login, /register, /dashboard, /transactions)?
  - How to implement "require account" guard?
  - Redirect logic for authenticated vs unauthenticated users?
  - How to pass data between routes (e.g., filtered topic view)?
- **Deliverable**: Router configuration document

### Research Deliverables
- `spendbook-v1.research.md` - Consolidated research findings
- Decision log for each research area
- Identified risks and mitigation strategies

## Phase 1: Design & Architecture

### Design Tasks

#### 1. Data Model Design
- **Objective**: Define TypeScript interfaces for all entities
- **Deliverables**:
  - Entity types (User, Account, TrackingTopic, Transaction)
  - API request/response types (from OpenAPI schema)
  - Enum definitions (TopicStatus, TransactionType)
  - Utility types (ApiResponse wrapper, pagination if needed)
- **File**: `spendbook-v1.data-model.md`

#### 2. API Service Contracts
- **Objective**: Define service layer interfaces and composable APIs
- **Deliverables**:
  - Service method signatures for each API endpoint
  - Composable function signatures (useAuth, useAccount, etc.)
  - Error handling patterns
  - Loading state management patterns
- **File**: `spendbook-v1.api-integration.md`

#### 3. Component Architecture
- **Objective**: Define component hierarchy and prop/emit contracts
- **Deliverables**:
  - Component tree diagram
  - Props/emits interface for each component
  - Component responsibility matrix
  - Shared component patterns (cards, forms, lists)
- **File**: `spendbook-v1.component-architecture.md`

#### 4. Composable Design
- **Objective**: Design reusable composition functions
- **Deliverables**:
  - `useAuth()` - login, register, logout, session management
  - `useAccount()` - CRUD operations, active account selection
  - `useTrackingTopic()` - CRUD operations, status management
  - `useTransaction()` - pay-in, pay-out, validation, history
  - `useApi()` - base API client configuration
- **File**: `spendbook-v1.composables-design.md`

#### 5. Validation Rules
- **Objective**: Define all validation logic
- **Deliverables**:
  - Email format validation
  - Password requirements (min 8 chars per clarifications)
  - Account name validation (1-50 chars per clarifications)
  - Topic name validation (1-30 chars per clarifications)
  - Transaction amount validation (min $0.01, max $999,999,999.99)
  - Overdraft validation logic
- **File**: `spendbook-v1.validation-rules.md`

#### 6. UI/UX Flow Documentation
- **Objective**: Document user flows and screen transitions
- **Deliverables**:
  - Registration → First Account → Dashboard flow
  - Login → Dashboard (if accounts exist) flow
  - Create Transaction flow
  - Switch Account flow
  - View Filtered Transactions flow
- **File**: `spendbook-v1.user-flows.md`

### Architecture Decisions

#### API Communication
- Use Axios for HTTP client
- Centralized error handling in API service layer
- Request interceptor for common headers
- Response interceptor for error transformation
- Composables wrap services for reactive state

#### Authentication Strategy
- Store username in localStorage after login
- No session token visible in API (username sent with each request)
- Router guard checks localStorage for username
- Logout clears localStorage and redirects to login

#### State Management
- **No Pinia required** - Use composables with `ref`/`reactive`
- Each composable manages its own state
- Active account ID stored in localStorage
- Refresh dashboard data on account switch

#### Error Handling
- API errors displayed via DaisyUI alert component
- Form validation errors shown inline below fields
- Loading states using DaisyUI loading spinner
- Optimistic updates for better UX (show change, then sync with API)

#### Styling Approach
- Tailwind utility classes for layout (grid, flex, spacing)
- DaisyUI components for UI elements (buttons, cards, inputs)
- DaisyUI theme: default (can be changed via config)
- Responsive design: mobile-first breakpoints

## Phase 2: Implementation Tasks

*Generated by `/speckit.tasks` command - not included in this plan*

Tasks will be created based on:
1. Priority from user stories (P1 → P2 → P3)
2. Technical dependencies (services before composables before components)
3. User flow completeness (authentication before dashboard)

Expected task categories:
- Setup & Configuration (Vite, TypeScript, Tailwind, DaisyUI, Router)
- Type Definitions (API types, entities, enums)
- Services Layer (API client, auth, account, topic, transaction services)
- Composables (useAuth, useAccount, useTrackingTopic, useTransaction)
- Views (Login, Register, Create Account, Dashboard, Transactions)
- Components (Cards, Forms, Lists, Navigation)
- Utilities (Currency, DateTime, Validation)
- Integration Testing (Manual verification per constitution)

## API Integration Details

### Request/Response Flow

#### Standard Response Wrapper
All API responses follow this structure:
```typescript
interface ApiBaseResponse<T> {
  data: T;
  errorCode: number;
  errorMessage: string | null;
}
```

#### Error Handling Strategy
- `errorCode === 0`: Success
- `errorCode !== 0`: Error (display `errorMessage` to user)
- HTTP errors (network, 500, etc.): Show generic error message

### Endpoint Mapping to Features

#### User Story 1: Authentication
- **Register**: `POST /api/spendbook/create-user`
  - Request: `{ username, password }`
  - Response: `BaseResponse` (errorCode, errorMessage)
- **Login**: `POST /api/spendbook/login`
  - Request: `{ username, password }`
  - Response: `LoginResponse` (username, utcCreateOn)

#### User Story 2: Dashboard
- **Get Summary**: `POST /api/spendbook/get-user-summary-status`
  - Request: `{ username }`
  - Response: `GetUserSummaryStatusResponse` (accounts[], trackingPaymentSummaries[])
  - **Key**: Account objects include pre-calculated daily/weekly/monthly/yearly summaries!

#### User Story 3: Account Management
- **Create Account**: `POST /api/spendbook/create-account`
  - Request: `{ username, accountName, initialBalance, currency }`
  - Response: `BaseResponse`
- **Update Account**: `POST /api/spendbook/update-account`
  - Request: `{ username, accountId, newAccountName }`
  - Response: `BaseResponse`

#### User Story 4: Tracking Topics
- **Create Topic**: `POST /api/spendbook/create-tracking-topic`
  - Request: `{ username, topicName, utcTargetDate, targetAmount, currency }`
  - Response: `BaseResponse`
  - **Note**: User can input target date and target amount to mark payment goals
- **Get Topics**: `POST /api/spendbook/get-tracking-topic`
  - Request: `{ username }`
  - Response: `GetTrackingTopicResponse` (topics[])
- **Update Topic**: `POST /api/spendbook/update-tracking-topic`
  - Request: `{ username, trackingTopicId, newName?, newStatus }`
  - Response: `BaseResponse`
  - **Status Enum**: Active=0, Completed=1, Failed=2, Cancelled=3, Unknown=4

#### User Story 5: Transactions
- **Pay-In**: `POST /api/spendbook/payin`
  - Request: `{ username, accountId, amount, receiptUrl?, remarks?, trackingTopicId? }`
  - Response: `BaseResponse`
- **Pay-Out**: `POST /api/spendbook/payout`
  - Request: `{ username, accountId, amount, receiptUrl?, remarks?, trackingTopicId? }`
  - Response: `BaseResponse`
  - **Client-side validation required**: Check balance before calling API

#### User Story 6: Transaction Report
- **Get Transactions**: `POST /api/spendbook/get-transaction`
  - Request: `{ username, accountId, fromUtcDate, toUtcDate, trackingTopicId? }`
  - Response: `GetTransactionResponse` (transactions[])
  - **Note**: User can select date range (defaults to today), show all transactions in range (no 50-limit)

### API Clarifications - RESOLVED ✅

#### Topic Status Enum Mapping ✅ RESOLVED
- **Active** = 0
- **Completed** = 1
- **Failed** = 2
- **Cancelled** = 3
- **Unknown** = 4

**Implementation**: 
- UI shows "Active" topics by default (status = 0)
- User can mark topics as Completed/Failed/Cancelled via update endpoint
- Status filter in UI: Active | Completed | Failed | Cancelled

#### Topic Target Date/Amount ✅ RESOLVED
- **Decision**: Allow user input for target date and target amount
- **Purpose**: Let users mark payment goals/targets for tracking topics
- **UI Implementation**: 
  - Target Date: Date picker (required field)
  - Target Amount: Currency input (required field)
  - Display progress towards target on dashboard

#### Transaction Timestamps ✅ RESOLVED
- **User Input Provided**: Convert local time to UTC before API call
- **User Input Not Provided**: Use current UTC timestamp as default
- **Implementation**:
  ```typescript
  const utcTimestamp = userInputTime 
    ? convertLocalToUTC(userInputTime) 
    : new Date().toISOString();
  ```

#### Transaction Report Date Range ✅ RESOLVED
- **Default**: Show transactions for today (fromUtcDate = start of today, toUtcDate = end of today)
- **User Selection**: Provide date range picker (from/to dates)
- **Display**: Show ALL transactions in selected range (no 50-limit on frontend)
- **Note**: Removed "last 50" requirement - show all transactions in date range

#### API Base URL ✅ RESOLVED
- **Production**: `https://apini.ppiinn.net`
- **CORS**: Enabled for local development

#### Still Applicable
- **Receipt URL**: Ignore for v1 (attachments out of scope per spec)
- **Currency**: Always use "USD" for v1

## Dependencies & Configuration

### Package Dependencies

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "daisyui": "^4.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Configuration Files

#### `vite.config.ts`
- Vue plugin configuration
- API proxy for CORS during development
- Build optimization settings

#### `tailwind.config.js`
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'], // or ['dark'] or custom theme
  },
}
```

#### `tsconfig.json`
- `strict: true` (per constitution)
- Path aliases for clean imports (@/components, @/composables, etc.)
- Vue-specific compiler options

#### `.env` files
```
VITE_API_BASE_URL=https://apini.ppiinn.net
```

## Risk Assessment

### Resolved Risks ✅
1. ~~**API Timestamp Handling**~~ - **RESOLVED**: Convert local to UTC if user inputs, else use current UTC
2. ~~**Topic Required Fields**~~ - **RESOLVED**: User inputs target date/amount (payment goals feature)
3. ~~**"Last 50 Transactions"**~~ - **RESOLVED**: Show all transactions in user-selected date range (default: today)
4. ~~**CORS Issues**~~ - **RESOLVED**: API supports CORS at `https://apini.ppiinn.net`

### Remaining Medium Risk
5. **Overdraft Validation**: API may allow negative balance server-side
   - **Mitigation**: Implement strict client-side validation before calling payout endpoint

6. **Authentication Persistence**: No session token in API (username-per-request)
   - **Mitigation**: Store username in localStorage, clear on logout

### Low Risk
7. **DaisyUI Version Compatibility**: Components may change between versions
   - **Mitigation**: Lock DaisyUI version in package.json

8. **Date/Time Library**: Need datetime picker that works with Vue 3
   - **Mitigation**: Use native `<input type="datetime-local">` with UTC conversion helper

## Success Metrics

### Technical Success
- ✅ All 67 functional requirements implemented
- ✅ Zero TypeScript errors in strict mode
- ✅ 100% DaisyUI component usage (no custom UI)
- ✅ All composables follow Composition API patterns
- ✅ Responsive design works on mobile (320px+) and desktop

### Performance Success
- ✅ Dashboard loads within 2 seconds (SC-003)
- ✅ Account switching within 1 second (SC-004)
- ✅ Transaction form submission within 30 seconds (SC-005)
- ✅ Transaction report displays within 2 seconds (SC-007)

### User Experience Success
- ✅ Complete user flow: Register → Create Account → Add Transaction → View Report
- ✅ Pay-Out overdraft blocking works 100% of time (SC-011)
- ✅ All time-period summaries display accurately (SC-006)
- ✅ Intuitive navigation requiring no documentation (UX-001)

## Next Steps

1. **Immediate**: Run `/speckit.plan` Phase 0 research to generate `research.md`
2. **Then**: Complete Phase 1 design to generate data models and contracts
3. **Then**: Run `/speckit.tasks` to generate implementation task list
4. **Finally**: Begin implementation following task priorities

## All Critical Questions Resolved ✅

1. ~~What do `EnumPaymentTrackingTopicStatus` values 0-4 represent?~~ ✅ **RESOLVED**: Active=0, Completed=1, Failed=2, Cancelled=3, Unknown=4
2. ~~Can payin/payout accept custom timestamp, or always use server time?~~ ✅ **RESOLVED**: Convert user input to UTC or use current UTC
3. ~~What is the API base URL for development and production?~~ ✅ **RESOLVED**: `https://apini.ppiinn.net`
4. ~~Does API require CORS configuration for local development?~~ ✅ **RESOLVED**: CORS is supported
5. ~~Is username-per-request authentication sufficient?~~ ✅ **RESOLVED**: Yes, username sent with each request
6. ~~How to get "last N transactions"?~~ ✅ **RESOLVED**: Use date range filter, show all in range (no limit)
7. ~~Can we omit `utcTargetDate` and `targetAmount`?~~ ✅ **RESOLVED**: No - these are payment goal features, user inputs required

### Remaining Questions (Nice-to-Have)
- HTTP status codes for specific error scenarios
- Rate limiting policies (if any)
- Maximum date range for transaction queries

---

**Plan Version**: 1.1  
**Last Updated**: 2025-12-08  
**Status**: All critical clarifications resolved - Ready for implementation  
**Next Step**: Run `/speckit.tasks` to generate implementation tasks
