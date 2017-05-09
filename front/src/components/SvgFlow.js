import React, { Component } from 'react';
import TraefikProvider from './TraefikProvider'


export default class SvgFlow extends Component {
  loadData(props) {
    
    
  }

  componentDidMount() {
    console.log(this.props);
    this.loadData(this.props);
  }

  componentDidUpdate() {
    console.log(this.props);
    this.loadData(this.props);
  }

  render() {
    
    var providers = [];
    var nodesElement = [];
    var backendsDict = {};
    
    for (var p in this.props.data.providers) {
      var frontends = [];
      for (var b in this.props.data.providers[p].backends) {
        var urls = [];
        for (var s in this.props.data.providers[p].backends[b].servers) {
          var url = this.props.data.providers[p].backends[b].servers[s].url;
          var weight = this.props.data.providers[p].backends[b].servers[s].weight;
          urls.push({url: url, weight: weight});
        }
        var backendData ={
          type: 'backend',
          name: b,
          urls: urls
        };
        backendsDict[b] = backendData;
      }

      for (var f in this.props.data.providers[p].frontends) {
        var entrypoints = this.props.data.providers[p].frontends[f].entryPoints.join(", ")
        var backend = this.props.data.providers[p].frontends[f].backend;

        var routes = [];
        for (var r in this.props.data.providers[p].frontends[f].routes) {
          var rule = this.props.data.providers[p].frontends[f].routes[r].rule;
          routes.push(rule);
        }
        
        var frontend = {
          type: 'frontend',
          name: f,
          routes: routes,
          entrypoints: entrypoints,
        }

        if (backendsDict[backend]) {
          backendsDict[backend].parent = f;
          frontend.backend = backendsDict[backend];
        }
        
        frontends.push(frontend);
      };
      
      providers.push({
        name: p,
        frontends: frontends
      })
    }
    
    for (var i in providers) {
        nodesElement.push(<TraefikProvider data={providers[i]} key={i}/>);
    }
    
    return (
      <div id="svg-flow">
        {nodesElement}
      </div>
    );
  }
}
