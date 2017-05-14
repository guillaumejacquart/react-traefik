import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Search extends Component {
  constructor(props) {
    super(props);
    
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(){
  }

  handleChange(event) {
    const { onChange } = this.props;
    this.setState({value: event.target.value});
    onChange(event.target.value);
  }

  render() {
    return (
      <div className="row justify-content-md-center traefik-form-search">
        <form className="form-inline">
          <label className="mr-sm-2" htmlFor="inlineFormInput">Filter traefik routes:</label>
          <input type="text" value={this.state.value} onChange={this.handleChange} className="form-control mb-2 mr-sm-2 mb-sm-0" id="inlineFormInput" placeholder="Traefik query" />
        </form>
      </div>
    )
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired
}