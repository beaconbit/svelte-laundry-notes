<script lang="ts">
	const { data } = $props()
        import Notespanel from '$lib/components/Notespanel.svelte';
</script>

<svelte:head>
	<title>{data.machine}</title>
	<meta name="description" content={data.machine} />
</svelte:head>

<section>
  <Notespanel notes={data.notes} machine={data.machine} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

</style>
