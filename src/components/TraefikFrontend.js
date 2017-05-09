import React, { Component } from 'react';
import TraefikBackend from './TraefikBackend'


export default class TraefikFrontend extends Component {

  componentDidMount() {
    console.log(this.props);
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  render() {
    var routes = [];
    for (var i in this.props.data.routes) {
      routes.push(<li className='traefik-route list-group-item' key={i}>
        route : {this.props.data.routes[i]}
      </li>);
    }
    
    return (
      <div className="traefik-frontend row justify-content-between">
        <div className="col-md-5 traefik-frontend-front">
          <div className="card">
            <div className="card-header bg-primary text-white">
              Frontend
            </div>
            <div className="card-block">
              <h4 className="card-title">{this.props.data.name}</h4>
            </div>
            <ul className="list-group list-group-flush">{routes}</ul>
          </div>
        </div>
        <div className="col-md-2 traefik-link align-self-center">
          {this.props.data.entrypoints}
        </div>
        <div className="col-md-5 traefik-frontend-backs">
            <TraefikBackend data={this.props.data.backend}/>
        </div>
      </div>
    );
  }
}
