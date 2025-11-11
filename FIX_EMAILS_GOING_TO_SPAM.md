# Why Reset Password Emails Go to Spam & How to Fix It

## Why Your Emails Are Going to Spam

Your email **template is good**, but spam filters check **much more than just HTML content**. Here's what's actually causing the spam issue:

---

## 🚨 Main Reasons Emails Go to Spam

### 1. **Missing Email Authentication (SPF, DKIM, DMARC)** ⚠️ CRITICAL

**The Problem:**
When you send emails through SMTP (Gmail, SendGrid, etc.), spam filters check if your domain is authorized to send emails. Without proper DNS records, emails are automatically marked as spam.

**What Email Providers Check:**
- ✅ **SPF Record**: Is this server allowed to send emails for this domain?
- ✅ **DKIM Signature**: Is this email cryptographically signed by the sender?
- ✅ **DMARC Policy**: What should happen if SPF/DKIM fail?

**Why This Happens with Your Setup:**
If you're sending from `noreply@yourdomain.com` but using Gmail SMTP or Supabase default email, the **sending server doesn't match the "From" address domain**.

**Example:**
- Email says "From: noreply@qodebench.com"
- But you're sending through Gmail SMTP (smtp.gmail.com)
- Gmail server is NOT authorized to send for qodebench.com
- Result: 🚫 SPAM

---

### 2. **Using "noreply@" Address** 📧

**The Problem:**
Spam filters distrust `noreply@`, `no-reply@`, `donotreply@` addresses because:
- Spammers commonly use them
- Users can't respond to verify legitimacy
- Looks automated/robotic

**Better Alternatives:**
- ✅ `support@qodebench.com`
- ✅ `hello@qodebench.com`
- ✅ `team@qodebench.com`
- ✅ `notifications@qodebench.com`

---

### 3. **Low Sender Reputation** 📊

**The Problem:**
If you just set up SMTP:
- Your sending IP/domain has NO reputation yet
- Email providers don't trust you
- First emails often go to spam until reputation builds

**How to Build Reputation:**
- Send consistently (not sudden bursts)
- Get high open rates
- Get users to mark as "Not Spam"
- Avoid bounces and spam complaints

---

### 4. **Missing or Poor Email Headers** 📋

**The Problem:**
Your email might be missing important headers that verify legitimacy:
- `Reply-To` header
- Proper `Message-ID`
- `List-Unsubscribe` header (for bulk emails)
- Proper `Return-Path`

---

### 5. **Suspicious Link Patterns** 🔗

**The Problem in Your Template:**
```html
{{ .ConfirmationURL }}
```

This link:
- Is a long, random token URL
- Looks suspicious to spam filters
- Contains query parameters

**Spam Filters See:**
`https://yourapp.com/auth/callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

This looks like a phishing link!

---

## ✅ Complete Fix Guide

### Fix 1: Set Up Email Authentication (CRITICAL)

#### Option A: Send from Gmail Address (Easiest for Testing)

**Use Gmail's own address** so authentication works:

**Supabase SMTP Settings:**
```
Host: smtp.gmail.com
Port: 587
Username: yourname@gmail.com
Password: [App Password]
Sender email: yourname@gmail.com  ← MUST MATCH username
Sender name: QodeBench
```

**Email Template Settings in Supabase:**
- Change "From" to: `yourname@gmail.com`
- Or just use `QodeBench <yourname@gmail.com>`

✅ **Why This Works:**
- Gmail authenticates its own addresses automatically
- SPF/DKIM handled by Gmail
- Higher trust score

---

#### Option B: Use Custom Domain with Proper DNS (Best for Production)

If you own `qodebench.com`, set up proper email authentication:

**1. Add SPF Record** (DNS TXT Record)
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.google.com ~all
```
(This authorizes Gmail to send for your domain)

**2. Set Up DKIM** (in Gmail/Google Workspace)
- Go to Google Workspace Admin → Apps → Gmail → Authenticate Email
- Generate DKIM key
- Add provided DNS records

