import React, { Component } from 'react';
import _ from 'lodash';
import { createTree } from './Tree'


export default class ThreeJSFlow extends Component {
  jsonData = {
    name: "internet",
    children: []
  };

  routesData = {
    name: "traefik",
    children: []
  }

  loadData(props) {
    var backendsDict = {};

    for (var p in this.props.data.providers) {
      var provider = {
        name: p,
        children: []
      }

      for (var b in this.props.data.providers[p].backends) {
        var urls = [];
        for (var s in this.props.data.providers[p].backends[b].servers) {
          var url = this.props.data.providers[p].backends[b].servers[s].url;
          var weight = this.props.data.providers[p].backends[b].servers[s].weight;
          urls.push({
            url: url,
            weight: weight
          });
        }
        var backendData = {
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
          this.routesData.children.push({
            name: r,
            rule: rule,
            entryPoints: entrypoints,
            backend: backend
          })
        }

        provider.children.push({
          name: backend,
          backend: backendsDict[backend]
        });
      };

      this.jsonData.children.push(provider)
    }

    createTree("#d3-flow-svg", this.jsonData)
    createTree("#d3-flow-svg", this.routesData, "right-to-left")
  }

  componentDidMount() {
    console.log(this.props);
    this.loadData(this.props);
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);

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
