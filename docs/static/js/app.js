function buildMetadata(sample) {
    // write code to create the buildMetadata
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // filter for 
        var filteredArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var filtered = filteredArray[0];
        var sample_metadata = d3.select("#sample-metadata")
        //clears existing metadata
        sample_metadata.html("");
        //append kvps 
        Object.entries(filtered).forEach(([key, value]) => {
        sample_metadata.append("h6").text(`${key.toUpperCase()}:${value}`);
        });
    });
}

/***********************************************/

function buildPlots(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        //filter data
        var filteredArray = samples.filter(sampleObj => sampleObj.id == sample);
        var filtered = filteredArray[0];

        //variables:
        var otu_ids = filtered.otu_ids;
        var otu_labels = filtered.otu_labels;
        var sample_values = filtered.sample_values;

        
        //horizontal bar chart data
        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                type: "bar",
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                orientation: "h",
            }
        ];
        //bar chart formatting
        var barFormatting = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };
        //plot bar chart
        Plotly.newPlot("bar", barData, barFormatting)


        //bubble chart formatting
        var bubbleFormatting = {
            title: "Bacteria Cultures Found",
            margin: {t: 0},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t: 30}
        };
        //bubble chart data
        var bubbleData = [
            {
                type: "bubble",
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];
        //create plot
        Plotly.newPlot("bubble", bubbleData, bubbleFormatting);
    
    });
}

/***********************************************/
//dropdown box
function init() {
    //dropdown reference
    var selector = d3.select('#selDataset');
    //dropdown data
    d3.json("samples.json").then((data) => {
        var names = data.names;

        names.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var sampleStart = names[0];
        buildPlots(sampleStart);
        buildMetadata(sampleStart);
    });
}

/***********************************************/
//function to get data with selection change
function optionChanged(newSelection) {
    buildMetadata(newSelection);
    buildPlots(newSelection);
}

/***********************************************/
//init dash
init();