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
	let API_RES =
		API +
		'/' +
		$page.params.autonomic_community +
		'/' +
		$page.params.year +
		'/' +
		$page.params.quarter;

	import { onMount } from 'svelte';
	import { Button, Table, Alert } from '@sveltestrap/sveltestrap';

	let taxesData = {};

	let resultMessage,
		resultStatus = '';

	let newTaxesName = '';
	let newTaxesYear = '';
	let newTaxesQuarter = '';
	let newTaxesIRPF = '';
	let newTaxesSocNoConsolidadas = '';
	let newTaxesIVA = '';

	async function getData(msg = true) {
		// resultStatus, (resultMessage = '');
		try {
			await fetch(API + '/loadInitialData', { method: 'GET' });
			const res = await fetch(API_RES, { method: 'GET' });

			if (res.status === 200) {
				taxesData = await res.json();
				newTaxesName = taxesData.autonomic_community;
				newTaxesYear = taxesData.year;
				newTaxesQuarter = taxesData.quarter;
				newTaxesIRPF = taxesData.atr_irpf;
				newTaxesSocNoConsolidadas = taxesData.atr_soc_no_consolidadas;
				newTaxesIVA = taxesData.atr_iva;

                if(msg){
                    resultStatus = 'success';
                    resultMessage = 'Dato recibido';
                }
				console.log(`Response received:\n${JSON.stringify(taxesData, null, 2)}`);
			} 
            else if(res.status === 404){
                let paramName = $page.params.autonomic_community;
                let paramYear = $page.params.year; 
                let paramQuarter = $page.params.quarter;
                resultStatus = "warning";
                resultMessage = `No se pudo encontrar el dato ${paramName} en el año ${paramYear} en el trimestre ${paramQuarter}`
            }
            else {
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
			autonomic_community: newTaxesName,
			year: newTaxesYear,
			quarter: newTaxesQuarter,
			atr_irpf: newTaxesIRPF,
			atr_soc_no_consolidadas: newTaxesSocNoConsolidadas,
			atr_iva: newTaxesIVA
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
					console.log(`Taxes updated`);
                    resultStatus = 'success';
                    resultMessage = 'Dato editado';
					await getData(false);
				}
                else if(res.status === 400){
                    resultStatus = "warning";
                    resultMessage = `Los campos están mal formados`;
                }
                else {
					resultStatus = 'warning';
					resultMessage = 'No se pudieron editar los datos';
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

{#if resultMessage}
	<Alert color={resultStatus}>{resultMessage}</Alert>
{/if}

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
				{newTaxesName}
			</td>
			<td>
				{newTaxesYear}
			</td>
			<td>
				{newTaxesQuarter}
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
				<Button color="danger" on:click={deleteData}>Borrar</Button>

			</td>
			<td>
				<Button color="primary" on:click={editData}>Actualizar datos de impuestos</Button>
			</td>
		</tr>
	</tbody>
</Table>

<button on:click={goto('/taxes')}>Atrás</button>
