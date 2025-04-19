<script>
	// @ts-nocheck
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	let DEVEL_HOST = 'http://localhost:16078';
	//let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";

	let API = '/api/v1/taxes-stats';
	if (dev) {
		API = DEVEL_HOST + API;
	}
	let API_RES = API + "/" +
		$page.params.autonomic_community +
		'/' +
		$page.params.year +
		'/' +
		$page.params.quarter;


	import { onMount } from 'svelte';
	import { Button, Table } from '@sveltestrap/sveltestrap';

	let taxesData = {};


	async function getData() {
		// let resultStatus = "";
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			const res = await fetch(API_RES, { method: 'GET' });
			const data = await res.json();
			// result = JSON.stringify(data, null, 2);

			taxesData = data;
			console.log(`Response received:\n${JSON.stringify(taxesData, null, 2)}`);
		} catch (error) {
			console.log(`ERROR getting data from ${API_RES}: ${error}`);
		}
	}

	async function editData() {
		try {
			const res = await fetch(API_RES, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					autonomic_community: taxesData.autonomic_community,
					year: taxesData.year,
					quarter: taxesData.quarter,
					atr_irpf: taxesData.atr_irpf,
					atr_soc_no_consolidadas: taxesData.atr_soc_no_consolidadas,
					atr_iva: taxesData.atr_iva
				})
			});
			const status = await res.status;
			if (status === 200) {
				console.log(`Taxes updated`);
				await getData();
			} else {
				console.log(`Error editing taxes: status received\n${status}`);
			}
			//result = JSON.stringify(data,null,2);
		} catch (error) {
			console.log(`ERROR editing data from ${API_RES}: ${error}`);
		}
	}

	async function deleteData(name, year, quarter) {
		try {
			const res = await fetch(API_RES + '/' + name + '/' + year + '/' + quarter, {
				method: 'DELETE'
			});

			const status = await res.status;

			if (status === 200) {
				console.log(`Taxes deleted`);
				goto('/taxes');
			} else {
				console.log(`Error deleting taxes: status received\n${status}`);
			}
		} catch (error) {
			console.log(`ERROR deleting data from ${API_RES}: ${error}`);
		}
	}

	onMount(async () => {
		await getData();
	});
</script>

<h2>
	Datos sobre los impuestos en {taxesData.autonomic_community} para el año {taxesData.year} y en el
	cuatrimestre
	{taxesData.quarter}
</h2>
<!--{JSON.stringify(taxesData,null,2)}-->

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
				{taxesData.autonomic_community}
			</td>
			<td>
				{taxesData.year}
			</td>
			<td>
				{taxesData.quarter}
			</td>
			<td>
				<input type="number" bind:value={taxesData.atr_irpf} />
			</td>
			<td>
				<input type="number" bind:value={taxesData.atr_soc_no_consolidadas} />
			</td>
			<td>
				<input type="number" bind:value={taxesData.atr_iva} />
			</td>
		</tr>
		<tr>
			<td>
				<Button
					color="danger"
					on:click={() => {
						deleteData(
							taxesData.autonomic_community,
							taxesData.year,
							taxesData.quarter
						);
					}}>Borrar</Button
				>
			</td>
			<td>
				<Button color="primary" on:click={editData}>Actualizar datos de impuestos</Button>
			</td>
		</tr>
	</tbody>
</Table>

<button on:click={goto('/taxes')}>Atrás</button>
