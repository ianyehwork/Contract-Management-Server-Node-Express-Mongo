var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVICE_ACC,
        pass: process.env.EMAIL_SERVICE_PWD
    }
});

var sendPasswordResetEmail = (receiverEmail, username, token) => {
    var resetPasswordUrl = `${process.env.APP_BASE_URL}/password-reset/${username}/${token}`;
    var mailOptions = {
        from: 'ian.yeh.work@gmail.com',
        to: receiverEmail,
        subject: '[PLMS] Password reset request.',
        html:`<h1>Hi @${username}!</h1>
              <p>You're receiving this email because you recently made a password reset request. If this wasn't you, please ignore this email.</p>
              <p>Click the following link into your browser:</p>
              <p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return error;
        } else {
            return 'Email sent: ' + info.response;
        }
    });
};

var sendLoginTokenEmail = (receiverEmail, username, token) => {
    var mailOptions = {
        from: 'ian.yeh.work@gmail.com',
        to: receiverEmail,
        subject: '[PLMS] Login token request.',
        html:`<h1>Hi @${username}!</h1>
              <p>You're receiving this email because you recently attempted to log into the system. If this wasn't you, please reset you password!</p>
              <p>The login token is:</p>
              <p><h2>${token}</h2></p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return error;
        } else {
            return 'Email sent: ' + info.response;
        }
    });
};

module.exports = {
    sendPasswordResetEmail,
    sendLoginTokenEmail
};