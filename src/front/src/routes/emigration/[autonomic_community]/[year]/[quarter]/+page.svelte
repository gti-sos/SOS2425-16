<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    let DEVEL_HOST = "http://localhost:16078";
    //let PROD_HOST = "http://localhost:16078/api/v1/emigration-stats";
    //let API = "/api/v1/emigration-stats/"+$page.params.autonomic_community+"/"+$page.params.year+"/"+$page.params.quarter;
    let API = '/api/v1/emigration-stats';
    if(dev){
        API = DEVEL_HOST + API;
    }
    let API_RES = // peligro, deberia meterse dentro del if?
		API +
		'/' +
		$page.params.autonomic_community +
		'/' +
		$page.params.year +
		'/' +
		$page.params.quarter;
    
    import {onMount} from "svelte";
    import { Button, Table, Alert } from '@sveltestrap/sveltestrap';
    
    let emigration_data = {};
    let resultMessage,resultStatus = '';

    let newEmigrationName = '';
    let newEmigrationYear = '';
    let newEmigrationQuarter = '';
    let newEmigrationBetween_20_24_yo = '';
    let newEmigrationBetween_25_29_yo = '';
    let newEmigrationBetween_30_34_yo = '';

    async function getData(msg = true) {
		// resultStatus, (resultMessage = '');
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			const res = await fetch(API_RES, { method: 'GET' });

			if (res.status === 200) {
				emigration_data = await res.json();
				newEmigrationName = emigration_data.autonomic_community;
				newEmigrationYear = emigration_data.year;
				newEmigrationQuarter = emigration_data.quarter;
				newEmigrationBetween_20_24_yo = emigration_data.between_20_24_yo;
				newEmigrationBetween_25_29_yo = emigration_data.between_25_29_yo;
				newEmigrationBetween_30_34_yo = emigration_data.between_30_34_yo;

                if(msg){
                    resultStatus = 'success';
                    resultMessage = 'Dato recibido';
                }
				console.log(`Response received:\n${JSON.stringify(emigration_data, null, 2)}`);
			} else {
				resultStatus = 'warning';
				resultMessage = 'No se pudo acceder a los datos';
			}
		} catch (error) {
			console.log(`ERROR getting data from ${API_RES}: ${error}`);
			resultStatus = 'danger';
			resultMessage = 'El servidor se encuentra ausente';

		}
	}

    async function editData() {
		let postBody = JSON.stringify({
			autonomic_community: newEmigrationName,
			year: newEmigrationYear,
			quarter: newEmigrationQuarter,
			between_20_24_yo: newEmigrationBetween_20_24_yo,
			between_25_29_yo: newEmigrationBetween_25_29_yo,
			between_30_34_yo: newEmigrationBetween_30_34_yo
		});

        console.log(postBody)
		let invalidValues = Object.values(postBody).filter((f) => ((f === '') || (f === null) || (f === undefined) || (f === "")));
        console.log(invalidValues)

		if (invalidValues.length > 0) {
			resultStatus = 'warning';
			resultMessage = 'Campos mal formados';
		} else {
			try {
				const res = await fetch(API_RES, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: postBody
				});
				const status = await res.status;
				if (status === 200) {
					console.log(`Emigration updated`);
                    resultStatus = 'success';
                    resultMessage = 'Dato editado';
					await getData(false);
				} else {
					resultStatus = 'warning';
					resultMessage = 'No se pudo editar el dato, la expresión está mal formada, compruebe haber introducido datos numéricos';
					console.log(`Error editing taxes: status received\n${status}`);
				}
				//result = JSON.stringify(data,null,2);
			} catch (error) {
				console.log(`ERROR editing data from ${API_RES}: ${error}`);
				resultStatus = 'danger';
				resultMessage = 'El servidor se encuentra ausente';
			}
		}
	}

	async function deleteData() {
		try {
			const res = await fetch(API_RES, {
				method: 'DELETE'
			});

			const status = await res.status;

			if (status === 200) {
				console.log(`Emigration deleted`);
				goto('/emigration');
			} else {
				console.log(`Error deleting emigration: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR deleting data from ${API_RES}: ${error}`);
		}
	}

    onMount(async () =>{
        await getData();
    });
    
</script>
{#if resultMessage}
	<Alert color={resultStatus}>{resultMessage}</Alert>
{/if}
<h2>Datos sobre la emigración en {emigration_data.autonomic_community} para el año {emigration_data.year} y en el trimestre {emigration_data.quarter}</h2>
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
                {newEmigrationName}
            </td>
            <td>
                {newEmigrationYear}
            </td>
            <td>
                {newEmigrationQuarter}
            </td>
            <td>
                <input type="number" bind:value={newEmigrationBetween_20_24_yo}/>
            </td>
            <td>
                <input type="number"  bind:value={newEmigrationBetween_25_29_yo}/>
            </td>
            <td>
                <input  type="number" bind:value={newEmigrationBetween_30_34_yo}/>
            </td>
            <td>
                <Button color="primary" on:click={editData}>Actualizar datos de emigración</Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button color="danger" on:click={deleteData}>Borrar</Button>
            </td>
        </tr>
    </tbody>
</Table>

<button on:click={goto("/emigration")}>Atrás</button>