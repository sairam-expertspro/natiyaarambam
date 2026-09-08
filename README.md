# natiyaarambam
dance academy

## Contact form setup

Required environment variables:

- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT` (optional)
- `MYSQL_SSL` (optional, set to `true` if your Hostinger plan requires SSL)
- `ZEPTOMAIL_HOST`
- `ZEPTOMAIL_PORT`
- `ZEPTOMAIL_API_USER`
- `ZEPTOMAIL_API_KEY`
- `CONTACT_FROM_EMAIL` or `ZEPTOMAIL_FROM_EMAIL`
- `CONTACT_NOTIFY_EMAIL` or `ENROLL_NOTIFY_EMAIL`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `ADMIN_BASIC_AUTH_USER`
- `ADMIN_BASIC_AUTH_PASSWORD`

Routes:

- Contact form submission: `/api/enroll` and `/api/contact`
- Admin inbox: `/admin`
