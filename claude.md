# 🏗️ Project: SafeSite AI (Phase 2)
# 📊 Task: Integrate Real Data into System Analytics UI

## 🎯 Objective
I have already built the UI for the "System Analytics" dashboard. It currently has hardcoded values (like PKR 0, 1 Manager, 0 Workers, N/A violations). 
Your task is to write the backend logic (Custom Hook) to fetch real data from Supabase and map those variables into my existing UI component.

## 🗄️ Database Schema Context
- `profiles` table: Has a `role` column ('manager', 'worker', 'super_admin').
- `violation_logs` table: Has `fine_amount` (int) and `violation_type` (text).

## 🧩 Part 1: The Logic (`hooks/useAdminAnalytics.js`)
Write a custom React Native hook that calculates the following metrics:
1. `totalFines`: Sum of `fine_amount` from all rows in `violation_logs`.
2. `managerCount`: Count of rows in `profiles` where `role === 'manager'`.
3. `workerCount`: Count of rows in `profiles` where `role === 'worker'`.
4. `topViolation`: The `violation_type` string that appears most frequently in `violation_logs`.
5. `isLoading`: Boolean for loading state.

*Important:* Use `useFocusEffect` (from React Navigation) or a `refresh` function so the data updates every time the Admin visits this screen. Wrap Supabase calls in `try-catch`.

## 🎨 Part 2: UI Integration (`screens/SystemAnalyticsScreen.js`)
1. Import `useAdminAnalytics` into my analytics screen.
2. **DO NOT change my layout, View structures, or styling.** 3. Only replace the hardcoded text strings in my UI with the dynamic variables from the hook. 
   - Replace "0" next to PKR with `{totalFines}`.
   - Replace "1" under Managers with `{managerCount}`.
   - Replace "0" under Workers with `{workerCount}`.
   - Replace "N/A" with `{topViolation || 'No violations yet'}`.
4. If `isLoading` is true, you can wrap the numbers in a simple `<ActivityIndicator />` or just show "..." temporarily.