<script>
	import TodoView from "./components/TodoView.svelte";
	import Footer from "./components/Footer.svelte";
</script>

<div class="container">
	<TodoView />
	<Footer />
</div>

<style>
	.container {
		min-height: 100vh;
		display: grid;
		grid-template-rows: 1fr auto;
	}
</style>
