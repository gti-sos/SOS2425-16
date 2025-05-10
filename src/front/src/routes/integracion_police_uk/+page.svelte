<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Alert } from '@sveltestrap/sveltestrap';

	// let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API =
		'https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2025-03';

	// if (dev) {
	// 	API = DEVEL_HOST + API;
	// }

	let resultStatus,
		resultMessage = '';

	function countData(jsonData) {
		const res = new Map();

		for (let i = 0; i < jsonData.length; i++) {
			const item = jsonData[i];
			let name = item.category;
			if (!res.has(name)) {
				res.set(name, 1);
			} else {
				let prevValue = res.get(name);
				res.set(name, prevValue + 1);
			}
		}
		console.log(res);
		return Array.from(res);
	}

	async function getData() {
		let police_data;
		try {
			const res = await fetch(API, { method: 'GET' });

			if (res.status === 200) {
				police_data = await res.json();
				police_data = countData(police_data);
				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(police_data)

				console.log(`Response received:\n${JSON.stringify(police_data, null, 2)}`);
			} else if (res.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
			return police_data;
		} catch (error) {
			console.log(`ERROR getting data from ${API}: ${error}`);
		}
	}

	onMount(async () => {
		let chartData = await getData();
		anychart.onDocumentReady(function () {
			// set chart theme
			anychart.theme('darkTurquoise');
			// create pie chart with passed data
			var chart = anychart.pie(chartData);

			// set chart title text settings
			chart
				.title('Recuento de crímenes en UK en 2025-03')
				// set chart radius
				.radius('43%')
				// create empty area in pie chart
				.innerRadius('30%');

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