**3. Add DMARC Record** (DNS TXT Record)
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@qodebench.com
```

**4. Update Supabase SMTP:**
```
Sender email: noreply@qodebench.com
Sender name: QodeBench
```

Now emails from `noreply@qodebench.com` via Gmail SMTP will be authenticated!

---

#### Option C: Use Professional Email Service (Recommended)

**SendGrid (Best for Transactional Emails)**

1. **Sign up**: sendgrid.com (Free tier: 100 emails/day)
2. **Verify Domain**: Add DNS records they provide
3. **Get API Key**: Settings → API Keys
4. **Configure Supabase SMTP:**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [Your SendGrid API Key]
   Sender email: noreply@qodebench.com
   Sender name: QodeBench
   ```

✅ **Why SendGrid:**
- Pre-configured SPF/DKIM
- High deliverability rates
- Email analytics
- Domain reputation management
- Automatic spam testing

**Other Good Options:**
- **Mailgun**: Similar to SendGrid, great deliverability
- **Postmark**: Specializes in transactional emails
- **AWS SES**: Cheap, reliable, good for high volume
- **Resend**: Modern, developer-friendly, great DX

---

### Fix 2: Improve Email Template

Update your Supabase email template with these changes:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - QodeBench</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- Preheader text (hidden but helps email clients) -->
        <div style="display: none; max-height: 0; overflow: hidden;">
          Reset your QodeBench password - this link expires in 60 minutes
        </div>

        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="margin: 0; color: #0ea5e9; font-size: 28px; font-weight: 700;">QodeBench</h1>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Your Coding Interview Platform</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 22px; font-weight: 600;">Reset Your Password</h2>

              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Hi there,
              </p>

              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your QodeBench account.
                Click the button below to create a new password:
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}"
                       style="display: inline-block;
                              background-color: #0ea5e9;
                              color: #ffffff;
                              text-decoration: none;
                              padding: 16px 40px;
                              border-radius: 8px;
                              font-size: 16px;
                              font-weight: 600;
                              box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f8fafc; border-left: 4px solid #0ea5e9; padding: 16px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #334155; font-size: 14px; font-weight: 600;">
                      🔒 Security Notice
                    </p>
                    <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                      This link will expire in <strong>60 minutes</strong> for your security.
                      If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #475569; font-size: 15px; line-height: 1.6;">
                Best regards,<br>
                <strong>The QodeBench Team</strong>
              </p>
            </td>
          </tr>

          <!-- Alternative Link Section -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                <strong>Button not working?</strong> Copy and paste this link into your browser:
              </p>
              <p style="margin: 0; color: #0ea5e9; font-size: 12px; line-height: 1.5; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.6; text-align: center;">
                © 2025 QodeBench. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer Links -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td align="center" style="padding: 20px;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                Need help? Contact us at <a href="mailto:support@qodebench.com" style="color: #0ea5e9; text-decoration: none;">support@qodebench.com</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                QodeBench | Coding Interview Platform
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

