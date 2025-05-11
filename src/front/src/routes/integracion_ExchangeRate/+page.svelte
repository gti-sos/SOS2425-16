<svelte:head>
  <script src="https://cdn.canvasjs.com/canvasjs.stock.min.js"></script>
</svelte:head>

<style>
    #chartContainer {
      height: 500px;
      width: 100%;
    }
</style>
<script>
    import { onMount } from 'svelte';
  
    let chart;
  
    // Metemos los quarters como el ultimo dia de cada trimestre
    const quarters = [
      { label: "Q1 2021", date: "2021-03-31" },
      { label: "Q2 2021", date: "2021-06-30" },
      { label: "Q3 2021", date: "2021-09-30" },
      { label: "Q4 2021", date: "2021-12-31" }
    ];
    // @ts-ignore
    let chartData = [];
  
    async function fetchRates() {
      const responses = await Promise.all(
        quarters.map(q =>
          fetch(`https://api.frankfurter.app/${q.date}?from=EUR&to=USD,GBP,CHF`)
            .then(res => res.json())
            .then(data => ({ label: q.label, rates: data.rates }))
        )
      );
  
      // Generamos 3 series para USD, GBP y CHF
      const usdSeries = {
        type: "candlestick",
        name: "USD",
        showInLegend: true,
        dataPoints: responses.map((r, i) => ({
          label: r.label,
          y: [
            r.rates.USD * (1 - 0.01), // open
            r.rates.USD * (1 + 0.01), // high
            r.rates.USD * (1 - 0.02), // low
            r.rates.USD               // close
          ]
        }))
      };
  
      const gbpSeries = {
        type: "candlestick",
        name: "GBP",
        showInLegend: true,
        dataPoints: responses.map((r, i) => ({
          label: r.label,
          y: [
            r.rates.GBP * (1 - 0.01),
            r.rates.GBP * (1 + 0.01),
            r.rates.GBP * (1 - 0.02),
            r.rates.GBP
          ]
        }))
      };
  
      const chfSeries = {
        type: "candlestick",
        name: "CHF",
        showInLegend: true,
        dataPoints: responses.map((r, i) => ({
          label: r.label,
          y: [
            r.rates.CHF * (1 - 0.01),
            r.rates.CHF * (1 + 0.01),
            r.rates.CHF * (1 - 0.02),
            r.rates.CHF
          ]
        }))
      };
  
      chartData = [usdSeries, gbpSeries, chfSeries];
    }
  
    onMount(async () => {
      await fetchRates();
      // @ts-ignore
      chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Tasas de cambio por trimestre (2021) - EUR vs USD, GBP, CHF"
        },
        axisY: {
          title: "Tasa de cambio",
          prefix: "€"
        },
        axisX: {
          title: "Trimestre"
        },
        // @ts-ignore
        data: chartData
      });
  
      chart.render();
    });
  </script>

<h2>Velas financieras (EUR vs otras monedas) - 2021</h2>
<div id="chartContainer"></div>
