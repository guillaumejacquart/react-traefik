import React, { Component } from 'react';
import _ from 'lodash';
import { createTree } from './Tree'
import * as d3 from 'd3'


export default class ThreeJSFlow extends Component {

  loadData(props) {
    var jsonData = {
      name: "traefik",
      hasDetails: false,
      routes: [],
      children: []
    };

    var routesData = {
      name: "internet",
      hasDetails: false,
      routes: [],
      children: []
    }
    d3.selectAll('#d3-flow-svg *').remove();
    var backendsDict = {};

    for (var p in this.props.data.providers) {
      var provider = {
        name: p,
        hasDetails: false,
        routes: [],
        children: []
      }

      for (var b in this.props.data.providers[p].backends) {
        var urls = [];
        var details = '<ul class="backend-url">';
        for (var s in this.props.data.providers[p].backends[b].servers) {
          var url = this.props.data.providers[p].backends[b].servers[s].url;
          var weight = this.props.data.providers[p].backends[b].servers[s].weight;
          urls.push({
            url: url,
            weight: weight
          });
          details += '<li>Url : ' + url + '<br/>Weight : ' + weight+'</li>'
        }
        details += '</ul>';
        var backendData = {
          name: b,
          hasDetails: true,
          urls: urls,
          details: details
        };
        backendsDict[b] = backendData;
      }

      for (var f in this.props.data.providers[p].frontends) {
        var entrypoints = this.props.data.providers[p].frontends[f].entryPoints.join(", ")
        var backend = this.props.data.providers[p].frontends[f].backend;

        var routes = [];
        for (var r in this.props.data.providers[p].frontends[f].routes) {
          var route = {
            name: r,
            value: this.props.data.providers[p].frontends[f].routes[r].rule
          };
          routes.push(route);
          routesData.routes.push(route);
          routesData.children.push({
            name: route.name,
            route: route,
            entryPoints: entrypoints,
            backend: backend,
            hasDetails: true,
            details: '<div>' + route.value + '</div>'
          })
        }

        provider.children.push({
          name: backend,
          hasDetails: true,
          urls: backendsDict[backend].urls,
          details: backendsDict[backend].details,
          routes:routes
        });

        provider.routes = provider.routes.concat(routes);
        jsonData.routes = jsonData.routes.concat(routes);
      };

      jsonData.children.push(provider)
    }

    createTree("#d3-flow-svg", jsonData)
    createTree("#d3-flow-svg", routesData, "right-to-left")
  }

  componentDidMount() {
    this.loadData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (_.isEqual(prevProps.data.providers, this.props.data.providers)) {
      return;
    }

    this.loadData(this.props);
  }

  render() {
    return (
      <div id="d3-flow">
        <svg id="d3-flow-svg"></svg>
      </div>
    );
  }
}
