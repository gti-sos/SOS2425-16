<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	let emigrationAPI = '/api/v1/emigration-stats';

	if (dev) {
		emigrationAPI = DEVEL_HOST + emigrationAPI;
	}
	
	const conumptionsAPI = 'https://sos2425-12.onrender.com/api/v1/annual-consumptions';

	let emigration_data = [];
	// @ts-ignore
	let consumptionData = [];

	// @ts-ignore
	let resultEmigration = [];
	// @ts-ignore
	let resultConsumptions = [];

	async function getEmigrationData() {
		try {
			await fetch(emigrationAPI + '/loadInitialData', { method: 'GET' });
			let res = await fetch(emigrationAPI, { method: 'GET' });
			console.log(res);
			if (res.status === 200) {
				emigration_data = await res.json();
				console.log(emigration_data);
				// @ts-ignore
				emigration_data.forEach((entry) => {
					if (entry.year !== 2020) return;
					const comunidad = entry.autonomic_community;
					const totalEntry =
						entry.between_20_24_yo + entry.between_25_29_yo + entry.between_30_34_yo;
					// @ts-ignore
					const existing = resultEmigration.find((item) => item.autonomic_community === comunidad);

					if (existing) {
						existing.total += totalEntry;
					} else {
						resultEmigration.push({
							name: comunidad,
							y: totalEntry
						});
					}
				});
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
	}

	// @ts-ignore
	console.log(
		// @ts-ignore
		resultEmigration.sort((a, b) => a.autonomic_community.localeCompare(b.autonomic_community))
	);

	async function getConsumptionData() {
		try {
			//await fetch(conumptionsAPI + '/loadInitialData', { method: 'GET' });
			let res = await fetch(conumptionsAPI, { method: 'GET' });
			console.log(res);
			if (res.status === 200) {
				consumptionData = await res.json();
				console.log(consumptionData);
				// @ts-ignore
				consumptionData.forEach((entry) => {
					if (entry.year !== 2020) return;
					const comunidad = entry.aacc;
					// @ts-ignore
					const existing = resultConsumptions.find((item) => item.aacc === comunidad);

					if (existing) {
						existing.total += entry.co2_emission;
					} else {
						resultConsumptions.push({ name: comunidad, y: entry.co2_emission });
					}
				});
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
	}

	// @ts-ignore
	console.log(resultConsumptions);
	// @ts-ignore
	console.log(resultConsumptions.sort((a, b) => a.name.localeCompare(b.name)).map(item => item.name));
	onMount(async () => {
		await getEmigrationData();
		await getConsumptionData();
		// @ts-ignore
		// Data retrieved from https://worldpopulationreview.com/countries
		Highcharts.chart('container', {
			chart: {
				type: 'lollipop'
			},

			accessibility: {
				point: {
					valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
				}
			},

			legend: {
				enabled: false
			},

			subtitle: {
				text: '2020'
			},

			title: {
				text: 'Comunidades Autónomas españolas por su consumo de CO2 y personas que emigran de ellas en el año 2020'
			},

			tooltip: {
				shared: true
			},

			xAxis: {
				type: 'category',
				// @ts-ignore
				categories: resultConsumptions.sort((a, b) => a.name.localeCompare(b.name)).map(item => item.name),
			},

			yAxis: {
				title: {
					text: 'Datos'
				}
			},

			series: [
				{
					name: 'Emigraciones',
					// @ts-ignore
					data: resultEmigration.map(item => item.y)
				},
				{
					name: 'Consumo de CO2',
					// @ts-ignore
					data: resultConsumptions.map(item => item.y)
				}
			]

		});
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/dumbbell.js"></script>
	<script src="https://code.highcharts.com/modules/lollipop.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<figure class="highcharts-figure">
	<div id="container"></div>
	<p class="highcharts-description">
		Gráfico de tipo piruleta que muestra las comunidades autónomas españolas por su consumo de CO2 y personas que emigran de ellas en el año 2020.
	</p>
</figure>

<style>
	.highcharts-figure,
	.highcharts-data-table table {
		min-width: 320px;
		max-width: 800px;
		margin: 1em auto;
	}

	.highcharts-data-table table {
		font-family: Verdana, sans-serif;
		border-collapse: collapse;
		border: 1px solid #ebebeb;
		margin: 10px auto;
		text-align: center;
		width: 100%;
		max-width: 500px;
	}

	.highcharts-data-table caption {
		padding: 1em 0;
		font-size: 1.2em;
		color: #555;
	}

	.highcharts-data-table th {
		font-weight: 600;
		padding: 0.5em;
	}

	.highcharts-data-table td,
	.highcharts-data-table th,
	.highcharts-data-table caption {
		padding: 0.5em;
	}

	.highcharts-data-table thead tr,
	.highcharts-data-table tbody tr:nth-child(even) {
		background: #f8f8f8;
	}

	.highcharts-data-table tr:hover {
		background: #f1f7ff;
	}

	.ld-label {
		width: 200px;
		display: inline-block;
	}

	.ld-url-input {
		width: 500px;
	}

	.ld-time-input {
		width: 40px;
	}

	.highcharts-description {
		margin: 0.3rem 10px;
	}
</style>
