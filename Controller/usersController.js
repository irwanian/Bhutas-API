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
                    
                    var verificationLink = `http://localhost:3000/verified?username=${fullname}&password=${hashPassword}`
                    mailOptions = {
                        from : 'Bhutas Team <irwanramadhan288@gmail.com>',
                        to : email,
                        subject : ' Bhutas email Verification',
                        html : `We're gladly welcome You to our community, to verify Your Account, Please click this link below : 
                        <a href="${verificationLink}"> Join Bhutas! </a>`
                    }

                    transporter.sendMail(mailOptions, (err3, results)=> {
                        if(err) return res.status(500).send({message: 'an error occurred when sending email', err3})

                    })

                    var sql = `select * from users`
    
                    connection.query(sql, (err2, results) => {
                        if(err2) return res.status(500).send({message: 'an error occured when fetching data 2', err2})
                        
                        res.status(200).send(results)
                    })
                    })
            } 
        })
    },
    emailVerification : (req, res) => {
        var {email, password} = req.body
        var sql = `select email from users where email='${email}'`
        connection.query(sql , (err, results)=> {
            if(err) return res.status(500).send({status : 'error', err})

            if(results.length === 0 ){
                return res.status(500).send({status : 'error', err : 'user not found'})
            }

            sql = `update users set status= 1 where email='${email}' and password='${password}'`

            conn.query(sql, (err1, results) => {
                if(err1) return res.status(500).send({status : 'error', err})

                return res.status(200).send(results)    
            })
        })
    },
    resendEmailVerification : (req, res) => {
        var {fullname, email} = req.body

        var sql = `select fullname, password, email from users where username='${fullname}' and email='${email}'`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({status : 'error', err})

            if(results.length === 0){
                return res.status(500).send({status: 'error', err : 'User Not Found!!'})
            }

            var verificationLink = `http://localhost:3000/verified?fullname=${results[0].fullname}&password=${results[0].password}`
                        mailOptions = {
                            from : 'Your God <irwanramadhan288@gmail.com>',
                            to : results[0].email,
                            subject : ' Bhutas email Verification',
                            html : `Klik link dibawah inii untuk verifikasi : 
                            <a href="${verificationLink}"> Join Bhutas! </a>`
                        }
    
                        transporter.sendMail(mailOptions, (err2, res2) =>{
                            if(err2){
                                console.log(err2);
                                return res.status(500).send({status: 'error occurred when resending email verification', err : err2})
                            }
    
                            console.log('Success Bro!!');
                            return res.status(200).send({results})
                    })
            })
        },
        keepLogged : (req, res)=> {
            console.log(req.user);
            var sql = `select * from users where id=${req.user.userId}`
            connection.query(sql, (err, results)=> {
                if(err) return res.status(500).send({status : 'error', err})
               
                if(results.length === 0){
                    return res.status(500).send({status: 'error', status: 'User Not Found'})
                }
                console.log(results);
    
                res.send({username : results[0].fullname, email : results[0].email, status : results[0].status})
            })
        },
        login : (req, res)=>{
            var {email, password} = req.body
            var hashPassword = crypto.createHmac('sha256', 'generateRandomString').update(password).digest('hex')

            var sql = `select * from users where email='${email}' and password='${hashPassword}'`
            connection.query(sql, (err, results)=> {
                if(err) return res.status(500).send({status: 'error', err})
    
                if(results.length === 0){
                    return res.status(200).send({status: 'error', message: 'email or password incorrect'})
                }

                // var sql = `update users set last_login = ${lastLog} where email= '${email}' and password = '${hashPassword}'`
                // connection.query(sql, (err1, results)=> {
                //     console.log(err1.sqlMessage);
                    
                //     if(err1) return res.status(500).send({message: 'an error occurred when updating last_login', err1})

                    return res.status(200).send({ email : results[0].email, status : results[0].status })
                })
        }
}