<script>
	// @ts-nocheck
    import {onMount} from "svelte";
	import {options_Spotify} from "../../../../../Secrets/api_keys_gonzalo.js";
	let query = '';
	// @ts-ignore
	let canciones = [];



	
    async function getData(){
        const url = 'https://spotify23.p.rapidapi.com/search/?q=Tornado%20Of%20Souls&type=multi&offset=0&limit=10&numberOfTopResults=5';
        const res = await fetch(url, options_Spotify);
        canciones = await res.json();
    }
	
	
	
	async function buscarCanciones() {
		try {
            const url = `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
            console.log(encodeURIComponent(query));
			const res = await fetch(url, options_Spotify);
			canciones = await res.json();
            console.log(res);
            console.log (canciones);
            console.log(canciones.tracks.items);
            console.log(canciones.tracks.items[0].data.albumOfTrack.coverArt.sources[0].url);
            console.log(canciones.tracks.items[0].data.name);
            console.log(canciones.tracks.items[0].data.uri);
		} catch (error) {
            console.log(error);
        }
	}
	
    onMount(async () =>{
        await buscarCanciones();
    });

</script>

<form on:submit|preventDefault={buscarCanciones}>
	<input bind:value={query} placeholder="Buscar canciones..." />
	<button type="submit">Buscar</button>
</form>

{#if canciones.tracks?.items?.length > 0}
	<ul>
		{#each canciones.tracks.items as item}
			<li>
				<img src={item.data.albumOfTrack.coverArt.sources[0].url} alt="cover" width="50" />
				<strong>{item.data.name}</strong>
				<a href={item.data.uri}><button>Reproducir canción</button></a>
			</li>
		{/each}
	</ul>
{/if}
