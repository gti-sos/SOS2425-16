<script>
    // @ts-nocheck
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import {onMount} from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let API = "/api/v1/unemployment-stats";
    let DEVEL_HOST = "http://localhost:16078";

    if(dev){
            API = DEVEL_HOST + API;
    }

    let API_R = API+"/"+$page.params.autonomic_community+"/"+$page.params.year+"/"+$page.params.quarter;

    let unemploymentData = [];
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado

    async function getData() {
        resultStatus = result = "";
        try {
            //await fetch(API + '/loadInitialData', { method: 'GET' });
            const res = await fetch(API_R);
            if (res.status === 200) {
                unemploymentData = await res.json();
            } 
        } catch (error) {
            resultStatus = `No se pudieron obtener los datos: ${error.message}`;
            result = "danger";
        }
    }

    async function editData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API_R, {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    autonomic_community : unemploymentData.autonomic_community,
                    year : unemploymentData.year,
                    quarter : unemploymentData.quarter,
                    unemployment_rate : unemploymentData.unemployment_rate, 
                    previous_quarter_var : unemploymentData.previous_quarter_var, 
                    previous_year_quarter_var : unemploymentData.previous_year_quarter_var
                })
            });
            if (res.status === 200) {
                await getData()
                goto("/unemployment-stats");
                resultStatus = `El dato de '${unemploymentData.autonomic_community}' (${unemploymentData.year}, ${unemploymentData.quarter}) se ha editado correctamente.`;
                result = "success";
            }
        } catch (error){
            resultStatus = `No se pudieron obtener los datos: ${error.message}`;
            result = "danger";
        }

    }

    onMount(async () => {
		await getData();
	});

</script>



<h2>
	Datos sobre el desempleo en {unemploymentData.autonomic_community} en el año {unemploymentData.year} y durante el
	trimestre
	{unemploymentData.quarter}
</h2>
<!--{JSON.stringify(unemploymentData,null,2)}-->

<Table>
	<thead>
		<tr>
			<th>Comunidad Autónoma</th>
			<th>Año</th>
			<th>Trimestre</th>
			<th>Tasa de desempleo (%)</th>
            <th>Var. trimestre anterior</th>
            <th>Var. mismo trimestre año anterior</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				{unemploymentData.autonomic_community}
			</td>
			<td>
				{unemploymentData.year}
			</td>
			<td>
				{unemploymentData.quarter}
			</td>
			<td>
				<input type="number" bind:value={unemploymentData.unemployment_rate} />
			</td>
			<td>
				<input type="number" bind:value={unemploymentData.previous_quarter_var} />
			</td>
			<td>
				<input type="number" bind:value={unemploymentData.previous_year_quarter_var} />
			</td>
		</tr>
		<tr> <!--
			<td>
				<Button
					color="danger"
					on:click={() => {
						deleteData(
							unemploymentData.autonomic_community,
							unemploymentData.year,
							unemploymentData.quarter
						);
					}}>Borrar</Button
				>
			</td> -->
			<td>
				<Button color="primary" on:click={editData}>Actualizar</Button>
			</td>
		</tr>
	</tbody>
</Table>