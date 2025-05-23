<svelte:head>
    <title>Impuestos España</title>
</svelte:head>

<script>
	// @ts-nocheck

	import { dev } from '$app/environment';
	let DEVEL_HOST = 'http://localhost:16078';
	// let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	let API = '/api/v1/taxes-stats';

	if (dev) {
		API = DEVEL_HOST + API;
	}

	import { onMount } from 'svelte';
	import { Button, Table, Alert } from '@sveltestrap/sveltestrap';

	let taxesData = [];
	let newTaxesName = '';
	let newTaxesYear = '';
	let newTaxesQuarter = '';
	let newTaxesIRPF = '';
	let newTaxesSocNoConsolidadas = '';
	let newTaxesIVA = '';

    let resultMessage, resultStatus = '';

	async function getData(msg = true) {
		let searchQuery = `?autonomic_community=${newTaxesName}&year=${newTaxesYear}&quarter=${newTaxesQuarter}&atr_irpf=${newTaxesIRPF}&atr_soc_no_consolidadas=${newTaxesSocNoConsolidadas}&atr_iva=${newTaxesIVA}`;
		// resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
            // const data = await res.json();
			const res = await fetch(API + searchQuery, { method: 'GET' });

            if(res.status === 200){
                taxesData = await res.json();
                if(msg){
                    resultStatus = "success";
                    resultMessage = "Datos recibidos";
                }
                console.log(`Response received:\n${JSON.stringify(taxesData, null, 2)}`);
            }
            else if(res.status === 404){
                resultStatus = "warning";
                resultMessage = `No se pudo acceder a ${newTaxesName} en el año ${newTaxesYear} y en el trimestre ${newTaxesQuarter}`;
            }
            else{
                resultStatus = "warning";
                resultMessage = "No se pudo acceder a los datos";
            }
		} catch (error) {
			console.log(`ERROR getting data from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
	}

	async function deleteData() {
		let deleteQuery = `/${newTaxesName}/${newTaxesYear}/${newTaxesQuarter}`;

		try {
			const res = await fetch(API + deleteQuery, { method: 'DELETE' });

			const status = await res.status;

			if (status == 200) {
				console.log(`Tax data ${deleteQuery} deleted`);
                newTaxesName = newTaxesYear = newTaxesQuarter = newTaxesIVA = newTaxesIRPF = newTaxesSocNoConsolidadas = "";
                resultStatus = "success";
                resultMessage = "Dato borrado";
				await getData(false);
			}
            else if(res.status === 404){
                resultStatus = "warning";
                resultMessage = `No se pudo borrar el dato ${newTaxesName} en el año ${newTaxesYear} y en el trimestre ${newTaxesQuarter}`;
            }
            else {
                resultStatus = "warning";
                resultMessage = "No se pudo borrar el dato";
				console.log(`ERROR deleting tax data ${name}: status received\n${status}`);
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
				taxesData.length = 0;
			} else {
                resultStatus = "warning";
                resultMessage = "No se pudieron borrar los datos";
				console.log(`ERROR deleting tax data: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  DELETE from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
	}

	async function createData() {
        console.log(newTaxesIRPF)
		try {
			let postBody = JSON.stringify({
				autonomic_community: newTaxesName,
				year: newTaxesYear,
				quarter: newTaxesQuarter,
				atr_irpf: newTaxesIRPF,
				atr_soc_no_consolidadas: newTaxesSocNoConsolidadas,
				atr_iva: newTaxesIVA
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
                newTaxesName = newTaxesYear = newTaxesQuarter = newTaxesIVA = newTaxesIRPF = newTaxesSocNoConsolidadas = "";
                resultStatus = "success";
                resultMessage = "Dato creado";
				await getData(false);
			} 
            else if(res.status === 400){
                resultStatus = "warning";
                resultMessage = `No se pudo crear el dato ${newTaxesName} en el año ${newTaxesYear} y en el trimestre ${newTaxesQuarter}`;
            }
            else if(res.status === 409){
                resultStatus = "warning";
                resultMessage = `El dato ${newTaxesName} en el año ${newTaxesYear} y en el trimestre ${newTaxesQuarter} ya existe`;
            }
            else {
                resultStatus = "warning";
                resultMessage = "No se pudo crear el dato";
				console.log(`ERROR creating data: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  GET from ${API}: ${error}`);
            resultStatus = "danger";
            resultMessage = "El servidor se encuentra ausente";
		}
	}

	onMount(async () => {
		await getData();
	});
</script>

{#if resultMessage}
    <Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

<h2>Estadísticas sobre los impuestos en España</h2>

<Table>
	<thead>
		<tr>
			<th>Comunidad Autónoma</th>
			<th>Año</th>
			<th>Trimestre</th>
			<th>IRPF</th>
			<th>Sociedades no consolidadas</th>
			<th>IVA</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<input type="text" placeholder="Inserte nombre" bind:value={newTaxesName} />
			</td>
			<td>
				<input type="number" placeholder="Inserte año" bind:value={newTaxesYear} />
			</td>
			<td>
				<input type="text" placeholder="Inserte trimestre" bind:value={newTaxesQuarter} />
			</td>
			<td>
				<input type="number" placeholder="Inserte IRPF" bind:value={newTaxesIRPF} />
			</td>
			<td>
				<input type="number" placeholder="Inserte impuesto de sociedades" bind:value={newTaxesSocNoConsolidadas} />
			</td>
			<td>
				<input type="number" placeholder="Inserte IVA" bind:value={newTaxesIVA} />
			</td>
		</tr>

		<tr>
			<td>
				<Button color="primary" on:click={createData}>Insertar datos</Button>
			</td>
			<td>
				<Button color="success" on:click={getData}>Buscar datos</Button>
			</td>
			<!-- <td> -->
			<!-- 	<Button color="success" on:click={searchData}>Buscar un dato</Button> -->
			<!-- </td> -->
			<td>
				<Button color="warning" on:click={deleteData}>Borrar un dato</Button>
			</td>
			<td>
				<Button color="danger" on:click={deleteAllData}>Borrar todos los datos</Button>
			</td>
		</tr>

		{#each taxesData as td (td)}
			<tr>
				<td>
                    <a href ="/taxes/{td.autonomic_community}/{td.year}/{td.quarter}">{td.autonomic_community}</a>
				</td>
				<td>
					{td.year}
				</td>
				<td>
					{td.quarter}
				</td>
				<td>
					{td.atr_irpf}
				</td>
				<td>
					{td.atr_soc_no_consolidadas}
				</td>
				<td>
					{td.atr_iva}
				</td>
			</tr>
		{/each}
	</tbody>
	<tfoot> </tfoot>
</Table>
