const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets.json'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-central-1'
});

exports.send = (email, secretCode) => {
    return ses.sendEmail({
        Source: "silke.m.fahr@gmail.com",
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: "Reset password"
            },
            Body: {
                Text: {
                    Data: "Here is your code for resetting your password: " + [secretCode]
                }
            }
        }
    }).promise().then(
        () => console.log('OMG it worked!')
    ).catch(
        err => console.log(err)
    );
}
