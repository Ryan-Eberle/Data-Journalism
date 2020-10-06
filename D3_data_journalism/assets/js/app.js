// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top:20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight -margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Choose an x and y axis as a starting point for the graphing
// chosenYAxis 1. Age 2. Poverty 3. Income
var chosenYAxis = 'age'
// chosenXAxis 1. obeseity 2. smokes 3. healthcare
var chosenXAxis = "obesity"

// function for updating x-scale variable on click of label
function xScale(newsData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d[chosenXAxis]) * 0.8,
        d3.max(newsData, d => d[chosenXAxis]) * 1.2
    ])
        .range([0,width]);
    return xLinearScale;
}
// YScale function
function yScale(newsData, chosenYAxis) {
    var YLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d[chosenYAxis]) * 0.8,
        d3.max(newsData, d => d[chosenYAxis]) * 1.2
    ])
        .range([height, 0]);
    return YLinearScale;
}
//function for updating Xaxis variable when clicked
function renderXAxis(newXScale, Xaxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    Xaxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}
//function for updating Yaxis var on click
function renderYAxis(newYScale, Yaxis) {
    var leftAxis = d3.axisLeft(newYScale);

    Yaxis.transition()
        .duration(1000)
        .call(leftAxis);
    return Yaxis;
}
// function to render the data point circles using X and Y scales
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

// function to format text for renderCircles
function renderText(circlesText, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesText.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesText;
}
// ToolTip function for X and Y 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesText) {
    var xLabel;
    var xformatLabel;

    if (chosenXAxis === "obesity") {
        label = "Obeseity: "
        xformatLabel = "%";
    }
    else if (chosenXAxis === "smokes"){
        label = "Smokes: "
        xformatLabel = "%";
    }
    else {
        label = "Lacks Healthcare: "
        xformatLabel = "%";
    }

    var yLabel;
    var yformatLabel

    if (chosenYAxis === "age") {
        label = "Age: "
        yformatLabel = " ";
    }
    else if (chosenYAxis === "poverty") {
        label = "Poverty: "
        yformatLabel = "%";
    }
    else {
        label = "Household Income: $"
        yformatLabel = " ";
    }
    // format tooltip variable show state data 
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            return (`${d.state}<br>
            ${xLabel}${chosenXAxis}${xformatLabel}<br>
            ${yLabel}${chosenYAxis}${yformatLabel}`)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}


d3.csv('/assets/data/data.csv').then(function(newsData) {
    //console.log(newsData);
    // clean up that data!
    newsData.forEach(function(d) {
    d.age = +d.age;
    d.poverty = +d.poverty;
    d.income = +d.income;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
    d.healthcare = +d.healthcare;
    });

    // X Scale
    var xLinearScale = xScale(newsData, chosenXAxis);
    // Y Scale
    var YLinearScale = yScale(newsData, chosenYAxis);

    // initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.leftAxis(YLinearScale);

    //append x axis 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);
    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // create circles on graph
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("cicle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .classed("stateCircle", true)
        .attr("r", 15)

    var circlesText = chartGroup.selectAll("text")
        .data(newsData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .classed("stateText", true)
        .attr("dy", ".3em")
        .text(d => (d.abbr))

    // x labels group 3 obesity, smoke%, healthcare%
    var xLabelGroup = chartGroup.append("g")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)

    var obeseLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity %:")

    var smokeLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smoking %:")

    var healthcareLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare(%):")

    // y labels group Age, Poverty, Income

    var yLabelGroup = chartGroup.append("g")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`);

    var ageLabel = yLabelGroup.append("text")
        .attr("x", -200)
        .attr("y", -30)
        .attr("value", "age")
        .classed("active", true)
        .text("Age(Median):")

    var povertyLabel = yLabelGroup.append("g")
        .attr("x", -200)
        .attr("y", -50)
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("Poverty %:")

    var incomeLabel = yLabelGroup.append("g")
        .attr("x", -200)
        .attr("y", -70)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Median Income Level:")

    // updateToolTip function    
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesText)

    // HERE YOU WILL ADD EVENT LISTENERS

}); 

