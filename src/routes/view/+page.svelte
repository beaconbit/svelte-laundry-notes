<script lang="ts">
	let { data = [] } = $props();

	async function deleteMachine(machineToDelete) {
                if (machineToDelete.length === 0) { return; }
                const result = await fetch('/api/admin-delete-notes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ engineer: machineToDelete.machine })
                });
                if (result.ok) {
			const newMachines = machines.filter(x => x != machineToDelete.machine);
			machines = newMachines;
                }
	}
        async function sendMessage() {
                if (message.length === 0 || machine.length === 0) { return; }
                const result = await fetch('/api/admin-create-note', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: message, engineer: machine })
                });
                if (result.ok) {
			const newMachines = [...machines, machine];
			machines = newMachines;
			machine = '';
                }

        }
	console.log("bloody basket balls: ", data);
</script>

<svelte:head>
	<title>View</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>

</section>

<style>
</style>
