const router = require('express').Router()
const {Product, Photo, Review, PhotosProducts, ProductsCategories, Category} = require('../db/models')
const {Op} = require('sequelize')
const isAdmin = require('../middleware/isAdmin')
const isLoggedIn = require('../middleware/isLoggedIn')
module.exports = router

const PRODUCT_PAGE_SIZE = 12

// get all products, public
router.get('/offset/:offset', async (req, res, next) => {
  try {
    let offset = Number(req.params.offset)
    const products = await Product.findAll({
      where: {quantityOnHand: {[Op.gt]: 0}},
      include: [{model: Photo}, {model: Category}],
      limit: PRODUCT_PAGE_SIZE,
      offset: offset
    })
    const count = await Product.count({where: {quantityOnHand: {[Op.gt]: 0}}})
    res.json({products, count})
  } catch (err) {
    next(err)
  }
})

// search for products, public
router.get('/search/:term/offset/:offset', async (req, res, next) => {
  try {
    let offset = Number(req.params.offset)
    let query = req.params.term
    const products = await Product.findAll({
      include: [{model: Photo}, {model: Category}],
      where: {
        title: {
          [Op.iLike]: `%${query}%`
        },
        quantityOnHand: {
          [Op.gt]: 0
        }
      },
      limit: PRODUCT_PAGE_SIZE,
      offset: offset
    })
    const count = await Product.count({
      where: {
        title: {
          [Op.iLike]: `%${query}%`
        },
        quantityOnHand: {
          [Op.gt]: 0
        }
      }
    })
    const found = count > 0
    res.json({products, count, found})
  } catch (err) {
    next(err)
  }
})

// get products by category, public
router.get('/categories/:categoryId/offset/:offset', async (req, res, next) => {
  try {
    let id = Number(req.params.categoryId)
    let offset = Number(req.params.offset)
    let category = await Category.findOne({
      include: [{model: Product, include: [{model: Photo}, {model: Category}]}],
      where: {
        id: id
      }
    })
    // if no category matches or if no products in category
    if (!category || category.products === []) {
      res.json({
        count: 0,
        products: [],
        found: false
      })
    } else {
      let stockedProducts = category.products.filter(
        prod => prod.quantityOnHand > 0
      ) // filter out QoH zero products
      let count = stockedProducts.length
      res.json({
        count: count,
        products: stockedProducts.slice(offset, offset + PRODUCT_PAGE_SIZE),
        found: true
      })
    }
  } catch (err) {
    next(err)
  }
})

// get product by id, public
router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id

    const product = await Product.findOne({
      where: {id},
      include: [{model: Photo}, {model: Review}, {model: Category}]
    })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

// post a review, users only
router.post('/:id/reviews', isLoggedIn, async (req, res, next) => {
  try {
    const review = await Review.create(req.body)
    res.json(review)
  } catch (err) {
    next(err)
  }
})

// add products, admin only
router.post('/admin/add', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    let {title, description, price, quantityOnHand, photo} = req.body
    let newProduct = await Product.create({title, description, price, quantityOnHand})
    if (photo) {
      let newPhoto = await Photo.create({photoUrl: photo})
      await PhotosProducts.create({productId: newProduct.id, photoId: newPhoto.id})
    }
    else {
      await PhotosProducts.create({productId: newProduct.id, photoId: 1})
    }

    // if(categories){
    //   let categoryArray = categories.split(', ')
    //   for (let i = 0; i < categoryArray.length; i++) {
    //     let singleCategory = await Category.findOne({where: {name: categoryArray[i]} })
    //     if (singleCategory) {
    //       await ProductsCategories.create({categoryId: singleCategory.id, productId: newProduct.id})
    //     }
    //     else{
    //       let newCategory = await Category.create({name: element})
    //       await ProductsCategories.create({categoryId: newCategory.id, productId: newProduct.id})
    //     }
    //   }
    // }

    res.json(newProduct)
  } catch (err) {
    next(err)
  }
})

router.put('/:productId/edit', async (req, res, next) => {
  try {
    let {title, description, price, quantityOnHand, photo} = req.body
    await Product.update({title, description, price, quantityOnHand}, 
      {where: {id: req.params.productId}})
    if (photo) {
      let newPhoto = await Photo.create({photoUrl: photo})
      await PhotosProducts.create({productId: req.params.productId, photoId: newPhoto.id})
    }
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
  }
})
