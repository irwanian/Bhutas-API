const connection = require('../Database')

module.exports = {
    getCategories: (req, res) => {
        var sql = `select * from categories where is_deleted = 0`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when fetching data', err})
            
            res.status(200).send(results)
        })
    },
    getCertaincategory: (req, res) => {
        var sql = `SELECT p.productname,
        p.id as product_id,
        p.description,
        p.price,
        p.discount,
        p.image as picture,
        c.categoryname as category,
        b.brandname as brand,
        b.image as logo
        from products p
        join categories c
        on c.id = p.category_id
        join brands b
        on b.id = p.brand_id
        where p.isdeleted = 0
        and c.is_deleted = 0
        and b.is_deleted = 0
        and c.id =${req.params.id}`
        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when fetching data', err})

            res.status(200).send(results)
        })           
    },
    addCategories: (req, res) => {
        var sql = `insert into categories set ?`
        var data = req.body

        connection.query(sql, data, (err1, results) => {
            if(err1) return res.status(500).send({message: 'an error occurred when uploading data', err})


            var sql = `select * from categories where is_deleted = 0`

            connection.query(sql, (err2, results) => {
            if(err2) return res.status(500).send({message: 'an error occurred when fetching data', err2})
            
            console.log('add data success');
            res.status(200).send(results)
        })
        })
    },
    deleteCategories: (req, res) => {
        var sql = `update categories set is_deleted = 1 where id=${req.params.id}`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when deleting data', err})

            var sql = `select * from categories where is_deleted = 0`

            connection.query(sql, (err2, results) => {
            if(err2) return res.status(500).send({message: 'an error occurred when fetching data', err2})
            
            console.log('delete success') 
            res.status(200).send(results)
        })
        })
    },
    editcategories: (req, res) => {
        var sql = `update categories set ? where id=${req.params.id} and is_deleted = 0`

        connection.query(sql, req.body, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when updating data', err})
 
            var sql = `select * from categories where is_deleted = 0`

            connection.query(sql, (err2, results) => {
            if(err2) return res.status(500).send({message: 'an error occurred when fetching data', err2})
            
            console.log('edit data success')
            res.status(200).send(results)
        })
        })
    }
}