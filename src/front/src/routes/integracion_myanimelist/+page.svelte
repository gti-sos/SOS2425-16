<script>
	let animes = [];
	let queryName = '';

	async function buscarAnimes() {
		try {
			let url = `https://api.jikan.moe/v4/anime?q=${queryName}`;
			const res = await fetch(url);
			animes = await res.json();
			console.log(animes);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<form on:submit|preventDefault={buscarAnimes}>
	<input bind:value={queryName} placeholder="Buscar animes..." />
	<button type="submit">Buscar</button>
</form>

{#if animes}
	<ul>
		{#each animes.data as item}
			<li>
				<img src={item.images.jpg.image_url} alt="cover" width="50" />
				<strong>{item.title}</strong>
				<i>Episodios: {item.episodes}</i>
			</li>
		{/each}
	</ul>
{/if}
