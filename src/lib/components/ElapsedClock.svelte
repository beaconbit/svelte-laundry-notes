<script>
	const { timestamp } = $props();

	const start = new Date(timestamp);

	let elapsed = $state('00:00:00');

	const updateElapsed = () => {
		const now = new Date();
		const diff = Math.floor((now.getTime() - start.getTime()) / 1000);

		const hours = String(Math.floor(diff / 3600) - 12).padStart(2, '0');
		const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
		const seconds = String(diff % 60).padStart(2, '0');

		elapsed = `${hours}:${minutes}:${seconds}`
	};

	// Update every second
	const interval = setInterval(updateElapsed, 1000);

	// Clean up when component unmounts
	$effect(() => {
		return () => clearInterval(interval);
	});
</script>

<p>{elapsed}</p>

