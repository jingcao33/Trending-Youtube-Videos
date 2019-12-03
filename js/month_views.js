  // set the dimensions and margins of the graph
    var margin = {top: 40, right: 100, bottom: 80, left: 50},
        width = 1300 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select("#lollipop")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/jingcao33/Trending-Youtube-Videos/master/month_view.csv", function(data) {
    
    // sort data
    // data.sort(function(b, a) {
    //   return a.Views_per_day - b.Views_per_day;
    // });
    
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 9])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))
      .selectAll("text")
        .attr("transform", "translate(0)rotate(0)")
        .style("text-anchor", "end");
    // Add X axis label:
    svg.append("text")
     .attr("text-anchor", "start")
     .attr("x", width/2-100)
     .attr("y", height+60)
     .attr("fill","rgba(70, 68, 75, 1)")
     .text("Average views per day(M)")
     .attr("font-weight","bold")


    // Y axis
    var y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(function(d) { return d.month;}))
      .padding(1);
    svg.append("g")
      .call(d3.axisLeft(y))

    // Add Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20 )
    .text("Month")
    .attr("text-anchor", "start")
    .attr("font-weight","bold")
    .attr("fill","rgba(70, 68, 75, 1)")
    

      // Create a tooltip div that is hidden by default:
      var Tooltip = d3.select("#lollipop")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        // .style("background-color", "white")
        .style("background-color", "rgba(70, 68, 75, 1)")
        .style("color","seashell")
        .style("font-size", "14px")
        // .style("border", "solid")
        .style("border-radius", "5px")
        .style("padding", "5px")


      // Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function (d) {
        Tooltip
          .html("<b>Average Views Per Day:</b> " + d.Views_per_day)
          .style("position", "absolute")
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", d3.event.pageY + "px")
      }
      var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
      }
      
    // Lines
    svg.selectAll("myline")
      .data(data)
      .enter()
      .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.month); })
        .attr("y2", function(d) { return y(d.month); })
        .attr("stroke", "grey")
    
    // Circles
    var node = svg.append("g")
      .selectAll("mycircle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", x(0))
        .attr("cy", function(d) { return y(d.month); })
        .attr("r", "10")
        .style("fill", "#FFc0cb")
        .attr("stroke", "white")
        // -3- Trigger the functions for hover
        .on("mouseover", mouseover) 
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

// Change the X coordinates of line and circle
svg.selectAll("circle")
  .transition()
  .duration(2000)
  .attr("cx", function(d) { return x(d.Views_per_day/1000000); })

svg.selectAll("line")
  .transition()
  .duration(2000)
  .attr("x1", function(d) { return x(d.Views_per_day/1000000); })



})
