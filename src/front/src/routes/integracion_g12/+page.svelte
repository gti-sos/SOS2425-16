

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
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
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45
				}
			},
			title: {
				text: 'Emisiones de CO2 por comunidad'
			},
			subtitle: {
				text: ''
			},
			plotOptions: {
				pie: {
					innerSize: 100,
					depth: 45
				}
			},
			series: [
				{
					name: 'Emisión de CO2',
					data: [
						['Andalucía', 55873],
						['Asturias', 146676],
						['Baleares', 80802],
						['Canarias', 86531],
						['Cantabria', 90147],
						['Castilla La Mancha', 155524],
						['Castilla Y León', 154753],
						['Cataluña', 114869],
						['Ceuta', 143410],
                        ['Valencia', 129126],
                        ['Extremadura', 159870],
                        ['Galicia', 132272],
                        ['Madrid', 216853],
                        ['Melilla', 111276],
                        ['Murcia', 131549],
                        ['Navarra', 143969],
                        ['País Vasco', 99789],
					]
				}
			]
		});
	});
</script>

<figure class="highcharts-figure">
	<div id="container"></div>
	<p class="highcharts-description">
		
	</p>
</figure>

