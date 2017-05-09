import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class UrlInput extends Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps){
    if(this.props.value != prevProps.value){
      this.setState({ value: this.props.value });
    }
  }

  handleSubmit(event) {
    const { onClick } = this.props;
    onClick(this.state.value);
    event.preventDefault();    
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div className="row justify-content-md-center traefik-form-url">
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <label className="sr-only" htmlFor="inlineFormInput">Traefik API url : </label>
          <input type="text" value={this.state ? this.state.value : ''} onChange={this.handleChange} className="form-control mb-2 mr-sm-2 mb-sm-0" id="inlineFormInput" placeholder="Traefik URL" />

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