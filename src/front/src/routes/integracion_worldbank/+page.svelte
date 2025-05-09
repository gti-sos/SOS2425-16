<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Alert } from '@sveltestrap/sveltestrap';

	// let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API = 'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json';

	// if (dev) {
	// 	API = DEVEL_HOST + API;
	// }

	let worldbank_data = [];
	let resultStatus,
		resultMessage = '';

	function standarizeData(jsonData) {
        let res = jsonData;
		res = res[1];
		res = res.map((item) => [item.date, item.value]);
		res.reverse();
        return res;
	}

	async function getData() {
		try {
			const res = await fetch(API, { method: 'GET' });

			if (res.status === 200) {
				worldbank_data = await res.json();
                worldbank_data = standarizeData(worldbank_data);
				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(worldbank_data)

				console.log(`Response received:\n${JSON.stringify(worldbank_data, null, 2)}`);
			} else if (res.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
			return worldbank_data;
		} catch (error) {
			console.log(`ERROR getting data from ${API}: ${error}`);
		}
	}

	onMount(async () => {
		let graphData = await getData();
		anychart.onDocumentReady(function () {
			// set chart theme
			anychart.theme('darkTurquoise');
			// create data set on our data
			var dataSet = anychart.data.set(graphData);

			// map data for the first series, take x from the zero column and value from the first column of data set
			var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

			// map data for the second series, take x from the zero column and value from the second column of data set
			var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });

			// map data for the third series, take x from the zero column and value from the third column of data set
			var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });

			// create line chart
			var chart = anychart.line();

			// turn on chart animation
			chart.animation(true);

			// set chart padding
			chart.padding([10, 20, 5, 20]);

			// turn on the crosshair
			chart.crosshair().enabled(true).yLabel(false).yStroke(null);

			// set tooltip mode to point
			chart.tooltip().positionMode('point');

			// set chart title text settings
			chart.title('Trend of Sales of the Most Popular Products of ACME Corp.');

			// set yAxis title
			chart.yAxis().title('Number of Bottles Sold (thousands)');
			chart.xAxis().labels().padding(5);

			// create first series with mapped data
			var firstSeries = chart.line(firstSeriesData);
			firstSeries.name('Población de África Este y Sur');
			firstSeries.hovered().markers().enabled(true).type('circle').size(4);
			firstSeries.tooltip().position('right').anchor('left-center').offsetX(5).offsetY(5);

			// turn the legend on
			chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

			// set container id for the chart
			chart.container('container');
			// initiate chart drawing
			chart.draw();
		});
	});
</script>

<svelte:head>
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-base.min.js"></script>
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-ui.min.js"></script>
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-exports.min.js"></script>
	<script src="https://cdn.anychart.com/releases/v8/themes/dark_turquoise.min.js"></script>
</svelte:head>

{#if resultMessage}
	<Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

<div id="container"></div>

<style>
	@import url('https://cdn.anychart.com/releases/v8/css/anychart-ui.min.css');
	@import url('https://cdn.anychart.com/releases/v8/fonts/css/anychart-font.min.css');

	html,
	body,
	#container {
		width: 100%;
		height: 80vh;
		margin: 0;
		padding: 0;
	}
</style>
