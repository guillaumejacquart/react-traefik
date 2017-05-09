import React, {
  Component
}
from 'react';
import go from 'gojs';


export default class GoFlow extends Component {
  diagram = null
  $ = go.GraphObject.make;

  initDiagram() {
    this.diagram =
      this.$(go.Diagram, "go-flow", {
        initialContentAlignment: go.Spot.Center, // center Diagram contents
        "undoManager.isEnabled": false // enable Ctrl-Z to undo and Ctrl-Y to redo
      });
    this.diagram.isReadOnly = true;
  }
  loadData(props) {
    var $ = this.$;

    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle() {
      return {
        font: "9pt  Segoe UI,sans-serif",
        stroke: "white"
      };
    }

    // This converter is used by the Picture.
    function findHeadShot(key) {
      if (key < 0 || key > 16) return "images/HSnopic.png"; // There are only 16 images on the server
      return "images/HS" + key + ".png"
    }

    // the template we defined earlier
    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        // for sorting, have the Node.text be the data.name
        new go.Binding("text", "name"),
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding("layerName", "isSelected", function(sel) {
          return sel ? "Foreground" : "";
        }).ofObject(),
        // define the node's outer shape
        $(go.Shape, "Rectangle", {
          name: "SHAPE",
          fill: "#00FF00",
          stroke: null,
          // set the port properties:
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer"
        }),
        $(go.Panel, "Horizontal",
          $(go.Picture, {
              name: "Picture",
              desiredSize: new go.Size(39, 50),
              margin: new go.Margin(6, 8, 6, 10),
            },
            new go.Binding("source", "key", findHeadShot)),
          // define the panel where the text will appear
          $(go.Panel, "Table", {
              maxSize: new go.Size(150, 999),
              margin: new go.Margin(6, 10, 0, 3),
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, {
              column: 2,
              width: 4
            }),
            $(go.TextBlock, textStyle(), // the name
              {
                row: 0,
                column: 0,
                columnSpan: 5,
                font: "12pt Segoe UI,sans-serif",
                editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding("text", "name").makeTwoWay()),
            $(go.TextBlock, "Desc: ", textStyle(), {
              row: 1,
              column: 0
            }),
            $(go.TextBlock, textStyle(), {
                row: 1,
                column: 1,
                columnSpan: 4,
                editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "desc").makeTwoWay())
          ) // end Table Panel
        ) // end Horizontal Panel
      ); // end Node

    var model = $(go.TreeModel);
    var data =[];
    var backends = {};
    
    for (var p in props.data.providers) {
      for (var b in props.data.providers[p].backends) {
        var urls = '';
        for (var s in props.data.providers[p].backends[b].servers) {
          var url = props.data.providers[p].backends[b].servers[s].url;
          var weight = props.data.providers[p].backends[b].servers[s].weight;
          urls += 'url : ' + url + ', weight : ' + weight;
        }
        var backendData ={
          key: b,
          name: b,
          desc: urls
        };
        data.push(backendData);
        backends[b] = backendData;
      }

      for (var f in props.data.providers[p].frontends) {
        var entrypoints = props.data.providers[p].frontends[f].entryPoints.join(", ")
        var backend = props.data.providers[p].frontends[f].backend;

        var routes = '';
        for (var r in props.data.providers[p].frontends[f].routes) {
          var rule = props.data.providers[p].frontends[f].routes[r].rule;
          routes += 'Rule : ' + rule;
        }
        
        data.push({
          key: f,
          name: f,
          desc: routes
        })

        if (backends[backend]) {
          backends[backend].parent = f;
        }
      };
    }
    
    console.log(data);
    model.nodeDataArray = data;
    this.diagram.model = model;
  }

  componentDidMount() {
    console.log(this.props);
    this.initDiagram();
    this.loadData(this.props);
  }

  componentDidUpdate() {
    console.log(this.props);
    this.loadData(this.props);
  }

  render() {
    return (
      <div id="go-flow" style={{marginTop:"50px", width:"100%", height:"400px", backgroundColor: "#DAE4E4"}}></div>
    );
  }
}
