# 🏗️ Project: SafeSite AI 
# 🚀 Task: The "Kill Switch" (Manager Suspension System)

## 🎯 Objective
You are an expert React Native (Expo) and Supabase Developer. My RBAC (Role-Based Access Control) is working. Now, I need to build a "Kill Switch" for the Super Admin. The Super Admin should be able to instantly suspend a 'manager'. If a manager is suspended, they should be immediately logged out and blocked from logging in again.

## 🗄️ Database Schema Update Required
Assume the `profiles` table in Supabase needs a new column:
- `is_suspended` (boolean, default: false)

## 🧩 The Workflow to Implement

**Part 1: The Admin Controls (UI & Logic)**
1. Write a custom hook `useManagerControl.js`.
2. It should fetch all users from the `profiles` table where `role === 'manager'`.
3. It must have a function `toggleSuspension(managerId, currentStatus)` that updates the `is_suspended` boolean in the Supabase database.
4. Provide the boilerplate React Native code for `ManagerControlScreen.js` (FlatList) to display the managers and a "Suspend / Reactivate" button to trigger the hook.

**Part 2: The Enforcement (The Actual "Kill")**
This is the most critical part. The system must enforce the suspension.
1. Update my Auth logic (provide the code for `AuthContext.js` or the main route guard).
2. When fetching the user's session and profile on app load, check the `is_suspended` flag.
3. If `is_suspended === true`, forcefully call `supabase.auth.signOut()`, clear local storage, and show an Alert: "Account Suspended. Contact Administration."

## ⚠️ Strict Development Rules
1. Do not overwrite my existing UI styles. Keep the UI simple so I can style it later.
2. Focus heavily on **Part 2 (The Enforcement)**. The Kill Switch is useless if the manager remains logged in after the database is updated.
3. Wrap all Supabase calls in `try-catch` blocks.