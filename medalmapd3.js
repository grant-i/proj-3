// mapd3.js

// Set the dimensions and margins of the graph
var width = 960, height = 600;

// Create a tooltip
var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Create SVG element
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the projection and path generator
var projection = d3.geoEquirectangular()
    .scale(150)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

// Define a color scale
var colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, 121]);  // Adjust the domain based on your data's max value

// Load and process the CSV data
d3.csv("just_medals_com.csv").then(function(medalData) {
    // Convert totals to numeric values
    medalData.forEach(function(d) {
        d.Total = +d.Total;
    });

    // Load the GeoJSON data for world countries
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(world) {

        // Create a map of countries and their total medals for a specific year
        var year = 2016; // Choose the year you want to visualize
        var medalMap = {};
        medalData.forEach(function(d) {
            if (d.Year == year) {
                medalMap[d.Country] = d.Total;  // Use the ISO 3166-1 alpha-3 code
            }
        });

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(world.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                var totalMedals = medalMap[d.id];  // Use d.id which is the ISO 3166-1 alpha-3 code
                return totalMedals ? colorScale(totalMedals) : "#ccc";
            })
            .attr("stroke", "#333")
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.properties.name + "<br>Total Medals: " + (medalMap[d.id] || 0))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });

    }).catch(function(error) {
        console.error("Error loading the GeoJSON data:", error);
    });

}).catch(function(error) {
    console.error("Error loading the CSV data:", error);
});