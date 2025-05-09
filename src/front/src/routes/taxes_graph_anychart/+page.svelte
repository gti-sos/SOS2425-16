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
				let numYears = new Set(taxes_data.map((item) => item.year)).size;

				taxes_data = collectToMap(taxes_data);
				console.log(taxes_data);
				taxes_data = taxes_data.map((item) => ({
					x: item[0],
					value: Math.trunc(item[1] / numYears)
				}));
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

			// create barmekko chart with data
			var chart = anychart.barmekko(data);
            chart.legend(true);
			// set chart title text settings
			chart.title('Mekko chart de media anual de impuestos en España por comunidad autónoma (€)');

			// set chart padding
			chart.padding().left(75);

			// disabled labels
			chart.labels(false);

            chart.xAxis().labels().enabled(false)

			// set tooltip settings
			chart.tooltip().format('Impuestos: {%Value}');

			// get average
			var average = Math.round(chart.getSeries(0).getStat('average'));

			// create line marker
			chart.lineMarker().zIndex(100).value(average).stroke('#F44336', 2).axis(chart.yAxis());

			// create text marker
			chart
				.textMarker()
				.value(average)
				.text('Media: ' + average)
				.anchor('right-center')
				.offsetX(10)
				.align('left')
				.zIndex(100)
				.axis(chart.yAxis());

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
	<script src="https://cdn.anychart.com/releases/v8/js/anychart-mekko.min.js"></script>
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
