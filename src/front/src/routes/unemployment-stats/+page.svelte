<script>
    // @ts-nocheck
    console.log("ola");
    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/unemployment-stats";
    console.log(API);
    if(dev){
        API = DEVEL_HOST + API;
    }

    import {onMount} from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let unemploymentData = [];
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado
    let newUnemploymentAutonomicCommunity;
    let newUnemploymentYear;
    let newUnemploymentQuarter;
    let newUnemploymentUnemployment_rate;
    let newUnemploymentPrevious_quarter_var;
    let newUnemploymentPrevious_year_quarter_var;

    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API);
            if (res.status === 200) {
                unemploymentData = await res.json();
            } else if (res.status === 404) {
                unemploymentData = [];
                resultStatus = "No hay datos disponibles.";
                result = "warning";
            } else {
                throw new Error("Error inesperado al cargar los datos");
            }
        } catch (error) {
            resultStatus = `No se pudieron obtener los datos: ${error.message}`;
            result = "danger";
        }
    }

    async function createData() {
        resultStatus = result = "";
        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    autonomic_community: newUnemploymentAutonomicCommunity,
                    year: parseInt(newUnemploymentYear),
                    quarter: newUnemploymentQuarter,
                    unemployment_rate: parseFloat(newUnemploymentUnemployment_rate),
                    previous_quarter_var: parseFloat(newUnemploymentPrevious_quarter_var),
                    previous_year_quarter_var: parseFloat(newUnemploymentPrevious_year_quarter_var),
                })
            });

            if (response.status === 201) {
                resultStatus = "Dato creado correctamente.";
                result = "success";
                await getData(); // Recargar los datos automáticamente
            } else if (response.status === 409) {
                resultStatus = "Ya existe un recurso con esos datos. No se puede duplicar.";
                result = "danger";
            } else if (response.status === 400) {
                resultStatus = "Los datos enviados no son válidos. Revisa los campos.";
                result = "danger";
            } else {
                throw new Error(`Código inesperado: ${response.status}`);
            }
        } catch (error) {
            resultStatus = `Error al crear el dato: ${error.message}`;
            result = "danger";
        }
    }

    async function deleteData(name, year, quarter) {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/${name}/${year}/${quarter}`, { method: "DELETE" });

            if (res.status === 200) {
                resultStatus = `El dato de '${name}' (${year}, ${quarter}) se ha eliminado correctamente.`;
                result = "success";
                await getData(); // Recarga automática
            } else if (res.status === 404) {
                resultStatus = `No existe un recurso con esos datos: '${name}' (${year}, ${quarter}).`;
                result = "warning";
            } else {
                throw new Error(`Código inesperado: ${res.status}`);
            }
        } catch (error) {
            resultStatus = `Error al eliminar el recurso: ${error.message}`;
            result = "danger";
        }
}

    async function deleteAllData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, { method: "DELETE" });
            if (res.status === 200) {
                resultStatus = "Todos los datos fueron eliminados correctamente.";
                result = "success";
                await getData();
            } else if (res.status === 404) {
                resultStatus = "No había datos para eliminar.";
                result = "warning";
            } else {
                throw new Error(`Código inesperado: ${res.status}`);
            }
        } catch (error) {
            resultStatus = `Error al eliminar los datos: ${error.message}`;
            result = "danger";
        }
    }

    onMount(() => {
        getData();
    });


</script>

<h2>Estadísticas de Desempleo en España</h2>

{#if resultStatus}
    <Alert color={result}>{resultStatus}</Alert>
{/if}

<Table striped>
    <thead>
        <tr>
            <th>Comunidad Autónoma</th>
            <th>Año</th>
            <th>Trimestre</th>
            <th>Tasa de desempleo (%)</th>
            <th>Var. trimestre anterior</th>
            <th>Var. mismo trimestre año anterior</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <!-- Fila para introducir un nuevo dato -->
        <tr>
            <td><input bind:value={newUnemploymentAutonomicCommunity}></td>
            <td><input type="number" bind:value={newUnemploymentYear}></td>
            <td><input bind:value={newUnemploymentQuarter}></td>
            <td><input type="number" step="0.1" bind:value={newUnemploymentUnemployment_rate}></td>
            <td><input type="number" step="0.01" bind:value={newUnemploymentPrevious_quarter_var}></td>
            <td><input type="number" step="0.01" bind:value={newUnemploymentPrevious_year_quarter_var}></td>
            <td><Button color="primary" on:click={createData}>Añadir</Button></td>
        </tr>

        <!-- Datos existentes -->
        {#each unemploymentData as data}
            <tr>
                <td>{data.autonomic_community}</td>
                <td>{data.year}</td>
                <td>{data.quarter}</td>
                <td>{data.unemployment_rate}</td>
                <td>{data.previous_quarter_var}</td>
                <td>{data.previous_year_quarter_var}</td>
                <td>
                    <Button color="danger" size="sm" on:click={() => deleteData(data.autonomic_community, data.year, data.quarter)}>
                        Borrar
                    </Button>
                </td>
            </tr>
        {/each}

        <!-- Botón para borrar todo -->
        <tr>
            <td colspan="7">
                <Button color="danger" on:click={deleteAllData}>Eliminar Todos los Datos</Button>
            </td>
        </tr>
    </tbody>
</Table>
