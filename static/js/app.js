// Code to select, process, and plot data

// Make data global
var fileData;

d3.json('./data/samples.json').then(function(data) {

    fileData = data;

    let dropDown = d3.select('#selDataset');
    let testSubjectList = fileData.names;

    testSubjectList.forEach(element => {
        let option = dropDown.append('option');
        option.text(element);
    })

    // Wait til data are loaded before running init
    initPlatform();

});

// Get

function initPlatform() {

    // Test value
    let subjNumber = "940";

    //
    // *** Metadata ***
    //

    let metaData = fileData.metadata.filter(entry => entry.id === parseInt(subjNumber));

    let metaDiv = d3.select('#sample-metadata');

    // Clear the parent div of anything prior
    metaDiv.html("")

    // Loop through object and add each key/value to div
    Object.entries(metaData[0]).forEach(([key,value]) => {
        let div = metaDiv.append('div');
        div.classed('md-col-12',true);
        div.text(`${key}: ${value}`);
    });

    //
    // *** Bar Chart ***
    //

    let samples = fileData.samples.filter(entry => entry.id === subjNumber);

    let sampleVals = samples[0].sample_values;
    let otuIDs = samples[0].otu_ids;
    let otuLabels = samples[0].otu_labels;

    let data = [{
        type: 'bar',
        x: sampleVals.slice(0,10),
        y: otuIDs.map(x => `OTU ${x}`).slice(0,10),
        hovertext: otuLabels.slice(0,10),
        orientation: 'h'
      }];
    
    let layout = {
      yaxis: {autorange: "reversed"},
      margin: {
        l: 80,
        r: 50,
        b: 50,
        t: 10,
        pad: 4
      }
    }

    Plotly.newPlot('bar', data, layout);

    //
    // *** Bubble Chart ***
    //

    var trace1 = [{
        x: otuIDs,
        y: sampleVals,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: otuIDs,
            size: sampleVals
        }
      }];

      let layout2 = {
        xaxis: {
            title: {
                text: 'OTU Label'
            }
        }
      }

      Plotly.newPlot('bubble', trace1, layout2);

      //
      // *** Gauge Chart ***
      //

      var data3 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: metaData[0].wfreq,
          title: { text: "Wash Frequency", font: { size: 24 } },
          //delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
          gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
            bar: { visible: false, color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 2], color: "#eff3ff" },
              { range: [2, 4], color: "#bdd7e7" },
              { range: [4, 6], color: "#6baed6" },
              { range: [6, 8], color: "#3182bd" },
              { range: [8, 10], color: "#08519c" }
            ]
          }
        }
      ];
      
      var layout3 = {
        //width: 400,
        //height: 300,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
      };
      
      Plotly.newPlot('gauge', data3, layout3);

};

function optionChanged(testSubject) {

    // 
    // *** MetaData ***
    //

    let metaData = fileData.metadata.filter(entry => entry.id === parseInt(testSubject));

    let metaDiv = d3.select('#sample-metadata');

    // Clear the parent div of anything prior
    metaDiv.html("")

    // Loop through object and add each key/value to div
    Object.entries(metaData[0]).forEach(([key,value]) => {
        let div = metaDiv.append('div');
        div.classed('md-col-12',true);
        div.text(`${key}: ${value}`);
    });

    //
    // *** Bar Chart ***
    //

    let samples = fileData.samples.filter(entry => entry.id === testSubject);
    
    let x = samples[0].sample_values.slice(0,10);
    let y = samples[0].otu_ids.map(x => `OTU ${x}`).slice(0,10);
    let hovertext = samples[0].otu_labels.slice(0,10);

    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
    Plotly.restyle("bar", "hovertext", [hovertext]);

    //
    // *** Bubble Chart ***
    //

    let x2 = samples[0].otu_ids;
    let y2 = samples[0].sample_values;
    let text2 = samples[0].otu_labels;

    Plotly.restyle("bubble", "x", [x2]);
    Plotly.restyle("bubble", "y", [y2]);
    Plotly.restyle("bubble", "text", [text2]);
    Plotly.restyle("bubble", "marker.color", [x2]);
    Plotly.restyle("bubble", "marker.size", [y2]);

    //
    // *** Gauge Chart ***
    //

    let newVal = metaData[0].wfreq;

    Plotly.restyle("gauge", "value", [newVal]);

};
