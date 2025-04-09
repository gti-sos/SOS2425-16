<script>
    let API = "http://localhost:16078/api/v1/emigration-stats";

    import {onMount} from "svelte";

    let emigration_data = [];
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado


    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});
            const data = res.json(); //asumo que la respuesta es json, o esta parseada asi
            result = JSON.stringify(data,null,2); // para mostrarlo al usuario
            // @ts-ignore
            emigration_data = data;
        } catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
        
    }

    onMount(async () =>{
        getData();
    });
    
</script>

<h2> Emigration Stats</h2>
