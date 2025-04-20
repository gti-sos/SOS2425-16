<svelte:head>
    <title>Emigracion España</title>
</svelte:head>
<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16078";
    //let PROD_HOST = "http://localhost:16078/api/v1/emigration-stats";
    let API = "/api/v2/emigration-stats";

    if(dev){
        API = DEVEL_HOST + API;
    }

    import {onMount} from "svelte";
    import { Button, Table, Alert } from '@sveltestrap/sveltestrap';

    let emigration_data = [];
    //let result = ""; // resultado que devuelve la API
    let resultMessage, resultStatus = '';
    let newEmigrationName = "";
    let newEmigrationYear = "";
    let newEmigrationQuarter = "";
    let newEmigrationBetween_20_24_yo = "";
    let newEmigrationBetween_25_29_yo = "";
    let newEmigrationBetween_30_34_yo = "";

    // Variables para búsqueda
    /*
    let filterCommunity = "";
    let filterYear = "";
    let filterQuarter = "";
    let filterBetween_20_24_yo = "";
    let filterBetween_25_29_yo = "";
    let filterBetween_30_34_yo = "";
    */

    async function getData(msg =true) { // meterle 404
        let searchQuery = `?autonomic_community=${newEmigrationName}&year=${newEmigrationYear}
        &quarter=${newEmigrationQuarter}&between_20_24_yo=${newEmigrationBetween_20_24_yo}
        &between_25_29_yo=${newEmigrationBetween_25_29_yo}&between_30_34_yo=${newEmigrationBetween_30_34_yo}`;
		// resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData' , { method: 'GET' });
            // const data = await res.json();
			const res = await fetch(API + searchQuery, { method: 'GET' });

            if(res.status === 200){
                emigration_data = await res.json();
                if(msg){
                    resultStatus = "success";
                    resultMessage = "Datos recibidos";
                }
                console.log(`Response received:\n${JSON.stringify(emigration_data, null, 2)}`);
            }
            else{
                resultStatus = "warning";
                resultMessage = `No existe la comunidad ${newEmigrationName} `;
                if (newEmigrationYear){
                    resultMessage+= `en el año ${newEmigrationYear} `
                }
                if (newEmigrationQuarter){
                    resultMessage+= `en el trimestre ${newEmigrationQuarter} `
                }
                if (newEmigrationBetween_20_24_yo){
                    resultMessage+= `con la cantidad de personas entre 20 y 24 años ${newEmigrationQuarter} `
                }
                if (newEmigrationBetween_25_29_yo){
                    resultMessage+= `con la cantidad de personas entre 25 y 29 años ${newEmigrationQuarter} `
                }
                if (newEmigrationBetween_30_34_yo){
                    resultMessage+= `con la cantidad de personas entre 30 y 34 años ${newEmigrationQuarter}`
                }
            }
		} catch (error) {
			console.log(`ERROR getting data from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
        
    }

    /*
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
            }
        } catch (error) {
            resultStatus = `Error al buscar datos: ${error.message}`;
            result = "danger";
        }
    }*/

    async function createData() {
		try {
			let postBody = JSON.stringify({
                autonomic_community : newEmigrationName,
                year : parseInt(newEmigrationYear),
                quarter : newEmigrationQuarter,
                between_20_24_yo : parseInt(newEmigrationBetween_20_24_yo),
                between_25_29_yo : parseInt(newEmigrationBetween_25_29_yo),
                between_30_34_yo : parseInt(newEmigrationBetween_30_34_yo),
			});
			const res = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: postBody
			});

			const status = await res.status;
			if (status == 201) {
				console.log(`Data created`);
                newEmigrationName = newEmigrationYear = newEmigrationQuarter = newEmigrationBetween_20_24_yo = newEmigrationBetween_25_29_yo = newEmigrationBetween_30_34_yo = "";
                resultStatus = "success";
                resultMessage = "Dato creado";
				await getData(false);
			} else if (status === 409) {
                resultStatus = "warning";
                resultMessage = "No se pudo crear el dato porque ya existe otro igual";
				console.log(`ERROR creating data: status received\n${status}`);
			}else{
                resultStatus = "warning";
                resultMessage = `No se pudo editar el dato, la expresión está mal formada, compruebe haber introducido datos numéricos`;
				console.log(`ERROR creating data: status received\n${status}`);
            }
		} catch (error) {
			console.log(`ERROR:  GET from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
	}

	async function deleteData(name,year,quarter) {
		let deleteQuery = `/${name}/${year}/${quarter}`;

		try {
			const res = await fetch(API + deleteQuery, { method: 'DELETE' });

			const status = await res.status;

			if (status == 200) {
				console.log(`Emigration data ${deleteQuery} deleted`);
                //newEmigrationName = newEmigrationYear = newEmigrationQuarter = newEmigrationBetween_20_24_yo = newEmigrationBetween_25_29_yo = newEmigrationBetween_30_34_yo = "";
                resultStatus = "success";
                resultMessage = "Dato borrado";
				await getData(false);
			} else {
                resultStatus = "warning";
                resultMessage = "No se pudo borrar el dato";
				console.log(`ERROR deleting emigration data ${name}: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  DELETE from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
	}

    async function deleteAllData() {
		try {
			const res = await fetch(API + '/', { method: 'DELETE' });

			const status = await res.status;

			if (status == 200) {
				console.log(`All data deleted`);
                resultStatus = "success";
                resultMessage = "Todos los datos borrados";
				// getData();
				emigration_data.length = 0;
			} else {
                resultStatus = "warning";
                resultMessage = "No se pudieron borrar los datos porque ya no hay datos";
				console.log(`ERROR deleting tax data: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  DELETE from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
	}

    onMount(async () =>{
        await getData();
    });
    
</script>
{#if resultMessage}
    <Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

<h2>Estadísticas sobre la emigración en España</h2>
<!--{JSON.stringify(emigration_data,null,2)}-->

<Table>
    <thead>
        <tr>
            <th>Comunidad Autónoma</th>
            <th>Año</th>
            <th>Trimestre</th>
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
                <input class="form-control" placeholder="Trimestre" bind:value={newEmigrationQuarter} />
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
        </tr>
        <tr>
			<td>
				<Button color="primary" on:click={createData}>Insertar datos</Button>
			</td>
			<td>
				<Button color="success" on:click={getData}>Buscar datos</Button>
			</td>
			<td>
				<Button color="danger" on:click={deleteAllData}>Borrar todos los datos</Button>
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
    </tbody>
</Table>