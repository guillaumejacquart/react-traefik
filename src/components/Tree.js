import * as d3 from "d3";

export function createTree(selector, data, orient) {
    // Set the dimensions and margins of the diagram
    var margin = {
        top: 20,
        right: 90,
        bottom: 30,
        left: 90
    },
    initWidth = 1024,
    initHeight = 512,
    depth = 130;
    
    var orient = orient || "left-to-right";
    var coeff = orient == "left-to-right" ? 1 : -1;
    margin.left = (initWidth)/2 + coeff * 40;
    
    var width = initWidth - margin.left - margin.right;
    var height = initHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(selector)
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" +
        margin.left + "," + margin.top + ")");

    var i = 0,
        duration = 350,
        root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(data, function (d) {
        return d.children;
    });
    root.x0 = width / 2;
    root.y0 = height / 2;

    // Collapse after the second level
    //root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
        if (d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null
        }
    }

    function update(source) {

        // Assigns the x and y position for the nodes
        var treeData = treemap(root);

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * depth
        });

        // ****************** Nodes section ***************************

        // Update the nodes...
        var node = svg.selectAll('g.node')
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function (d) {
                return d.children || d._children ? coeff * -13 : coeff * 13;
            })
            .attr("text-anchor", function (d) {
                return d.children || d._children ? (coeff == 1 ? "end" : "start") : (coeff == 1 ? "start" : "end");
            })
            .text(function (d) {
                return d.data.name;
            });

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + coeff * d.y + "," + d.x + ")";
            });

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr('cursor', 'pointer');


        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 1e-6);

        // On exit reduce the opacity of text labels
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links...
        var link = svg.selectAll('path.link')
            .data(links, function (d) {
                return d.id;
            });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function (d) {
                var p = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal(p, p)
            });

        // UPDATE
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function (d) {
                return diagonal(d, d.parent)
            });

        // Remove any exiting links
        link.exit().transition()
            .duration(duration)
            .attr('d', function (d) {
                var p = {
                    x: source.x,
                    y: source.y
                }
                return diagonal(p, p)
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            var path = `M ${coeff*s.y} ${s.x}
                C ${coeff*(s.y + d.y) / 2} ${s.x},
                  ${coeff*(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`

            return path
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }
}

function drawTree(root, pos){
  var SWITCH_CONST = 1;
  if (pos === "left") {
    SWITCH_CONST = -1;
  }
}