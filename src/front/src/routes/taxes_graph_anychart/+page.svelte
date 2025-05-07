<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Alert } from '@sveltestrap/sveltestrap';

	let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API = '/api/v1/taxes-stats';

	if (dev) {
		API = DEVEL_HOST + API;
	}

	let taxes_data = [];
	let resultStatus,
		resultMessage = '';

	function collectToMap(array) {
		const res = new Map();

		for (let i = 0; i < array.length; i++) {
			const item = array[i];
			let name = item.autonomic_community;
			let taxesSum = item.atr_irpf + item.atr_iva + item.atr_soc_no_consolidadas;
			if (!res.has(name)) {
				res.set(name, taxesSum);
			} else {
				let prevValue = res.get(name);
				res.set(name, prevValue + taxesSum);
			}
		}
		return Array.from(res);
	}

	async function getData() {
		// resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res = await fetch(API, { method: 'GET' });

			if (res.status === 200) {
				taxes_data = await res.json();
				taxes_data = collectToMap(taxes_data);
				console.log(taxes_data);
				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(taxes_data)

				console.log(`Response received:\n${JSON.stringify(taxes_data, null, 2)}`);
			} else if (res.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
		} catch (error) {
			console.log(`ERROR getting data from ${API}: ${error}`);
		}
	}

	onMount(async () => {
		await getData();
		anychart.onDocumentReady(function () {
			// set chart theme
			anychart.theme('darkTurquoise');
			var data = taxes_data;

			// sort data by alphabet order
			data.sort(function (itemFirst, itemSecond) {
				return itemSecond[1] - itemFirst[1];
			});

			// create bar chart
			var chart = anychart.bar();

			// turn on chart animation
			chart
				.animation(true)
				.padding([10, 40, 5, 20])
				// set chart title text settings
				.title('Impuestos en las comunidades de España');

			// create area series with passed data
			var series = chart.bar(data);
			// set tooltip formatter
			series
				.tooltip()
				.position('right')
				.anchor('left-center')
				.offsetX(5)
				.offsetY(0)
				.format('${%Value}{groupsSeparator: }');

			// set titles for axises
			chart.xAxis().title('Products by Revenue');
			chart.yAxis().title('Revenue in Dollars');
			chart.interactivity().hoverMode('by-x');
			chart.tooltip().positionMode('point');
			// set scale minimum
			chart.yScale().minimum(0);

			// set container id for the chart
			chart.container('container');
			// initiate chart drawing
			chart.draw();
		});
	});
</script>

{#if resultMessage}
	<Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

<svelte:head>
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-base.min.js"></script>
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-ui.min.js"></script>
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-exports.min.js"></script>
	<script src="https://cdn.anychart.com/releases/v8/themes/dark_turquoise.min.js"></script>
</svelte:head>

<div id="container"></div>

<style>
	@import url('https://cdn.anychart.com/releases/v8/css/anychart-ui.min.css');
	@import url('https://cdn.anychart.com/releases/v8/fonts/css/anychart-font.min.css');

	/* html, */
	/* body, */
	#container {
		width: 100%;
		height: 80vh;
		margin: 0;
		padding: 0;
	}
</style>
