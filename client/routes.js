import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  AllProducts,
  SingleProduct,
  OrderHistory,
  BillingForm,
  CategoryProducts,
  AdminOrdersView
} from './components'
import {me} from './store'
import {Redirect} from 'react-router' //TODO fix back button bug.

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, isAdmin} = this.props
    console.log('isAdmin: ', isAdmin)

    return (
      <Switch>
        {isAdmin && (
          <Switch>
            {/* Routes placed here are only available for admin users */}
            {console.log('in isAdmin switch', isAdmin)}
            <Route
              exact
              path="/admin/orders/offset/:offset"
              render={rParams => (
                <AdminOrdersView
                  {...rParams}
                  key={rParams.match.params.offset}
                />
              )}
            />
          </Switch>
        )}
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/products/page/:offset" component={AllProducts} />
        <Route
          exact
          path="/products/categories/:categoryId/page/:offset"
          component={CategoryProducts}
        />
        <Route exact path="/product/:id" component={SingleProduct} />
        <Route
          exact
          path="/user/:userId/orders/offset/:offset"
          render={rParams => (
            <OrderHistory {...rParams} key={rParams.match.params.offset} />
          )}
        />
        <Route exact path="/billing" component={BillingForm} />

        {/* Redirects */}
        <Redirect exact from="/admin/orders" to="/admin/orders/offset/0" />
        <Redirect exact from="/" to="/products/page/0" />
        <Redirect exact from="/index.html" to="/products/page/0" />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
          </Switch>
        )}
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    isAdmin: !!state.user.id && state.user.userType === 'admin'
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
