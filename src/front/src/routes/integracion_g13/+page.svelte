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

        let categories = res.map(item => item[0]);
        sumTaxes = res.map(item => item[1]);
        sumParks = res.map(item => item[2]);
        res = [categories, sumTaxes, sumParks]
		console.log(res);
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

		var options = {
			series: [
				{
					name: 'Parques naturales',
					data: graphData[1]
				},
				{
					name: 'Impuestos IRPF',
					data: graphData[2]
				},
			],
			chart: {
				type: 'bar',
				height: 350
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					borderRadius: 5,
					borderRadiusApplication: 'end'
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: graphData[0]
			},
			yaxis: {
				title: {
					text: ''
				}
			},
			fill: {
				opacity: 1
			},
			tooltip: {
				y: {
					formatter: function (val) {
						return val;
					}
				}
			}
		};

		var chart = new ApexCharts(document.querySelector('#chart'), options);
		chart.render();
	});
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<div id="chart"></div>
