<svelte:head>
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>


<style>

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#chartdiv {
  width: 100%;
  height: 500px;
}
</style>

<script>
import {onMount} from "svelte";

onMount(async () =>{
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
// @ts-ignore
var root = am5.Root.new("chartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  // @ts-ignore
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
// @ts-ignore
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  title: "Personas que han emigrado de España en el año 2021 de entre 20 y 34 años",
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0,
  layout: root.verticalLayout
}));


// Data
var colors = chart.get("colors");

var data = [{
  country: "Cataluña",
  visits: 33342,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-states.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Madrid",
  visits: 26868,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-kingdom.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Valencia",
  visits: 26454,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/china.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Aragón",
  visits: 26123,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/japan.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Murcia",
  visits: 15430,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/germany.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Andalucía",
  visits: 15071,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/france.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Asturias",
  visits: 14995,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/india.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Galicia",
  visits: 8731,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/spain.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Castilla La Mancha",
  visits: 3800,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/netherlands.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Castilla Y León",
  visits: 93,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/south-korea.svg",
  columnSettings: { fill: colors.next() }
}];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
// @ts-ignore
var xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 30,
  minorGridEnabled: true
})

// @ts-ignore
var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "country",
  renderer: xRenderer,
  // @ts-ignore
  bullet: function (root, axis, dataItem) {
    // @ts-ignore
    return am5xy.AxisBullet.new(root, {
      location: 0.5,
      // @ts-ignore
      sprite: am5.Picture.new(root, {
        width: 24,
        height: 24,
        // @ts-ignore
        centerY: am5.p50,
        // @ts-ignore
        centerX: am5.p50,
        src: dataItem.dataContext.icon
      })
    });
  }
}));

xRenderer.grid.template.setAll({
  location: 1
})

xRenderer.labels.template.setAll({
  paddingTop: 20
});

xAxis.data.setAll(data);

// @ts-ignore
var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  // @ts-ignore
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
// @ts-ignore
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "visits",
  categoryXField: "country"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  tooltipY: 0,
  strokeOpacity: 0,
  templateField: "columnSettings"
});

series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);

});
</script>

<h2>Personas que han emigrado de España en el año 2021 de entre 20 y 34 años</h2>
<div id="chartdiv"></div>
<p>
  Gráfico de barras que muestra el total de personas de entre 20 y 34 años que han emigrado de España en el año 2021.
</p>