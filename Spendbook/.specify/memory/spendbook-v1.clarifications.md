# Clarifications Needed: Spendbook v1

**Specification**: spendbook-v1.spec.md  
**Date**: 2025-12-08  
**Status**: Needs User Input

## Critical Clarifications (Blocking Implementation)

### 1. Overdraft Behavior ✅ DECIDED
**Issue**: What happens when a user tries to create a Pay-Out transaction that exceeds their current account balance?

**Options**:
- **A**: Block the transaction and show an error message "Insufficient balance"
- **B**: Allow the transaction and permit negative balances
- **C**: Show a warning but allow user to proceed

**Recommendation**: Option A (block transaction) for v1 simplicity, unless tracking credit/loans is a use case.

**User Decision**: **Option A - Block transactions that exceed balance with error message "Insufficient balance. Current balance: $X.XX"**

---

### 2. Tracking Topic Deletion ✅ DECIDED
**Issue**: What happens when a user deletes a tracking topic that has associated transactions?

**Options**:
- **A**: Prevent deletion if transactions exist (show error: "Cannot delete topic with transactions")
- **B**: Allow deletion and mark associated transactions as "Uncategorized"
- **C**: Allow deletion and keep the topic name in transaction history as "Deleted: [Topic Name]"

**Recommendation**: Option B (mark as uncategorized) for better UX.

**User Decision**: **No deletion allowed. Topics use Active/Inactive status instead. Inactive topics are hidden from dropdown but remain associated with historical transactions.**

---

### 3. Account Deletion ✅ DECIDED
**Issue**: Currently "out of scope", but users may accidentally create test accounts. Should there be any way to delete accounts?

**Options**:
- **A**: No deletion functionality at all in v1
- **B**: Allow deletion only if account has zero transactions
- **C**: Allow deletion with confirmation, remove all associated transactions

**Recommendation**: Option B (safe deletion) to prevent data loss while allowing cleanup.

**User Decision**: **Option A - No deletion functionality. Accounts are permanent to maintain transaction history integrity.**

---

### 4. Transaction Form - Date/Time Selection ✅ DECIDED
**Issue**: How should users input transaction date/time?

**Options**:
- **A**: Default to current date/time (read-only, no selection)
- **B**: Date picker + time picker (allows backdating/future dating)
- **C**: Date picker only (time auto-set to transaction creation time)
- **D**: Quick presets (Today, Yesterday, Last Week) + custom date picker

**Recommendation**: Option B (full date/time selection) for flexibility in recording past transactions.

**User Decision**: **Option B - Date/time defaults to current date and time but user can optionally modify it to any date/time.**

---

### 5. Initial Account Creation ✅ DECIDED
**Issue**: What happens during user registration regarding accounts?

**Options**:
- **A**: User automatically gets a default "Main Account" with $0 balance
- **B**: After registration, user must explicitly create their first account
- **C**: During registration, prompt user to name their first account and set initial balance

**Recommendation**: Option A (auto-create default) for fastest onboarding, but Option C provides better initial setup.

**User Decision**: **Option B/C hybrid - After registration, redirect user to account creation page where they explicitly create their first account with name and optional initial balance. Dashboard requires at least one account.**

---

## Important Clarifications (Affects UX)

### 6. Dashboard Layout
**Issue**: Specific arrangement of dashboard cards not defined.

**Questions**:
- Should cards be arranged in a grid layout (2-3 columns on desktop)?
- Should time-period summaries (daily/weekly/monthly/yearly) be in one large card with tabs, or separate cards?
- Where exactly is the account switcher dropdown positioned (top navbar, within dashboard)?

**Recommendation**: 
- Grid layout: 3 columns on desktop, 1 column on mobile
- Time summaries: Single card with 4 columns (Daily | Weekly | Monthly | Yearly)
- Account switcher: Top-right of navbar for easy access

**User Decision**: ___________

---

### 7. Transaction Form Access
**Issue**: Where/how do users access the transaction form?

