<script>
	import Navbar from "./components/Navbar.svelte";
	import TodoView from "./components/TodoView.svelte";
	import Footer from "./components/Footer.svelte";
	import { onMount } from "svelte";

	function loadTheme() {
		const isDark = localStorage.getItem("isDarkMode");
		if (isDark) {
			const json = JSON.parse(isDark);
			if (json === true) document.body.classList.add('dark')
		}
	}

	onMount(() => loadTheme());
</script>

<div class="grid">
	<Navbar />
	<TodoView />
	<Footer />
</div>

<style>
	.grid {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}
</style>
