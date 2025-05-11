<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	let API = '/api/v1/emigration-stats';

	if (dev) {
		API = DEVEL_HOST + API;
	}

	let emigration_data = [];
	// @ts-ignore
	let groupedData = [];
	async function getEmigrationData() {
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			let res = await fetch(API, { method: 'GET' });
			console.log(res);
			if (res.status === 200) {
				emigration_data = await res.json();
				console.log(emigration_data);
				// @ts-ignore
				emigration_data.forEach((entry) => {
					if (entry.year !== 2021) return;
					const comunidad = entry.autonomic_community;
					const totalEntry =
						entry.between_20_24_yo + entry.between_25_29_yo + entry.between_30_34_yo;

					// @ts-ignore
					const existing = groupedData.find((item) => item.autonomic_community === comunidad);

					if (existing) {
						existing.total += totalEntry;
					} else {
						groupedData.push({ country: comunidad, visits: totalEntry });
					}
				});
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
	}

	// @ts-ignore
	console.log(groupedData);

	onMount(async () => {
		await getEmigrationData();
		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		// @ts-ignore
		var root = am5.Root.new('chartdiv');

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			// @ts-ignore
			am5themes_Animated.new(root)
		]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		// @ts-ignore
		var chart = root.container.children.push(
			// @ts-ignore
			am5xy.XYChart.new(root, {
				title: 'Personas que han emigrado de España en el año 2021 de entre 20 y 34 años',
				panX: false,
				panY: false,
				wheelX: 'panX',
				wheelY: 'zoomX',
				paddingLeft: 0,
				layout: root.verticalLayout
			})
		);

		// Data
		// @ts-ignore
		var data = groupedData;

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		// @ts-ignore
		var xRenderer = am5xy.AxisRendererX.new(root, {
			minGridDistance: 30,
			minorGridEnabled: true
		});

		// @ts-ignore
		var xAxis = chart.xAxes.push(
			// @ts-ignore
			am5xy.CategoryAxis.new(root, {
				categoryField: 'country',
				renderer: xRenderer,
				// @ts-ignore
				// @ts-ignore
				bullet: function (root, axis, dataItem) {
					// @ts-ignore
					return am5xy.AxisBullet.new(root, {
						location: 0.5,
						// @ts-ignore
						sprite: am5.Picture.new(root, {
							width: 24,
							height: 24,
							// @ts-ignore
							centerY: am5.p50,
							// @ts-ignore
							centerX: am5.p50,
							src: dataItem.dataContext.icon
						})
					});
				}
			})
		);

		xRenderer.grid.template.setAll({
			location: 1
		});

		xRenderer.labels.template.setAll({
			paddingTop: 20
		});

		xAxis.data.setAll(data);

		// @ts-ignore
		var yAxis = chart.yAxes.push(
			// @ts-ignore
			am5xy.ValueAxis.new(root, {
				// @ts-ignore
				renderer: am5xy.AxisRendererY.new(root, {
					strokeOpacity: 0.1
				})
			})
		);

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		// @ts-ignore
		var series = chart.series.push(
			// @ts-ignore
			am5xy.ColumnSeries.new(root, {
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'visits',
				categoryXField: 'country'
			})
		);

		series.columns.template.setAll({
			tooltipText: '{categoryX}: {valueY}',
			tooltipY: 0,
			strokeOpacity: 0,
			templateField: 'columnSettings'
		});

		series.data.setAll(data);

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear();
		chart.appear(1000, 100);
	});
</script>

<svelte:head>
	<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<h2>Personas que han emigrado de España en el año 2021 de entre 20 y 34 años</h2>
<div id="chartdiv"></div>
<p>
	Gráfico de barras que muestra el total de personas de entre 20 y 34 años que han emigrado de
	España en el año 2021.
</p>

<style>
	body {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
	}

	#chartdiv {
		width: 100%;
		height: 500px;
	}
</style>
