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
    let newEmigrationName = "";
    let newEmigrationYear = "";
    let newEmigrationQuarter = "";
    let newEmigrationBetween_20_24_yo = "";
    let newEmigrationBetween_25_29_yo = "";
    let newEmigrationBetween_30_34_yo = "";

    // Variables para búsqueda
    let filterCommunity = "";
    let filterYear = "";
    let filterQuarter = "";
    let filterBetween_20_24_yo = "";
    let filterBetween_25_29_yo = "";
    let filterBetween_30_34_yo = "";

    async function getData() { // meterle 404
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});
            if (res.status === 200){
                const data = await res.json(); //asumo que la respuesta es json, o esta parseada asi
                result = JSON.stringify(data,null,2); // para mostrarlo al usuario
                emigration_data = data;
                console.log(`Response received:\n${JSON.stringify(emigration_data,null,2)}`);
            }else if (res.status === 404) {
                emigration_data = [];
                resultStatus = "No hay datos disponibles.";
                result = "warning";
            }else{
                throw new Error("Error inesperado al cargar los datos");
            }
        } catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
        
    }

    async function searchData() {
        console.log("Llamada a searchData()");
        resultStatus = result = "";
        let queryParams = [];
        console.log("Valores usados para filtrar:", {
            filterCommunity,
            filterYear,
            filterQuarter,
            filterBetween_20_24_yo,
            filterBetween_25_29_yo,
            filterBetween_30_34_yo
            });
        //encodeURIComponent se usa para el tema de los espacios o tildes en las urls, para que estas no se rompan.
        //En nuestros datos las ccaas no tienen espacios ni tildes, realmente no es necesario en nuestro caso, pero
        // es bueno añadirlo.
        if (filterCommunity) {
            queryParams.push(`autonomic_community=${encodeURIComponent(filterCommunity)}`);
        }
        if (filterYear) {
            queryParams.push(`year=${encodeURIComponent(filterYear)}`);}
        if (filterQuarter) {
            queryParams.push(`quarter=${encodeURIComponent(filterQuarter)}`);
        }
        if (filterBetween_20_24_yo) {
            queryParams.push(`between_20_24_yo=${encodeURIComponent(filterBetween_20_24_yo)}`);
        }
        if (filterBetween_25_29_yo) {
            queryParams.push(`between_25_29_yo=${encodeURIComponent(filterBetween_25_29_yo)}`);
        }
        if (filterBetween_30_34_yo) {
            queryParams.push(`between_30_34_yo=${encodeURIComponent(filterBetween_30_34_yo)}`);
        }

        let query = queryParams.length ? `?${queryParams.join("&")}` : "";
        // A partir de queryParams hemos construido los parametros que añadimos en la URL, y en query detectamos si hay parametros
        // Si los hay, le añadimos el '?' del 'http://..../emigration-stats?autonomic_community=....', asi construimos el filtro.
        try {
            console.log("URL construida:", API + query); // importante para depurar
            const res = await fetch(API + query); //Hacemos la petición al backend con los filtros añadidos.

            if (res.status === 200) {
                const data = await res.json();
                emigration_data = data;
                resultStatus = `Mostrando ${data.length} resultado(s).`;
                result = "success";
            } else if (res.status === 404) {
                emigration_data = [];
                resultStatus = "No se encontraron datos con esos criterios.";
                result = "warning";
            } else {
                throw new Error(`Código inesperado: ${res.status}`);
            }
        } catch (error) {
            resultStatus = `Error al buscar datos: ${error.message}`;
            result = "danger";
        }
    }

    async function crateData() { // da problemas luego al mirar pagina indiviadual y no deja borrarlo (problemas de sincronia?)
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    autonomic_community : newEmigrationName,
                    year : parseInt(newEmigrationYear),
                    quarter : newEmigrationQuarter,
                    between_20_24_yo : parseInt(newEmigrationBetween_20_24_yo),
                    between_25_29_yo : parseInt(newEmigrationBetween_25_29_yo),
                    between_30_34_yo : parseInt(newEmigrationBetween_30_34_yo),
                })
            });
            const status = await res.status; 
            resultStatus = status;
            if(status === 201){
                console.log(`Emigration created`);
                await getData();
            }else if (status === 409) {
                resultStatus = "Ya existe un recurso con esos datos. No se puede duplicar.";
                result = "danger";
            } else if (status === 400) {
                resultStatus = "Los datos enviados no son válidos. Revisa los campos.";
                result = "danger";
            }else{
                console.log(`Error creating emigration: status received\n${status}`);
            }
            //result = JSON.stringify(data,null,2);

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
            }else if (status === 404) {
                resultStatus = `No existe un recurso con esos datos: '${name}' (${year}, ${quarter}).`;
                result = "warning";
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
            }else if (status === 404) {
                resultStatus = `No existe un recurso con esos datos: '${name}' (${year}, ${quarter}).`;
                result = "warning";
            }else{
                console.log(`Error deleting all data : status received\n${status}`);
            }
        } catch(error){
            console.log(`ERROR deleting data from ${API}: ${error}`);
        }
        
    }

    onMount(async () =>{
        await getData();
    });
    
