import React, { useEffect } from "react";
import * as d3 from "d3";
import axios from 'axios';

function Chart2() {

  useEffect(() => {
    // Fetch data and set up chart once component is mounted
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:3000/budget');
        const budgetData = res.data.myBudget;

        const titles = budgetData.map(d => d.title);
        const colors = budgetData.map(d => d.color);
        const values = {};

        budgetData.forEach(d => {
          values[d.title] = d.budget;
        });

        const colorScale = d3.scaleOrdinal().domain(titles).range(colors);
        const transformedData = titles.map(title => ({
          label: title,
          value: values[title]
        }));
        setupChart(transformedData, colorScale);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  function setupChart(data, color) {
    // ... (same D3 code as provided, but ensure you're selecting within the component)
    const svg = d3.select("#myD3Chart").select("svg").select("g");
    // rest of the D3 code...
    // set the dimensions and margins of the graph to be a quarter of the window size
    var width = 400,
    height = 170,
    radius = Math.min(width, height) / 3;

    var pie = d3.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

    var arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

    var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
    svg.attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");
    var key = function(d){ return d.data.label; };
    getBudgetData().then(function(data) {
    data = data.myBudget;
    var values = {};
    var titles = data.map(function(d) { return d.title; });
    var colors = data.map(function(d) { return d.color; });
    // values should be a dictionary of title: value
    data.forEach(function(d) {
        values[d.title] = d.budget;
    });
    return { titles, colors, values};
    }
    ).then(function(result) {
        var titles = result.titles;
        var colors = result.colors;
        var values = result.values;
        color = d3.scaleOrdinal()
        .domain(titles)
        .range(colors);
        return { color: color, values: values };
    }).then(function(result) {
        color = result.color;
        var values = result.values;
        var data = getData(values);
        change(data);
    }
    ).catch(function(err) {
        console.log(err);
    }
    );


    function getBudgetData (){
    return fetch('http://localhost:3000/budget')
    .then(function (res) {
        return res.json();
    })
    .catch(function (err) {
        console.log(err);
    });
    }

    function getData (values){
    var labels = color.domain();
    return labels.map(function(label){
        return { label: label, value: values[label] }
    });
    }


    function change(data) {

    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), key);

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })

    slice.exit()
        .remove();

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labels").selectAll("text")
        .data(pie(data), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.label;
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });

    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
    };
  }

  return (
    <div id="myD3Chart">
      <svg>
        <g>
          <g className="slices"></g>
          <g className="labels"></g>
          <g className="lines"></g>
        </g>
      </svg>
    </div>
  );
}

export default Chart2;