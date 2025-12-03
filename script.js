import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const margin = { top: 20, right: 30, bottom: 40, left: 40 };
// const width = 800 - margin.left - margin.right;
// const height = 500 - margin.top - margin.bottom;
const width = 1000;
const height = 400;
console.log(height)
const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let globalData; // ⭐ store data globally so buttons can use it

// Load CSV
d3.csv("CO2.csv").then(function (data) {

    data.forEach(d => {

        d.CO2_Emission = +d["CO2 emission (Tons)"];
        d.Population = +d["Population(2022)"];
        console.log(d.CO2_Emission)
        d.Year = +d.Year;
    });

    globalData = data; // ⭐ assign to global variable

    console.log("CSV loaded:", globalData);

    // createBarChart(globalData);  // show a default chart
});

// Buttons
document.getElementById('barChartBtn').addEventListener('click', () => toggleChart("bar"));
// document.getElementById('lineChartBtn').addEventListener('click', () => toggleChart("line"));
// document.getElementById('pieChartBtn').addEventListener('click', () => toggleChart("pie"));
/*document.getElementById('areachart').addEventListener('click', () => toggleChart("areachart"));*/

// Clear SVG before drawing a new chart
function clearSVG() {
    svg.selectAll("*").remove();
}

function toggleChart(type) {
    if (!globalData) return; // data not loaded yet

    clearSVG();

    if (type === "bar") {
        console.log("shbchdb")
        createBarChart(globalData)
    };
    if (type === "line") createLineChart(globalData);
    if (type === "pie") createPieChart(globalData);
    if (type === "areachart") createAreaChart(globalData);
}
// Bar Chart Visualization
// Bar Chart Visualization
function createBarChart(data) {
    // Filter data for year 2020 to ensure unique countries
    const data2020 = data.filter(d => d.Year === 2020);

    // Select 10 random countries
    const random10Data = d3.shuffle(data2020).slice(0, 10);

    // Sort by CO2 Emission descending for better visualization
    random10Data.sort((a, b) => b.CO2_Emission - a.CO2_Emission);

    const x = d3.scaleBand()
        .domain(random10Data.map(d => d.Country))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(random10Data, d => d.CO2_Emission)])
        .nice()
        .range([height, 0]);

    svg.selectAll(".bar")
        .data(random10Data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Country))
        .attr("y", d => y(d.CO2_Emission))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.CO2_Emission))
        .attr("fill", "#69b3a2");

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));
}



