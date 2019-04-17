'use strict'
/* global describe beforeEach it */
const {expect} = require('chai')
const seed = require('./seed')
const {
  User,
  Review,
  Product,
  Category,
  Order,
  ProductsCategories,
  OrdersProducts
} = require('../server/db/models')



describe('the seed script', () => {
  beforeEach(seed) // don't run before every one

  it('populates the users table with at least one entry', async () => {
    const users = await User.findAll()
    expect(users).to.have.lengthOf.at.least(1)
  })



  it('assigns a category to every product', async () => {
    const categories = await Product.findAll()
    expect(categories).to.have.lengthOf.at.least(1)
  })

  it('sets the price to null in ordersProducts for all cart orders', async () => {
    const cartOrders = await Order.findAll({where: {status: 'cart'}})
    const nullPriceProducts = await OrdersProducts.findAll({where: {purchasePrice: null}})
    let idArray = []
    for (let i = 0; i < cartOrders.length; i++) {
      idArray.push(cartOrders[i].dataValues.id)
    }
    let idArray2 = []
    for (let i = 0; i < nullPriceProducts.length; i++) {
      if(!idArray2.includes(nullPriceProducts[i].dataValues.orderId)){
        idArray2.push(nullPriceProducts[i].dataValues.orderId)
      }
    }
    expect(idArray).to.deep.equal(idArray2)
  })

  // productsOrders test ideas
  // if an order is in cart, all entries for it in the ordersProducts have price null
})


