const connection = require('../Database')

module.exports = {
    getUserCartData: (req, res) => {
        let sql =  `SELECT p.productname,
                    p.id as product_id,
                    p.price,
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
                        
                        
                        res.status(200).send(results)
                    })
    },
    addToCart: (req, res)=> {
        const { product_id, user_id, qty, price, total_price, size } = req.body

        let sql = `select * from cart where user_id = ${user_id} and size = ${size} and product_id = ${product_id}`

        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({message: 'error retrieving cart detail'})
            
            let cartData = {
                
            }


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

            sql = `SELECT p.productname,
                    p.id as product_id,
                    p.price,
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

                    connection.query(sql, (err1, results)=> {
                        if(err1) return res.status(500).send(err1)

                        res.status(200).send(results)
            })
        })
    },
    addTransactionDetail: (req, res)=> {
            sql = `insert into transaction (user_id, total_price) select user_id, total_price from cart
                   where move_to_trx = 0 and product_deleted = 0 and user_id = ${req.params.id}`

            console.log('pass')

            connection.query(sql, (err1, results)=> {
                if(err1) return res.status(500).send({ message: 'error inserting transaction data', err1 })
                
                sql = ` insert into transaction_item (transaction_id, product_id, price, qty)
                        select t.id, product_id, price, qty
                        from cart ca
                        join transaction t
                        on t.user_id = ca.user_id
                        where ca.move_to_trx = 0
                        and ca.product_deleted = 0
                        and ca.user_id = ${req.params.id}`      

                connection.query(sql, (err2, results)=> {
                    if(err2) return res.status(500).send({ message: 'error updating transaction_item', err2})

                    sql = 'Update stocks'
                })
            })
    }

    // sql = ` insert into transaction_item (transaction_id, product_id, price, qty)
    // select ca.id, product_id, price, qty
    // from cart ca
    // join products p
    // on p.id = ca.product_id
    // join categories c
    // on c.id = p.category_id
    // join brands b
    // on b.id = p.brand_id
    // join users u
    // on u.id = ca.user_id
    // where ca.move_to_trx = 1
    // and ca.product_deleted = 0
    // and ca.user_id = ${req.params.id}`      
}

                    