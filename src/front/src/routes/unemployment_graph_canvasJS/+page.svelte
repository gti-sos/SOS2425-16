<svelte:head>
  <script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</svelte:head>

<style>
    #chartContainer {
      height: 500px;
      width: 100%;
      margin-top: 20px;
    }
</style>

<script>
    import { onMount } from "svelte";
  
    let chart;
  
    onMount(async () => {
      try {
        const response = await fetch("http://localhost:16078/api/v1/unemployment-stats?year=2021&quarter=q4");
        const data = await response.json();
  
        // @ts-ignore
        const chartData = data.map(entry => ({
          y: entry.unemployment_rate,
          // @ts-ignore
          label: entry.autonomic_community.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        }));
  
        // @ts-ignore
        chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Tasa de Paro por Comunidad Autónoma (Q4 2021)",
            fontSize: 22
          },
          data: [{
            type: "doughnut",
            innerRadius: "60%",
            showInLegend: false,
            indexLabel: "{label}: {y}%",
            dataPoints: chartData
          }]
        });
  
        chart.render();
  
      } catch (error) {
        console.error("Error al cargar datos del API:", error);
      }
    });
  
</script>

<h2>Tasa de Paro por Comunidad Autónoma (Q4 2021)</h2>
<div id="chartContainer"></div>
<p>
  Esta gráfica muestra la tasa de paro (en %) en el cuarto trimestre de 2021 por comunidad autónoma.
</p>
