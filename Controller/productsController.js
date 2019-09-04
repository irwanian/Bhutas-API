const connection = require('../Database')
const { uploader } = require('../Helpers/fileUploader')
const fs = require('fs')
const _ = require('lodash')

module.exports = {
    getProducts: (req, res) => {
        var sql = 
        `SELECT p.productname,
        p.description,
        p.price,
        p.discount,
        c.categoryname as category,
        b.brandname as brand,
        b.image as logo
        from products p
        join categories c
        on c.id = p.category_id
        join brands b
        on b.id = p.brand_id
        where isdeleted = 0`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'error loading data', err})

            res.status(200).send(results)
        })
    },
    getSaleProducts: (req, res) => {
        var sql = 
        `SELECT p.productname,
        p.description,
        p.price,
        p.discount,
        c.categoryname as category,
        b.brandname as brand,
        b.image as logo
        from products p
        join categories c
        on c.id = p.category_id
        join brands b
        on b.id = p.brand_id
        where isdeleted = 0 
        and discount > 0`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'error loading data', err})

            res.status(200).send(results)
        })
    },
    getNewArrivals: (req, res) => {
        var sql = 
        `SELECT p.productname,
        p.description,
        p.price,
        p.discount,
        c.categoryname as category,
        b.brandname as brand,
        b.image as logo
        from products p
        join categories c
        on c.id = p.category_id
        join brands b
        on b.id = p.brand_id
        where isdeleted = 0
        order by p.id desc
        limit 5`


        connection.query( sql, (err, results)=> {
            if(err) return res.status(500).send({message: `there's an error when fetching data`, err})

            res.status(200).send(results)
        })
    },
    searchProducts: (req, res) => {
        var sql = 
        `SELECT p.productname,
        p.description,
        p.price,
        p.discount,
        c.categoryname as category,
        b.brandname as brand,
        b.image as logo
        from products p
        join categories c
        on c.id = p.category_id
        join brands b
        on b.id = p.brand_id
        where isdeleted = 0
        and p.productname like '%${req.query.searching}%'`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'error loading data', err})

            res.status(200).send(results)
        })
    },
    addNewProduct: (req, res) => {
        
        
        try {
            const path = '/post/images'; //file save path
            const upload = uploader(path, 'BHT').fields([{ name: 'image'}]); //uploader(path, 'default prefix') nama property di fields harus sesuai dengan nama di formData
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Error!', err });
                }
    
                const { image } = req.files;
                console.log(image + ' image bro')
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath+ ' image path bro')
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data)
                console.log(data)
                data.image = imagePath;
                
                const { 
                        productname,
                        category_id,
                        brand_id,
                        description,
                        price,
                        size46,
                        size47,
                        size48,
                        size49,
                        size50
                     } = data
                var sql = `select * from products where productname = ${productname} and brand_id = ${brand_id} and category_id = ${category_id} `

                connection.query(sql, (err1, results)=> {
                    if(err1) res.status(500).json({message: 'error occurred when fetching data', err1})

                    
                    var productDatabase = { productname,
                                            description,
                                            price: price,
                                            category_id,
                                            brand_id,
                                            image
                                    }
                connection.query(`insert into products set ?`, productDatabase, (err2, results)=> {
                    if(err2) res.status(500).send({message: 'an error occurred when posting data', err2})
                
                    var stockData = {
                        productid: results.insertId,
                        size_46: size46,
                        size_47: size47,
                        size_48: size48,
                        size_49: size49,
                        size_50: size50
                    }

                    connection.query(`insert into productstocks set ?`, stockData, (err3, results)=> {
                        console.log(stockData.productid, stockData.size_46, stockData.size_47 )
                        if(err3) res.status(500).json({message: 'ann error occurred when uploading stock data', err3})
                            
                            res.status(200).send(results)
                     })
                  })
                })
             })      
        } catch(err) {
            return res.status(500).json({ message: "Third Error", error: err });
        }
    }
}