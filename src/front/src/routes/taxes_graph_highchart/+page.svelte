<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Alert, Button } from '@sveltestrap/sveltestrap';

	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API = '/api/v1/taxes-stats';

	if (dev) {
		API = DEVEL_HOST + API;
	}

	let taxes_data = [];
	let graphYear = 2021;
	let chart;
	let resultStatus,
		resultMessage = '';

	async function updateGraphData() {
		await getData();
		chart.series[0].setData(taxes_data);
	}

	async function getData() {
		// resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res = await fetch(API + '?year=' + graphYear, { method: 'GET' });

			if (res.status === 200) {
				taxes_data = await res.json();
				resultMessage = `Gráfica del año ${graphYear}`;
				resultStatus = 'success';
				// console.log(taxes_data)

				const sum_taxes = taxes_data.reduce(
					(accumulator, currentValue) =>
						accumulator +
						currentValue.atr_irpf +
						currentValue.atr_iva +
						currentValue.atr_soc_no_consolidadas,
					0
				);

				taxes_data = taxes_data.map((item) => ({
					name: item.autonomic_community,
					y: ((item.atr_irpf + item.atr_iva + item.atr_soc_no_consolidadas) / sum_taxes) * 100
				}));


				console.log(`Response received:\n${JSON.stringify(taxes_data, null, 2)}`);
			} else if (res.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos del año ${graphYear}`;
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
		chart = Highcharts.chart('container', {
			chart: {
				type: 'pie',
				zooming: {
					type: 'xy'
				},
				panning: {
					enabled: true,
					type: 'xy'
				},
				panKey: 'shift'
			},
			title: {
				text: 'Porcentaje de impuestos en España por comunidad autónoma'
			},
			tooltip: {
				valueSuffix: '%'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: [
						{
							enabled: true,
							distance: 20
						},
						{
							enabled: true,
							distance: -40,
							format: '{point.percentage:.1f}%',
							style: {
								fontSize: '1.2em',
								textOutline: 'none',
								opacity: 0.7
							},
							filter: {
								operator: '>',
								property: 'percentage',
								value: 10
							}
						}
					]
				}
			},
			series: [
				{
					name: 'Percentage',
					colorByPoint: true,
					data: taxes_data
				}
			]
		});
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/non-cartesian-zoom.js"></script>
	<script src="https://code.highcharts.com/modules/mouse-wheel-zoom.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

{#if resultMessage}
	<Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

<figure class="highcharts-figure">
	<div id="container"></div>
</figure>

<label for="graphYear">Año de gráfica</label>
<input type="number" min="0" bind:value={graphYear} />
<Button on:click={updateGraphData}>Mostrar año</Button>

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

	input[type='number'] {
		min-width: 50px;
	}

	.highcharts-description {
		margin: 0.3rem 10px;
	}
</style>
