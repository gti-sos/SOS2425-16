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
	import { Button, Table } from '@sveltestrap/sveltestrap';

	let taxesData = [];
    let result = "";
    let resultStatus = "";
	let newTaxesName;
	let newTaxesYear;
	let newTaxesQuarter;
	let newTaxesIRPF;
	let newTaxesSocNoConsolidadas;
	let newTaxesIVA;

    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"})
            const data = await res.json();
            result = JSON.stringify(data, null, 2);

            taxesData = data;
            console.log(`Response received:\n${JSON.stringify(taxesData,null,2)}`);
        } catch (error) {
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
    }

    async function deleteAllData() {
        taxesData.length = 0;
    }

    onMount(async () =>{
        getData();
    });

</script>

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
				<Button color="primary">Insertar datos</Button>
			</td>
			<td>
				<Button color="success" on:click={getData}>Listar datos</Button>
			</td>
			<td>
				<Button color="warning">Borrar un dato</Button>
			</td>
			<td>
				<Button color="danger" on:click={deleteAllData}>Borrar todos los datos</Button>
			</td>
		</tr>

        {#each taxesData as td (td)}
            <tr>
                <td>
                    {td.autonomic_community}
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
