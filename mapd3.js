// mapd3.js

// Set the dimensions and margins of the graph
var width = 960, height = 600;

// Map projection
var projection = d3.geoEquirectangular()
    .scale(150)
    .translate([width / 2, height / 2]);

// Define path generator
var path = d3.geoPath()
    .projection(projection);

// Create SVG container
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load external GeoJSON data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then(function(topo) {
        // Check if the data is loaded correctly
        console.log(topo);

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)  // Bind GeoJSON data
            .enter()
            .append("path")
            .attr("d", path)  // Draw each country
            .attr("fill", "#ccc");  // Default fill color

        // Add more interaction or color scaling here

    }).catch(function(error) {
        console.error("Error loading the GeoJSON data: ", error);
    });