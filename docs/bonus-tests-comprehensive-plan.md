# Comprehensive Bonus Tests Plan

This document contains the complete test plan for bonus functionality, organized by test type. Each test includes detailed prerequisites, actions, expected results, and validation points.

## Summary
- **Smoke Tests:** 7 tests
- **E2E Tests:** 1 test  
- **Regression Tests:** 16 tests
- **TBD Tests:** 5 tests
- **Total:** 29 tests

---

## Smoke Tests

### Basic Activation + Cancellation Tests

#### S1 - Cash-NoDeposit activation and cancellation
- **Prerequisite:** 0 bonuses
- **Action 1:** Activate "Available Cash-NoDeposit becomes Active"
- **Action 2:** Cancel active bonus
- **Result 1:** Bonus becomes active/wagering
- **Result 2:** Bonus disappears completely
- **Validation:** Button states, progress bar, tab movements, specific wallet amounts

#### S2 - Cash-Deposit activation and cancellation
- **Prerequisite:** 0 bonuses
- **Action 1:** Activate "Available Cash-Deposit becomes Active"
- **Action 2:** Cancel active bonus
- **Result 1:** Bonus becomes active/wagering
- **Result 2:** Bonus disappears completely
- **Validation:** Button states, progress bar, tab movements, specific wallet amounts

#### S3 - FS-NoDeposit activation and cancellation
- **Prerequisite:** 0 bonuses
- **Action 1:** Activate "Available FS-NoDeposit becomes Active"
- **Action 2:** Cancel active bonus
- **Result 1:** Bonus becomes active/wagering
- **Result 2:** Bonus disappears completely
- **Validation:** Button states, progress bar, tab movements, specific wallet amounts

#### S4 - FS-Deposit activation and cancellation
- **Prerequisite:** 0 bonuses
- **Action 1:** Activate "Available FS-Deposit becomes Active"
- **Action 2:** Cancel active bonus
- **Result 1:** Bonus becomes active/wagering
- **Result 2:** Bonus disappears completely
- **Validation:** Button states, progress bar, tab movements, specific wallet amounts

### Additional Smoke Tests

#### S5 - Tab navigation and content validation
- **Prerequisite:** 1 "Active FS-Deposit in Active Tab" + 2 pending + 3 available (6 total)
- **Action:** Navigate through all tabs
- **Expected Result:** Each tab shows correct bonuses with proper filtering
- **Validation:** Tab filtering, bonus counts, ordering



---

## E2E Tests

### Comprehensive E2E Workflow

#### E1 - Complete bonus lifecycle - all transitions and cross-types
- **Prerequisite:** 6 available bonuses (2 of each type except Cash-NoDeposit which has 3 for rapid clicking test)
- **Action 1:** Activate FS-NoDeposit
- **Action 2:** Activate Cash-Deposit
- **Action 3:** Activate FS-Deposit
- **Action 4:** Rapidly click 2 Cash-NoDeposit bonuses
- **Action 5:** Cancel active
- **Action 6:** Zero out new active
- **Action 7:** Wagering success on final active
- **Expected Results:** Complete queue building, rapid click protection, all transition types, cross-type interactions
- **Validation:** Specific wallet amounts after each financial action, tab movements, queue ordering, cross-type behavior, rapid clicking protection, large queue management

---

## Regression Tests

### Cancel Active Bonus Scenarios

#### R1 - Cancel FS-NoDeposit → Cash-Deposit becomes active
- **Prerequisite:** 1 "Active FS-NoDeposit to be Canceled" + 3 pending: "Pending Cash-Deposit becomes Active", "Pending FS-Deposit stays Pending Position 1", "Pending Cash-NoDeposit stays Pending Position 2"
- **Action:** Cancel "Active FS-NoDeposit to be Canceled"
- **Expected Result:** "Active FS-NoDeposit to be Canceled" disappears, "Pending Cash-Deposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts, cross-type transition, queue reordering

#### R2 - Cancel FS-Deposit → FS-NoDeposit becomes active
- **Prerequisite:** 1 "Active FS-Deposit to be Canceled" + 3 pending: "Pending FS-NoDeposit becomes Active", "Pending Cash-NoDeposit stays Pending Position 1", "Pending Cash-Deposit stays Pending Position 2"
- **Action:** Cancel "Active FS-Deposit to be Canceled"
- **Expected Result:** "Active FS-Deposit to be Canceled" disappears, "Pending FS-NoDeposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts, same-category transition, queue reordering

