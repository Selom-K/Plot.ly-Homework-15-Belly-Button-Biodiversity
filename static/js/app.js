console.log("app.js loaded");

// Function to fetch the metadata for a sample using d3.json
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Functions to generate the bubble chart and bar chart
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples= data.samples;
      var resultsarray= samples.filter(sampleobject => 
          sampleobject.id == sample);
      var result= resultsarray[0]
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;
    
    // Bubble chart
      var LayoutBubble = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        };
    
        var DataBubble = [ 
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            size: values,
            colorscale: "Earth"
            }
        }
      ];
    
      Plotly.newPlot("bubble", DataBubble, LayoutBubble);
    
    
    // Bar chart
      var bar_data =[
        {
          y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          orientation:"h"
        }
      ];
    
      var barLayout = {
        title: "Top 10 OTUs found in the individual",
        margin: { t: 25, l: 140 }
      };
    
      Plotly.newPlot("bar", bar_data, barLayout);
    });
    }
     
    // Function to operate dropdown
    function init() {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
     
      const firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
    });
    }
    
    function optionChanged(newSample) {
    
    buildMetadata(newSample);
    buildCharts(newSample);
    }
        
    // Initiate the dashboard
    init();