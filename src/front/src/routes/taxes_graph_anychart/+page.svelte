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
            if(!res.has(name)){
                res.set(name, taxesSum);
            }
            else {
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
                console.log(taxes_data)
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
        await getData()
		anychart.onDocumentReady(function () {
			// set chart theme
			anychart.theme('darkTurquoise');
			// create column chart
			var chart = anychart.column();

			// turn on chart animation
			chart.animation(true);

			// set chart title text settings
			chart.title('Top 10 Cosmetic Products by Revenue');

			// create area series with passed data
			var series = chart.column(
				taxes_data
			);

			// set series tooltip settings
			series.tooltip().titleFormat('{%X}');

			series
				.tooltip()
				.position('center-top')
				.anchor('center-bottom')
				.offsetX(0)
				.offsetY(5)
				.format('${%Value}{groupsSeparator: }');

			// set scale minimum
			chart.yScale().minimum(0);

			// set yAxis labels formatter
			chart.yAxis().labels().format('${%Value}{groupsSeparator: }');

			// tooltips position and interactivity settings
			chart.tooltip().positionMode('point');
			chart.interactivity().hoverMode('by-x');

			// axes titles
			chart.xAxis().title('Product');
			chart.yAxis().title('Revenue');

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

	html,
	body,
	#container {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
