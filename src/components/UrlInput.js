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
      <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSubmit}>
        <label className="" htmlFor="inlineFormInput" style={{color: 'white'}}>Traefik API url : </label>
        <input type="text" value={this.state ? this.state.value : ''} onChange={this.handleChange} className="form-control mr-sm-2" id="inlineFormInput" placeholder="Traefik URL" />

        <button type="submit" className="btn btn-outline-success  my-2 my-sm-0">Submit</button>
      </form>
    )
  }
}

UrlInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired
}