#### R3 - Cancel Cash-NoDeposit → FS-Deposit becomes active
- **Prerequisite:** 1 "Active Cash-NoDeposit to be Canceled" + 3 pending: "Pending FS-Deposit becomes Active", "Pending Cash-Deposit stays Pending Position 1", "Pending FS-NoDeposit stays Pending Position 2"
- **Action:** Cancel "Active Cash-NoDeposit to be Canceled"
- **Expected Result:** "Active Cash-NoDeposit to be Canceled" disappears, "Pending FS-Deposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts, cross-type transition, queue reordering

#### R4 - Cancel Cash-Deposit → Cash-NoDeposit becomes active
- **Prerequisite:** 1 "Active Cash-Deposit to be Canceled" + 3 pending: "Pending Cash-NoDeposit becomes Active", "Pending FS-NoDeposit stays Pending Position 1", "Pending FS-Deposit stays Pending Position 2"
- **Action:** Cancel "Active Cash-Deposit to be Canceled"
- **Expected Result:** "Active Cash-Deposit to be Canceled" disappears, "Pending Cash-NoDeposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts, same-category transition, queue reordering

### Zero Out Active Bonus Scenarios

#### R5 - Zero out FS-NoDeposit → FS-Deposit becomes active
- **Prerequisite:** 1 "Active FS-NoDeposit to be Zeroed" + 3 pending: "Pending FS-Deposit becomes Active", "Pending Cash-NoDeposit stays Pending Position 1", "Pending Cash-Deposit stays Pending Position 2"
- **Action:** Zero out "Active FS-NoDeposit to be Zeroed"
- **Expected Result:** "Active FS-NoDeposit to be Zeroed" disappears, "Pending FS-Deposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (loss), same-category transition

#### R6 - Zero out FS-Deposit → Cash-NoDeposit becomes active
- **Prerequisite:** 1 "Active FS-Deposit to be Zeroed" + 3 pending: "Pending Cash-NoDeposit becomes Active", "Pending FS-NoDeposit stays Pending Position 1", "Pending Cash-Deposit stays Pending Position 2"
- **Action:** Zero out "Active FS-Deposit to be Zeroed"
- **Expected Result:** "Active FS-Deposit to be Zeroed" disappears, "Pending Cash-NoDeposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (loss), cross-type transition

#### R7 - Zero out Cash-NoDeposit → Cash-Deposit becomes active
- **Prerequisite:** 1 "Active Cash-NoDeposit to be Zeroed" + 3 pending: "Pending Cash-Deposit becomes Active", "Pending FS-Deposit stays Pending Position 1", "Pending FS-NoDeposit stays Pending Position 2"
- **Action:** Zero out "Active Cash-NoDeposit to be Zeroed"
- **Expected Result:** "Active Cash-NoDeposit to be Zeroed" disappears, "Pending Cash-Deposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (loss), same-category transition

#### R8 - Zero out Cash-Deposit → FS-NoDeposit becomes active
- **Prerequisite:** 1 "Active Cash-Deposit to be Zeroed" + 3 pending: "Pending FS-NoDeposit becomes Active", "Pending Cash-Deposit stays Pending Position 1", "Pending FS-Deposit stays Pending Position 2"
- **Action:** Zero out "Active Cash-Deposit to be Zeroed"
- **Expected Result:** "Active Cash-Deposit to be Zeroed" disappears, "Pending FS-NoDeposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (loss), cross-type transition

### Wagering Success Scenarios

#### R9 - Wagering success FS-NoDeposit → FS-Deposit becomes active
- **Prerequisite:** 1 "Active FS-NoDeposit for Wagering Success" + 3 pending: "Pending FS-Deposit becomes Active", "Pending Cash-NoDeposit stays Pending Position 1", "Pending Cash-Deposit stays Pending Position 2"
- **Action:** Complete wagering on "Active FS-NoDeposit for Wagering Success"
- **Expected Result:** "Active FS-NoDeposit for Wagering Success" disappears, "Pending FS-Deposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (win), same-category transition

#### R10 - Wagering success FS-Deposit → Cash-NoDeposit becomes active
- **Prerequisite:** 1 "Active FS-Deposit for Wagering Success" + 3 pending: "Pending Cash-NoDeposit becomes Active", "Pending FS-NoDeposit stays Pending Position 1", "Pending Cash-Deposit stays Pending Position 2"
- **Action:** Complete wagering on "Active FS-Deposit for Wagering Success"
- **Expected Result:** "Active FS-Deposit for Wagering Success" disappears, "Pending Cash-NoDeposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (win), cross-type transition

