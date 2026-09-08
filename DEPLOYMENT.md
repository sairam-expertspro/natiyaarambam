# Natyaarambam production deployment guide

Use this guide to deploy the Next.js app on Hostinger with MySQL, ZeptoMail, Google reCAPTCHA, and the admin inbox.

## 1. Pre-deploy checks

1. Pull the latest code.
2. Run locally:
   ```bash
   npm install
   npm run build
   npm run lint
   ```
3. Confirm these routes work:
   - `/contact`
   - `/admin`
   - `/api/enroll`
   - `/api/contact`

## 2. Hostinger app setup

1. In Hostinger hPanel, open **Websites -> Manage -> Advanced -> Node.js**.
2. Create or select the Node app for this site.
3. Point the app root to the project directory.
4. Use:
   ```bash
   npm start
   ```
5. Make sure the app is restarted after every deploy.

## 3. MySQL setup

Create a MySQL database and user in Hostinger.

Set these env vars:
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT` (usually `3306`)
- `MYSQL_SSL` (`true` if your Hostinger setup requires SSL)

Notes:
- The app auto-creates the `contact_messages` table on first successful submission.
- The admin inbox reads from the same table.

## 4. ZeptoMail setup

In ZeptoMail:
1. Create/confirm your SMTP endpoint.
2. Verify the sender email/domain.
3. Copy the SMTP host, port, username, and API key/password.

Set:
- `ZEPTOMAIL_HOST`
- `ZEPTOMAIL_PORT`
- `ZEPTOMAIL_API_USER`
- `ZEPTOMAIL_API_KEY`

Mail identity used by the app:
- From: `Natyaarambham Support Team | natyaarambham@gmail.com`
- Support reply email: `natyaarambham@gmail.com`

Optional/used by the app:
- `CONTACT_FROM_EMAIL`
- `CONTACT_NOTIFY_EMAIL`
- `ZEPTOMAIL_FROM_EMAIL`
- `ZEPTOMAIL_FROM`
- `ENROLL_NOTIFY_EMAIL`
- `LEAD_EMAIL_TO`

## 5. Google reCAPTCHA v2 checkbox

Set up the site in Google reCAPTCHA and choose **v2 Checkbox**.

Set:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

Important:
- Add your production domain in the reCAPTCHA admin console.
- The form will not submit successfully without a valid token.

## 6. Admin inbox protection

The admin screen is at:
- `/admin`

Protect it with basic auth:
- `ADMIN_BASIC_AUTH_USER`
- `ADMIN_BASIC_AUTH_PASSWORD`

## 7. Production environment variables

Set these in Hostinger:

```bash
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_PORT=3306
MYSQL_SSL=true

ZEPTOMAIL_HOST=
ZEPTOMAIL_PORT=
ZEPTOMAIL_API_USER=
ZEPTOMAIL_API_KEY=

CONTACT_FROM_EMAIL=
CONTACT_NOTIFY_EMAIL=

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

ADMIN_BASIC_AUTH_USER=
ADMIN_BASIC_AUTH_PASSWORD=
```

## 8. Deploy

1. Upload or pull the latest code to the Hostinger app directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build:
   ```bash
   npm run build
   ```
4. Restart the Node app.

## 9. Post-deploy verification

Test:
- Home page loads
- Contact form loads
- reCAPTCHA checkbox appears
- Form submits successfully
- User receives the thank-you email
- Support inbox receives the enquiry email
- Admin inbox opens with basic auth

## 10. Email content behavior

On successful submission, the app sends:

1. A thank-you email to the submitter.
2. A support notification email to Natyaarambham.

Subject lines:
- `Thank you for contacting Natyaarambham Dance Academy`
- `New Enquiry Submitted via Natyaarambham Website`

## 11. Troubleshooting

- reCAPTCHA missing: check `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- reCAPTCHA verification failure: check `RECAPTCHA_SECRET_KEY`
- Email not sending: check ZeptoMail credentials and sender verification
- DB write failure: check MySQL host/user/password/database/SSL
- Admin access denied: check basic auth env vars

