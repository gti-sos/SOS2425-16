<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	let API = '/api/v1/emigration-stats';

	if (dev) {
		API = DEVEL_HOST + API;
	}
	let groupedData = {};
	let emigration_data = [];
	async function getEmigrationData() {
		// resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
            let res = await fetch(API, { method: 'GET' });
            console.log(res);
			if (res.status === 200) {
				emigration_data = await res.json();
                console.log(emigration_data);
				// @ts-ignore
				emigration_data.forEach(item => {
					let community = item.autonomic_community;
					let year = item.year;
					let total = item.between_20_24_yo + item.between_25_29_yo + item.between_30_34_yo;

					// @ts-ignore
					if (!groupedData[community]) {
						// @ts-ignore
						groupedData[community] = {};
					}

					// @ts-ignore
					if (!groupedData[community][year]) {
						// @ts-ignore
						groupedData[community][year] = 0;
					}

					// @ts-ignore
					groupedData[community][year] += total;
				});
			}
		} catch (error) {
			console.log(`ERROR getting data ${error}`);
		}
	}
    console.log(groupedData);

	onMount(async () => {
        await getEmigrationData();
		const startYear = 2019,
			endYear = 2021,
			btn = document.getElementById('play-pause-button'),
			input = document.getElementById('play-range'),
			nbr = 11;

		// @ts-ignore
		let dataset, chart;

		/*
		 * Animate dataLabels functionality
		 */
		(function (H) {
			const FLOAT = /^-?\d+\.?\d*$/;

			// Add animated textSetter, just like fill/strokeSetters
			H.Fx.prototype.textSetter = function () {
				const chart = H.charts[this.elem.renderer.chartIndex];

				let thousandsSep = chart.numberFormatter('1000.0')[1];

				if (/[0-9]/.test(thousandsSep)) {
					thousandsSep = ' ';
				}

				const replaceRegEx = new RegExp(thousandsSep, 'g');

				let startValue = this.start.replace(replaceRegEx, ''),
					endValue = this.end.replace(replaceRegEx, ''),
					currentValue = this.end.replace(replaceRegEx, '');

				if ((startValue || '').match(FLOAT)) {
					startValue = parseInt(startValue, 10);
					endValue = parseInt(endValue, 10);

					// No support for float
					currentValue = chart.numberFormatter(
						Math.round(startValue + (endValue - startValue) * this.pos),
						0
					);
				}

				this.elem.endText = this.end;

				this.elem.attr(this.prop, currentValue, null, true);
			};

			// Add textGetter, not supported at all at this moment:
			H.SVGElement.prototype.textGetter = function () {
				const ct = this.text.element.textContent || '';
				return this.endText ? this.endText : ct.substring(0, ct.length / 2);
			};

			// Temporary change label.attr() with label.animate():
			// In core it's simple change attr(...) => animate(...) for text prop
			// @ts-ignore
			H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
				const attr = H.SVGElement.prototype.attr,
					// @ts-ignore
					chart = this.chart;

				if (chart.sequenceTimer) {
					// @ts-ignore
					this.points.forEach((point) =>
						(point.dataLabels || []).forEach(
							// @ts-ignore
							(label) =>
								// @ts-ignore
								(label.attr = function (hash) {
									if (hash && hash.text !== undefined && chart.isResizing === 0) {
										const text = hash.text;

										delete hash.text;

										return this.attr(hash).animate({ text });
									}
									return attr.apply(this, arguments);
								})
						)
					);
				}

				const ret = proceed.apply(
					// @ts-ignore
					this,
					Array.prototype.slice.call(arguments, 1)
				);

				// @ts-ignore
				this.points.forEach((p) =>
					// @ts-ignore
					(p.dataLabels || []).forEach((d) => (d.attr = attr))
				);

				return ret;
			});
			// @ts-ignore
		})(Highcharts);

		// @ts-ignore
		function getData(year) {
			// @ts-ignore
			const output = Object.entries(dataset)
				.map((country) => {
					const [countryName, countryData] = country;
					return [countryName, Number(countryData[year])];
				})
				// @ts-ignore
				.sort((a, b) => b[1] - a[1]);
			return [output[0], output.slice(1, nbr)];
		}

		function getSubtitle() {
			// @ts-ignore
			const population = getData(input.value)[0][1];
			// @ts-ignore
			return `<span style="font-size: 80px">${input.value}</span>
        <br>
        <span style="font-size: 22px">
            Total: <b>: ${population}</b> miles
        </span>`;
		}

		(async () => {

			dataset = groupedData;
            console.log(dataset);

			// @ts-ignore
			chart = Highcharts.chart('container', {
				chart: {
					animation: {
						duration: 700
					},
					marginRight: 50
				},
				title: {
					text: 'Personas que emigran de España por comunidad',
					align: 'left'
				},
				subtitle: {
					text: getSubtitle(),
					floating: true,
					align: 'right',
					verticalAlign: 'middle',
					useHTML: true,
					y: -80,
					x: -100
				},

				legend: {
					enabled: false
				},
				xAxis: {
					type: 'category'
				},
				yAxis: {
					opposite: true,
					tickPixelInterval: 150,
					title: {
						text: null
					}
				},
				plotOptions: {
					series: {
						animation: false,
						groupPadding: 0,
						pointPadding: 0.1,
						borderWidth: 0,
						colorByPoint: true,
						dataSorting: {
							enabled: true,
							matchByName: true
						},
						type: 'bar',
						dataLabels: {
							enabled: true
						}
					}
				},
				series: [
					{
						type: 'bar',
						name: startYear,
						data: getData(startYear)[1]
					}
				],
				responsive: {
					rules: [
						{
							condition: {
								maxWidth: 550
							},
							chartOptions: {
								xAxis: {
									visible: false
								},
								subtitle: {
									x: 0
								},
								plotOptions: {
									series: {
										dataLabels: [
											{
												enabled: true,
												y: 8
											},
											{
												enabled: true,
												format: '{point.name}',
												y: -8,
												style: {
													fontWeight: 'normal',
													opacity: 0.7
												}
											}
										]
									}
								}
							}
						}
					]
				}
			});
		})();

		/*
		 * Pause the timeline, either when the range is ended, or when clicking the
		 * pause button. Pausing stops the timer and resets the button to play mode.
		 */
		// @ts-ignore
		function pause(button) {
			button.title = 'play';
			button.className = 'fa fa-play';
			// @ts-ignore
			clearTimeout(chart.sequenceTimer);
			// @ts-ignore
			chart.sequenceTimer = undefined;
		}

		/*
		 * Update the chart. This happens either on updating (moving) the range input,
		 * or from a timer when the timeline is playing.
		 */
		// @ts-ignore
		function update(increment) {
			if (increment) {
				// @ts-ignore
				input.value = parseInt(input.value, 10) + increment;
			}
			// @ts-ignore
			if (input.value >= endYear) {
				// Auto-pause
				pause(btn);
			}

			// @ts-ignore
			chart.update(
				{
					subtitle: {
						text: getSubtitle()
					}
				},
				false,
				false,
				false
			);

			// @ts-ignore
			chart.series[0].update({
				// @ts-ignore
				name: input.value,
				// @ts-ignore
				data: getData(input.value)[1]
			});
		}

		/*
		 * Play the timeline.
		 */
		// @ts-ignore
		function play(button) {
			button.title = 'pause';
			button.className = 'fa fa-pause';
			// @ts-ignore
			chart.sequenceTimer = setInterval(function () {
				update(1);
			}, 500);
		}

		// @ts-ignore
		btn.addEventListener('click', function () {
			// @ts-ignore
			if (chart.sequenceTimer) {
				pause(this);
			} else {
				play(this);
			}
		});
		/*
		 * Trigger the update on the range bar click.
		 */
		// @ts-ignore
		input.addEventListener('click', function () {
			update();
		});
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<figure class="highcharts-figure">
	<div id="parent-container">
		<div id="play-controls">
			<button id="play-pause-button" class="fa fa-play" title="play"></button>
			<input id="play-range" type="range" value="2019" min="2019" max="2021" />
		</div>
		<div id="container"></div>
	</div>
	<p class="highcharts-description">
		Gráfico de barras que muestra la evolución en la emigración de España desde 2019 a 2021.
	</p>
</figure>

<style>
	@import url('https://netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');

	.highcharts-figure {
		margin: 0;
	}

	#play-controls {
		max-width: 1000px;
		margin: 1em auto;
	}

	#container {
		height: 900px;
		max-width: 1000px;
		margin: 0 auto;
	}

	#play-pause-button {
		margin-left: 10px;
		width: 50px;
		height: 50px;
		cursor: pointer;
		border: 1px solid rgba(2, 117, 255, 1);
		border-radius: 25px;
		color: white;
		background-color: rgba(2, 117, 255, 1);
		transition: background-color 250ms;
	}

	#play-pause-button:hover {
		background-color: rgba(2, 117, 255, 0.5);
	}

	#play-range {
		transform: translateY(2.5px);
		width: calc(100% - 90px);
		background: #f8f8f8;
	}

	.highcharts-description {
		margin: 0.3rem 10px;
	}
</style>
