import React, { Component } from 'react';
import TraefikFrontend from './TraefikFrontend'


export default class TraefikProvider extends Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    
    var frontends = [];
    for (var i in this.props.data.frontends) {
        frontends.push(<TraefikFrontend data={this.props.data.frontends[i]} key={i}/>);
    }
    
    return (
      <div className="traefik-providers">
        <div className="card card-outline-secondary traefik-provider">
          <div className="card-header">
            Provider : {this.props.data.name}
          </div>
          <div className="card-block">
            {frontends}
          </div>
        </div>
      </div>
    );
  }
}
