import React, { Component } from 'react';
import _ from 'lodash';
import Tree from './Tree'
import * as d3 from 'd3'


export default class ThreeJSFlow extends Component {

  loadData(props) {
    var jsonData = {
      name: "traefik",
      hasDetails: false,
      routes: [],
      children: [],
      image: {
        src: 'images/traefik.png',
        width: 100,
        height: 100
      },
      className: 'traefik-root'
    };

    var routesData = {
      name: "internet",
      hasDetails: false,
      routes: [],
      children: [],
      image: {
        src: 'images/cloud.png',
        width: 100,
        height: 100
      },
      className: 'internet-root'
    }
    
    d3.selectAll('#d3-flow-svg *').remove();
    var backendsDict = {};

    for (var p in this.props.data.providers) {
      var provider = {
        name: p,
        hasDetails: false,
        routes: [],
        children: [],
        image: {
          src: 'images/' + p + '.png',
          width: p === "file" ? 75 : 100,
          height: p === "file" ? 75 : 100
        }
      }

      for (var b in this.props.data.providers[p].backends) {
        var urls = [];
        for (var s in this.props.data.providers[p].backends[b].servers) {
          var url = this.props.data.providers[p].backends[b].servers[s].url;
          var weight = this.props.data.providers[p].backends[b].servers[s].weight;
          urls.push({
            name: s,
            hasDetails: true,
            details: '<ul><li>Weight: ' + weight + '</li><li>URL: ' + url + '</li></ul>',
            depth: 150,
            width: 200,
            className: "traefik-server"
          });
          
        }
        var backendData = {
          name: b,
          urls: urls,
          children: urls
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

        backendsDict[backend].children.forEach((c) => {
          c.routes = routes;
        });
        provider.children.push({
          name: backend,
          urls: backendsDict[backend].urls,
          details: backendsDict[backend].details,
          children: backendsDict[backend].children,
          routes:routes
        });

        provider.routes = provider.routes.concat(routes);
        jsonData.routes = jsonData.routes.concat(routes);
      };

      jsonData.children.push(provider)
    }

    var tree = new Tree();
    tree.createTree("#d3-flow-svg", jsonData, "left-to-right");
    tree.createTree("#d3-flow-svg", routesData, "right-to-left");
   // 
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
