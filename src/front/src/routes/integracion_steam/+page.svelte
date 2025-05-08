<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	const options = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': '327d45c5e8mshf516faabaaf6508p130521jsn4b72c45e09cb',
			'x-rapidapi-host': 'games-details.p.rapidapi.com'
		}
	};

	// @ts-ignore
	let juegos = [];
	let query = '';

	async function buscarJuegos() {
		try {
			let url = `https://games-details.p.rapidapi.com/search?sugg=${encodeURIComponent(query)}`;
			const res = await fetch(url, options);
			juegos = await res.json();
            console.log(res);
			console.log(juegos);
            console.log(juegos.data.search[0]);
            console.log(juegos.data.search[0].name);
            console.log(juegos.data.search[0].price);
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		await buscarJuegos();
	});
</script>

<form on:submit|preventDefault={buscarJuegos}>
	<input bind:value={query} placeholder="Buscar juegos..." />
	<button type="submit">Buscar</button>
</form>

{#if juegos.data?.search?.length > 0}
	<ul>
		{#each juegos.data.search as item}
			<li>
				<img src={item.image} alt="cover" width="50" />
				<strong>{item.name}</strong>
                <strong>{item.price}</strong>
			</li>
		{/each}
	</ul>
{/if}
