# Password Reset Setup & Troubleshooting Guide

## Issues Fixed

### ✅ 1. Duplicate Success Messages
**Problem**: Two success messages were showing after requesting password reset (toast + success state)

**Solution**: Removed the toast message from `reset-password-form.tsx`, keeping only the green success box with "Check your email" message.

---

## Email Not Being Sent - Setup Guide

If you're not receiving password reset emails, follow these steps to configure Supabase email settings:

### Step 1: Check Email Confirmation Settings

1. Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. Make sure **"Enable email provider"** is ON
3. Check **"Confirm email"** setting:
   - If you want emails to be sent: **ENABLE** this
   - If you disabled this for faster signup: emails won't be sent for ANYTHING (signup, password reset, etc.)

**IMPORTANT**: Even if you disabled email confirmation for signup, you MUST re-enable it for password reset emails to work!

### Step 2: Configure Email Templates

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Find **"Reset Password"** template
3. Your template is already configured correctly (as shown in the HTML you provided)
4. Make sure the **"Confirmation URL"** uses this pattern:
   ```
   {{ .ConfirmationURL }}
   ```

### Step 3: Configure SMTP Settings (CRITICAL!)

By default, Supabase uses their own email service which has rate limits and may not work in development.

**For Production**: Set up custom SMTP

1. Go to **Supabase Dashboard** → **Project Settings** → **Auth** → **SMTP Settings**
2. Enable **"Enable Custom SMTP"**
3. Configure with your email provider:

#### Option A: Gmail SMTP (Simple for Testing)
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [App Password - NOT your regular password]
Sender email: your-email@gmail.com
Sender name: QodeBench
```

**How to get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication (required)
3. Go to "App Passwords"
4. Generate password for "Mail"
5. Use that password in SMTP settings

#### Option B: SendGrid (Recommended for Production)
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Your SendGrid API Key]
Sender email: noreply@yourdomain.com
Sender name: QodeBench
```

#### Option C: AWS SES (Enterprise)
```
Host: email-smtp.[region].amazonaws.com
Port: 587
Username: [Your SES SMTP Username]
Password: [Your SES SMTP Password]
Sender email: noreply@yourdomain.com
Sender name: QodeBench
```

### Step 4: Configure Redirect URLs

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Add these to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   ```

### Step 5: Test Email Delivery

1. Go to **Authentication** → **Users**
2. Click a test user → **"Send password recovery"**
3. Check if email arrives
4. If it works here but not from your app, it's an app issue
5. If it doesn't work here, it's a Supabase configuration issue

---

## How Password Reset Flow Works

### Complete User Journey:

1. **User Goes to Reset Password Page**
   - URL: `https://yourapp.com/reset-password`
   - Component: `ResetPasswordForm`

2. **User Enters Email & Clicks "Send Reset Link"**
   - Calls `useAuth().resetPassword(email)`
   - Supabase sends email with link to:
     ```
     https://yourapp.com/auth/callback?token=xxx&type=recovery
     ```

3. **User Clicks Link in Email**
   - Browser opens the callback URL
   - Route: `app/auth/callback/route.ts`
   - Callback handler:
     - Exchanges token for session
     - Sees `type=recovery` parameter
     - Redirects to `/update-password`

4. **User Lands on Update Password Page**
   - URL: `https://yourapp.com/update-password`
   - Component: `UpdatePasswordForm`
   - User is now authenticated (has active session)

5. **User Enters New Password**
   - Calls `supabase.auth.updateUser({ password: newPassword })`
   - Password is updated in Supabase
   - Shows success toast
   - Redirects to `/dashboard`

### Technical Flow:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Request                                              │
│    /reset-password                                           │
│    ↓                                                         │
│    ResetPasswordForm.onSubmit()                              │
│    ↓                                                         │
│    useAuth().resetPassword(email)                            │
│    ↓                                                         │
│    supabase.auth.resetPasswordForEmail(                      │
│      email,                                                  │
│      { redirectTo: "/auth/callback?type=recovery" }          │
│    )                                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Supabase Sends Email                                      │
│    Template: "Reset Password" in Auth → Email Templates     │
│    Link: https://yourapp.com/auth/callback?                 │
│          token=xxx&type=recovery                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User Clicks Email Link                                    │
│    /auth/callback?token=xxx&type=recovery                   │
│    ↓                                                         │
│    app/auth/callback/route.ts                               │
│    ↓                                                         │
│    exchangeCodeForSession(token)                             │
│    ↓                                                         │
│    Check: type === 'recovery' ? ✅                           │
│    ↓                                                         │
│    Redirect to /update-password                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Update Password Page                                      │
│    /update-password                                          │
│    ↓                                                         │
│    UpdatePasswordForm                                        │
│    ↓                                                         │
│    User enters new password                                  │
│    ↓                                                         │
│    supabase.auth.updateUser({ password })                    │
│    ↓                                                         │
│    Success! → Redirect to /dashboard                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Files Involved

