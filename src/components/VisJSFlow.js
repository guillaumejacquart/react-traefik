import React, { Component } from 'react';
import _ from 'lodash';
import * as vis from 'vis'


export default class VisJSFlow extends Component {
  loadData(props) {
    var backendsDict = {};

    var LENGTH_MAIN = 350,
      LENGTH_SERVER = 150,
      LENGTH_SUB = 50,
      WIDTH_SCALE = 2,
      GREEN = 'green',
      RED = '#C5000B',
      ORANGE = 'orange',
      //GRAY = '#666666',
      GRAY = 'gray',
      BLACK = '#2B1B17';

    var nodes = [];
    var edges = [];
    var network = null;

    nodes.push({
      id: 'urls',
      label: 'Internet',
      group: 'switch',
      value: 10,
      fixed: {
        y:true
      },
      y: 200
    });
    nodes.push({
      id: 'traefik',
      label: 'Traefik',
      group: 'switch',
      value: 10,
      fixed: {
        y:true
      },
      y: 200
    });
    edges.push({
      from: 'urls',
      to: 'traefik',
      length: LENGTH_MAIN * 2,
      width: WIDTH_SCALE * 6,
      label: ''
    });

    for (var p in this.props.data.providers) {
      var provider = {
        id: p,
        label: p,
        group: 'type',
        value: 10
      }

      for (var b in this.props.data.providers[p].backends) {
        nodes.push({
          id: b,
          label: b,
          group: b
        });
        for (var s in this.props.data.providers[p].backends[b].servers) {
          var url = this.props.data.providers[p].backends[b].servers[s].url;
          var weight = this.props.data.providers[p].backends[b].servers[s].weight;
          nodes.push({
            id: url,
            label: url,
            group: 'url-' + b
          });
          edges.push({
            from: b,
            to: url,
            label: 'weight: ' + weight,
            length: LENGTH_MAIN / 2,
            width: WIDTH_SCALE * 3,
          })
        }
        edges.push({
          from: p,
          to: b,
          length: LENGTH_MAIN,
          width: WIDTH_SCALE * 6,
        })
      }

      for (var f in this.props.data.providers[p].frontends) {
        var entrypoints = this.props.data.providers[p].frontends[f].entryPoints.join(", ")
        var backend = this.props.data.providers[p].frontends[f].backend;

        var routes = [];
        for (var r in this.props.data.providers[p].frontends[f].routes) {
          var rule = this.props.data.providers[p].frontends[f].routes[r].rule;
          routes.push(rule);
          nodes.push({
            id: r,
            label: r,
            group: 'route',
            title: entrypoints,
            value: 10
          })
          
          edges.push({
            from: r,
            to: 'urls',
            length: LENGTH_MAIN,
            width: WIDTH_SCALE * 6,
            label: entrypoints
          });
        }
      };

      nodes.push(provider);
      edges.push({
        from: 'traefik',
        to: provider.id,
        length: LENGTH_MAIN,
        width: WIDTH_SCALE * 6
      });
    }

    // create a network
    var container = document.getElementById('visjs-flow');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout:{
        improvedLayout: true
      },
      nodes: {
        scaling: {
          min: 16,
          max: 32
        }
      },
      edges: {
        color: GRAY,
        smooth: false
      },
      physics: {
        enabled: false,
        barnesHut: {
          gravitationalConstant: -30000
        },
        stabilization: {
          iterations: 2500
        }
      },
      groups: {
        'switch': {
          shape: 'circle',
          color: '#FF9900' // orange
        },
        'type': {
          shape: 'dot',
          color: "#2B7CE9" // blue
        },
        mobile: {
          shape: 'dot',
          color: "#5A1E5C" // purple
        },
        server: {
          shape: 'square',
          color: "#C5000B" // red
        },
        internet: {
          shape: 'square',
          color: "#109618" // green
        }
      }
    };
    network = new vis.Network(container, data, options);
    window.network = network;
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
      <div id="visjs-flow" style={{width: '100%', height: '800px'}}>
      </div>
    );
  }
}
