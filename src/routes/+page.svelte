<script lang="ts">
	const { data = [] } = $props();
	const machines = data.machines;
	console.log(data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="wrapper">
	{#each machines as machine}
			<a href="/notes/{machine}" class="row">
				<span>{machine}</span>
			</a>
	{/each}
	</div>
</section>

<style>
        .wrapper {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                width: 100vw;
                max-width: 400px;
                background-color: rgba(50, 50, 50, 1);
                box-sizing: border-box;
                border-radius: 12px;
                padding: 12px;
        }
        .row {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                box-sizing: border-box;
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 6px;
		color: rgba(115,105,115,1);
                border: 2px solid rgba(75,75,75,1);
        }
	.row:hover {
                border: 2px solid rgba(255,255,255,1);
		color: rgba(255,255,255,1);
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	        font-family: 'Manrope', sans-serif;
		font-size: 22px;
	}

	h1 {
		width: 100%;
	}

</style>