</script>


<h3>Buscar datos de emigración</h3>

<form on:submit|preventDefault={searchData} class="mb-4">
  <div class="row g-2">
    <div class="col-md-4 col-lg-3">
      <input class="form-control" placeholder="Comunidad Autónoma" bind:value={filterCommunity} />
    </div>
    <div class="col-md-2 col-lg-1">
      <input class="form-control" type="number" placeholder="Año" bind:value={filterYear} />
    </div>
    <div class="col-md-2 col-lg-1">
      <input class="form-control" placeholder="Cuatrimestre" bind:value={filterQuarter} />
    </div>
    <div class="col-md-3 col-lg-2">
      <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 20 y 24 años" bind:value={filterBetween_20_24_yo} />
    </div>
    <div class="col-md-3 col-lg-2">
      <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 25 y 29 años" bind:value={filterBetween_25_29_yo} />
    </div>
    <div class="col-md-3 col-lg-2">
      <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 30 y 34 años" bind:value={filterBetween_30_34_yo} />
    </div>
    <div class="col-auto">
      <button class="btn btn-info" type="submit">Buscar</button>
      <button class="btn btn-secondary ms-2" type="button" on:click={getData}>Limpiar</button>
    </div>
  </div>
</form>

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
                <input class="form-control" placeholder="Comunidad Autónoma" bind:value={newEmigrationName} />
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Inserte año" bind:value={newEmigrationYear} />
            </td>
            <td>
                <input class="form-control" placeholder="Cuatrimestre" bind:value={newEmigrationQuarter} />
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 20 y 24 años" bind:value={newEmigrationBetween_20_24_yo} />
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 25 y 29 años" bind:value={newEmigrationBetween_25_29_yo} />
            </td>
            <td>
                <input class="form-control" type="number" step="1" placeholder="Nº Personas entre 30 y 34 años" bind:value={newEmigrationBetween_30_34_yo} />
            </td>
            <td>
                <Button color="primary" on:click={crateData}>Insertar datos de emigración</Button>
            </td>
        </tr>
        {#each emigration_data as emigration}
        <tr>
            <td>
                <a href ="/emigration/{emigration.autonomic_community}/{emigration.year}/{emigration.quarter}">{emigration.autonomic_community}</a>
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


<!--
<form on:submit|preventDefault={buscar}>
    <input
      type="text"
      bind:value={emigration.autonomic_community}
      placeholder="Buscar comunidad"
      class="form-control"
    />
    <button class="btn btn-primary mt-2">Buscar</button>
</form>


<ul class="mt-3">
    {#each emigration_data as emigration}
      <li>{emigration.autonomic_community}</li>
    {/each}
</ul>
-->