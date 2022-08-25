// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC20e48fd1fab979da60ed1ac2ffac81f9';
const authToken = '385f06570365e67420567f3b9f82c0b3';
const client = require('twilio')(accountSid, authToken);

const sendMessage = (phone, OTP, hash) => {
    client.messages
    .create({
        body: '<#> Your OOPs-Project code is ' + String(OTP) + '\n' + hash,
        from: '+12564856267',
        to: '+91' + phone
   })
  .then(message => console.log(message.sid));
}

// sendMessage('8692078552', 123456)

module.exports = sendMessage