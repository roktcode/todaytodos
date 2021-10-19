<script>
	import Navbar from "./components/Navbar.svelte";
	import TodoView from "./components/TodoView.svelte";
	import Footer from "./components/Footer.svelte";
</script>

<div class="container">
	<Navbar />
	<TodoView />
	<Footer />
</div>

<style>
	.container {
		max-width: 800px;
		min-width: 400px;
		margin: 0 auto;
		padding: 2rem 1rem;
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}
</style>
