/* --------------- Account.js --------------- */

"use strict";

{
    const
        sgMail = require("@sendgrid/mail"),
        appMail = "descorcia@intekglobal.com";

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const sendWelcomeEmail = function (email, name) {
        sgMail.send({
            to: email,
            from: appMail,
            subject: "TaskApp Welcome Mail",
            text: `Welcome ${name}!`
        });
    }

    const sendCancelationEmail = function (email, name) {
        sgMail.send({
            to: email,
            from: appMail,
            subject: "Taskapp account canceled",
            text: `We are sorry you canceled your account ${name}. 
Let us know if there is anything we could do to improve your experience with our application. `
        });
    }

    module.exports = { sendWelcomeEmail, sendCancelationEmail };
}





