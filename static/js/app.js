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

};
