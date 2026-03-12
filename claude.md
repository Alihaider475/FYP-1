# Project: SafeSite AI (Phase 2)
# Task: Forgot Password & Password Reset Logic (OTP Flow)

## 🎯 Objective
You are an expert React Native (Expo) and Supabase Developer. I have already built the UI for the "Forgot Password" screen. Your task is to provide the backend logic using a custom hook.

## 📋 The Required Workflow (OTP Flow for Mobile)
Since deep linking can be complex in Expo, we will use the Supabase OTP flow for password recovery. The hook needs to support two distinct actions:

**Action 1: Send Reset OTP**
1. User provides their `email`.
2. Validate the email format.
3. Call `supabase.auth.resetPasswordForEmail(email)`.
4. If successful, alert the user to check their email for a 6-digit OTP code and transition the UI state to the OTP verification step.

**Action 2: Verify OTP and Update Password**
1. User provides the `email`, the 6-digit `otp` they received, and their `newPassword`.
2. Call `supabase.auth.verifyOtp({ email, token: otp, type: 'recovery' })` to verify the code and create a secure session.
3. IMMEDIATELY after successful verification, call `supabase.auth.updateUser({ password: newPassword })` to set the new password.
4. If successful, alert the user "Password updated successfully" and navigate them back to the Login screen.

## 🛠️ Requirements for Claude
* Write a custom React Native hook called `useForgotPassword.js`.
* It should return state variables: `isLoading` (boolean) and `step` (number: 1 for Email input, 2 for OTP/New Password input).
* It should return two functions: `sendResetEmail(email)` and `updatePassword(email, otp, newPassword)`.
* Wrap all Supabase calls in `try-catch` blocks and use `Alert.alert` for error handling (e.g., "Email not found", "Invalid OTP").
* **Do NOT write UI components.** I will connect this hook to my existing TextInputs and Buttons. Just provide the complete hook logic.