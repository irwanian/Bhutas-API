const connection = require('../Database')

module.exports = {
    getCategories: (req, res) => {
        var sql = `select * from categories`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when fetching data', err})
            
            res.status(200).send(results)
        })
    },
    getCertaincategory: (req, res) => {
        var sql = `select * from categories c
                   join products p
                   on p.category_id = c.id 
                   where c.id =${req.params.id}
                   and isdeleted = 0`

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


            var sql = `select * from categories`

            connection.query(sql, (err2, results) => {
            if(err2) return res.status(500).send({message: 'an error occurred when fetching data', err2})
            
            console.log('add data success');
            res.status(200).send(results)
        })
        })
    },
    deleteCategories: (req, res) => {
        var sql = `delete from categories where id=${req.params.id}`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when deleting data', err})

            var sql = `select * from categories`

            connection.query(sql, (err2, results) => {
            if(err2) return res.status(500).send({message: 'an error occurred when fetching data', err2})
            
            console.log('delete success') 
            res.status(200).send(results)
        })
        })
    },
    editcategories: (req, res) => {
        var sql = `update categories set ? where id=${req.params.id}`

        connection.query(sql, req.body, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when updating data', err})
 
            var sql = `select * from categories`

            connection.query(sql, (err2, results) => {
            if(err2) return res.status(500).send({message: 'an error occurred when fetching data', err2})
            
            console.log('edit data success')
            res.status(200).send(results)
        })
        })
    }
}