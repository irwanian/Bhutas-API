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
                        
                        if(results.length === 0) return res.status(500).send({message: 'User Not Found'})
                        
                        res.status(200).send(results)
                    })
    },
    addToCart: (req, res)=> {
        const { product_id, user_id, qty, price, total_price, size } = req.body

        let sql = `insert into cart set ?`
        
        

        let cartData = {
            product_id,
            user_id,
            qty,
            price,
            total_price,
            size
        }

        connection.query(sql, cartData, (err, results)=> {
            if(err) res.status(500).send({message: 'error occurred when posting cart data', err})

            if(product_id === 0 || qty === 0 || price === 0|| total_price === 0){
                res.status(500).send({message: 'an error occurred, please contact the administrator', err})
            }

                res.status(200).send(results)
            })
    }
}

                    