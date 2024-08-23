// mapd3.js

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

// Load the CSV data and the GeoJSON data
Promise.all([
    d3.csv("just_medals_com.csv"),
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
]).then(function(data) {
    var medalData = data[0];
    var world = data[1];

    // Convert totals to numeric values
    medalData.forEach(function(d) {
        d.Total = +d.Total;
    });

    // Function to update the map based on the selected year
    function updateMap(Year) {
        // Create a map of countries and their total medals for the selected year
        var medalMap = {};
        medalData.forEach(function(d) {
            if (d.Year == Year) {
                // Convert Country_Name to a corresponding ISO 3166-1 alpha-3 code if necessary
                medalMap[d.Country_Name] = d.Total;
            }
        });

        // Update the map
        svg.selectAll("path")
            .data(world.features)
            .join("path")  // Use join to update existing paths
            .attr("d", path)
            .attr("fill", function(d) {
                var totalMedals = medalMap[d.properties.name];  // Adjust this to match how country names are stored in GeoJSON
                return totalMedals ? colorScale(totalMedals) : "#ccc";
            })
            .attr("stroke", "#333")
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.properties.name + "<br>Total Medals: " + (medalMap[d.properties.name] || 0))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    // Initial map draw
    var initialYear = 1896;  // Or set this dynamically based on your data
    updateMap(initialYear);

    // Update the map when the slider is moved
    var slider = d3.select("#yearSlider");
    var yearValue = d3.select("#yearValue");

    slider.on("input", function() {
        var selectedYear = +this.value;
        yearValue.text(selectedYear);
        updateMap(selectedYear);
    });

}).catch(function(error) {
    console.error("Error loading the data:", error);
});