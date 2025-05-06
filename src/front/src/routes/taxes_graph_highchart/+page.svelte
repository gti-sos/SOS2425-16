<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API = '/api/v1/taxes-stats';

	if (dev) {
		API = DEVEL_HOST + API;
	}

	let taxes_data = [];

	async function getData() {
		// resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res = await fetch(API, { method: 'GET' });

			if (res.status === 200) {
				taxes_data = await res.json();
				// console.log(taxes_data)

				const sum_taxes = taxes_data.reduce(
					(accumulator, currentValue) => accumulator + currentValue.atr_irpf + currentValue.atr_iva + currentValue.atr_soc_no_consolidadas,
					0
				);
				console.log(sum_taxes);

				taxes_data = taxes_data.map((item) => ({
					name: item.autonomic_community,
					y: (item.atr_irpf + item.atr_iva + item.atr_soc_no_consolidadas)/sum_taxes * 100
				}));

				console.log(`Response received:\n${JSON.stringify(taxes_data, null, 2)}`);
			}
		} catch (error) {
			console.log(`ERROR getting data from ${API}: ${error}`);
		}
	}

	onMount(async () => {
		await getData();
		Highcharts.chart('container', {
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
				text: 'Egg Yolk Composition'
			},
			tooltip: {
				valueSuffix: '%'
			},
			subtitle: {
				text: 'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
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

<figure class="highcharts-figure">
	<div id="container"></div>
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

	input[type='number'] {
		min-width: 50px;
	}

	.highcharts-description {
		margin: 0.3rem 10px;
	}
</style>
