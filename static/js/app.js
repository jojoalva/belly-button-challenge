const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Load the data once and use it for both purposes
d3.json(url).then(init);

// Prepare data for plotting
function init(data) {
  // Assuming 'samples' is the array property in data structure
  let samplesArray = data.samples;
  let metadataArray = data.metadata;
  console.log(data)

  // Access the array of values in the loaded JSON data
  let values = samplesArray.map(sample => sample.id);
  let wfreq = metadataArray.map(metadata => metadata.wfreq)

  // // Log the data that will be appended to the dropdown options
  // console.log("Data to Append:", values);

  // Select the dropdown element
  let dropdown = d3.select("#selDataset");

  // Bind the data to the dropdown options
  dropdown.selectAll("option")
    .data(values)
    .enter()
    .append("option")
    .attr("value",id => id)
    .text(id => id);

  console.log(metadataArray[0].wfreq)
    
  // Initially, create the bar plot for the first value in the dropdown list
  updateBarPlot(samplesArray[0]);
  updateBubbleChart(samplesArray[0]);
  updateMetaData(metadataArray[0]);
  updateGauge(metadataArray[0].wfreq, metadataArray[0].id)
  
}


// Function to create/update the bar plot using Plotly
function updateBarPlot(sample) {
  // set variables for otu_ids and sample_values
  let otu_ids = sample.otu_ids;
  let sample_values = sample.sample_values;
  let otu_labels = sample.otu_labels;

  let data = [{
    type: 'bar',
    orientation: 'h',
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: otu_ids.slice(0, 10).map(id => `Name: ${otu_labels[otu_ids.indexOf(id)]}`).reverse(),
    marker: {
      color: sample_values.slice(0, 10),
      colorscale: 'YlOrRd'
    }
  }]

  let layout =  {title: 'Top 10 OTUs found'}

  // Create a horizontal bar plot using Plotly
  Plotly.newPlot("bar", data, layout);
}



// Function to create/update the Bubble chart using Plotly
function updateBubbleChart(sample) {
  // set variables for otu_ids and sample_values
  let otu_ids = sample.otu_ids;
  let sample_values = sample.sample_values;
  let otu_labels = sample.otu_labels;

  let data = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      opacity: [0.8],
      size: sample_values,
      color: otu_ids,
      colorscale: 'YlOrRd'
    }
  }]

  let layout =  {
    title: 'OTU sample values by otu_id',
    xaxis: {
      title: {
        text: 'OTU ID' // Set the x-axis title
      }
    }
  }

  // Create a bubble plot using Plotly
  Plotly.newPlot("bubble", data, layout);
}



// Function to update the metadata held within the 'demographics' box
function updateMetaData(subjectMetadata) {
  
  let demoBox = d3.select("#sample-metadata");

  // Clear the existing content
  demoBox.html("")

// Iterate through the metadata object and append each key-value pair
Object.entries(subjectMetadata).forEach(([key, value]) => {
  demoBox.append("p").text(`${key.toUpperCase()}: ${value}`);
});

}

function updateGauge(wfreqValue, subjectID) {
  var gaugedata = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreqValue,
      title: { text: "Scrubs per week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          
          { range: [0, 1], color: "#800026" },
          { range: [1, 2], color: "#9b0026" },
          { range: [2, 3], color: "#a70026" },
          { range: [3, 4], color: "#ab0026" },
          { range: [4, 5], color: "#e21b1c" },
          { range: [5, 6], color: "#ee3323" },
          { range: [6, 7], color: "#fda848" },
          { range: [7, 8], color: "#fdc865" },
          { range: [8, 9], color: "#fefecb" },
        ]
      }
    }
  ];

  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", gaugedata, layout);
}

function optionChanged(subjectID) {
  d3.json(url).then(data => {

    // Find the corresponding sample data
    let selectedSample = data.samples.find(sample => sample.id == subjectID);
    let selectedMetadata = data.metadata.find(metadata => metadata.id == subjectID);
    let wfreqValue = selectedMetadata.wfreq;

    // Update the plots with the selected data
    updateBarPlot(selectedSample);
    updateBubbleChart(selectedSample);
    updateMetaData(selectedMetadata);
    updateGauge(wfreqValue, subjectID);
}
  )}