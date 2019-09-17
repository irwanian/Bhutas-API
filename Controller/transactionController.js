const connection = require('../Database/index')
const { uploader } = require('../Helpers/fileUploader')
const fs = require('fs')

module.exports = {
    getTrxData: (req, res) => {
        let sql =  `SELECT
                    t.id as transaction_id,
                    p.id as product_id,
                    p.productname,
                    p.image as picture,
                    c.categoryname as category,
                    b.brandname as brand,
                    ti.price as price,
                    p.discount,
                    ti.qty as qty,
                    t.total_price as total
                    from products p
                    join transaction_item ti
                    on ti.product_id = p.id
                    join categories c
                    on c.id = p.category_id
                    join brands b
                    on b.id = p.brand_id
                    join transaction t
                    on t.id = ti.transaction_id
                    join users u
                    on u.id = t.user_id
                    where u.id = ${req.params.id}
                    and t.status = 1
        `
        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({ message: 'error retrieving transaction data ', err})

            // const today = new Date()
            sql = `select id, total_price from transaction where user_id = ${req.params.id} and status = 1` 

            connection.query(sql ,(err1, trxResults) => {
                if(err1) res.status(500).send({message: `error retrieving transaction id`, err1})
                
                res.status(200).send({
                                        transaction_data: results,
                                        transaction_id: trxResults[trxResults.length - 1].id,
                                        total: trxResults[trxResults.length - 1].total_price
                                    })
            })
        })
    },
    uploadTrx: (req, res) => {
        try {
            const path = '/post/images/products/transaction'; //file save path
            const upload = uploader(path, 'BHT').fields([{ name: 'image'}]); //uploader(path, 'default prefix') nama property di fields harus sesuai dengan nama di formData
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Error!', err });
                }
    
                const { image } = req.files;
                console.log(image + ' image transaction')
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                let sql = `select * from transaction where status = 1 and transaction_canceled = 0 and id = ${req.params.id}`
            
                connection.query(sql, (err, results)=> {
                    if(err) res.status(500).send({message: 'error retrieving transaction data', err})
                    
                    sql = `update transaction set trx_proof = '${imagePath}', status = 2
                           where status = 1 and transaction_canceled = 0 and id =${req.params.id}`

                    connection.query(sql, (err1, results)=> {
                        if(err1) return res.status(500).send({ message: 'error updating transaction data', err1})

                        res.status(200).send(results)
                    })
                })
            })
        } catch(err) {
            return res.status(500).json({ message: "Third Error", error: err.message });
        }
    },
    getUnapprovedTrx: (req, res) => {
        let sql =  `select t.id,
                    t.transaction_date as date,
                    t.trx_proof as proof,
                    u.fullname from transaction t
                    join users u
                    on u.id = t.user_id
                    where t.status = 2
        `
        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({ message: 'error retrieving transaction data ', err})

            // const today = new Date()
            sql = `select id from transaction where status = 2` 

            connection.query(sql ,(err1, trxResults) => {
                if(err1) res.status(500).send({message: `error retrieving transaction id`, err1})
                
                res.status(200).send(results)
            })
        })
    },
    unapprovedTrxDetail: (req, res) => {
        let sql = `select t.id,
                   p.productname,
                   p.image as picture,
                   ti.price,
                   ti.qty,
                   (ti.price * ti.qty) as total_price
                   from transaction t
                   join transaction_item ti
                   on t.id = ti.transaction_id
                   join products p
                   on p.id = ti.product_id
                   where t.id = ${req.params.id}
                   `
        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({message: `error retrieving detail`, err})

            return res.status(200).send(results)
        })           
    },
    acceptTrx: (req, res) => {
        let sql = `select * from transaction where status = 2 and id = ${req.params.id} and transaction_canceled = 0`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({ message: 'error retrieving transaction data', err })

            sql = `update transaction set status = 3 where status = 2 and  id = ${req.params.id} and transaction_canceled = 0`

            connection.query(sql, (err1, results)=> {
                if(err1) return res.status(500).send({ message: 'error updating transaction status', err1 })
                
                sql = `select t.id,
                t.transaction_date as date,
                t.trx_proof as proof,
                u.fullname from transaction t
                join users u
                on u.id = t.user_id
                where t.status = 2
                 `
               connection.query(sql, (err2, results)=> {
                if(err2) return res.status(500).send({ message: 'error retrieving updated transaction data', err2})

                   return res.status(200).send(results)
               })     
            })
        })
    },
    rejectTrx: (req, res) => {
        let sql = `select * from transaction where status = 2 and id = ${req.params.id} and transaction_canceled = 0`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({ message: 'error retrieving transaction data', err })

            sql = `update transaction set status = 4 where status = 2 and id = ${req.params.id} and transaction_canceled = 0`

            connection.query(sql, (err1, results)=> {
                if(err1) return res.status(500).send({ message: 'error updating transaction status', err1 })
                
                sql = `select t.id,
                t.transaction_date as date,
                t.trx_proof as proof,
                u.fullname from transaction t
                join users u
                on u.id = t.user_id
                where t.status = 2
                 `
               connection.query(sql, (err2, results)=> {
                if(err2) return res.status(500).send({ message: 'error retrieving updated transaction data', err2})

                   return res.status(200).send(results)
               })
            })
        })
    },
    getUnsentItems: (req, res) => {
        let sql = ` select t.id,
        t.transaction_date as date,
        t.trx_proof as proof,
        u.fullname from transaction t
        join users u
        on u.id = t.user_id
        where t.status = 3
        `
        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({message: 'error retrieving unsent products', err})

            return res.status(200).send(results)
        })
    },
    sendItems: (req, res) => {

            sql = `update transaction set status = 5 where status = 3 and id = ${req.params.id} and transaction_canceled = 0`

            connection.query(sql, (err1, results)=> {
                if(err1) return res.status(500).send({ message: 'error updating transaction status', err1 })
                
                sql= ` select t.id,
                       t.transaction_date as date,
                       t.trx_proof as proof,
                       u.fullname from transaction t
                       join users u
                       on u.id = t.user_id
                       where t.status = 3
                        `

                        connection.query(sql, (err2, results)=> {
                            if(err2) return res.status(500).send({message: `error occurred when retrieving unsent items`})
                    
                            return res.status(200).send(results)
                })
            })
    },
    receiveItems: (req, res) => {
        let sql = `select * from transaction where status = 5 and id = ${req.params.id} and transaction_canceled = 0`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({ message: 'error retrieving transaction data', err })

            sql = `update transaction set status = 6 where status = 5  id = ${req.params.id} and transaction_canceled = 0`

            connection.query(sql, (err1, results)=> {
                if(err1) return res.status(500).send({ message: 'error updating transaction status', err1 })
                
                return res.status(200).send(results)
            })
        })
    },
    getAdminTrxHistory: (req, res) => {
        let sql =  `SELECT
                    t.id as transaction_id,
                    p.id as product_id,
                    p.productname,
                    p.image as picture,
                    c.categoryname as category,
                    b.brandname as brand,
                    ti.price as price,
                    p.discount,
                    ti.qty as qty,
                    t.total_price as total
                    from products p
                    join transaction_item ti
                    on ti.product_id = p.id
                    join categories c
                    on c.id = p.category_id
                    join brands b
                    on b.id = p.brand_id
                    join transaction t
                    on t.id = ti.transaction_id
                    join users u
                    on u.id = t.user_id
                    where t.status = 6
        `
        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({ message: 'error retrieving transaction data ', err})

            // const today = new Date()
            sql = `select id, total_price from transaction where user_id = ${req.params.id} and status = 6` 

            connection.query(sql ,(err1, trxResults) => {
                if(err1) res.status(500).send({message: `error retrieving transaction id`, err1})
                
                res.status(200).send({
                                        transaction_data: results,
                                        transaction_id: trxResults[trxResults.length - 1].id,
                                        total: trxResults[trxResults.length - 1].total_price
                                    })
            })
        })
    },
    getUserTrxHistory: (req, res) => {
        let sql =  `SELECT
                    t.id as transaction_id,
                    p.id as product_id,
                    p.productname,
                    p.image as picture,
                    c.categoryname as category,
                    b.brandname as brand,
                    ti.price as price,
                    p.discount,
                    ti.qty as qty,
                    t.total_price as total
                    from products p
                    join transaction_item ti
                    on ti.product_id = p.id
                    join categories c
                    on c.id = p.category_id
                    join brands b
                    on b.id = p.brand_id
                    join transaction t
                    on t.id = ti.transaction_id
                    join users u
                    on u.id = t.user_id
                    where t.status = 6
                    and u.id = ${req.params.id}
        `
        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({ message: 'error retrieving transaction data ', err})

            // const today = new Date()
            sql = `select id, total_price from transaction where user_id = ${req.params.id} and status = 6` 

            connection.query(sql ,(err1, trxResults) => {
                if(err1) res.status(500).send({message: `error retrieving transaction id`, err1})
                
                res.status(200).send({
                                        transaction_data: results,
                                        transaction_id: trxResults[trxResults.length - 1].id,
                                        total: trxResults[trxResults.length - 1].total_price
                                    })
            })
        })
    }    
}      