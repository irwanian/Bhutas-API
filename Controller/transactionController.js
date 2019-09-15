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
                    ca.size
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
        let sql = `select SUM(qty) as totalqty from cart where user_id = ${req.params.id}`

        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({message: 'error retrieving cart data'})

            return res.status(200).send({ results: results[0].totalqty})
        })
    }
}

                    