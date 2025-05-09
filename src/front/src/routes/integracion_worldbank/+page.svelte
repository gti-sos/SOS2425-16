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
			anychart.theme(anychart.themes.darkEarth);
			// set the data
			var data = {
				header: ['Name', 'Población'],
				rows: graphData
			};

			// create the chart
			var chart = anychart.bar();

			// add data
			chart.data(data);

			// set the chart title
			chart.title('Evolución de la población En África Sur y Este');

			// draw
			chart.container('container');
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
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