### Frontend Components:
- `components/auth/reset-password-form.tsx` - Request reset link
- `components/auth/update-password-form.tsx` - Enter new password
- `app/(auth)/reset-password/page.tsx` - Reset password page
- `app/(auth)/update-password/page.tsx` - Update password page

### Backend/Auth:
- `hooks/use-auth.ts` - `resetPassword()` function
- `app/auth/callback/route.ts` - Handles email link redirects

### Configuration Files:
- Email templates: Configured in Supabase Dashboard
- Redirect URLs: Configured in Supabase Dashboard
- SMTP: Configured in Supabase Dashboard

---

## Testing Checklist

### Before Testing:
- [ ] SMTP configured in Supabase
- [ ] Email provider enabled in Authentication → Providers
- [ ] Redirect URLs added to URL Configuration
- [ ] Email template verified

### Test Steps:
1. [ ] Go to `/reset-password`
2. [ ] Enter a valid email address
3. [ ] Click "Send Reset Link"
4. [ ] See success message (green box, NO toast)
5. [ ] Check email inbox (and spam folder)
6. [ ] Receive email with "Reset Password" button
7. [ ] Click the button in email
8. [ ] Land on `/update-password` page
9. [ ] Enter new password (min 8 characters)
10. [ ] Click "Update Password"
11. [ ] See success toast
12. [ ] Get redirected to `/dashboard`
13. [ ] Try logging out and logging in with new password

### Troubleshooting:

**Email not arriving?**
- Check Supabase → Authentication → Logs for errors
- Verify SMTP settings are correct
- Try "Send password recovery" from Supabase dashboard Users page
- Check spam folder
- Wait 5-10 minutes (sometimes delayed)

**Link doesn't work?**
- Check redirect URL matches your domain exactly
- Check browser console for errors
- Verify `/auth/callback` route exists
- Check that link hasn't expired (60 min expiry)

**Can't update password?**
- Check browser console for errors
- Verify user is authenticated (has session)
- Check Supabase logs for auth errors
- Try logging out and clicking email link again

**Redirected to wrong page?**
- Check `type=recovery` is in URL when clicking email
- Verify auth callback checks for `type === 'recovery'`
- Check middleware isn't interfering

---

## Security Notes

✅ **What's Secure:**
- Tokens expire after 60 minutes
- One-time use tokens (can't reuse after password change)
- User must have access to email account
- Password strength requirements enforced
- HTTPS recommended for production

⚠️ **Important:**
- Never log password reset tokens
- Use HTTPS in production
- Keep SMTP credentials secret
- Use environment variables for sensitive data
- Consider rate limiting password reset requests

---

## Quick Fix for "Email Not Sending"

If emails still aren't sending after SMTP setup:

### Option 1: Enable Supabase Default Email (Development)
1. Supabase Dashboard → Authentication → Settings
2. Scroll to "Enable Email Confirmations"
3. Toggle ON
4. This will use Supabase's built-in email (limited but works for testing)

### Option 2: Use Magic Link Instead (Alternative)
If you can't get email working, consider using Supabase Magic Links for authentication instead of password reset emails.

### Option 3: Contact Supabase Support
If using Supabase Pro plan, contact support to verify email delivery settings.

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Custom SMTP configured (not Supabase default)
- [ ] Production domain added to Redirect URLs
- [ ] Email templates tested and branded
- [ ] Rate limiting enabled on password reset endpoint
- [ ] Monitoring set up for failed email deliveries
- [ ] Sender email verified (SPF, DKIM records)
- [ ] Consider using professional email service (SendGrid, AWS SES, etc.)

---

## Need Help?

1. Check Supabase Dashboard → Authentication → Logs
2. Check browser console for errors
3. Check Supabase email delivery logs
4. Review this guide's troubleshooting section
5. Test with Supabase's built-in "Send password recovery" feature first
