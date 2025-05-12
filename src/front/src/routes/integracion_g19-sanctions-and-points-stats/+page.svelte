<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16078";
    let unemploymentAPI = "/api/v1/unemployment-stats";
    if(dev){
        unemploymentAPI = DEVEL_HOST + unemploymentAPI;
    }

    //const unemploymentAPI = 'http://localhost:16078/api/v1/unemployment-stats';
    const sanctionsAPI = 'https://sos2425-19.onrender.com/api/v1/sanctions-and-points-stats';
    
    // @ts-ignore
    function normalize(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ñ/g, "n")
            .replace(/\s+/g, "-");
    }

    onMount(async () => {
        try {
            const unemploymentRes = await fetch(unemploymentAPI);
            const sanctionsRes = await fetch(sanctionsAPI);

            const unemploymentData = await unemploymentRes.json();
            const sanctionsData = await sanctionsRes.json();

            const communities = [
                'andalucia', 'aragon', 'canarias', 'cantabria', 
                'castilla-la-mancha', 'castilla-y-leon', 'cataluna', 'ceuta', 
                'extremadura', 'galicia'
            ];
            const capitals = {
                'andalucia': 'sevilla',
                'aragon': 'zaragoza',
                'canarias': 'santa-cruz-de-tenerife', 
                'cantabria': 'cantabria',
                'castilla-la-mancha': 'toledo',
                'castilla-y-leon': 'valladolid',
                'cataluna': 'barcelona',
                'ceuta': 'ceuta',
                'extremadura': 'badajoz',
                'galicia': 'coruna-(a)'
            };
            // @ts-ignore
            const unemploymentRates = [];
            // @ts-ignore
            const sanctionsPoints = [];

            communities.forEach(community => {
                const unemploymentEntry = unemploymentData.find(
                    // @ts-ignore
                    e => normalize(e.autonomic_community) === community &&
                         e.year === 2021 && e.quarter === 'q4'
                );
        
               const sanctionsEntries = sanctionsData.filter(
                    // @ts-ignore
                    e => normalize(e.autonomous_community) === community && normalize(e.province) === capitals[community]
                );
                // @ts-ignore
                const sanctionsEntry = sanctionsEntries.reduce((minEntry, current) => {
                    if (!minEntry || current.ine_code < minEntry.ine_code) {
                        return current;
                    }
                    return minEntry;
                }, null);

                unemploymentRates.push(unemploymentEntry ? unemploymentEntry.unemployment_rate : 0);
                sanctionsPoints.push(sanctionsEntry ? sanctionsEntry.total_sanctions_with_points : 0);
            });
            //Maquillamos el formato para la gráfica
            const labels = communities.map(c => 
                c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')
            );

            const chartConfig = {
                type: 'hbar',
                title: {
                    text: 'Unemployment Rate (2021 Q4) vs Sanctions with Points (2022)',
                    fontSize: 24
                },
                scaleX: {
                    labels: labels
                },
                series: [
                    {
                        // @ts-ignore
                        values: unemploymentRates,
                        text: 'Unemployment Rate (%)',
                        backgroundColor: '#36A2EB'
                    },
                    {
                        // @ts-ignore
                        values: sanctionsPoints,
                        text: 'Sanctions with Points',
                        backgroundColor: '#FF6384'
                    }
                ]
            };
            // @ts-ignore
            zingchart.render({
                id: 'comparisonChart',
                data: chartConfig,
                height: 600,
                width: '70%'
            });

        } catch (error) {
            console.error('Error loading or rendering data:', error);
        }
    });
</script>

<h2>Comparativa de Paro y el primer registro de sanción en cada CCAA en su capital</h2>
<div id="comparisonChart"></div>
