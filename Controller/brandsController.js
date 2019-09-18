const connection = require('../Database')
const { uploader } = require('../Helpers/fileUploader')
const fs = require('fs')

module.exports = {
    getBrands: (req, res) => {
        var sql = `select * from brands where is_deleted = 0`

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send({message: 'an error occurred when fetching data', err})

            res.status(200).send(results)
        })
    },
    getCertainBrands: (req, res) => {
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
        where isdeleted = 0
        and c.is_deleted = 0
        and b.is_deleted = 0
        and b.id =${req.params.id}`
                   
        connection.query(sql, (err, results) => {
            if(err) res.status(500).send({message: 'an error occurred when fetching data', err})

            res.status(200).send(results)
        })
    },
    addBrands: (req,res) => {
        try {
            const path = '/post/images'; //file save path
            const upload = uploader(path, 'BHT').fields([{ name: 'image'}]); //uploader(path, 'default prefix') nama property di fields harus sesuai dengan nama di formData
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Error!', err });
                }
    
                const { image } = req.files;
                console.log(image + ' image brand')
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;
                
                var sql = 'INSERT INTO brands SET ?';
                connection.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "first error", err });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from brands where is_deleted = 0;';
                    connection.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "Second Error", err });
                        }
                        
                        res.status(200).send(results);
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "Third Error", error: err.message });
        }
    },
        deleteBrands: (req, res)=> {
            var sql = `select * from brands where id = ${req.params.id} and is_deleted = 0` ;
    
            connection.query(sql, (err, results)=> {
                if(err) return res.status(500).json({message : 'Error when fetching data'})
                
                if(results.length > 0){
                    var sql = `update brands set is_deleted = 1 where id = ${req.params.id} and is_deleted = 0`;
                    console.log(req.params.id);
                    
                    connection.query(sql, (err1, results1)=> {
                    if(err1) return res.status(200).json({message : 'Delete Brand Success'})
                })
            }
            fs.unlinkSync('./public' + results[0].image)
            
             var sql=`select * from brands where is_deleted = 0`
            connection.query(sql, (err2, results2)=>{
                if(err2) return res.status(500).sjson({message : 'there is an error occured', err2})
                console.log(results2)

                res.send(results2)
            })
        })
    },
    editBrands: (req,res) => {
        var sql = `SELECT * from brands where id = ${req.params.id} and is_deleted = 0;`;
        connection.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/post/images'; //file save path
                const upload = uploader(path, 'BHT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                    }
    
                    const { image } = req.files;
                    console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data);
    
                    try {
                        if(imagePath) {
                            data.image = imagePath;
                            
                        }
                        sql = `Update brands set ? where id = ${req.params.id} and is_deleted = 0;`
                        connection.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                fs.unlinkSync('./public' + results[0].image);
                            }
                            sql = `Select * from brands where is_deleted = 0 ;`;
                            connection.query(sql, (err2,results2) => {
                                if(err2) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                return res.status(200).send(results2);
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
    }
}