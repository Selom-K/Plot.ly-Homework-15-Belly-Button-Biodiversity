console.log("app.js loaded");

// Advance challenge - Gauge chart
// Color palette
var arrColorsG = ["#004643", "#19A979", "#19A979", "#62AB37", "#5EEB5B", "#61FF7E", "#A6EBC9", "#CAC2B5", "#ECDCC9", "white"];

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

    buildGauge(result.wfreq)

  });
}

// Function for Gauge chart
function GaugeChartfig(sample) {
  console.log("sample", sample);
  d3.json("samples.json").then(data =>{
    var objs = data.metadata;    
    var matchedSampleObj = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));
    console.log("GaugeChartfig matchedSampleObj", matchedSampleObj);

    gaugeChart(matchedSampleObj[0]);
 });   
}

function gaugeChart(data) {
  console.log("gaugeChart", data);

  if(data.wfreq === null){
    data.wfreq = 0;
  }

  let degree = parseInt(data.wfreq) * (180/10);

  // Calculation for the meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);
  
  let trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 5, color:'472D30'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:[...arrColorsG]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#472D30',
        line: {
          color: '#472D30'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrubs per Week</b>',
    height: 450,
    width: 450,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});

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
      GaugeChartfig(firstSample)
    });
    }
    
    function optionChanged(newSample) {
    
    buildMetadata(newSample);
    buildCharts(newSample);
    GaugeChartfig(newSample)
    }
        
    // Initiate the dashboard
    init();