**Key Improvements:**
1. ✅ Added preheader text (helps inbox placement)
2. ✅ Better security notice (builds trust)
3. ✅ Professional footer with company info
4. ✅ Contact email visible (shows you're real)
5. ✅ Better formatting and styling
6. ✅ More legitimate-looking design

---

### Fix 3: Change Sender Address

**In Supabase → Authentication → Email Templates:**

**BEFORE (Spam Trigger):**
```
From: noreply@qodebench.com
```

**AFTER (Better):**
```
From: QodeBench <support@qodebench.com>
```

Or if using Gmail SMTP:
```
From: QodeBench <yourname@gmail.com>
```

---

### Fix 4: Ask Users to Whitelist

**Add this to your documentation/first email:**

> **To ensure you receive our emails:**
>
> Please add `support@qodebench.com` (or your email) to your contacts/safe senders list.
>
> **Gmail users:** Move this email from Spam to Inbox, then click "Report not spam"
> **Outlook users:** Right-click → Junk → "Not Junk" → "Always trust"

---

### Fix 5: Warm Up Your Email Sender

If using a new email domain or SMTP:

**Week 1:** Send 50-100 emails/day
**Week 2:** Send 200-500 emails/day
**Week 3:** Send 1,000-2,000 emails/day
**Week 4+:** Full volume

This builds sender reputation gradually.

---

## 🧪 Testing Email Deliverability

### Test 1: Mail-Tester.com
1. Go to https://mail-tester.com
2. They give you a test email address
3. Send reset password to that address from your app
4. Check your spam score (aim for 8/10 or higher)
5. Fix issues they identify

### Test 2: Check Email Authentication
1. Go to https://mxtoolbox.com/SuperTool.aspx
2. Enter your domain
3. Check SPF, DKIM, DMARC records
4. All should show ✅ green

### Test 3: Send to Multiple Providers
Test with:
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- ProtonMail

Check if it lands in Inbox or Spam for each.

---

## 📊 Quick Win: Use SendGrid Right Now

**Fastest Solution (30 minutes setup):**

1. **Sign up**: https://sendgrid.com (Free: 100 emails/day)

2. **Verify Your Email:**
   - Settings → Sender Authentication
   - Click "Verify Single Sender"
   - Use your Gmail or work email
   - Click verification link in email

3. **Get API Key:**
   - Settings → API Keys → Create API Key
   - Name: "QodeBench Production"
   - Full Access
   - Copy the key (save it securely!)

4. **Configure Supabase:**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [paste your SendGrid API key]
   Sender email: [the email you verified in step 2]
   Sender name: QodeBench
   ```

5. **Update Email Template:**
   - Supabase → Authentication → Email Templates
   - Paste the improved template from above

6. **Test:**
   - Send reset password email
   - Check inbox (should NOT be in spam now!)

✅ **Result:** 90%+ inbox delivery rate

---

## 🎯 Production-Ready Checklist

Before going live:

### DNS Records:
- [ ] SPF record added
- [ ] DKIM configured and verified
- [ ] DMARC policy set
- [ ] MX records configured (if using custom domain for receiving)

### Email Service:
- [ ] Professional email service (SendGrid/Postmark/Mailgun)
- [ ] Domain authenticated
- [ ] Sender email verified
- [ ] API keys secured in environment variables

### Email Content:
- [ ] No "noreply@" address (use support@, hello@, etc.)
- [ ] Professional HTML template
- [ ] Preheader text added
- [ ] Contact info visible
- [ ] Unsubscribe link (for marketing emails)
- [ ] Physical address (for marketing emails)

### Testing:
- [ ] Mail-tester score 8/10+
- [ ] Tested on Gmail, Outlook, Yahoo
- [ ] SPF/DKIM/DMARC passing
- [ ] Links work correctly
- [ ] Mobile-responsive
- [ ] No broken images

### Monitoring:
- [ ] Email delivery monitoring set up
- [ ] Bounce rate tracking
- [ ] Complaint rate monitoring
- [ ] Open rate tracking (optional)

---

## 🚨 Common Mistakes to Avoid

1. ❌ Using `noreply@` addresses
2. ❌ No SPF/DKIM/DMARC records
3. ❌ Sending from wrong domain
4. ❌ All caps subject lines ("RESET YOUR PASSWORD")
5. ❌ Too many exclamation marks!!!
6. ❌ Suspicious words: "FREE", "CLICK NOW", "LIMITED TIME"
7. ❌ Broken or shortened links (bit.ly, etc.)
8. ❌ Poor email-to-text ratio
9. ❌ Large images without alt text
10. ❌ Sending too many emails too quickly (new sender)

---

## Summary: Quick Fix Steps

**Immediate (5 minutes):**
1. Change sender from `noreply@` to `support@` or use Gmail address
2. Update email template with improved version above

**Short-term (30 minutes):**
1. Sign up for SendGrid free tier
2. Verify sender email
3. Configure Supabase SMTP with SendGrid
4. Test with mail-tester.com

**Long-term (1-2 hours):**
1. Set up custom domain email
2. Add SPF/DKIM/DMARC DNS records
3. Warm up sender reputation
4. Monitor deliverability metrics

---

**Need help?** Feel free to ask about any of these steps!
