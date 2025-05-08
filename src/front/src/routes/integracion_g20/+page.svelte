<script>
// @ts-nocheck

    import {onMount} from "svelte";
    // @ts-ignore
    import { Button, Table, Alert } from '@sveltestrap/sveltestrap';
    // @ts-ignore
    let datos = [];
    async function getData(){
        try{
            const res = await fetch('http://localhost:16078/api/v1/integrations/g20');
            if(res.status === 200){
                datos = await res.json();
            }
            // @ts-ignore
            console.log(`Response received:\n${JSON.stringify(datos, null, 2)}`);
        }catch (error){
            console.log("ERROR");
        }
    }

    onMount(async () =>{
        await getData();
    });
</script>

<Table>
    <thead>
        <tr>
            <th>Comunidad Autónoma</th>
            <th>Accidentes fatales</th>
            <th>Fallecidos</th>
            <th>Vehículos que no pasaron las revisión</th>
            <th>Año</th>
        </tr>
    </thead>
    <tbody>
        {#each datos as accident}
        <tr>
            <td>
               {accident.autonomous_community}
            </td>
            <td>
                {accident.fatal_accidents}
            </td>
            <td>
                {accident.deceased}
            </td>
            <td>
                {accident.vehicles_without_mot}
            </td>
            <td>
                {accident.year}
            </td>
        </tr>
        {/each}
    </tbody>
</Table>




