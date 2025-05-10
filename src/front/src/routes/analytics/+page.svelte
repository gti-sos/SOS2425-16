<script>
	// @ts-nocheck
	// @ts-ignore

	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let DEVEL_HOST = 'http://localhost:16078';
	let API_TAXES = '/api/v1/taxes-stats';
	let API_EMIGRATION = '/api/v1/emigration-stats';
	let API_UNEMPLOYMENT = '/api/v1/unemployment-stats';

	let resultStatus,
		resultMessage = '';

	if (dev) {
		API_TAXES = DEVEL_HOST + API_TAXES;
		API_UNEMPLOYMENT = DEVEL_HOST + API_UNEMPLOYMENT;
		API_EMIGRATION = DEVEL_HOST + API_EMIGRATION;
	}

	async function getTaxesData() {
        let sum_taxes = 0;
		try {
			await fetch(API_TAXES + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res_taxes = await fetch(API_TAXES, { method: 'GET' });


			if (res_taxes.status === 200) {
				const taxes_data = await res_taxes.json();
				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(taxes_data)

				sum_taxes = taxes_data.reduce(
					(accumulator, currentValue) =>
						accumulator +
						currentValue.atr_irpf +
						currentValue.atr_iva +
						currentValue.atr_soc_no_consolidadas,
					0
				);

				console.log(`Response received:\n${JSON.stringify(taxes_data, null, 2)}`);
			} else if (res_taxes.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
        return sum_taxes;
	}


	async function getEmigrationData() {
        let sum_emigration = 0;
		try {
			await fetch(API_EMIGRATION + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res_emigration = await fetch(API_EMIGRATION, { method: 'GET' });


			if (res_emigration.status === 200) {
				const emigration_data = await res_emigration.json();
				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(emigration_data)

				sum_emigration = emigration_data.reduce(
					(accumulator, currentValue) =>
						accumulator +
						currentValue.between_20_24_yo +
						currentValue.between_25_29_yo +
						currentValue.between_30_34_yo,
					0
				);

				console.log(`Response received:\n${JSON.stringify(emigration_data, null, 2)}`);
			} else if (res_emigration.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
        return sum_emigration;
	}


	async function getUnemploymentData() {
        let sum_unemployment = 0;
		try {
			await fetch(API_UNEMPLOYMENT + '/loadInitialData', { method: 'GET' });
			// const data = await res.json();
			const res_unemployment = await fetch(API_UNEMPLOYMENT, { method: 'GET' });


			if (res_unemployment.status === 200) {
				const unemployment_data = await res_unemployment.json();
				resultMessage = `Gráfica mostrada`;
				resultStatus = 'success';
				// console.log(unemployment_data)

				sum_unemployment = unemployment_data.reduce(
					(accumulator, currentValue) =>
						accumulator +
						currentValue.unemployment_rate +
						currentValue.previous_quarter_var +
						currentValue.previous_year_quarter_var,
					0
				);

				console.log(`Response received:\n${JSON.stringify(unemployment_data, null, 2)}`);
			} else if (res_unemployment.status === 404) {
				resultStatus = 'warning';
				resultMessage = `No se encontraron datos`;
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
        return sum_unemployment;
	}

	async function getData() {
		let res = [];

        let res_taxes = await getTaxesData();
        console.log(res_taxes)

        let res_emigration = await getEmigrationData();
        console.log(res_emigration)

        let res_unemployment = await getUnemploymentData();
        console.log(res_unemployment)

        res = [
            ['Impuestos (Escala 1:10000)', res_taxes/10000],
            ['Emigración', res_emigration],
            ['Desempleo (Escala 1:100)', res_unemployment*100]
        ]
		// try {
		// 	await fetch(API_TAXES + '/loadInitialData', { method: 'GET' });
		// 	await fetch(API_EMIGRATION + '/loadInitialData', { method: 'GET' });
		// 	await fetch(API_UNEMPLOYMENT + '/loadInitialData', { method: 'GET' });
		// 	// const data = await res.json();
		// 	const res_taxes = await fetch(API_TAXES, { method: 'GET' });
		// 	const res_emigration = await fetch(API_EMIGRATION, { method: 'GET' });
		// 	const res_unemployment = await fetch(API_UNEMPLOYMENT, { method: 'GET' });
		//
		// 	let sum_taxes = 0;
		//
		// 	if (res_taxes.status === 200) {
		// 		const taxes_data = await res_taxes.json();
		// 		resultMessage = `Gráfica mostrada`;
		// 		resultStatus = 'success';
		// 		// console.log(taxes_data)
		//
		// 		sum_taxes = taxes_data.reduce(
		// 			(accumulator, currentValue) =>
		// 				accumulator +
		// 				currentValue.atr_irpf +
		// 				currentValue.atr_iva +
		// 				currentValue.atr_soc_no_consolidadas,
		// 			0
		// 		);
		//
		// 		console.log(`Response received:\n${JSON.stringify(taxes_data, null, 2)}`);
		// 	} else if (res_taxes.status === 404) {
		// 		resultStatus = 'warning';
		// 		resultMessage = `No se encontraron datos del año ${graphYear}`;
		// 	} else {
		// 		resultStatus = 'warning';
		// 		resultMessage = 'No se pudo acceder a los datos';
		// 	}
		// } catch (error) {
		// 	console.log(`ERROR getting data ${error}`);
		// }

        console.log(res);

		return res;
	}

	onMount(async () => {

        let graphData = await getData();
		// Set up the chart
		Highcharts.chart('container', {
			chart: {
				type: 'pyramid3d',
				options3d: {
					enabled: true,
					alpha: 10,
					depth: 50,
					viewDistance: 50
				}
			},
			title: {
				text: 'Highcharts Pyramid3D Chart'
			},
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b> ({point.y:,.0f})',
						allowOverlap: true,
						x: 10,
						y: -5
					},
					width: '60%',
					height: '80%',
					center: ['50%', '45%']
				}
			},
			series: [{
					name: 'Unique users',
					data: graphData
				}
			]
		});
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
	<script src="https://code.highcharts.com/modules/cylinder.js"></script>
	<script src="https://code.highcharts.com/modules/funnel3d.js"></script>
	<script src="https://code.highcharts.com/modules/pyramid3d.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<figure class="highcharts-figure">
	<div id="container"></div>
	<p class="highcharts-description">
		Highcharts supports drawing pyramid charts in 3D as well as 2D. While the 2D version is
		typically easier to read, the 3D version is sometimes used for decorative effect.
	</p>
</figure>

<style>
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
