<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API_G13 = 'https://sos2425-13.onrender.com/api/v2/national-parks';
	let API_TAXES = '/api/v1/taxes-stats';
	let resultStatus,
		resultMessage = '';

	if (dev) {
		API_TAXES = DEVEL_HOST + API_TAXES;
	}

	async function getTaxesData() {
		let taxes_data = [];
		try {
			await fetch(API_TAXES + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res = await fetch(API_TAXES, { method: 'GET' });

			if (res.status === 200) {
				taxes_data = await res.json();

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
			console.log(`ERROR getting data: ${error}`);
		}
		return taxes_data;
	}

	function collectToMapTaxes(array) {
		const res = new Map();

		for (let i = 0; i < array.length; i++) {
			const item = array[i];
			let name = item.autonomic_community;
			let taxesSum = item.atr_irpf;
			if (!res.has(name)) {
				res.set(name, taxesSum);
			} else {
				let prevValue = res.get(name);
				res.set(name, prevValue + taxesSum);
			}
		}
		// return Array.from(res);
		return res;
	}

	async function getNaturalParksData() {
		let parks = [];
		try {
			await fetch(API_G13 + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res = await fetch(API_G13, { method: 'GET' });

			if (res.status === 200) {
				parks = await res.json();

				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(national_parks_data)

				console.log(`Response received:\n${JSON.stringify(parks, null, 2)}`);
			} else if (res.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
		} catch (error) {
			console.log(`ERROR getting data: ${error}`);
		}
		return parks;
	}

	function collectToMapNaturalParks(array) {
		const res = new Map();

		for (let i = 0; i < array.length; i++) {
			const item = array[i];
			let name = item.autonomous_community;
			let parksSum = item.current_area;
			if (!res.has(name)) {
				res.set(name, parksSum);
			} else {
				let prevValue = res.get(name);
				res.set(name, prevValue + parksSum);
			}
		}
		// return Array.from(res);
		return res;
	}

	async function getData() {
		let res = [];
		let taxes_data = [];
		let parks_data = [];

		res = [
			['Lip gloss', 22998, 12043],
			['Eyeliner', 12321, 15067],
			['Eyeshadows', 12998, 12043],
			['Powder', 10261, 14419],
			['Mascara', 11261, 10419],
			['Foundation', 10342, 10119],
			['Rouge', 11624, 7004],
			['Lipstick', 8814, 9054],
			['Eyebrow pencil', 11012, 5067],
			['Nail polish', 9814, 3054]
		];

		taxes_data = await getTaxesData();
		parks_data = await getNaturalParksData();

		let sumTaxes = collectToMapTaxes(taxes_data);
		console.log(sumTaxes);

		let sumParks = collectToMapNaturalParks(parks_data);
		console.log(sumParks);

		// res = joinData(taxes_data, national_parks_data);
		res = joinData(sumTaxes, sumParks);
        console.log(res)
		return res;
	}

	function joinData(taxesMap, parksMap) {
		let res = [];

		taxesMap.forEach((val, key) => {
			if (parksMap.has(key)) {
				res.push([key, val, parksMap.get(key)]);
			}
		});

		return res;
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

			// create column chart
			var chart = anychart.column();

			// turn on chart animation
			chart.animation(true);

			// set chart title text settings
			chart.title('Comparación de impuestos IRPF y Área de parques naturales');

			// temp variable to store series instance
			var series;

			// helper function to setup label settings for all series
			var setupSeries = function (series, name) {
				series.name(name);
				series.selected().fill('#f48fb1 0.8').stroke('1.5 #c2185b');
			};

			// create first series with mapped data
			series = chart.column(firstSeriesData);
			series.xPointPosition(0.45);
			setupSeries(series, 'Impuestos IRPF');

			// create second series with mapped data
			series = chart.column(secondSeriesData);
			series.xPointPosition(0.25);
			setupSeries(series, 'Parques naturales');

			// set chart padding
			chart.barGroupsPadding(0.3);

			// format numbers in y axis label to match browser locale
			chart.yAxis().labels().format('{%Value}{groupsSeparator: }');

			// set titles for Y-axis
			// chart.yAxis().title('');

			// turn on legend
			chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);

			chart.interactivity().hoverMode('single');

			chart.tooltip().format('{%Value}{groupsSeparator: }');

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
