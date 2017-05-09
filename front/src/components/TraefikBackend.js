import React, { Component } from 'react';


export default class TraefikBackend extends Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    var urls = [];
    for (var i in this.props.data.urls) {
      urls.push(<li className='traefik-url list-group-item' key={i}>
        url : {this.props.data.urls[i].url}, weight: {this.props.data.urls[i].weight}
      </li>);
    }
    
    return (
        <div className="traefik-backend">
          <div className="card">
            <div className="card-header bg-success text-white">
              Backend
            </div>
            <div className="card-block">
              <h4 className="card-title">{this.props.data.name}</h4>
            </div>
            <ul className="list-group list-group-flush">{urls}</ul>
          </div>
        </div>
    );
  }
}
