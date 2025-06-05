<script lang="ts">
        import { fly } from 'svelte/transition';

	let { data = [] } = $props();
	let machines = $state(data.machines);
	let message = $state('default');
	let machine = $state('');

	const handleFocus = () => {
	}
	const handleBlur = () => {
	}
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
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div class="wrapper">
    <input type="text" onfocus={handleFocus} onblur={handleBlur} value={message} oninput={(e) => (message = e.target.value)}>
    <input type="text" onfocus={handleFocus} onblur={handleBlur} value={machine} oninput={(e) => (machine = e.target.value)}>
    <div class="sendButton" onclick={() => sendMessage()}></div>
  </div>

  <div class="wrapper">
    {#each machines as machine (machine)}
       <div 
         class="row"
         transition:fly={{ x: 200, duration: 500 }}
       >
       <a href="/notes/{machine}">{machine}</a>
       <div class="deleteButton" onclick={() => deleteMachine({machine})}></div>
       </div>
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
