<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16078";
    //let PROD_HOST = "http://localhost:16078/api/v1/emigration-stats";
    let API = "/api/v1/emigration-stats";

    if(dev){
        API = DEVEL_HOST + API;
    }

    import {onMount} from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let emigration_data = [];
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado
    let newEmigrationName;
    let newEmigrationYear;
    let newEmigrationQuarter;
    let newEmigrationBetween_20_24_yo;
    let newEmigrationBetween_25_29_yo;
    let newEmigrationBetween_30_34_yo;

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

    async function searchData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API+`?autonomic_community=${encodeURIComponent(autonomic_community)}&year=${encodeURIComponent(year)}&quarter=${encodeURIComponent(quarter)}`, {method:"GET"});
            const data = await res.json();
            result = JSON.stringify(data,null,2);

            emigration_data = data;
            console.log(`Response received:\n${JSON.stringify(emigration_data,null,2)}`);
        } catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
        
    }

    async function crateData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    autonomic_community : newEmigrationName,
                    year : newEmigrationYear,
                    quarter : newEmigrationQuarter,
                    between_20_24_yo : newEmigrationBetween_20_24_yo,
                    between_25_29_yo : newEmigrationBetween_25_29_yo,
                    between_30_34_yo : newEmigrationBetween_30_34_yo,
                })
            });
            const status = await res.status; 
            resultStatus = status;
            if(status === 201){
                console.log(`Emigration created`);
                getData();
            }else{
                console.log(`Error creating emigration: status received\n${status}`);
            }
            result = JSON.stringify(data,null,2);

        } catch(error){
            console.log(`ERROR creating data from ${API}: ${error}`);
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
                getData();
            }else{
                console.log(`Error deleting emigration: status received\n${status}`);
            }
        } catch(error){
            console.log(`ERROR deleting data from ${API}: ${error}`);
        }
    }

    async function deleteAllData() { // editar para que devuelva un array vacio y se muestre al usuario
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"DELETE"});

            const status = await res.status; 
            resultStatus = status;

            if(status === 200){
                console.log(`All data has been nuked :D`);
                getData();
            }else{
                console.log(`Error deleting all data : status received\n${status}`);
            }
        } catch(error){
            console.log(`ERROR deleting data from ${API}: ${error}`);
        }
        
    }

    onMount(async () =>{
        getData();
    });
    
</script>

<h2>Estadísticas sobre la emigración en España</h2>
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
                <input bind:value={newEmigrationName}>
            </td>
            <td>
                <input bind:value={newEmigrationYear}>
            </td>
            <td>
                <input bind:value={newEmigrationQuarter}>
            </td>
            <td>
                <input bind:value={newEmigrationBetween_20_24_yo}>
            </td>
            <td>
                <input bind:value={newEmigrationBetween_25_29_yo}>
            </td>
            <td>
                <input bind:value={newEmigrationBetween_30_34_yo}>
            </td>
            <td>
                <Button color="primary" on:click={crateData}>Insertar datos de emigración</Button>
            </td>
        </tr>
        {#each emigration_data as emigration}
        <tr>
            <td>
                {emigration.autonomic_community}
            </td>
            <td>
                {emigration.year}
            </td>
            <td>
                {emigration.quarter}
            </td>
            <td>
                {emigration.between_20_24_yo}
            </td>
            <td>
                {emigration.between_25_29_yo}
            </td>
            <td>
                {emigration.between_30_34_yo}
            </td>
            <td>
                <Button color="danger" on:click={()=>{deleteData(emigration.autonomic_community,emigration.year,emigration.quarter)}}>Borrar</Button>
            </td>
        </tr>
        {/each}
        <tr>
            <td>
                <!---<div class="d-flex justify-content-center align-items-center" style="height: 100%;">-->
                    <Button color="danger" on:click={deleteAllData}>Borrar Todo</Button>
                <!--</div>-->
            </td>
        </tr>
    </tbody>
</Table>