#### R11 - Wagering success Cash-NoDeposit → Cash-Deposit becomes active
- **Prerequisite:** 1 "Active Cash-NoDeposit for Wagering Success" + 3 pending: "Pending Cash-Deposit becomes Active", "Pending FS-Deposit stays Pending Position 1", "Pending FS-NoDeposit stays Pending Position 2"
- **Action:** Complete wagering on "Active Cash-NoDeposit for Wagering Success"
- **Expected Result:** "Active Cash-NoDeposit for Wagering Success" disappears, "Pending Cash-Deposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (win), same-category transition

#### R12 - Wagering success Cash-Deposit → FS-NoDeposit becomes active
- **Prerequisite:** 1 "Active Cash-Deposit for Wagering Success" + 3 pending: "Pending FS-NoDeposit becomes Active", "Pending Cash-Deposit stays Pending Position 1", "Pending FS-Deposit stays Pending Position 2"
- **Action:** Complete wagering on "Active Cash-Deposit for Wagering Success"
- **Expected Result:** "Active Cash-Deposit for Wagering Success" disappears, "Pending FS-NoDeposit becomes Active" becomes active, queue shifts up
- **Validation:** Specific wallet amounts (win), cross-type transition

### Pending Queue Formation Tests

#### R13 - Cash-NoDeposit pending queue
- **Prerequisite:** 1 "Active FS-Deposit stays Active" + 1 "Available Cash-NoDeposit becomes Pending"
- **Action:** Activate available bonus
- **Expected Result:** "Active FS-Deposit stays Active", "Available Cash-NoDeposit becomes Pending"
- **Validation:** Pending tab appearance, disabled Cancel button, warning message, All tab ordering

#### R14 - Cash-Deposit pending queue
- **Prerequisite:** 1 "Active FS-NoDeposit stays Active" + 1 "Available Cash-Deposit becomes Pending"
- **Action:** Activate available bonus
- **Expected Result:** "Active FS-NoDeposit stays Active", "Available Cash-Deposit becomes Pending"
- **Validation:** Pending tab appearance, disabled Cancel button, warning message, All tab ordering

#### R15 - FS-NoDeposit pending queue
- **Prerequisite:** 1 "Active Cash-Deposit stays Active" + 1 "Available FS-NoDeposit becomes Pending"
- **Action:** Activate available bonus
- **Expected Result:** "Active Cash-Deposit stays Active", "Available FS-NoDeposit becomes Pending"
- **Validation:** Pending tab appearance, disabled Cancel button, warning message, All tab ordering

#### R16 - FS-Deposit pending queue
- **Prerequisite:** 1 "Active Cash-NoDeposit stays Active" + 1 "Available FS-Deposit becomes Pending"
- **Action:** Activate available bonus
- **Expected Result:** "Active Cash-NoDeposit stays Active", "Available FS-Deposit becomes Pending"
- **Validation:** Pending tab appearance, disabled Cancel button, warning message, All tab ordering

---

## TBD Tests - Pending Developer Clarification

#### TBD1 - Network error during activation
- **Description:** Test activation failure due to network issues
- **Developer Question:** What happens when activation API call fails?

#### TBD2 - Browser refresh during activation
- **Description:** Test page refresh during bonus activation
- **Developer Question:** How does system handle refresh during state change?

#### TBD3 - Multiple browser tabs with bonuses page
- **Description:** Test concurrent bonus page usage
- **Developer Question:** How does system handle multiple active sessions or different browser tabs?

#### TBD4 - Available bonus grant date ordering
- **Description:** Test correct ordering of available bonuses by grant date
- **Developer Question:** Should this be UI test or API test?

#### TBD5 - Progress bar edge values
- **Description:** Test 0% and 100% progress states display correctly
- **Developer Question:** Are there any functional differences between different bonus types?

---

## Test Data Requirements

### Bonus Naming Convention
Each bonus should have a descriptive name that indicates:
1. **Initial state** (Available, Active, Pending)
2. **Bonus type** (Cash-NoDeposit, Cash-Deposit, FS-NoDeposit, FS-Deposit)
3. **End state** (what it becomes after the test action)

### Wallet Validation
- **Specific amounts approach:** Validate exact wallet values before and after each financial action
- **Components to track:** Real Money, Casino Bonus, Balance (Sport Bonus ignored for these tests)

### Cross-Type Testing
Tests ensure that bonus type (Cash vs FS, Deposit vs NoDeposit) does not affect queue management logic - only the order of activation/cancellation matters.
