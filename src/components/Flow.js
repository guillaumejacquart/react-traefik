import React, { Component } from 'react';
import joint from 'jointjs';
import $ from 'jquery';


export default class Flow extends Component {
  loadData(props) {
    var graph = new joint.dia.Graph();

    new joint.dia.Paper({
      el: $('#joinjs-wrapper'),
      model: graph,
      gridSize: 1,
      interactive: function (cellView, method) {
        return false; // Only allow interaction with joint.dia.LinkView instances.
      }
    });

    var backends = {};
    var rectArrays = [];
    var linkArrays = [];
    var initY = 10;
    var initX = 10;
    var blockWidth = 200;
    var blockHeight = 150;
    var spaceFrontBackHor = 500;
    var spaceFrontBackVert = 200;

    for (var p in props.data.providers) {
      for (var b in props.data.providers[p].backends) {
        var urls = '';
        for (var s in props.data.providers[p].backends[b].servers) {
          var url = props.data.providers[p].backends[b].servers[s].url;
          var weight = props.data.providers[p].backends[b].servers[s].weight;
          urls += '<li>url : ' + url + ', weight : ' + weight + '</li>';
        }

        var rect = new joint.shapes.basic.TextBlock({
          position: { x: initX + spaceFrontBackHor, y: 0 },
          size: { width: blockWidth, height: blockHeight },
          attrs: { rect: { fill: '#0000FF' } },
          content: '<div class="block backend">' +
          '<div class="name">' + b + '</div>' +
          '<ul class="urls">' + urls + '</ul>' +
          '</div>'
        })
        backends[b] = rect;
        rectArrays.push(rect);
      }

      for (var f in props.data.providers[p].frontends) {
        var entrypoints = props.data.providers[p].frontends[f].entryPoints.join(", ")
        var backend = props.data.providers[p].frontends[f].backend;

        var routes = '';
        for (var r in props.data.providers[p].frontends[f].routes) {
          var rule = props.data.providers[p].frontends[f].routes[r].rule;
          routes += '<li>' + rule + '</li>';
        }

        var rect = new joint.shapes.basic.TextBlock({
          position: { x: initX, y: initY },
          size: { width: blockWidth, height: blockHeight },
          attrs: { rect: { fill: 'green' } },
          content: '<div class="block frontend">' +
          '<div class="name">' + f + '</div>' +
          '<ul class="routes">' + routes + '</ul>' +
          '</div>'
        })

        if (backends[backend]) {
          var link = new joint.dia.Link({
            source: { id: rect.id },
            target: { id: backends[backend] },
            labels: [
              { position: 0.5, attrs: { text: { text: entrypoints, fill: '#f6f6f6', 'font-family': 'sans-serif' }, rect: { stroke: '#7c68fc', 'stroke-width': 20, rx: 5, ry: 5 } } }
            ],
            attrs: {
              '.connection': { stroke: 'blue' },
              '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
              '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
            }
          });
          linkArrays.push(link);
          backends[backend].translate(0, initY);
        }
        rectArrays.push(rect);
        initY += spaceFrontBackVert;
      };
    }
    graph.addCells(rectArrays.concat(linkArrays));
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
    return (
      <div id="joinjs-wrapper">
      </div>
    );
  }
}