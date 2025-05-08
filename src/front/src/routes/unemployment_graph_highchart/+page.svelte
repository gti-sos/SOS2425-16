<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    let chart;

    onMount(async () => {
        const rawData = await fetch('http://localhost:16078/api/v1/unemployment-stats')
            .then(res => res.json());
        
        const formattedData = formatData(rawData);

        // @ts-ignore
        chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Evolución del paro por comunidad'
            },
            subtitle: {
                text: 'Porcentaje de desempleo en cada trimestre'
            },
            xAxis: {
                categories: formattedData.categories,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Tasa de desempleo (%)'
                }
            },
            tooltip: {
                split: true,
                valueSuffix: '%'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: formattedData.series
        });
    });

    // @ts-ignore
    function formatData(data) {
        // Ordenamos los datos por fecha
        // @ts-ignore
        data.sort((a, b) => {
            const keyA = `${a.year} ${a.quarter}`;
            const keyB = `${b.year} ${b.quarter}`;
            return keyA.localeCompare(keyB);
        });

        // Obtener lista única de fechas (xAxis)
        // @ts-ignore
        const categories = [...new Set(data.map(d => `${d.year} ${d.quarter}`))];

        // Agrupar por comunidad
        const seriesMap = {};
        // @ts-ignore
        data.forEach(d => {
            const key = d.autonomic_community;
            const timeLabel = `${d.year} ${d.quarter}`;
            // @ts-ignore
            if (!seriesMap[key]) {
                // @ts-ignore
                seriesMap[key] = {};
            }
            // @ts-ignore
            seriesMap[key][timeLabel] = d.unemployment_rate;
        });

        // Construir series para Highcharts
        const series = Object.entries(seriesMap).map(([community, values]) => {
            const dataPoints = categories.map(cat => values[cat] ?? null); // null para missing data, es bueno ponerlo
            return {
                name: community,
                data: dataPoints
            };
        });

        return { categories, series };
    }
</script>

<style>
    #container {
        height: 600px;
        max-width: 1000px;
        margin: 2rem auto;
    }

    .highcharts-description {
        text-align: center;
        font-size: 1rem;
        color: #555;
        margin-top: 1rem;
    }
</style>

<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Gráfico de área que muestra la evolución trimestral del desempleo por comunidad autónoma.
    </p>
</figure>
