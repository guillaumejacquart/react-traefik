import React, { Component } from 'react';
import _ from 'lodash';
import { createTree } from './Tree'
import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'


export default class DagreFlow extends Component {
  jsonData = {
    name: "traefik",
    children: []
  };

  routesData = {
    name: "Internet",
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

    // Create the input graph
    var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function() { return {}; });

    // Here we"re setting nodeclass, which is used by our custom drawNodes function
    // below.
    g.setNode(0,  { label: "TOP",       class: "type-TOP" });
    g.setNode(1,  { label: "S",         class: "type-S" });
    g.setNode(2,  { label: "NP",        class: "type-NP" });
    g.setNode(3,  { label: "DT",        class: "type-DT" });
    g.setNode(4,  { label: "This",      class: "type-TK" });
    g.setNode(5,  { label: "VP",        class: "type-VP" });
    g.setNode(6,  { label: "VBZ",       class: "type-VBZ" });
    g.setNode(7,  { label: "is",        class: "type-TK" });
    g.setNode(8,  { label: "NP",        class: "type-NP" });
    g.setNode(9,  { label: "DT",        class: "type-DT" });
    g.setNode(10, { label: "an",        class: "type-TK" });
    g.setNode(11, { label: "NN",        class: "type-NN" });
    g.setNode(12, { label: "example",   class: "type-TK" });
    g.setNode(13, { label: ".",         class: "type-." });
    g.setNode(14, { label: "sentence",  class: "type-TK" });

    g.nodes().forEach(function(v) {
    var node = g.node(v);
    // Round the corners of the nodes
    node.rx = node.ry = 5;
    });

    // Set up edges, no special attributes.
    g.setEdge(3, 4);
    g.setEdge(2, 3);
    g.setEdge(1, 2);
    g.setEdge(6, 7);
    g.setEdge(5, 6);
    g.setEdge(9, 10);
    g.setEdge(8, 9);
    g.setEdge(11,12);
    g.setEdge(8, 11);
    g.setEdge(5, 8);
    g.setEdge(1, 5);
    g.setEdge(13,14);
    g.setEdge(1, 13);
    g.setEdge(0, 1)

    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#dagre-d3-flow-svg"),
        svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("#dagre-d3-flow-svg g"), g);

    // Center the graph
    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
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
      <div id="dagre-d3-flow">
        <svg id="dagre-d3-flow-svg"></svg>
      </div>
    );
  }
}
