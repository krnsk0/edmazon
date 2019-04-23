/* eslint-disable complexity */
import OrderItem from './OrderItem'
import React from 'react'

import {updateStatusThunk, setPopup} from '../store'
import {BillingForm} from './'
import {connect} from 'react-redux'
import axios from 'axios'

//takes 4 props: state user object, viewType (just a string e.g. 'cart', 'order history'), products array, and removeItem function to be passed down to the OrderItem view
class orderView extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    const {products, status, id} = this.props.order
    const {user, removeItem, userType, popup} = this.props

    let email = ''
    if (user) email = user.email

    // calculate subtotal
    const subtotal = (
      products.reduce(
        (total, product) =>
          total + product.price * product.ordersProducts.quantity,
        0
      ) / 100
    ).toFixed(2)

    return (
      <div className="order-view-container">
        {products.length ? (
          <div className="order-view">
            {status === 'cart' ? (
              <div className="order-view-header-container">
                <div className="order-view-header">Cart</div>
              </div>
            ) : (
              <div className="order-view-header-container">
                <div className="order-view-header">
                  Order #{this.props.order.id}
                </div>
                <div className="order-view-header-small">User: {email}</div>
              </div>
            )}

            <div className="order-body">
              <div className="order-body-left">
                {products.length ? (
                  products.map(product => (
                    <div key={product.id}>
                      <OrderItem
                        product={product}
                        removeItem={removeItem}
                        status={status}
                        orderId={id}
                      />
                    </div>
                  ))
                ) : (
                  <div className="">No products to show</div>
                )}
              </div>
              <div className="order-body-right">
                <div className="order-body-info-block">
                  <div>SUBTOTAL: ${parseFloat(subtotal).toFixed(2)}</div>
                  <div>TAX: ${parseFloat(subtotal * 0.1).toFixed(2)}</div>
                  <div>TOTAL: ${parseFloat(subtotal * 1.1).toFixed(2)}</div>
                  <div>YOU SAVED: ${parseFloat(subtotal / 4).toFixed(2)}</div>
                </div>
                {status !== 'cart' && (
                  <div className="order-body-info-block">
                    <div> 
                    <div className="">Shipping Address:</div>
                    <p>{this.props.order.firstName} {this.props.order.lastName}</p>
                    <p>{this.props.order.address1}</p>
                    <p>{this.props.order.address2}</p>
                    <p>{this.props.order.company}</p>
                    <p>{this.props.order.city}, {this.props.order.state} {this.props.order.zip}</p>
                    <p>{this.props.order.Country}</p>
                    <p>{this.props.order.telephone}</p>
                    </div>
                  </div>
                )}
                {status !== 'cart' &&
                  userType === 'admin' && (
                    <div className="order-body-info-block">
                      <select
                        onChange={evt => {
                          evt.preventDefault()
                          this.props.updateStatus(
                            this.props.order.id,
                            evt.target.value
                          )
                        }}
                        value={this.props.order.status}
                        className="order-status-selector"
                        name="qty"
                      >
                        <option value="created">Created</option>
                        <option value="processing">Processing</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                {status === 'cart' && (
                  <div className="order-body-info-block">
                    <button type="button" onClick={()=>this.props.openCheckoutPopUp()} className="checkout-button">
                      CHECK OUT
                    </button>
                  </div>
                )}
                {popup === 'checkout' && (<BillingForm orderId={id} cost={Number(
                        parseFloat(subtotal * 1.1 * 100).toFixed(2)
                      )}/>)}
                {status === 'cart' && (
                  <div className="order-body-info-block">
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="order-view">
            <div className="order-view-header-container">
              {' '}
              <div className="order-view-header">Cart Empty!</div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  userType: state.user.userType,
  popup: state.popup
})
const mapDispatch = dispatch => {
  return {
    updateStatus: (orderId, status) =>
      dispatch(updateStatusThunk(orderId, status)),
    openCheckoutPopUp: () => dispatch(setPopup('checkout'))
  }
}
export default connect(mapState, mapDispatch)(orderView)
