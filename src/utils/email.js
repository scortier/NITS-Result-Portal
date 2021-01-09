const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
    process.env.GMAIL_OAUTH2_CLIENT_ID,
    process.env.GMAIL_OAUTH2_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
)

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_OAUTH2_REFRESH_TOKEN,
})
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'example@gmail.com',
        clientId: process.env.GMAIL_OAUTH2_CLIENT_ID,
        clientSecret: process.env.GMAIL_OAUTH2_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH2_REFRESH_TOKEN,
        accessToken: accessToken,
    },
    tls: {
        rejectUnauthorized: false,
    },
})

module.exports = smtpTransport
