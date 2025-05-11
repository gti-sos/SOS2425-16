<svelte:head>
  <script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</svelte:head>

<style>
    #chartContainer {
      height: 370px;
      width: 100%;
    }
</style>

<script>
    import { onMount } from 'svelte';
  
    let chartData = [];
  
    onMount(async () => {
      try {
        // Petición a través del proxy
        const response = await fetch('http://localhost:16078/api/openweather/data/2.5/weather?lat=37.39&lon=-5.99&units=metric');
        const data = await response.json();
  
        // Transformamos los datos
        // @ts-ignore
        chartData = [
          { label: "Temperatura actual", y: data.main.temp },
          { label: "Máxima", y: data.main.temp_max },
          { label: "Mínima", y: data.main.temp_min }
        ];
  
        // Renderizamos el gráfico
        // @ts-ignore
        const chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Temperatura por hora (Sevilla)"
          },
          axisY: {
            title: "Temperatura (°C)"
          },
          data: [{
            type: "column",
            dataPoints: chartData
          }]
        });
  
        chart.render();
      } catch (err) {
        console.error("Error al cargar datos del tiempo:", err);
      }
    });
  </script>
  
<h2>Temperatura por hora - Sevilla</h2>
<div id="chartContainer"></div>
  