const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service : 'gmail',
  auth : {
    user : 'irwanramadhan288@gmail.com',
    pass : 'nwjgiutpadwouakn'
  },
  tls : {
    rejectUnauthorized : false
  }
})

module.exports =transporter