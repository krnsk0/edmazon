// library imports
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

// store imports
import user from './user'
import popup from './popup'
import products from './products'
import selectedProduct from './selectedproduct'
import userorders from './userorders'
import categories from './categories'
//import reviews from './reviews'

const reducer = combineReducers({
  user: user,
  products: products,
  popup: popup,
  selectedProduct: selectedProduct,
  userOrders: userorders,
  categories: categories
  //reviews: reviews
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './popup'
export * from './products'
export * from './selectedproduct'
export * from './userorders'
//export * from '/reviews'
