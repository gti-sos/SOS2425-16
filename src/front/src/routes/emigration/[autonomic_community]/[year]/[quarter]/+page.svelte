<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    let DEVEL_HOST = "http://localhost:16078";
    //let PROD_HOST = "http://localhost:16078/api/v1/emigration-stats";
    let API = "/api/v1/emigration-stats/"+$page.params.autonomic_community+"/"+$page.params.year+"/"+$page.params.quarter;
    
    if(dev){
        API = DEVEL_HOST + API;
    }
    
    import {onMount} from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';
    
    let emigration_data = {};
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado

    // let newEmigrationBetween_20_24_yo = "";
    // let newEmigrationBetween_25_29_yo = "";
    // let newEmigrationBetween_30_34_yo = "";

    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});
            const data = await res.json(); //asumo que la respuesta es json, o esta parseada asi
            result = JSON.stringify(data,null,2); // para mostrarlo al usuario

            emigration_data = data;
            console.log(`Response received:\n${JSON.stringify(emigration_data,null,2)}`);
        } catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
        
    }

    async function editData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    autonomic_community : emigration_data.autonomic_community,
                    year : parseInt(emigration_data.year),
                    quarter : emigration_data.quarter,
                    between_20_24_yo : parseInt(emigration_data.between_20_24_yo),
                    between_25_29_yo : parseInt(emigration_data.between_25_29_yo),
                    between_30_34_yo : parseInt(emigration_data.between_30_34_yo),  
                })
            });
            const status = await res.status; 
            resultStatus = status;
            if(status === 200){
                console.log(`Emigration updated`);
                await getData();
            }else if (status === 400) {
                resultStatus = "Los datos enviados no son válidos. Revisa los campos.";
                result = "danger";
            }else{
                console.log(`Error editing emigration: status received\n${status}`);
            }
            //result = JSON.stringify(data,null,2);

        } catch(error){
            console.log(`ERROR editing data from ${API}: ${error}`);
        }
        
    }

    async function deleteData(name,year,quarter) {
        resultStatus = result = "";
        try {
            const res = await fetch(API+"/"+name+"/"+year+"/"+quarter, {method:"DELETE"});

            const status = await res.status; 
            resultStatus = status;

            if(status === 200){
                console.log(`Emigration deleted`);
                goto("/emigration");
            }
            else if (status === 404) {
                resultStatus = `No existe un recurso con esos datos: '${name}' (${year}, ${quarter}).`;
                result = "warning";
            }
            else{
                console.log(`Error deleting emigration: status received\n${status}`);
            }
        } catch(error){
            console.log(`ERROR deleting data from ${API}: ${error}`);
        }
    }

    onMount(async () =>{
        await getData();
    });
    
</script>
{#if result}
	<Alert color={result}>{resultStatus}</Alert>
{/if}
<h2>Datos sobre la emigración en {emigration_data.autonomic_community} para el año {emigration_data.year} y en el cuatrimestre {emigration_data.quarter}</h2>
<!--{JSON.stringify(emigration_data,null,2)}-->

<Table>
    <thead>
        <tr>
            <th>Comunidad Autónoma</th>
            <th>Año</th>
            <th>Cuatrimestre</th>
            <th>Entre 20 y 24 años</th>
            <th>Entre 25 y 29 años</th>
            <th>Entre 30 y 34 años</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                {emigration_data.autonomic_community}
            </td>
            <td>
                {emigration_data.year}
            </td>
            <td>
                {emigration_data.quarter}
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 20 y 24 años" bind:value={emigration_data.between_20_24_yo}/>
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 25 y 29 años" bind:value={emigration_data.between_25_29_yo}/>
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 30 y 34 años" bind:value={emigration_data.between_30_34_yo}/>
            </td>
            <td>
                <Button color="primary" on:click={editData}>Actualizar datos de emigración</Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button color="danger" on:click={()=>{deleteData(emigration_data.autonomic_community,emigration_data.year,emigration_data.quarter)}}>Borrar</Button>
            </td>
        </tr>
    </tbody>
</Table>

<button on:click={goto("/emigration")}>Atrás</button>