**Options**:
- **A**: Floating action button (FAB) visible on all pages
- **B**: Button on dashboard only ("+ New Transaction")
- **C**: Button in navigation bar
- **D**: Multiple entry points (dashboard + navbar)

**Recommendation**: Option D (dashboard + navbar) for maximum accessibility.

**User Decision**: ___________

---

### 8. Tracking Topics Display on Dashboard
**Issue**: "Lower section shows a card that contain smaller clickable card of tracking payment topic" - needs layout clarification.

**Questions**:
- How many topics should be visible at once? (All, or paginated/scrollable?)
- Should topics show transaction count or total spent?
- What happens when clicking a topic? (Filter view in modal, navigate to filtered report, expand inline?)

**Recommendation**:
- Display all topics in a scrollable grid (4-6 per row on desktop)
- Show topic name + transaction count for that topic
- Click opens transaction report filtered to that topic

**User Decision**: ___________

---

### 9. Transaction Report - "Load More" vs Pagination
**Issue**: Spec mentions "Load More button or pagination" for viewing beyond 50 transactions.

**Options**:
- **A**: "Load More" button (infinite scroll style)
- **B**: Traditional pagination (Page 1, 2, 3...)
- **C**: Infinite scroll (automatic loading)

**Recommendation**: Option A ("Load More" button) - simple, clear, mobile-friendly.

**User Decision**: ___________

---

### 10. Transaction Details View
**Issue**: "Click on a transaction to see full transaction details" - what is shown that isn't in the list?

**Questions**:
- Is this a modal, side panel, or separate page?
- What additional details are shown beyond: date/time, type, amount, topic, description, balance?

**Recommendation**: Modal popup showing the same information in a larger, more readable format. Consider adding: Account name, Created timestamp, Transaction ID.

**User Decision**: ___________

---

## Minor Clarifications (Nice to Have)

### 11. Password Requirements
**Issue**: No password complexity requirements specified.

**Question**: Should there be minimum password requirements (length, complexity)?

**Recommendation**: Minimum 8 characters, at least one letter and one number.

**User Decision**: ___________

---

### 12. Email Verification
**Issue**: Not mentioned in spec.

**Question**: Is email verification required after registration?

**Recommendation**: No email verification for v1 (lite mode) to simplify implementation.

**User Decision**: ___________

---

### 13. Currency Symbol Display
**Issue**: Spec mentions USD with $ symbol.

**Question**: Should $ symbol always be shown, or can users choose their display currency symbol (without actual currency conversion)?

**Recommendation**: Always show $ for v1. Symbol selection can be v2 feature.

**User Decision**: ___________

---

### 14. Account Name Uniqueness
**Issue**: Not specified if account names must be unique per user.

**Question**: Can a user have two accounts named "Savings"?

**Recommendation**: No requirement for uniqueness. Users should be able to distinguish by balance in dropdown.

**User Decision**: ___________

---

### 15. Tracking Topic Name Uniqueness
**Issue**: Not specified if topic names must be unique per user.

**Question**: Can a user create multiple topics with the same name?

**Recommendation**: Require unique topic names to avoid confusion in dropdown selection.

**User Decision**: ___________

---

### 16. Transaction Amount Validation
**Issue**: Spec mentions "decimal precision for currency" edge case.

**Question**: What are the validation rules for transaction amounts?
- Minimum amount? (e.g., $0.01 or allow $0.00?)
- Maximum amount? (e.g., $1,000,000?)
- Allow only 2 decimal places?

**Recommendation**: 
- Minimum: $0.01 (no zero-amount transactions)
- Maximum: $999,999,999.99 (practical limit)
- Force 2 decimal places

**User Decision**: ___________

---

### 17. Account Initial Balance Validation
**Issue**: Edge case mentions "What if user's initial account balance is negative?"

**Question**: Should initial balance accept negative values?

**Options**:
- **A**: Allow negative initial balance (useful for credit cards, loans)
- **B**: Require initial balance >= $0.00

**Recommendation**: Option A (allow negative) for flexibility in tracking debt.

**User Decision**: ___________

---

### 18. Transaction Description Field
**Issue**: Description is optional, but no max length specified.

