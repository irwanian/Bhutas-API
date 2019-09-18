const connection = require('../Database')

module.exports = {
    getUserCartData: (req, res) => {
        let sql =  `SELECT p.productname,
                    p.id as product_id,
                    p.price,
                    u.id as user,
                    p.discount,
                    p.image as picture,
                    c.categoryname as category,
                    b.brandname as brand,
                    b.image as logo,
                    ca.user_id as user,
                    ca.product_id as product,
                    ca.move_to_trx as trx,
                    ca.qty as qty,
                    ca.price as cart_price,
                    ca.total_price,
                    u.fullname,
                    ca.size,
                    ca.id as cart_id
                    from products p
                    join categories c
                    on c.id = p.category_id
                    join brands b
                    on b.id = p.brand_id
                    join cart ca
                    on ca.product_id = p.id
                    join users u
                    on u.id = ca.user_id
                    where u.id = ${req.params.id}
                    and ca.move_to_trx = 0
                    and ca.product_deleted = 0
                    `
                    
                    connection.query(sql, (err, results)=> {
                        if(err) return res.status(500).send(err)
                        console.log(results)
                        
                        res.status(200).send(results)
                    })
    },
    addToCart: (req, res)=> {
        const { product_id, user_id, qty, price, total_price, size } = req.body

        let sql = `select * from cart where user_id = ${user_id} and size = ${size} and product_id = ${product_id} and product_deleted = 0 and move_to_trx = 0`

        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({message: 'error retrieving cart detail'})
            
            if(results.length > 0){
                cartData = {
                    product_id,
                    user_id,
                    qty: results[0].qty + qty,
                    price,
                    total_price: total_price + results[0].total_price,
                    size
                }
                sql = `update cart set ? where product_id = ${product_id} and user_id = ${user_id} and size = ${size}`
            }else{
                cartData = {
                    product_id,
                    user_id,
                    qty,
                    price,
                    total_price,
                    size
                 }
                sql = `insert into cart set ?`
            }
                    connection.query(sql, cartData, (err1, results)=> {
                    if(err) res.status(500).send({message: 'error occurred when posting cart data', err})
                    
                    if(product_id === 0 || qty === 0 || price === 0|| total_price === 0){
                        res.status(500).send({message: 'an error occurred, please contact the administrator', err})
                }
                    console.log(results)
                    res.status(200).send(results)
                })
        })
    },
    getCartTotalQty: (req, res)=> {
        let sql = `select SUM(qty) as totalqty from cart where user_id = ${req.params.id} and product_deleted = 0 and move_to_trx = 0;`

        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({message: 'error retrieving cart data'})

            console.log(results)

            return res.status(200).send({ results: results[0].totalqty})
        })
    },
    deleteCartProduct: (req, res)=> {
        console.log(req.params)
        let sql = `UPDATE cart set product_deleted = 1 where id = ${req.params.id}`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send({message: 'an error occurred when deleting data'})

         sql =  `SELECT p.productname,
                    p.id as product_id,
                    p.price,
                    p.discount,
                    u.id as user,
                    p.image as picture,
                    c.categoryname as category,
                    b.brandname as brand,
                    b.image as logo,
                    ca.user_id as user,
                    ca.product_id as product,
                    ca.move_to_trx as trx,
                    ca.qty as qty,
                    ca.price as cart_price,
                    ca.total_price,
                    u.fullname,
                    ca.size,
                    ca.id as cart_id
                    from products p
                    join categories c
                    on c.id = p.category_id
                    join brands b
                    on b.id = p.brand_id
                    join cart ca
                    on ca.product_id = p.id
                    join users u
                    on u.id = ca.user_id
                    where u.id = ${req.params.user}
                    and ca.move_to_trx = 0
                    and ca.product_deleted = 0
                    `

                    connection.query(sql, (err1, results)=> {
                        if(err1) return res.status(500).send(err1)

                        console.log('data cart')
                        console.log(results)

                        res.status(200).send(results)
            })
        })
    },
    cartCheckout: (req, res)=> {
            sql = `insert into transaction (user_id, total_price) select user_id, SUM(total_price) from cart
                   where move_to_trx = 0 and product_deleted = 0 and user_id = ${req.params.id}`

            console.log('pass')

            connection.query(sql, (err1, results)=> {
                if(err1) return res.status(500).send({ message: 'error inserting transaction data', err1 })
                
                let id = results.insertId

                console.log(id)
                sql = ` insert into transaction_item (transaction_id, product_id, price, qty, size)
                        select t.id, product_id, price, qty, size
                        from cart ca
                        join transaction t
                        on t.user_id = ca.user_id
                        where ca.move_to_trx = 0
                        and ca.product_deleted = 0
                        and t.status = 0`

                connection.query(sql, (err2, results)=> {
                    if(err2) return res.status(500).send({ message: 'error updating transaction_item', err2})
                    sql = `update cart set move_to_trx = 1`

                    connection.query(sql, (err3, results)=> {
                        if(err3) return res.status(500).send({ message: 'error updating cart data', err3 })

                        sql = `update transaction set status = 1 where status = 0 and transaction_canceled = 0`
                            connection.query(sql, (err4, results)=> {
                                res.status(200).send(results)
                        })                                 
                    })
                })
            })
    }
}

                    