<svelte:head>
    <title>Desempleo en España</title>
</svelte:head>
<script>
    // @ts-nocheck
    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/unemployment-stats";
    if(dev){
        API = DEVEL_HOST + API;
    }

    import {onMount} from "svelte";
    import { Button, Table, Alert } from '@sveltestrap/sveltestrap';

    let unemploymentData = [];
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado

    let newUnemploymentAutonomicCommunity;
    let newUnemploymentYear;
    let newUnemploymentQuarter;
    let newUnemploymentUnemployment_rate;
    let newUnemploymentPrevious_quarter_var;
    let newUnemploymentPrevious_year_quarter_var;

    // Variables para búsqueda
    let filterCommunity = "";
    let filterYear = "";
    let filterQuarter = "";
    let filterRate = "";
    let filterPQVar = "";
    let filterPYQVar = "";

    async function getData(msg = true, da = false) {
        if (msg) {
            resultStatus = result = "";
        }
        try {
            const res = await fetch(API);
            if (res.status === 200) {
                unemploymentData = await res.json();
                if(msg){
                    resultStatus = "Datos recibidos";
                    result = "success";
                }
            } else if (res.status === 404) {
                unemploymentData = [];
                if (!da) {
                resultStatus = "No hay datos disponibles.";
                result = "warning";
                }
            } 
        } catch (error) {
            resultStatus = `No se pudieron obtener los datos: ${error.message}`;
            result = "danger";
        }
    }

    async function searchData() {
        resultStatus = result = "";
        let queryParams = [];
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
        if (filterRate) {
            queryParams.push(`unemployment_rate=${encodeURIComponent(filterRate)}`);
        }
        if (filterPQVar) {
            queryParams.push(`previous_quarter_var=${encodeURIComponent(filterPQVar)}`);
        }
        if (filterPYQVar) {
            queryParams.push(`previous_year_quarter_var=${encodeURIComponent(filterPYQVar)}`);
        }

        let query = queryParams.length ? `?${queryParams.join("&")}` : "";
        // A partir de queryParams hemos construido los parametros que añadimos en la URL, y en query detectamos si hay parametros
        // Si los hay, le añadimos el '?' del 'http://..../unemploymen-stats?autonomic_community=....', asi construimos el filtro.
        try {
            const res = await fetch(API + query); //Hacemos la petición al backend con los filtros añadidos.

            if (res.status === 200) {
                const data = await res.json();
                unemploymentData = data;
                resultStatus = `Mostrando ${data.length} resultado(s).`;
                result = "success";
            } else if (res.status === 404) {
                unemploymentData = [];
                resultStatus = "No se encontraron datos con esos criterios.";
                result = "warning";
            } 
        } catch (error) {
            resultStatus = `Error al buscar datos: ${error.message}`;
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
            console.log(response.status);
            if (response.status === 201) {
                resultStatus = "Dato creado correctamente.";
                result = "success";
                newUnemploymentAutonomicCommunity = newUnemploymentYear = newUnemploymentQuarter = newUnemploymentUnemployment_rate = newUnemploymentPrevious_quarter_var = newUnemploymentPrevious_year_quarter_var = "";
                await getData(false); // Recargar los datos automáticamente
            } else if (response.status === 409) {
                resultStatus = "Ya existe un recurso con esos datos. No se puede duplicar.";
                result = "danger";
            } else if (response.status === 400) {
                resultStatus = "Los datos enviados no son válidos. Revisa los campos.";
                result = "danger";
            }
        } catch (error) {
            resultStatus = `Error al crear el dato: ${error}`;
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
                await getData(false); // Recarga automática
            } else if (res.status === 404) {
                resultStatus = `No existe un recurso con esos datos: '${name}' (${year}, ${quarter}).`;
                result = "warning";
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
                await getData(false, true);
            } else if (res.status === 404) {
                resultStatus = "No había datos para eliminar.";
                result = "warning";
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


{#if resultStatus}
    <Alert color={result}>{resultStatus}</Alert>
{/if}

<h3>Buscar datos de desempleo</h3>

<form on:submit|preventDefault={searchData} class="mb-4">
  <div class="row g-2">
    <div class="col-md-4 col-lg-3">
      <input class="form-control" placeholder="CCAA" bind:value={filterCommunity} />
    </div>
    <div class="col-md-2 col-lg-1">
      <input class="form-control" type="number" placeholder="Año" bind:value={filterYear} />
    </div>
    <div class="col-md-2 col-lg-1">
      <input class="form-control" placeholder="Inserte trimestre" bind:value={filterQuarter} />
    </div>
    <div class="col-md-3 col-lg-2">
      <input class="form-control" type="number" step="0.1" placeholder="Tasa desempleo" bind:value={filterRate} />
    </div>
    <div class="col-md-3 col-lg-2">
      <input class="form-control" type="number" step="0.01" placeholder="Var. T. Anterior" bind:value={filterPQVar} />
    </div>
    <div class="col-md-3 col-lg-2">
      <input class="form-control" type="number" step="0.01" placeholder="Var. Año Anterior" bind:value={filterPYQVar} />
    </div>
    <div class="col-auto">
      <button class="btn btn-info" type="submit">Buscar</button>
      <button class="btn btn-secondary ms-2" type="button" on:click={getData}>Limpiar</button>
    </div>
  </div>
</form>


<h2>Estadísticas de Desempleo en España</h2>

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
            <td><input id="Comunidad" placeholder="Comunidad Autónoma" bind:value={newUnemploymentAutonomicCommunity}></td>
            <td><input id="Año" type="number" placeholder="Inserte año" bind:value={newUnemploymentYear}></td>
            <td><input id="Trimestre" placeholder="Trimestre" bind:value={newUnemploymentQuarter}></td>
            <td><input id="Tasa" type="number" step="0.1" placeholder="Tasa de desempleo" bind:value={newUnemploymentUnemployment_rate}></td>
            <td><input id="VarAnt" type="number" step="0.01" placeholder="Var. trimestre anterior" bind:value={newUnemploymentPrevious_quarter_var}></td>
            <td><input id="VarSig" type="number" step="0.01" placeholder="Var. mismo trimestre año anterior" bind:value={newUnemploymentPrevious_year_quarter_var}></td>
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
                    <a class="btn btn-warning btn-sm ms-2"
                        href={`/unemployment-stats/${data.autonomic_community}/${data.year}/${data.quarter}`}>
                        Editar
                    </a>
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
