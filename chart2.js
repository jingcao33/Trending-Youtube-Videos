// set the dimensions and margins of the graph
var margin = {top: 50, right: 150, bottom: 80, left: 30},
width = 1400 - margin.left - margin.right,
height = 580 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bubble_map_2")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/jingcao33/Trending-Youtube-Videos/master/video_dataset.csv", function(data) {

// ---------------------------//
//       AXIS  AND SCALE      //
// ---------------------------//

// Add X axis
var x = d3.scaleLinear()
.domain([0, 1400000])
.range([0, width]);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).ticks(5));

// Add X axis label:
svg.append("text")
  .attr("text-anchor", "start")
  .attr("x", width/2-30)
  .attr("y", height+70 )
  .text("Number of Comment")
  .attr("font-size", "18")
  .attr("fill","rgba(70, 68, 75, 1)")
  .attr("font-weight", "bold");

// Add Y axis
var y = d3.scaleLinear()
.domain([0, 100])
.range([height,0]);
svg.append("g")
.call(d3.axisLeft(y).ticks(10));

// Add Y axis label:
svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", 0)
  .attr("y", -20 )
  .text("Rate of Likes/Dislikes")
  .attr("fill","rgba(70, 68, 75, 1)")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold");

// Add a scale for bubble size
var z = d3.scaleSqrt()
.domain([18871288, 235211923])
.range([2, 50]);




// Add a scale for bubble color
var categoryList = ["Film_Animation", 'Autos_Vehicles', 'Music', 'Sports', 'Travel_Events', 'People_Blogs', 'Entertainment', 'Howto_Style', 'Science_Technology', 'Nonprofits_Activism', 'Comedy']

var color = d3.scaleOrdinal()
.domain(categoryList)
.range(["#EFBA48", "#377eb8", "#008295", "#984ea3", "#ff7f00", "rgba(70, 68, 75, 1)", "#FFAFAE", "#f781bf", "#999999", "#C30016", "#1f78b4"]);


// ---------------------------//
//      TOOLTIP               //
// ---------------------------//

// Create a tooltip div that is hidden by default:
var tooltip = d3.select("#bubble_map_2")
.append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  // .style("background-color", "white")
  .style("background-color", "rgba(70, 68, 75, 1)")
  .style("color","seashell")
  // .style("border", "solid")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("font-size", "14px")
  // .style("color", "black")
  .style("padding", "5px")

// Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
var showTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
tooltip
  .style("opacity", 1)
  .html("<b>Title:</b> " + d.title+"<br><b>Rate of likes/Dislikes:</b> "+d.rate_of_likes_and_dislikes+
  "<br><b>Comments: </b>"+d.comment_count
  )
  .style("position", "absolute")
  // .style("left", (d3.mouse(this)[0]+30) + "px")
  // .style("top", (d3.mouse(this)[1]+30) + "px")
  .style("left", (d3.event.pageX + 20) + "px")
  .style("top", d3.event.pageY + "px")
  .style("line-height", "1.5")
}
var moveTooltip = function(d) {
tooltip
  // .style("left", (d3.mouse(this)[0]+30) + "px")
  // .style("top", (d3.mouse(this)[1]+30) + "px")
  .style("left", (d3.event.pageX + 20) + "px")
  .style("top", d3.event.pageY + "px")
}
var hideTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
}


// ---------------------------//
//       HIGHLIGHT GROUP      //
// ---------------------------//

// What to do when one group is hovered
var highlight = function(d){
// reduce opacity of all groups
d3.selectAll(".bubbles").style("opacity", .08)
// expect the one that is hovered
d3.selectAll("."+d).style("opacity", 1)
}

// And when it is not hovered anymore
var unhighlight = function(d){
d3.selectAll(".bubbles").style("opacity", 1)
}


// ---------------------------//
//       CIRCLES              //
// ---------------------------//

// Add dots
svg.append('g')
.selectAll("circle")
.data(data)
.enter()
.append("circle")
  .attr("class", function(d) { return "bubbles " + d.category_name})
  .attr("cx", function (d) { return x(d.comment_count); } )
  .attr("cy", function (d) { return y(d.rate_of_likes_and_dislikes) } )
  .attr("r", function (d) { return z(d.views); } )
  .attr("fill-opacity", 0.8)
  .style("fill", function (d) { return color(d.category_name); } )
  .style("stroke-width", 1)
  .attr("stroke", function (d) { return "white" })
// -3- Trigger the functions for hover
.on("mouseover", showTooltip )
.on("mousemove", moveTooltip )
.on("mouseleave", hideTooltip )



// ---------------------------//
//       LEGEND              //
// ---------------------------//

// Add legend: circles
var valuesToShow = [20000000, 100000000, 200000000]
var xCircle = width+30
var xLabel = width+80
svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("circle")
    .attr("cx", xCircle-450)
    .attr("cy", function(d){ return height - 380 - z(d)
} )
    .attr("r", function(d){ return z(d) })
    .style("fill", "none")
    .attr("stroke", "black")

// Add legend: segments
svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("line")
    .attr('x1', function(d){ return xCircle + z(d)-450} )
    .attr('x2', xLabel-430)
    .attr('y1', function(d){ return height - 380 - z(d)})
    .attr('y2', function(d){ return height - 380 - z(d) } )
    .attr('stroke', 'black')
    .style('stroke-dasharray', ('2,2')
)

// Add legend: labels
svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("text")
    .attr('x', xLabel-430)
    .attr('y', function(d){ return height - 380 - z(d) } )
    .text( function(d){ return d/1000000 } )
    .style("font-size", 10)
    .attr('alignment-baseline', 'middle')

// Legend title
svg.append("text")
  .attr('x', xCircle - 450)
  .attr("y", height - 380 + 30)
  .text("Number of Views (M)")
  .attr("text-anchor", "middle")
  .style("font-size", 14)

// Add one dot in the legend for each name.
var size = 20
// var allgroups = ['Film & Animation', 'Autos & Vehicles', 'Music', 'Sports', 'Travel & Events', 'People & Blogs', 'Entertainment', 'Howto & Style', 'Science & Technology', 'Nonprofits & Activism', 'Comedy']
svg.selectAll("myrect")
  .data(categoryList)
  .enter()
  .append("circle")
    .attr("cx", width-180)
    .attr("cy", function(d,i){ return -10 + i*(size+5)}) // 10 is where the first dot appears. 25 is the distance between dots
    .attr("r", 5)
    .style("fill", function(d){ return color(d)})
    .on("mouseover", highlight)
    .on("mouseleave", unhighlight)

// Add labels beside legend dots
svg.selectAll("mylabels")
  .data(categoryList)
  .enter()
  .append("text")
    .attr("x", width-180 + size*.8)
    .attr("y", function(d,i){ return -10 + i * (size + 5) }) // 10 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .style("font-size", 14)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", unhighlight)
})