<svelte:head>
  <script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</svelte:head>

<style>
  #chartContainer {
    height: 420px;
    width: 100%;
  }
</style>

<script>
  import { onMount } from 'svelte';

  let chart;

  const provincesOfInterest = [
    "Andalusia", "Aragon", "Asturias", "Canarias", "Cantabria",
    "Castilla - La Mancha", "Castilla y Leon", "Catalonia", "Ceuta",
    "Madrid", "Extremadura", "Galicia", "Baleares"
  ];

  const fetchCovidData = async () => {
    const response = await fetch('https://covid-api.com/api/reports?iso=ESP');
    const result = await response.json();
    // @ts-ignore
    const filteredData = result.data.filter(entry =>
      provincesOfInterest.includes(entry.region.province)
    );
    // @ts-ignore
    const confirmedData = [];
    // @ts-ignore
    const deathsData = [];
    // @ts-ignore
    const activeData = [];
    // @ts-ignore
    filteredData.forEach(entry => {
      const province = entry.region.province;
      confirmedData.push({ label: province, y: entry.confirmed });
      deathsData.push({ label: province, y: entry.deaths });
      activeData.push({ label: province, y: entry.active });
    });
    // @ts-ignore
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "COVID-19 en España por comunidad autónoma"
      },
      axisY: {
        title: "Número de casos"
      },
      legend: {
        cursor: "pointer"
      },
      data: [
        {
          type: "area",
          name: "Confirmados",
          showInLegend: true,
          // @ts-ignore
          dataPoints: confirmedData
        },
        {
          type: "area",
          name: "Muertes",
          showInLegend: true,
          // @ts-ignore
          dataPoints: deathsData
        },
        {
          type: "area",
          name: "Activos",
          showInLegend: true,
          // @ts-ignore
          dataPoints: activeData
        }
      ]
    });

    chart.render();
  };

  onMount(fetchCovidData);
</script>

<h2>Comparativa de COVID-19 por comunidad autónoma (última actualización)</h2>
<div id="chartContainer"></div>
