# Tasks: Spendbook v1 - Financial Management Tool

**Input**: Design documents from `.specify/memory/`
**Prerequisites**: spendbook-v1.plan.md ✅, spendbook-v1.spec.md ✅, constitution.md ✅

**Tests**: NO TESTS (per constitution - no testing infrastructure)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-page application structure: `src/` at repository root

---

## Phase 1: Setup & Configuration (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and build configuration

**No dependencies - can start immediately**

- [ ] T001 Install project dependencies: `npm install vue@^3.4.0 vue-router@^4.2.0 axios@^1.6.0`
- [ ] T002 Install dev dependencies: `npm install -D @vitejs/plugin-vue@^5.0.0 typescript@^5.3.0 vite@^5.0.0 tailwindcss@^3.4.0 daisyui@^4.4.0 postcss@^8.4.0 autoprefixer@^10.4.0`
- [ ] T003 [P] Configure `vite.config.ts` with Vue plugin and API proxy for `https://apini.ppiinn.net`
- [ ] T004 [P] Configure `tailwind.config.js` with DaisyUI plugin and content paths
- [ ] T005 [P] Create `postcss.config.js` with Tailwind and Autoprefixer
- [ ] T006 [P] Update `tsconfig.json` to enable strict mode and configure path aliases (@/*)
- [ ] T007 [P] Create `.env` file with `VITE_API_BASE_URL=https://apini.ppiinn.net`
- [ ] T008 Update `src/style.css` with Tailwind directives (@tailwind base, components, utilities)
- [ ] T009 Update `src/main.ts` to import router and setup Vue app
- [ ] T010 Clean up default files: remove `src/components/HelloWorld.vue`, update `src/App.vue` to be router container

**Checkpoint**: Project builds successfully with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Type Definitions

- [ ] T011 [P] Create `src/types/enums.ts` with TopicStatus enum (Active=0, Completed=1, Failed=2, Cancelled=3, Unknown=4) and TransactionType enum
- [ ] T012 [P] Create `src/types/api.types.ts` with all API request/response types from OpenAPI spec (34 types)
- [ ] T013 [P] Create `src/types/entities.types.ts` with domain entity interfaces (User, Account, TrackingTopic, Transaction)

### Utilities

- [ ] T014 [P] Create `src/utils/currency.ts` with `formatCurrency(amount: number): string` function (returns $X.XX format)
- [ ] T015 [P] Create `src/utils/datetime.ts` with UTC conversion helpers: `localToUTC(date: Date): string`, `utcToLocal(isoString: string): Date`, `getCurrentUTC(): string`
- [ ] T016 [P] Create `src/utils/validation.ts` with validation functions: email, password (min 8 chars), account name (1-50), topic name (1-30), amount (0.01-999999999.99)

### API Service Layer

- [ ] T017 Create `src/services/api.service.ts` with Axios instance configured for base URL, headers, error interceptor
- [ ] T018 [P] Create `src/services/auth.service.ts` with `createUser()` and `login()` methods
- [ ] T019 [P] Create `src/services/account.service.ts` with `createAccount()`, `updateAccount()`, `getUserSummary()` methods
- [ ] T020 [P] Create `src/services/topic.service.ts` with `createTopic()`, `getTopics()`, `updateTopic()` methods
- [ ] T021 [P] Create `src/services/transaction.service.ts` with `payin()`, `payout()`, `getTransactions()` methods

### Router Configuration

- [ ] T022 Create `src/router/index.ts` with routes: /login, /register, /create-account, /dashboard, /transactions
- [ ] T023 Add authentication guard to router: check localStorage for username, redirect to /login if not found
- [ ] T024 Add account requirement guard: redirect to /create-account if user has no accounts (check after login)

### Layout Components

- [ ] T025 [P] Create `src/components/layout/NavBar.vue` with DaisyUI navbar: logo, Dashboard link, Transactions link, account dropdown, logout button
- [ ] T026 [P] Create `src/components/layout/PageContainer.vue` with DaisyUI container styling for page content
- [ ] T027 [P] Create `src/components/common/LoadingSpinner.vue` with DaisyUI loading spinner
- [ ] T028 [P] Create `src/components/common/ErrorAlert.vue` with DaisyUI alert component (error styling)
- [ ] T029 [P] Create `src/components/common/EmptyState.vue` with DaisyUI empty state message + action button

### Update App Root

- [ ] T030 Update `src/App.vue` to include NavBar (if authenticated) and router-view with PageContainer

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP Foundation

**Goal**: Enable users to register and log in to access the application

**Independent Test**: Create account, logout, login - verify session persistence in localStorage

### Composables

- [ ] T031 Create `src/composables/useAuth.ts` with reactive state (username, isAuthenticated) and methods: register(), login(), logout(), checkAuth()

### Views

- [ ] T032 [P] Create `src/views/RegisterView.vue` with DaisyUI form: email input, password input, display name input, submit button
- [ ] T033 [P] Create `src/views/LoginView.vue` with DaisyUI form: email input, password input, submit button, link to register
- [ ] T034 [US1] Connect RegisterView to useAuth composable: call register() on form submit, show errors via ErrorAlert
- [ ] T035 [US1] Connect LoginView to useAuth composable: call login() on form submit, redirect based on account status
- [ ] T036 [US1] Implement form validation in both views using validation utils
- [ ] T037 [US1] Add loading states to submit buttons using LoadingSpinner during API calls
- [ ] T038 [US1] Implement logout functionality in NavBar: call logout(), clear localStorage, redirect to /login

**Checkpoint**: Users can register, login, logout, and session persists across page refreshes

---

## Phase 4: User Story 3 - Account Management (Priority: P2)

**Goal**: Enable users to create and manage multiple accounts with account switching

**Independent Test**: Create multiple accounts, switch between them, verify dashboard updates

**Note**: Implementing before US2 (Dashboard) because dashboard needs accounts to display

### Composables

- [ ] T039 Create `src/composables/useAccount.ts` with reactive state (accounts, activeAccount) and methods: createAccount(), updateAccountName(), switchAccount(), loadAccounts(), setActiveAccount()

### Components

- [ ] T040 Create `src/components/account/CreateAccountForm.vue` with DaisyUI form: account name input, initial balance input (optional, default 0), currency select (default USD), submit button

### Views

- [ ] T041 Create `src/views/CreateAccountView.vue` using CreateAccountForm component
- [ ] T042 [US3] Connect CreateAccountView to useAccount composable: call createAccount() on submit
- [ ] T043 [US3] Implement redirect after first account creation: go to /dashboard, set as active account
- [ ] T044 [US3] Implement validation for account name (1-50 chars) using validation utils
- [ ] T045 [US3] Add loading state during account creation
- [ ] T046 Create `src/components/dashboard/AccountSelectorCard.vue` with DaisyUI dropdown showing all accounts (name + balance)
- [ ] T047 [US3] Connect AccountSelectorCard to useAccount: load accounts on mount, handle account switching
- [ ] T048 [US3] Store active account ID in localStorage for persistence
- [ ] T049 [US3] Add "Create New Account" option in AccountSelectorCard dropdown

**Checkpoint**: Users can create accounts and switch between them with persistence

---

## Phase 5: User Story 2 - Dashboard Overview (Priority: P1) 🎯 MVP Core

**Goal**: Display comprehensive financial overview with profile, balance, and time-period summaries

**Independent Test**: Login, view dashboard with all summary cards displaying accurate data

### Composables

- [ ] T050 Create `src/composables/useDashboard.ts` with reactive state (userSummary) and methods: loadDashboardData(), refreshDashboard()

### Components

- [ ] T051 [P] Create `src/components/dashboard/UserProfileCard.vue` with DaisyUI card: display user name and email
- [ ] T052 [P] Create `src/components/dashboard/BalanceCard.vue` with DaisyUI card: display current balance with large currency format
- [ ] T053 [P] Create `src/components/dashboard/SummaryCard.vue` with DaisyUI card: display time-period summary (pay-in/out) - reusable component
- [ ] T054 Create `src/views/DashboardView.vue` with grid layout (3 columns desktop, 1 mobile) for all cards

### Implementation

- [ ] T055 [US2] Connect DashboardView to useDashboard composable: call loadDashboardData() on mount and after account switch
- [ ] T056 [US2] Add UserProfileCard to dashboard: fetch from localStorage or API
- [ ] T057 [US2] Add AccountSelectorCard to dashboard top section
- [ ] T058 [US2] Add BalanceCard showing active account's current balance
- [ ] T059 [US2] Add 4 SummaryCard instances for: Daily, Weekly, Monthly, Yearly pay-in/out (8 data points total)
- [ ] T060 [US2] Use useDashboard to fetch data from `/api/spendbook/get-user-summary-status` endpoint
- [ ] T061 [US2] Display zero states ($0.00) when no transactions exist
- [ ] T062 [US2] Add loading spinner while dashboard data loads
- [ ] T063 [US2] Implement auto-refresh after account switch using useAccount watch
- [ ] T064 [US2] Format all currency values using currency utility

**Checkpoint**: Dashboard displays all summary cards with accurate calculations

---

## Phase 6: User Story 4 - Tracking Topics Management (Priority: P2)

**Goal**: Enable users to create and manage tracking topics for payment goals

**Independent Test**: Create topics with targets, change status, view on dashboard

### Composables

- [ ] T065 Create `src/composables/useTrackingTopic.ts` with reactive state (topics, activeTopics) and methods: createTopic(), updateTopic(), loadTopics(), getTopicById()

### Components

- [ ] T066 [P] Create `src/components/dashboard/TrackingTopicCard.vue` with DaisyUI card: topic name, status badge, target amount, target date, progress bar (if has transactions)
- [ ] T067 [P] Create `src/components/dashboard/TrackingTopicsSection.vue` with grid layout for topic cards + "Create New Topic" button
- [ ] T068 [P] Create topic creation modal/form with DaisyUI: topic name input, target date picker, target amount input, currency (default USD)
- [ ] T069 [P] Create topic status update modal with DaisyUI: status dropdown (Active, Completed, Failed, Cancelled)

### Implementation

- [ ] T070 [US4] Connect TrackingTopicsSection to useTrackingTopic: load topics on mount
- [ ] T071 [US4] Display only active topics (status=0) in main section
- [ ] T072 [US4] Implement "Create New Topic" functionality: show modal, call createTopic()
- [ ] T073 [US4] Validate topic name (1-30 chars), target date (future), target amount (> 0)
- [ ] T074 [US4] Implement topic status change: click on topic card opens status modal, update via updateTopic()
- [ ] T075 [US4] Make topic cards clickable: navigate to /transactions with topic filter
- [ ] T076 [US4] Show empty state when no active topics exist with "Create First Topic" prompt
- [ ] T077 [US4] Add TrackingTopicsSection to DashboardView lower section
- [ ] T078 [US4] Display topic target date using datetime utility (local format)

**Checkpoint**: Users can create topics with targets and manage their status

---

## Phase 7: User Story 5 - Process Transactions (Priority: P1) 🎯 MVP Core

**Goal**: Enable users to record financial transactions (pay-in/pay-out) with validation

**Independent Test**: Create transactions, verify balance updates and overdraft protection works

### Composables

- [ ] T079 Create `src/composables/useTransaction.ts` with reactive state (isProcessing) and methods: processPayin(), processPayout(), validatePayout()

### Components

- [ ] T080 Create `src/components/transaction/TransactionForm.vue` with DaisyUI form: transaction type radio (Pay-In/Pay-Out), amount input, date-time picker (default now), description textarea, topic dropdown (active only)
- [ ] T081 [US5] Implement transaction type selection: toggle between Pay-In and Pay-Out using DaisyUI radio buttons
- [ ] T082 [US5] Implement amount input with validation: min $0.01, max $999,999,999.99, 2 decimal places
- [ ] T083 [US5] Implement date-time picker: default to current local time, allow user modification
- [ ] T084 [US5] Convert selected local time to UTC before API submission using datetime utility
- [ ] T085 [US5] Implement topic dropdown: fetch from useTrackingTopic, show only active topics, optional selection
- [ ] T086 [US5] Implement description textarea: optional, max 200 chars
- [ ] T087 [US5] Connect form to useTransaction: call processPayin() or processPayout() based on type
- [ ] T088 [US5] Implement overdraft validation for Pay-Out: check against current balance, block if insufficient
- [ ] T089 [US5] Display error "Insufficient balance. Current balance: $X.XX" for overdraft attempts
- [ ] T090 [US5] Add loading state to submit button during API call
- [ ] T091 [US5] Redirect to /dashboard after successful transaction with success message
- [ ] T092 [US5] Show "Uncategorized" for transactions without topic selection

### Integration

- [ ] T093 [US5] Add "New Transaction" button to DashboardView using DaisyUI button (primary style)
- [ ] T094 [US5] Add "New Transaction" button to NavBar for easy access
- [ ] T095 [US5] Open TransactionForm in DaisyUI modal when button clicked
- [ ] T096 [US5] Refresh dashboard data after successful transaction (call useDashboard.refreshDashboard())

**Checkpoint**: Users can create transactions with balance validation and dashboard updates

---

## Phase 8: User Story 6 - Transaction Report (Priority: P3)

**Goal**: Enable users to view transaction history with date range filtering

**Independent Test**: Navigate to transactions, select date range, verify all transactions display

### Components

- [ ] T097 [P] Create `src/components/transaction/TransactionList.vue` with DaisyUI table: columns for date/time, type, amount, topic, description, balance after
- [ ] T098 [P] Create `src/components/transaction/TransactionDetailModal.vue` with DaisyUI modal: display full transaction details
- [ ] T099 [P] Create date range picker component with DaisyUI inputs: from date, to date, quick presets (Today, This Week, This Month)

### Views

- [ ] T100 Create `src/views/TransactionsView.vue` with date range filters and TransactionList component

### Implementation

- [ ] T101 [US6] Connect TransactionsView to useTransaction: add method getTransactions(accountId, fromDate, toDate, topicId?)
- [ ] T102 [US6] Default date range to today (start of day to end of day in UTC)
- [ ] T103 [US6] Implement date range selection: convert local dates to UTC for API call
- [ ] T104 [US6] Display ALL transactions in selected range (no pagination or limit)
- [ ] T105 [US6] Format transaction date/times using datetime utility (UTC to local)
- [ ] T106 [US6] Display topic name for each transaction (handle inactive topics gracefully)
- [ ] T107 [US6] Format amounts and balance using currency utility
- [ ] T108 [US6] Sort transactions by timestamp descending (newest first)
- [ ] T109 [US6] Implement transaction row click: open TransactionDetailModal
- [ ] T110 [US6] Show empty state when no transactions in selected range
- [ ] T111 [US6] Add loading spinner while fetching transactions
- [ ] T112 [US6] Support topic filter from dashboard: if navigated from topic card, apply topicId filter

### Integration

- [ ] T113 [US6] Add "View Transactions" link to NavBar
- [ ] T114 [US6] Implement navigation from TrackingTopicCard: pass topicId as route param/query
- [ ] T115 [US6] Display account name/info in TransactionsView header

**Checkpoint**: Users can view full transaction history with flexible date filtering

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Responsive Design

- [ ] T116 [P] Test and adjust all components for mobile (320px width minimum)
- [ ] T117 [P] Verify DaisyUI responsive classes work on dashboard cards
- [ ] T118 [P] Test account dropdown on mobile devices
- [ ] T119 [P] Ensure forms are usable on mobile (proper input types, validation)

### Error Handling

- [ ] T120 [P] Standardize error display across all views using ErrorAlert component
- [ ] T121 [P] Add proper error messages for all API failure scenarios
- [ ] T122 [P] Implement network error handling (offline, timeout)
- [ ] T123 [P] Add form validation error messages inline for all forms

### Performance

- [ ] T124 Optimize dashboard loading: consider caching user summary data
- [ ] T125 Debounce account switching to prevent rapid API calls
- [ ] T126 Lazy load transaction list for large date ranges (if performance issues arise)

### User Experience

- [ ] T127 [P] Add success toast notifications using DaisyUI alerts for actions (account created, transaction saved, etc.)
- [ ] T128 [P] Implement loading skeletons for dashboard cards (DaisyUI skeleton class)
- [ ] T129 [P] Add keyboard navigation support for forms (tab order, enter to submit)
- [ ] T130 [P] Add accessibility labels (ARIA) to all interactive elements

### Documentation

- [ ] T131 Update `README.md` with project setup instructions, API configuration, and development guide
- [ ] T132 [P] Add inline code comments for complex logic (UTC conversion, validation, etc.)
- [ ] T133 [P] Document composable APIs with JSDoc comments

### Final Verification

- [ ] T134 Verify all 68 functional requirements are implemented
- [ ] T135 Test complete user flow: Register → Create Account → Dashboard → Create Topic → Add Transaction → View Report
- [ ] T136 Verify TypeScript strict mode compliance (no errors)
- [ ] T137 Verify all components use DaisyUI (no custom UI)
- [ ] T138 Test performance metrics: dashboard < 2s, account switch < 1s, transaction report < 2s
- [ ] T139 Verify overdraft protection blocks 100% of invalid transactions
- [ ] T140 Test all time-period calculations display accurately

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - start immediately
2. **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories
3. **User Story 1 (Phase 3)**: Depends on Foundational - can start independently
4. **User Story 3 (Phase 4)**: Depends on Foundational and US1 (auth) - provides accounts for dashboard
5. **User Story 2 (Phase 5)**: Depends on US1 (auth) and US3 (accounts) - needs both
6. **User Story 4 (Phase 6)**: Depends on US1 (auth) and US2 (dashboard) - topics display on dashboard
7. **User Story 5 (Phase 7)**: Depends on US1 (auth), US3 (accounts), US4 (topics optional) - core transaction feature
8. **User Story 6 (Phase 8)**: Depends on US1 (auth), US3 (accounts), US5 (transactions) - displays transaction history
9. **Polish (Phase 9)**: Depends on all user stories being complete

### Critical Path for MVP

**Minimum Viable Product** (fastest path to working app):

```
Phase 1: Setup (T001-T010)
    ↓
Phase 2: Foundational (T011-T030)
    ↓
Phase 3: User Story 1 - Auth (T031-T038)
    ↓
Phase 4: User Story 3 - Accounts (T039-T049)
    ↓
Phase 5: User Story 2 - Dashboard (T050-T064)
    ↓
Phase 7: User Story 5 - Transactions (T079-T096)
    ↓
MVP COMPLETE - Can demo basic financial tracking
```

**Then add enhanced features**:
```
Phase 6: User Story 4 - Topics (T065-T078)
    ↓
Phase 8: User Story 6 - Reports (T097-T115)
    ↓
Phase 9: Polish (T116-T140)
    ↓
FULL v1 COMPLETE
```

### Parallel Opportunities

**Within Phase 1 (Setup)**: T003, T004, T005, T006, T007 can run in parallel

**Within Phase 2 (Foundational)**:
- Types: T011, T012, T013 parallel
- Utils: T014, T015, T016 parallel
- Services: T018, T019, T020, T021 parallel (after T017)
- Layout: T025, T026, T027, T028, T029 parallel

**Within Each User Story**:
- Component creation tasks (marked [P]) can run in parallel
- After components created, integration tasks run sequentially

**Across User Stories** (with enough team members):
- After Foundational complete, US1 can start
- After US1 complete, US3 and US4 can run in parallel
- After US3 complete, US2 can start
- After US2 and US4 complete, US5 can start
- After US5 complete, US6 can start

---

## Implementation Strategy

### Recommended Approach: Incremental MVP

**Week 1: Foundation**
- Days 1-2: Phase 1 (Setup) + Phase 2 Part 1 (Types & Utils)
- Days 3-5: Phase 2 Part 2 (Services, Router, Layout)

**Week 2: Core Authentication & Accounts**
- Days 1-3: Phase 3 (User Story 1 - Auth)
- Days 4-5: Phase 4 (User Story 3 - Accounts)

**Week 3: Dashboard & Transactions**
- Days 1-3: Phase 5 (User Story 2 - Dashboard)
- Days 4-5: Phase 7 Part 1 (User Story 5 - Transaction Form)

**Week 4: Complete MVP**
- Days 1-2: Phase 7 Part 2 (User Story 5 - Integration)
- Day 3: Test MVP flow end-to-end
- Days 4-5: Phase 6 (User Story 4 - Topics)

**Week 5: Enhanced Features**
- Days 1-3: Phase 8 (User Story 6 - Reports)
- Days 4-5: Phase 9 Part 1 (Polish - Responsive, Errors)

**Week 6: Final Polish**
- Days 1-3: Phase 9 Part 2 (UX, Performance, A11y)
- Days 4-5: Final testing and documentation

**Total: ~6 weeks for single developer, ~3-4 weeks with team**

### Testing Checkpoints

Since no automated tests per constitution, manual testing after each phase:

- **After Phase 3**: Can register and login
- **After Phase 4**: Can create accounts and switch
- **After Phase 5**: Can view dashboard with all data
- **After Phase 6**: Can create and manage topics
- **After Phase 7**: Can record transactions with validation
- **After Phase 8**: Can view transaction history
- **After Phase 9**: Full user journey works smoothly

---

## Task Count Summary

- **Setup**: 10 tasks
- **Foundational**: 20 tasks
- **User Story 1 (Auth)**: 8 tasks
- **User Story 3 (Accounts)**: 11 tasks
- **User Story 2 (Dashboard)**: 15 tasks
- **User Story 4 (Topics)**: 14 tasks
- **User Story 5 (Transactions)**: 18 tasks
- **User Story 6 (Reports)**: 19 tasks
- **Polish**: 25 tasks

**Total: 140 tasks**

**Estimated Effort**:
- Small tasks (1-2 hours): ~60 tasks
- Medium tasks (3-4 hours): ~60 tasks
- Large tasks (1 day): ~20 tasks

**Total Estimate**: ~400-500 hours (10-12 weeks single developer, 3-4 weeks with 3-person team)

---

## Notes

- **No Testing**: Per constitution, no unit/integration/E2E tests - manual validation only
- **Strict TypeScript**: All code must pass strict mode checks
- **DaisyUI Only**: No custom UI components - use DaisyUI for all elements
- **Composables Pattern**: All logic in composables, components are thin wrappers
- **API Integration**: All endpoints defined, base URL configured
- **UTC Handling**: All datetime conversions handled in utilities
- **Overdraft Protection**: Client-side validation before API call
- **Status Lifecycle**: Full 5-status support for topics
- **No Limits**: Transaction reports show all in date range

---

**Tasks Version**: 1.0  
**Generated**: 2025-12-08  
**Status**: Ready for implementation  
**Next Step**: Begin Phase 1 (Setup) tasks T001-T010
