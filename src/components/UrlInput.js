import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class UrlInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  handleSubmit(event, val) {
    const { onClick } = this.props
    onClick(val);
    event.preventDefault();    
  }

  render() {
    const { value, onClick } = this.props

    return (
      <div className="row justify-content-md-center traefik-form-url">
        <form className="form-inline" onSubmit={e => this.handleSubmit(e, this.state.value)}>
          <label className="sr-only" for="inlineFormInput">Traefik API url : </label>
          <input type="text" onChange={e => this.setState({ value: e.target.value })} className="form-control mb-2 mr-sm-2 mb-sm-0" id="inlineFormInput" placeholder="Traefik URL" />

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

UrlInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired
}