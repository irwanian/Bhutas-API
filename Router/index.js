const productsRouter = require('./productsRouter')
const categoriesRouter = require('./categoriesRouter')
const brandsRouter = require('./BrandsRouter')
const UsersRouter = require('./UsersRouter')
const cartRouter = require('./cartRouter')
const transactionRouter = require('./transactionRouter')

module.exports = {
    productsRouter,
    categoriesRouter,
    brandsRouter,
    UsersRouter,
    cartRouter,
    transactionRouter
}