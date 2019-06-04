const nodeMailer = require('nodemailer');

module.exports = nodeMailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: 'info@jc-desarrollos.com',
        pass: 'Cruz.1994'
    }
});