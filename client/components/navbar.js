import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout, setPopup} from '../store'
import {SearchBar} from './index'
import history from '../history'

class Navbar extends React.Component {
  render() {
    const {
      handleClick,
      isLoggedIn,
      openLoginPopup,
      openSignupPopup,
      userType,
      userId
    } = this.props
    return (
      <div className="navbar">
        <h1 className="navbar-title" onClick={() => history.push('/')}>
          EDMAZON
        </h1>
        <nav className="navbar-right-box">
          {isLoggedIn ? (
            <span className="navbar-link-container">
              {userType === 'admin' && (
                <button type="button" onClick={() => history.push('/admin')}>
                  Admin
                </button>
              )}
              <button
                type="button"
                onClick={() => history.push(`/user/${userId}/orders/page/0`)}
              >
                My Orders
              </button>
              <button type="button" onClick={handleClick}>
                Logout
              </button>
            </span>
          ) : (
            <span className="navbar-link-container">
              <button type="button" onClick={() => openLoginPopup()}>
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  openSignupPopup()
                }}
              >
                Sign Up
              </button>
            </span>
          )}
          <SearchBar />
        </nav>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    userType: state.user.userType,
    userId: state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    openLoginPopup() {
      dispatch(setPopup('login'))
    },
    openSignupPopup() {
      dispatch(setPopup('signup'))
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
