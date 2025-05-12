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
    const ownershipAPI = 'https://sos2425-19.onrender.com/api/v2/ownerships-changes-stats';

    // Esta funcion es para poner en el mismo formato las CCAAs
    // @ts-ignore
    function normalize(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
            .replace(/\s+/g, "-")            // Espacios por guiones
            .replace(/ñ/g, "n");              // Sustituir ñ por n
    }

    const communities = [
        'andalucia', 'aragon', 'asturias', 'canarias', 'cantabria', 
        'castilla-la-mancha', 'castilla-y-leon', 'cataluna', 'ceuta', 
        'comunidad-de-madrid', 'extremadura', 'galicia'
    ];

    // Capitales de las CCAAs
    const capitals = {
        'andalucia': 'Sevilla',
        'aragon': 'Zaragoza',
        'asturias': 'Asturias',
        'canarias': 'Santa Cruz de Tenerife',
        'cantabria': 'Cantabria',
        'castilla-la-mancha': 'Toledo',
        'castilla-y-leon': 'Valladolid',
        'cataluna': 'Barcelona',
        'ceuta': 'Ceuta',
        'comunidad-de-madrid': 'Madrid',
        'extremadura': 'Badajoz',
        'galicia': 'Pontevedra',
    };

    onMount(async () => {
        try {
            const unemploymentRes = await fetch(unemploymentAPI);
            const ownershipRes = await fetch(ownershipAPI);

            const unemploymentData = await unemploymentRes.json();
            const ownershipData = await ownershipRes.json();
            // @ts-ignore
            const unemploymentRates = [];
            // @ts-ignore
            const busOwnershipChanges = [];

            communities.forEach(community => {
                const unemploymentEntry = unemploymentData.find(
                    // @ts-ignore
                    e => normalize(e.autonomic_community) === community &&
                         e.year === 2021 && e.quarter === 'q4'
                );

                const ownershipEntry = ownershipData.find(
                    // @ts-ignore
                    e => normalize(e.autonomous_community) === community &&
                        // @ts-ignore
                         e.province.toLowerCase() === capitals[community].toLowerCase()
                );

                unemploymentRates.push(unemploymentEntry ? unemploymentEntry.unemployment_rate : 0);
                busOwnershipChanges.push(ownershipEntry ? ownershipEntry.bus : 0);
            });

            // @ts-ignore
            zingchart.render({
                id: 'comparisonChart',
                data: {
                    type: 'bar',
                    title: {
                        fontSize: 20
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'top'
                    },
                    scaleX: { //Maquillamos el formato para la gráfica
                        labels: communities.map(c => c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' '))
                    },
                    scaleY: {
                        label: { text: 'Values' }
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
                            values: busOwnershipChanges,
                            text: 'Bus Ownership Changes',
                            backgroundColor: '#FF6384'
                        }
                    ]
                },
                height: 500,
                width: '100%'
            });

        } catch (error) {
            console.error('Error loading or rendering data:', error);
        }
    });
</script>

<h2>Comparativa de Paro (2021 Q4) y Cambios de Titularidad de Autobuses en las capitales (2023)</h2>
<div id="comparisonChart"></div>
