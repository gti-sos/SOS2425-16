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

	async function getData() {
		let searchQuery = `?autonomic_community=${newTaxesName}&year=${newTaxesYear}&quarter=${newTaxesQuarter}&atr_irpf=${newTaxesIRPF}&atr_soc_no_consolidadas=${newTaxesSocNoConsolidadas}&atr_iva=${newTaxesIVA}`;
		resultStatus, resultMessage = '';
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
            // const data = await res.json();
			const res = await fetch(API + searchQuery, { method: 'GET' });

            if(res.status === 200){
                taxesData = await res.json();
                console.log(`Response received:\n${JSON.stringify(taxesData, null, 2)}`);
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
	// async function searchData() {
	// 	let searchQuery = `?autonomic_community=${newTaxesName}&year=${newTaxesYear}&quarter=${newTaxesQuarter}&atr_irpf=${newTaxesIRPF}&atr_soc_no_consolidadas=${newTaxesSocNoConsolidadas}&atr_iva=${newTaxesIVA}`;
	//
	// 	// let resultStatus = "";
	// 	try {
	// 		taxesData.length = 0;
	// 		await fetch(API + '/loadInitialData', { method: 'GET' });
	// 		const res = await fetch(API + searchQuery, { method: 'GET' });
	// 		const data = await res.json();
	// 		// result = JSON.stringify(data, null, 2);
	//
	// 		taxesData = data;
	// 		console.log(`Response received:\n${JSON.stringify(taxesData, null, 2)}`);
	// 	} catch (error) {
	// 		console.log(`ERROR getting data from ${API}: ${error}`);
	// 	}
	// }
	//
	async function deleteData() {
		let deleteQuery = `/${newTaxesName}/${newTaxesYear}/${newTaxesQuarter}`;

		try {
			const res = await fetch(API + deleteQuery, { method: 'DELETE' });

			const status = await res.status;

			if (status == 200) {
				console.log(`Tax data ${deleteQuery} deleted`);
				await getData();
			} else {
				console.log(`ERROR deleting tax data ${name}: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  DELETE from ${API}: ${error}`);
		}
	}

	async function deleteAllData() {
		try {
			const res = await fetch(API + '/', { method: 'DELETE' });

			const status = await res.status;

			if (status == 200) {
				console.log(`All data deleted`);
				// getData();
				taxesData.length = 0;
			} else {
				console.log(`ERROR deleting tax data: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  DELETE from ${API}: ${error}`);
		}
	}

	async function createData() {
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
				await getData();
			} else {
				console.log(`ERROR creating data: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR:  GET from ${API}: ${error}`);
		}
	}

	onMount(async () => {
		await getData();
	});
</script>

{#if resultMessage}
    <Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

<h2>Estadísticas sobre la emigración en España</h2>

<Table>
	<thead>
		<tr>
			<th>Comunidad Autónoma</th>
			<th>Año</th>
			<th>Cuatrimestre</th>
			<th>IRPF</th>
			<th>Sociedades no consolidadas</th>
			<th>IVA</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<input type="text" bind:value={newTaxesName} />
			</td>
			<td>
				<input type="number" bind:value={newTaxesYear} />
			</td>
			<td>
				<input type="text" bind:value={newTaxesQuarter} />
			</td>
			<td>
				<input type="number" bind:value={newTaxesIRPF} />
			</td>
			<td>
				<input type="number" bind:value={newTaxesSocNoConsolidadas} />
			</td>
			<td>
				<input type="number" bind:value={newTaxesIVA} />
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
