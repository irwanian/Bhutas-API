const connection = require('../Database')
const { uploader } = require('../Helpers/fileUploader')
const fs = require('fs')

module.exports = {
    getProducts: (req, res) => {
        
        var sql = 
        `SELECT p.productname,
        p.id as product_id,
        p.description,
        p.price,
        b.id as brand_id,
        c.id as category_id,
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
        where isdeleted = 0
        and b.is_deleted = 0
        and c.is_deleted = 0`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'error loading data', err})

            res.status(200).send(results)
        })
    },
    getTotalStocks: (req, res) => {
        let sql = `select ps.*,
                    p.productname 
                    from productstocks ps
                    join products p
                    on p.id = ps.productid
                    where productid = ${req.params.id}`

        connection.query(sql, (err, results)=> {
            if(err) res.status(500).send({message: 'error when retrieving stock data', err})

            res.status(200).send(results)
            console.log(results)
        })
    },
    getSaleProducts: (req, res) => {
        var sql = 
        `SELECT p.productname,
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
        where isdeleted = 0 
        and discount > 0
        and b.is_deleted = 0
        and c.is_deleted = 0`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'error loading data', err})

            res.status(200).send(results)
        })
    },
    getNewArrivals: (req, res) => {
        var sql = 
        `SELECT p.productname,
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
        where isdeleted = 0
        and b.is_deleted = 0
        and c.is_deleted = 0
        order by p.id desc
        limit 8`


        connection.query( sql, (err, results)=> {
            if(err) return res.status(500).send({message: `there's an error when fetching data`, err})

            res.status(200).send(results)
        })
    },
    searchProducts: (req, res) => {
        var sql = 
        `SELECT p.productname,
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
        where isdeleted = 0
        and b.is_deleted = 0
        and c.is_deleted = 0
        and p.productname like '%${req.query.searching}%'`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'error loading data', err})

            res.status(200).send(results)
        })
    },
    getSpecifictProduct: (req, res) => {
        var sql = 
        `SELECT p.productname,
        p.id as product_id,
        p.description,
        p.price,
        p.discount,
        ps.size_46,
        ps.size_47,
        ps.size_48,
        ps.size_49,
        ps.size_50,
        p.image as picture,
        c.categoryname as category,
        b.brandname as brand,
        b.image as logo
        from products p
        join categories c
        on c.id = p.category_id
        join brands b
        on b.id = p.brand_id
        join productstocks ps
        on ps.productid = p.id
        where isdeleted = 0 
        and b.is_deleted = 0
        and c.is_deleted = 0
        and p.id = ${req.params.id}`
        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send(err)

                return res.status(200).send(results)
            })
    },
    addNewProduct: (req, res) => {
        
        try {
            const path = '/post/images/products'; //file save path
            const upload = uploader(path, 'BHT').fields([{ name: 'image'}]); //uploader(path, 'default prefix') nama property di fields harus sesuai dengan nama di formData
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Error!', err });
                }
    
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data)
                data.image = imagePath;
                console.log(imagePath);
                
                
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
                        size50, 
                     } = data

                let sql = `select * from products where productname = '${productname}'
                             and brand_id = ${brand_id} and category_id = ${category_id} `

                connection.query(sql, (err1, results)=> {
                    if(err1) res.status(500).json({message: 'error occurred when fetching data', err1})

                    var productDatabase = { 
                                            productname,
                                            description,
                                            price,
                                            category_id,
                                            brand_id,
                                            image: imagePath
                                    }

                                    
                if(productname === '' || description === '', price === 0 || category_id === 0|| brand_id === 0|| image === undefined){
                    return res.status(500).send({ message: 'All Data Must be Filled', err1})
                }

                connection.query(`INSERT into products set ?`, productDatabase, (err2, Insertresults)=> {
                    if(err1) res.status(500).send({message: 'an error occurred when posting data', err1})
                    
                    
                    var stockData = { 
                        productid: Insertresults.insertId,
                        size_46: size46,
                        size_47: size47,
                        size_48: size48,
                        size_49: size49,
                        size_50: size50
                    }  
                    // console.log(stockData)

                     sql = `INSERT into productstocks set ?`


                    connection.query(sql, stockData, (err4, results)=> {
                        
                        if(err4) res.status(500).json({message: 'error updating stock data', err4})    
                        
                        res.status(200).send(results)
                    })
              })
            })
         })      
        } 
        catch(err) {
            return res.status(500).json({ message: "catch Error", error: err });
        }
    },
    deleteProduct: (req, res) => {
        let sql = `update products set isdeleted = 1 where id = ${req.params.id}`

        connection.query(sql, (err, results)=> {
            if(err) return res.status(200).send({ message: 'an error occurred when deleting data', err })

            var sql = 
                    `SELECT p.productname,
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
                    where isdeleted = 0
                    and b.is_deleted = 0
                    and c.is_deleted = 0`

            connection.query( sql, (err1, results)=>{

                res.status(200).send(results)
            })

        })
    },
    editProduct: (req, res) => {
        var sql = `SELECT * from products where id = ${req.params.id};`;
        connection.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/post/images/products'; //file save path
                const upload = uploader(path, 'BHT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                    }
                    const data = JSON.parse(req.body.data);

                    const {
                        productname,
                        category_id,
                        brand_id,
                        description,
                        price,
                        discount,
                        oldPhoto
                    } = data

                    console.log(req.files)
                    const { image } = req.files;
                    console.log('image nya ' + image)
                    const imagePath = image ? path + '/' + image[0].filename : oldPhoto;
                    delete data.oldPhoto
                    console.log(data)
                    try {
                        
                        sql = `Update products set productname = '${productname}',
                        price = ${price},
                        discount = ${discount},
                        category_id = ${category_id},
                        brand_id = ${brand_id},
                        description = '${description}',
                        image = '${imagePath}' where id = ${req.params.id};`
                        
                        connection.query(sql, (err1, results1) => {
                            if(err1) {
                                if(imagePath) {
                                    // console.log('path nya ' + imagePath)
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            console.log('update product')
                            if(image) {
                                fs.unlinkSync('./public' + results[0].image);
                            }
                            sql = `SELECT p.productname,
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
                                    where isdeleted = 0
                                    and b.is_deleted = 0
                                    and c.is_deleted = 0`;

                            connection.query(sql, (err2, getdata) => {
                                if(err2) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1 });
                                }
                                // console.log(getdata)
                                return res.status(200).send(getdata);
                            })
                        })
                    }
                    catch(err){
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            }
        })
    },
    updateProductStock: (req, res)=> {
        let sql = `select * from productstocks where id = ${req.params.id}`
        const { size_46, size_47, size_48, size_49, size_50 } = req.body

        connection.query(sql, (err, results)=> {
            if(err) return res.status(500).send(err)

            const data = {
                size_46,
                size_47,
                size_48,
                size_49,
                size_50
            }

            sql = `update productstocks set ? where id = ${req.params.id}`

            connection.query(sql, data, (err1, results)=> {
                if(err1) return res.status(500).send(err1)

                     sql = `select ps.*,
                            p.productname 
                            from productstocks ps
                            join products p
                            on p.id = ps.productid
                            where productid = ${req.params.id}`


                connection.query(sql, (err2, results)=> {
                    if(err2) return res.status(500).send(err2)

                    res.status(200).send(results)
                })
            })
        })
    }
}
