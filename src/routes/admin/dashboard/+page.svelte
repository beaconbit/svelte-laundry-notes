<script lang="ts">
        import ElapsedClock from '$lib/components/ElapsedClock.svelte';

	let { data = [] } = $props();
	console.log(data);
	console.log(data.result);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
<!--
       <ElapsedClock timestamp={Date.now() - 5000} /> 
-->
  <div class="wrapper">
    {#each data.result as note}
	<ElapsedClock timestamp={note.created} /> 
    {/each}
  </div>


</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

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
		border: 2px solid rgba(75,75,75,1);
	}
	.deleteButton {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: rgba(237,111,102,1); 
		color: white;
		cursor: pointer;
		border: none;
		outline: none;
		user-select: none;
	}
	.sendButton {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background-color: rgba(37,211,102,1); 
		margin-left: 4px;
		color: white;
		font-size: 1rem;
		cursor: pointer;
		border: none;
		outline: none;
		user-select: none;
	}
	input {
		all: unset;
		font-size: 22px;
		width: 100%;
		box-sizing: border-box;
		border: 2px solid rgba(75,75,75,1);
		margin-bottom: 12px;
		border-radius: 12px;
		padding: 0.5rem;
		font-family: inherit;
		margin-right: 4px;
		color: rgba(255,255,255,1);
	}


</style>
