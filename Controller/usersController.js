const connection = require('../Database')
const crypto = require('crypto')
const transporter = require('../Helpers/Mailer')

module.exports = {
    getAllUsers: (req, res) => {
        var sql = `select * from users`

        connection.query(sql, (err, results)=>{
            if(err) return res.status(500).send({message: 'an error occurred when fetching data', err})

            res.status(200).send(results)
        })
    },
    getCurretnUser: (req, res) => {
        let sql = `select * from users where is_login = 1`
        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({message: 'error retrieving data', err})

            res.status(200).send(results)
        })
    },
    searchUser: (req, res) => {
        var sql = `select * from users where email='${req.query.email}'`

        connection.query(sql, (err, results)=>{
            if(err) return res.status(500).send({message: 'an error occurred when fetching data', err})
            
            res.status(200).send(results)
        })
    },
    registerNewUser: (req, res) => {
        var { email, password, fullname, last_login } = req.body
        var sql = `select email from users where email = '${email}'`

        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({message: 'an error occurred when fetching data', err})
                        
            if(results.length > 0 ){
                return res.status(500).send({message: 'email is not available', err})
            }else{
                var hashPassword = crypto.createHmac('sha256', 'generateRandomString').update(password).digest('hex')                
                var userData = {
                    fullname,
                    password: hashPassword,
                    email,
                    last_login : new Date()
                }
                var sql = `insert into users set ?`
                
                connection.query(sql, userData, (err1, results) => {
                    if(err1) return res.status(500).send({message: 'an error occured when posting data', err1})
                    
                    var verificationLink = `http://localhost:3000/verified?fullname=${fullname}&password=${hashPassword}`
                    mailOptions = {
                        from : 'Bhutas Team <irwanramadhan288@gmail.com>',
                        to : email,
                        subject : ' Bhutas email Verification',
                        html : `We're gladly welcome You to our community, to verify Your Account, Please click this link below : <br/>
                        <a href="${verificationLink}"> Join Bhutas! </a>`
                    }

                    transporter.sendMail(mailOptions, (err3, results)=> {
                        if(err) return res.status(500).send({message: 'an error occurred when sending email', err3})

                        connection.query(`select * from users where email = '${email}'`, (err4, results)=> {
                            if(err4) return res.status(500).send(err4)

                            res.status(200).send(results)
                        })
                    })
                })
            } 
        })
    },
    emailVerification : (req, res) => {
        var {fullname, password} = req.body
        var sql = `select email, fullname, password from users where fullname='${fullname}'`

        connection.query(sql , (err, results)=> {
            if(err) return res.status(500).send({status : 'error', err})

            if(results.length === 0 ){
                return res.status(500).send({status : 'error', err : 'user not found'})
            }
            
            sql = `update users set status= 1 where email='${results[0].email}' and password='${password}'`

            connection.query(sql, (err1, results) => {
                if(err1) return res.status(500).send({status : 'error', err})

                return res.status(200).send(results)    
            })
        })
    },
    resendEmailVerification : (req, res) => {
        var {fullname, email} = req.body

        var sql = `select fullname, email, password, role_id from users where fullname='${fullname}' and email='${email}'`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({status : 'error', err})

            if(results.length === 0){
                return res.status(500).send({status: 'error', err : 'User Not Found!!'})
            }

                var verificationLink = `http://localhost:3000/verified?fullname=${results[0].fullname}&password=${results[0].password}`
                        mailOptions = {
                            from : 'Bhutas Team <irwanramadhan288@gmail.com>',
                            to : email,
                            subject : ' Bhutas email Verification',
                            html : `We're gladly welcome You to our community, to verify Your Account, Please click this link below : <br/>
                            <a href="${verificationLink}"> Join Bhutas! </a>`
                        }
    
                        transporter.sendMail(mailOptions, (err2, res2) =>{
                            if(err2){
                                console.log(err2);
                                return res.status(500).send({status: 'error occurred when resending email verification', err : err2})
                            }
    
                            console.log('Resend Email Verification Success, Bro!!');
                            return res.status(200).send({results})
                })
            })
        },
        keepLogged : (req, res)=> {
            if(!req.query.email){
                req.query.email === ''
            }
            console.log(req)
            var sql = `select * from users where email = '${req.query.email}'`
            connection.query(sql, (err, results)=> {
                if(err) return res.status(500).send({status : 'error', err})
               
                if(results.length === 0){
                    return res.status(500).send({status: 'error', status: 'User Not Found'})
                }
                
                console.log(results)
                res.status(200).send({results})
            })
        },
        login : (req, res)=>{
            var { email, password } = req.body
            var hashPassword = crypto.createHmac('sha256', 'generateRandomString').update(password).digest('hex')

            var sql = `select * from users where email='${email}' and password='${hashPassword}'`
            connection.query(sql, (err, results)=> {
                if(err) return res.status(500).send({status: 'error', err})
    
                if(results.length === 0){
                    return res.status(200).send({status: 'error', message: 'email or password incorrect'})
                }

                const data= {
                    email: email,
                    password: hashPassword,
                    last_login: new Date(),
                    is_login: 1
                }

                var sql = `update users set ? where email= '${email}' and password = '${hashPassword}'`
                
                connection.query(sql, data, (err1, results)=> {
                    
                    if(err1) return res.status(500).send({message: 'an error occurred when updating last_login', err1})

                    return res.status(200).send(results)
                })
            })
    },
    logoutUser: (req, res)=> {
        console.log(req.body)
        // connection.query(`update users set = 0 where email =`)
    }
}
