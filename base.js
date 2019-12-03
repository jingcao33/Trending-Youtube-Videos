var margin = { top: 40, right: 200, bottom: 60, left: 30 },
    width = 1400 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;

const svg = d3.select("#bubble_map_1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var categoryList = ["Film_Animation", 'Autos_Vehicles', 'Music', 'Sports', 'Travel_Events', 'People_Blogs', 'Entertainment', 'Howto_Style', 'Science_Technology', 'Nonprofits_Activism', 'Comedy']


d3.csv("https://raw.githubusercontent.com/jingcao33/Trending-Youtube-Videos/master/video_dataset.csv", function (data) {

        // create a tooltip
        var Tooltip = d3.select("#bubble_map_1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "rgba(70, 68, 75, 1)")
            .style("color","seashell")
            // .style("border", "solid")
            // .style("border-width", "2px")
            .style("font-size", "14px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            Tooltip
                .html("<b>Title: </b> " + d.title + "<br><b>Category Name: </b>" + d.category_name + "<br><b>Number of Views: </b>" + d.views)
                .style("position", "absolute")
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", d3.event.pageY + "px")
                .style("line-height", "1.5")
        }

        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
        }
        // var categoryList = ['Film & Animation', 'Autos & Vehicles', 'Music', 'Sports', 'Travel & Events', 'People & Blogs', 'Entertainment', 'Howto & Style', 'Science & Technology', 'Nonprofits & Activism', 'Comedy']
        
        // A color scale
        var color = d3.scaleOrdinal()
            .domain(categoryList)
            .range(["#EFBA48", "#377eb8", "#008295", "#984ea3", "#ff7f00", "rgba(70, 68, 75, 1)", "#FFAFAE", "#f781bf", "#999999", "#C30016", "#1f78b4"])

        // Size scale for views
        var z = d3.scaleSqrt()
            .domain([18871288, 235211923])
            .range([2, 50]);

        // Initialize the circle: all located at the center of the svg area
        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("name", function (d) { return d.title })
            .attr("class", function (d) { return "bubbles " + d.category_name })
            .attr("cx", width / 2)
            .attr("cy", height / 3)
            .attr("r", function (d) { return z(d.views) })
            .attr("fill", function (d) { return color(d.category_name) })
            .attr("fill-opacity", 0.8)
            .attr("stroke", "white")
            .style("stroke-width", 1)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(width / 2).y(height / 3)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(5)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (z(d.views) + 1) }).iterations(1)) // Force that avoids circle overlapping


        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation.nodes(data)
            .on("tick", function (d) {
                node.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
            });

        // ---------------------------//
        //       LEGEND              //
        // ---------------------------//

        // Add legend: circles
        var valuesToShow = [20000000, 100000000, 200000000]
        var xCircle = width/1.5 + 50
        var xLabel = width/1.5 + 100
        svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", xCircle-600)
            .attr("cy", function (d) { return height -190- z(d) })
            .attr("r", function (d) { return z(d) })
            .style("fill", "none")
            .attr("stroke", "#999")
            // .attr("position","block")

        // Add legend: segments
        svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("line")
                .attr('x1', function (d) { return xCircle - 600 + z(d) })
                .attr('x2', xLabel - 580)
                .attr('y1', function (d) { return height - 190 - z(d) })
                .attr('y2', function (d) { return height - 190 - z(d) })
                .attr('stroke', '#999')
                .style('stroke-dasharray', ('2,2'))
                // .attr("position", "block")

        // Add legend: labels
        svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("text")
                .attr('x', xLabel - 580)
                .attr('y', function (d) { return height - 190 - z(d) })
                .text(function (d) { return d/1000000 })
                .style("font-size", 10)
                .attr('alignment-baseline', 'middle')
                // .attr("position", "block")

        // Legend title
        svg.append("text")
            .attr('x', xCircle - 600)
            .attr("y", height - 190 + 30)
            .text("Number of Views (M)")
            .attr("text-anchor", "middle")
            .style("font-size", 14)

        // Add one dot in the legend for each name.
        var size = 20
        svg.selectAll("myrect")
            .data(categoryList)
            .enter()
            .append("circle")
            .attr("cx", width-250)
            .attr("cy", function (d, i) { return  i * (size + 5) +70 }) // 200 is where the first dot appears. 25 is the distance between dots
            .attr("r", 5)
            .style("fill", function (d) { return color(d) })

        // Add labels beside legend dots
        svg.selectAll("mylabels")
            .data(categoryList)
            .enter()
            .append("text")
            .attr("x", width-250 + size * .8)
            .attr("y", function (d, i) { return i * (size + 5) +70 }) // 200 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("font-size", 14)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    })
