<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	let emigrationAPI = '/api/v1/emigration-stats';

	if (dev) {
		emigrationAPI = DEVEL_HOST + emigrationAPI;
	}
	const trafficAPI = 'https://sos2425-20.onrender.com/api/v1/traffic-accidents';

	let emigration_data = [];
	// @ts-ignore
	let trafficData = [];

	// @ts-ignore
	let resultEmigration = [];
	// @ts-ignore
	let resultTraffic = [];

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
					if (entry.year !== 2021) return;
					const comunidad = entry.autonomic_community;
					// @ts-ignore
					const existing = resultEmigration.find((item) => item.autonomic_community === comunidad);

					if (existing) {
						existing.total += entry.between_20_24_yo;
					} else {
						resultEmigration.push({ autonomic_community: comunidad, total: entry.between_20_24_yo });
					}
				});
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
	}

	// @ts-ignore
	console.log(resultEmigration.sort((a, b) => a.autonomic_community.localeCompare(b.autonomic_community)));

	async function getTrafficData() {
		try {
			await fetch(trafficAPI + '/loadInitialData', { method: 'GET' });
			let res = await fetch(trafficAPI, { method: 'GET' });
			console.log(res);
			if (res.status === 200) {
				trafficData = await res.json();
				console.log(trafficData);
				// @ts-ignore
				trafficData.forEach((entry) => {
					if (entry.year !== 2022) return;
					const comunidad = entry.autonomous_community;
					// @ts-ignore
					const existing = resultTraffic.find((item) => item.autonomous_community === comunidad);

					if (existing) {
						existing.total += entry.deceased;
					} else {
						resultTraffic.push({ autonomous_community: comunidad, total: entry.deceased });
					}
				});
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
	}

	// @ts-ignore
	console.log(resultTraffic);

	onMount(async () => {
		await getEmigrationData();
		await getTrafficData();
		// @ts-ignore
		Highcharts.chart('container', {
			chart: {
				type: 'cylinder',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					depth: 50,
					viewDistance: 25
				}
			},
			title: {
				text: 'Número de accidentes por comunidad y personas que emigran de entre 20 y 24 años en el año 2022'
			},
			subtitle: {
				text:
					'Fuente: ' +
					'<a href="https://sos2425-20.onrender.com/api/v1/traffic-accidents"' +
					'target="_blank">API Grupo 20</a>'
			},
			xAxis: {
				// @ts-ignore
				categories: resultTraffic.sort((a, b) => a.autonomous_community.localeCompare(b.autonomous_community)).map(item => item.autonomous_community),
				title: {
					text: 'Comunidades'
				},
				labels: {
					skew3d: true
				}
			},
			yAxis: {
				title: {
					margin: 20,
					text: 'Fallecidos y emigrantes'
				},
				labels: {
					skew3d: true
				}
			},
			tooltip: {
				headerFormat: '<b> {category}</b><br>'
			},
			plotOptions: {
				series: {
					depth: 25,
					colorByPoint: true
				}
			},
			series: [
				{
					// @ts-ignore
					data: resultTraffic.map(item => item.total),
					name: 'Fallecidos',
					showInLegend: false
				},
				{
					// @ts-ignore
					data: resultEmigration.map(item => item.total),
					name: 'Emigraciones totales de personas entre 20 y 24 años ',
					showInLegend: false
				}
			]
		});
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
	<script src="https://code.highcharts.com/modules/cylinder.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<figure class="highcharts-figure">
	<div id="container"></div>
	<p class="highcharts-description">
		Gráfico que muestra las comunidades con más fallecidos por accidentes en carretera y personas
		que emigran de entre 20 y 24 años de dichas comunidades para el año 2022.
	</p>
</figure>

<style>
	#container {
		height: 400px;
	}

	.highcharts-figure,
	.highcharts-data-table table {
		min-width: 310px;
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

	.highcharts-description {
		margin: 0.3rem 10px;
	}
</style>
