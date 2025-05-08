<script>
    // @ts-nocheck
    
        import {onMount} from "svelte";
        // @ts-ignore
        import { Button, Table, Alert } from '@sveltestrap/sveltestrap';
        // @ts-ignore
        let datos = [];
        async function getData(){
            try{
                const res = await fetch('http://localhost:16078/api/v1/integrations/g12');
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
                <th>Año</th>
                <th>Electricidad</th>
                <th>Gas</th>
                <th>Consumo total</th>
                <th>Emisiones de CO2</th>
            </tr>
        </thead>
        <tbody>
            {#each datos as consumption}
            <tr>
                <td>
                   {consumption.aacc}
                </td>
                <td>
                    {consumption.year}
                </td>
                <td>
                    {consumption.electricity}
                </td>
                <td>
                    {consumption.gas}
                </td>
                <td>
                    {consumption.total_consumption}
                </td>
                <td>
                    {consumption.co2_emission}
                </td>
            </tr>
            {/each}
        </tbody>
    </Table>