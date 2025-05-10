<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
	<script src="https://code.highcharts.com/modules/cylinder.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

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

<script>
	import { onMount } from 'svelte';
	onMount(async () => {
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
				text: 'Número de accidentes por comunidad en los últimos dos años'
			},
			subtitle: {
				text:
					'Fuente: ' +
					'<a href="https://sos2425-20.onrender.com/api/v1/traffic-accidents"' +
					'target="_blank">API Grupo 20</a>'
			},
			xAxis: {
				categories: [
					'La Rioja',
					'Extremadura',
					'Cataluña',
					'Comunidad Valenciana',
					'Ceuta y Melilla',
					'Galicia',
					'Castilla La Mancha',
					'Andalucía',
					'País Vasco',
					'Navarra',
                    'Asturias',
                    'Castilla y León',
                    'Aragón',
                    'Canarias',
                    'Murcia',
                    'Cantabria',
                    'Madrid',
                    'Baleares',
				],
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
					text: 'Fallecidos'
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
					data: [24, 111, 552, 329, 6, 251, 220, 643, 111, 54, 83, 346, 155, 137, 121, 45, 262, 102],
					name: 'Fallecidos',
					showInLegend: false
				},
				{
					data: [424, 10794 , 18171 , 12113 , 621, 1503 , 1536 , 8167 , 1115, 5459 , 1153, 8279, 1552, 10687, 2311, 4512, 13164 , 1029],
					name: 'Emigraciones totales de personas entre 20 y 24 años ',
					showInLegend: false
				}
			]
		});
	});
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Gráfico que muestra las comunidades con más fallecidos por accidentes en carretera.
    </p>
</figure>
