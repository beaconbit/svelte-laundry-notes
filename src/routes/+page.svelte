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
                background-color: var(--color-bg-1);
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
                padding: 12px;
                margin-bottom: 6px;
		color: var(--color-text)
                border-radius: 2px;
                border-width: 1px;
		border-style: solid;
		border-color: var(--color-bg-2);
        }
	.row:hover {
                background-color: var(--color-bg-2);
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	        font-family: 'Manrope', sans-serif;
		font-size: 18px;
	}

	h1 {
		width: 100%;
	}

</style>
