// Code to select, process, and plot data

// Make data global to
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

    let samples = fileData.samples.filter(entry => entry.id === subjNumber);

    let data = [{
        type: 'bar',
        x: samples[0].sample_values.slice(0,10),
        y: samples[0].otu_ids.map(x => `OTU ${x}`).slice(0,10),
        hovertext: samples[0].otu_labels.slice(0,10),
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

};

function optionChanged(testSubject) {

    let samples = fileData.samples.filter(entry => entry.id === testSubject);
    
    console.log(samples)

};

/*var data = [{
    type: 'bar',
    x: [20, 14, 23],
    y: ['giraffes', 'orangutans', 'monkeys'],
    orientation: 'h'
  }];*/
  
  //Plotly.newPlot('myDiv', data);
  
