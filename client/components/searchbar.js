import React from 'react'
import PropTypes from 'prop-types'
import history from '../history'

export default class SearchBar extends React.Component {
  constructor(){
    super()
    this.state = {
      term: ""
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
  }
  onFormSubmit(event) {
    event.preventDefault()
    let poop = this.state.term
    console.log(poop)
    history.push(`/products/search/${poop}/page/0`)
  }
  onFormChange(event) {
    this.setState({term: event.target.value})
  }

  render() {
    return (
      <span className="search-bar">
        <form onSubmit={this.onFormSubmit}>
          <input type="text" name="searchText" id="searchText" onChange={this.onFormChange}/>
          <button type="submit">Search</button>
        </form>
      </span>
    )
  }
}


