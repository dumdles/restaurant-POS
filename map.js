var svg_map = d3.select("#map"),
    width_map = +svg_map.attr("width"),
    height_map = +svg_map.attr("height");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Define a zoom behavior
var zoom = d3.zoom()
    .scaleExtent([1, 8]) // Set the minimum and maximum zoom levels
    .on("zoom", zoomed);

// Apply the zoom behavior to the SVG
svg_map.call(zoom);

// Map and projection centered on Singapore
var projection = d3.geoMercator()
    .center([103.8198, 1.3521]) // Singapore's coordinates
    .scale(100000) // Adjust the scale as needed for bigger map
    .translate([width_map / 2, height_map / 2]);

// Load external data and draw map
d3.json("3-subzone.geojson", function (error, data) {
    if (error) {
        console.error("Error loading GeoJSON:", error);
        return;
    }

    // Draw the map
    svg_map.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("fill", "#69b3a2")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "#fff");

    // Restaurant branches with random locations and number of customers
    var restaurants = [
        { "name": "Restaurant A", "location": [103.85, 1.35], "customers": 50 },
        { "name": "Restaurant B", "location": [103.75, 1.4], "customers": 30 },
        { "name": "Restaurant C", "location": [103.9, 1.3], "customers": 70 }
    ];

    // Scale for circle radius based on density
    var radiusScale = d3.scaleLinear()
        .domain([0, d3.max(restaurants, function (d) {
            return d.customers;
        })])
        .range([5, 20]); // Adjust the range as needed

    // Draw restaurant branches
    svg_map.selectAll("circle")
        .data(restaurants)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return projection(d.location)[0];
        })
        .attr("cy", function (d) {
            return projection(d.location)[1];
        })
        .attr("r", function (d) {
            return radiusScale(d.customers);
        }) // Set the radius
        .attr("fill", "rgba(255, 0, 0, 0.5)") // Fill color with some transparency
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.name + "<br/>" + "Customers: " + d.customers)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});

// Function to handle zooming
function zoomed() {
    if (d3.event) {
        svg_map.selectAll("path")
            .attr("transform", d3.event.transform);
        svg_map.selectAll("circle")
            .attr("transform", d3.event.transform);
    }
}