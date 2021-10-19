<script>
	import DarkModeSwitch from "./DarkModeSwitch.svelte";

	export let isDarkMode;
</script>

<nav>
	<div class="nav-container">
		<div class="brand">
			<div class="logo">
				<a href="/">Today Todos <span>v1.0.0</span></a>
			</div>
			<div class="dark-switch">
				<DarkModeSwitch isDarkMode={isDarkMode}/>
			</div>
		</div>
		<ul class="nav-links">
			<li><a href="#">Home</a></li>
			<li><a href="#">About</a></li>
			<li><a href="#">Contact</a></li>
		</ul>
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		/* background: #eee; */
		background: var(--navbar-bg-color);
		margin-bottom: 2rem;
		box-shadow: 2px 3px 4px var(--navbar-box-shadow-color);
	}

	.nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		width: 100%;
		max-width: 1200px;
	}

	.nav-container .brand {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
	}

	.nav-container .brand a {
		text-decoration: none;
		color: var(---text-color);
	}

	.nav-container ul {
		list-style-type: none;
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		padding: 0;
		margin: 0;
	}

	.nav-container ul a {
		color: var(	--navbar-text-color);
		font-size: 1.2rem;
	}

	.brand span {
		font-size: 0.75rem;
		font-weight: lighter;
	}

	@media (max-width: 700px) {
		.nav-container {
			flex-direction: column;
			gap: 2rem;
		}

		.nav-container .brand {
			flex-direction: column;
			gap: 2rem;
		}
	}
</style>
