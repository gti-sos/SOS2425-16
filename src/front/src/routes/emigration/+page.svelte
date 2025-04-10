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


    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});
            const data = await res.json(); //asumo que la respuesta es json, o esta parseada asi
            result = JSON.stringify(data,null,2); // para mostrarlo al usuario

            emigration_data = data;
            console.log(`Response received:\n${JSON.stringify(emigration_data,null,2)}`)
        } catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
        
    }

    onMount(async () =>{
        getData();
    });
    
</script>

<h2> Emigration Stats</h2>
<!--{JSON.stringify(emigration_data,null,2)}-->

<Table>
    <thead>
        <tr>
            <th>Autonomic_Community</th>
            <th>Year</th>
            <th>Quarter</th>
            <th>Between_20_24_yo</th>
            <th>Between_25_29_yo</th>
            <th>Between_30_34_yo</th>
        </tr>
    </thead>
    <tbody>
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
        </tr>
        {/each}
    </tbody>
</Table>
<Button color="primary">Primary</Button>