**Question**: What is the maximum length for transaction descriptions?

**Recommendation**: 200 characters maximum.

**User Decision**: ___________

---

### 19. Account Name Length
**Issue**: No validation rules specified for account names.

**Question**: What are the length constraints for account names?

**Recommendation**: 
- Minimum: 1 character
- Maximum: 50 characters

**User Decision**: ___________

---

### 20. Tracking Topic Name Length
**Issue**: No validation rules specified for topic names.

**Question**: What are the length constraints for topic names?

**Recommendation**:
- Minimum: 1 character  
- Maximum: 30 characters

**User Decision**: ___________

---

## Data Persistence Clarifications

### 21. LocalStorage Data Structure
**Issue**: Spec says "use browser localStorage" but no structure defined.

**Question**: How should data be organized in localStorage?

**Recommendation**:
```typescript
localStorage structure:
- spendbook_user: { id, email, name, passwordHash, createdAt }
- spendbook_accounts: [{ id, userId, name, balance, isActive, createdAt }]
- spendbook_topics: [{ id, userId, name, color?, icon?, createdAt }]
- spendbook_transactions: [{ id, accountId, type, amount, date, description?, topicId?, createdAt }]
- spendbook_session: { userId, token, expiresAt }
```

**User Decision**: ___________

---

### 22. Session Expiration
**Issue**: "Maintain user session state" but no expiration policy defined.

**Question**: How long should a user session last?

**Options**:
- **A**: Session lasts until user logs out (no auto-expiration)
- **B**: Session expires after inactivity (e.g., 24 hours)
- **C**: Session expires after fixed time (e.g., 7 days)

**Recommendation**: Option A (manual logout only) for v1 simplicity.

**User Decision**: ___________

---

### 23. Multi-Device Sync
**Issue**: Edge case mentions "concurrent transactions from multiple devices" but localStorage is per-browser.

**Question**: Should we warn users that data is device-specific and won't sync across browsers/devices?

**Recommendation**: Yes, show a notice on first login: "Data is stored locally on this device only."

**User Decision**: ___________

---

## UI/UX Clarifications

### 24. Empty States
**Issue**: Some empty states defined, but not all.

**Questions**: What should be shown when:
- User has accounts but no tracking topics?
- User has accounts but no transactions?
- User is viewing transaction report with filters but no results?

**Recommendation**: 
- All empty states should show helpful message + action button (e.g., "Create your first topic")
- Use DaisyUI empty state patterns with icons

**User Decision**: ___________

---

### 25. Navigation Structure
**Issue**: Navigation between pages not fully specified.

**Question**: What is the main navigation structure?

**Recommendation**:
- Top navbar with: Logo/App Name | Dashboard Link | Transactions Link | Account Dropdown | Logout
- Active page highlighted
- Mobile: Hamburger menu

**User Decision**: ___________

---

### 26. Loading States
**Issue**: Success criteria mentions loading within 2 seconds, but no loading UI specified.

**Question**: Should loading states be shown when:
- Dashboard is calculating summaries?
- Switching accounts?
- Loading transaction report?

**Recommendation**: Yes, use DaisyUI loading spinner for any operation taking >200ms.

**User Decision**: ___________

---

### 27. Error Handling
**Issue**: Some error scenarios mentioned (invalid login) but not comprehensive.

**Question**: How should errors be displayed to users?

**Recommendation**: 
- Form validation errors: Inline below field (DaisyUI form error styling)
- System errors: Toast notification at top (DaisyUI alert)
- Critical errors: Modal dialog

**User Decision**: ___________

---

## Summary

**Critical (Must Decide)**: 5 items (#1-5)  
**Important (Should Decide)**: 10 items (#6-15)  
**Minor (Can Use Defaults)**: 12 items (#16-27)

**Next Steps**:
1. User provides decisions for critical clarifications (#1-5)
2. Review important clarifications (#6-15) 
3. Approve or modify recommendations for minor items (#16-27)
4. Update specification with final decisions
5. Proceed to planning phase
