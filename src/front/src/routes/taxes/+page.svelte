<script>
// @ts-nocheck

	// import { dev } from '$app/environment';
	// let DEVEL_HOST = 'http://localhost:16078';
	//let PROD_HOST = "http://localhost:16078/api/v1/taxes-stats";
	// let API = '/api/v1/emigration-stats';

	// if (dev) {
	// 	API = DEVEL_HOST + API;
	// }

	// import { onMount } from 'svelte';
	import { Button, Table } from '@sveltestrap/sveltestrap';

	// let taxesData = [];
	let newTaxesName;
	let newTaxesYear;
	let newTaxesQuarter;
	let newTaxesIRPF;
	let newTaxesSocNoConsolidadas;
	let newTaxesIVA;
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
	</tbody>
    <tfoot>
        <Button color="primary">Insertar datos</Button>
        <Button color="success">Listar datos</Button>
        <Button color="warning">Borrar un dato</Button>
        <Button color="danger">Borrar todos los datos</Button>
    </tfoot>
</Table>
