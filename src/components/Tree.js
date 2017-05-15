import * as d3 from "d3";
import $ from 'jquery';

export default class Tree {
    constructor() {
        this.svg = null;
        this.svgContainer = null;
        this.root1 = null;
        this.root2 = null;
    }

    createTree(selector, data, orient, callback) {
        // Set the dimensions and margins of the diagram
        var margin = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            initWidth = Math.max(document.getElementById('d3-flow').clientWidth - 40, 1300),
            initHeight = 600,
            depth = 180;

        var orient = orient || "left-to-right";
        var coeff = orient == "left-to-right" ? 1 : -1;
        margin.left = (initWidth) / 2 + coeff*50 + (coeff == -1 ? -1 * depth / 2 : -depth / 2);

        var width = initWidth - margin.left - margin.right;
        var height = initHeight - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        
        this.svgContainer = d3.select(selector);

        this.svg = this.svgContainer
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" +
                margin.left + "," + margin.top + ")");
        
        var svg = this.svg;

        var drag = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
        d3.select(selector).call(drag);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
        }

        function dragged(d) {
            var dxString = d3.select(this).attr("cx") || '0';
            var dyString = d3.select(this).attr("cy") || '0';
            var dx = parseFloat(dxString);
            var dy = parseFloat(dyString);
            var x0 = dx + d3.event.dx;
            var y0 = dy + d3.event.dy;

            d3.select(this).attr("cx", x0);
            d3.select(this).attr("cy", y0);
            d3.select(this).attr("transform", "translate(" + x0 + "," + y0 + ")");
        }

        function dragended(d) { /**/
            d3.select(this).classed("dragging", false);
        }

        var i = 0,
            duration = 350,
            root;

        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        root = d3.hierarchy(data, function(d) {
            return d.children;
        });
        root.x0 = width / 2;
        root.y0 = height / 2;

        // Collapse after the second level
        //root.children.forEach(collapse);

        update(root);

        function getClassName(constant, d) {
            var className = constant
            if (d.data.route) {
                className += ' ' + d.data.route.name
            }
            if (d.data.routes) {
                className += ' ' + d.data.routes.map((r) => r.name).join(' ')
            }
            if(d.data.className){
                className += ' ' + d.data.className
            }
            return className;
        }

        function update(source) {

            // Assigns the x and y position for the nodes
            var treeData = treemap(root);

            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * (d.data.depth || depth)
            });

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg.selectAll('g.node')
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', function(d) {
                    return getClassName('node', d);
                })
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on('click', click);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', function(d) {
                    var className = 'node'
                    if (d.data.rule) {
                        className += ' ' + d.data.rule
                    }
                    if (d.data.rules) {
                        className += ' ' + d.data.rules.join(' ')
                    }
                    return className;
                })
                .attr('r', function(d){
                    return d.data.image ? 0 : 1e-6
                });

            // Add HTML for the nodes
            var nodeHtml = nodeEnter.append('foreignObject')
                .attr('class', function(d) {
                    return getClassName('node-html-wrapper', d);
                })
                .attr("width", function(d) {
                    return d.data.hasDetails ? (d.data.width || "250") : "80";
                })
                .attr("x", function(d) {
                    return d.children || d._children ? coeff * -100 : (coeff == -1 ? -270 : 20);
                })
                .attr("y", "-2.7em")
                .on('mouseover', function(d) {
                    var classes = d3.select(this).attr('class')
                        .replace('node-html-wrapper', '')
                        .replace(' traefik-server', '')
                        .split(" ")
                        .join(', .');
                    if (classes[0] == ',') {
                        classes = classes.replace(', ', '');
                    }
                    d3.selectAll(classes).classed('node-active', true);
                })
                .on('mouseleave', function(d) {
                    var classes = d3.select(this).attr('class')
                        .replace('node-html-wrapper', '')
                        .replace(' traefik-server', '')
                        .split(" ")
                        .join(', .');
                    if (classes[0] == ',') {
                        classes = classes.replace(', ', '');
                    }
                    d3.selectAll(classes).classed('node-active', false);
                });
            
            nodeHtml.append('xhtml:div')
                .attr('class', 'node-html')
                .html(function(d) {
                    return '<div class="node-name">' + d.data.name + '</div>' +
                        '<div class="node-details">' + (d.data.details || '') + '</div>';
                });

            nodeHtml.filter(function(d) {
                return !d.data.hasDetails
            }).remove()

            // Add labels for the nodes
            var nodeText = nodeEnter.filter(function(d) {
                return !d.data.hasDetails && !d.data.image
            }).append('text')
                .attr('class', function(d) {
                    return getClassName('node-text', d);
                })
                .attr("dy", "-1.5em")
                .attr("x", function(d) {
                    return 0//d.children || d._children ? coeff * -13 : coeff * 13;
                })
                .attr("text-anchor", function(d) {
                    return "middle";//d.children || d._children ? (coeff == 1 ? "end" : "start") : (coeff == 1 ? "start" : "end");
                })
                .text(function(d) {
                    return d.data.name;
                });
            
            // Add labels for the nodes
            var nodeImages = nodeEnter.filter(function(d){
                return d.data.image;
            }).append("image")
                .attr('xlink:href', function(d){
                    return d.data.image.src;
                })
                .attr('cursor', 'pointer')
                .attr('height', function(d){
                    return d.data.image.height;
                })
                .attr('width', function(d){
                    return d.data.image.width;
                })
                .attr('class', function(d) {
                    return getClassName('node-image', d);
                })
                .attr("y", function(d) {
                    return -d.data.image.height / 2 + 'px'
                })
                .attr("x", function(d) {
                    var x = -d.data.image.width / 2;
                    return x;
                });
            
            nodeImages.filter(function(d) {
                return !d.data.image
            }).remove()

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + coeff * d.y + "," + d.x + ")";
                })
                .on('end', (e) => {
                    if(e.data.className === 'internet-root'){
                        var top1 = $('.traefik-root').position().top;
                        var top2 = $('.internet-root').position().top;
                        svg.attr("transform", "translate(" + margin.left + "," + (margin.top + (top1-top2)/2) + ")");
                    }
                });;

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', function(d){
                    return d.data.image ? 1e-6 : 10
                })
                .attr('cursor', 'pointer');


            // Remove any exiting nodes
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("opacity", 0)
                .attr("transform", function(d) {
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
                .data(links, function(d) {
                    return d.id;
                });

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g")
                .attr('class', function(d) {
                    return getClassName('link', d);
                })
                .attr("id", function(d, i) {
                    return 'path-' + d.data.name
                })
                .attr('d', function(d) {
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
                .attr('d', function(d) {
                    return diagonal(d, d.parent)
                });

            // Remove any exiting links
            link.exit().transition()
                .duration(duration)
                .attr('d', function(d) {
                    var p = {
                        x: source.x,
                        y: source.y
                    }
                    return diagonal(p, p)
                })
                .remove();

            // ****************** links text section ***************************

            // Update the links...
            var linkText = svg.selectAll('text.entrypoints')
                .data(links);

            // Add labels for the nodes
            var linkTextEnter = linkText.enter().append('text')
                .attr("dy", "-0.3em")
                .attr('class', function(d) {
                    return getClassName('entrypoints', d);
                })
                .attr("fill", "Black")
                .style("font", "normal 12px Arial")
                .append("textPath")
                .attr("startOffset", "55.76%")
                .style("text-anchor", "end")
                .attr("xlink:href", function(d, i) {
                    return '#path-' + d.data.name;
                })
                .text(function(d) {
                    return d.data.entryPoints;
                });

            // Remove any exiting links
            linkText.exit().remove();

            // Store the old positions for transition.
            nodes.forEach(function(d) {
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
}
