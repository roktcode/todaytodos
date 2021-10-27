<script>
	import { authStore } from "../stores/authStore.js";

	function logout() {
		$authStore = { currentPage: "login", user: null };
		localStorage.removeItem("user");
	}
</script>

<nav>
	<div class="nav-container">
		<div class="brand">
			<div class="logo">
				<a href="/">
					{$authStore.user ? $authStore.user.name + "'s" : "Today"} Todos
				</a>
			</div>
		</div>

		{#if $authStore.user}
			<ul class="nav-links">
				<li><button on:click={logout}>Logout</button></li>
			</ul>
		{/if}
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
		/* box-shadow: 1px 2px 3px var(--navbar-box-shadow-color); */
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
		gap: 4rem;
		padding: 0;
		margin: 0;
	}

	.nav-container a {
		color: var(--navbar-text-color);
		font-size: 1.2rem;
		font-weight: 600;
	}

	/* .brand span {
		font-size: 0.75rem;
		font-weight: lighter;
	} */

	button {
		cursor: pointer;
	}

	@media (max-width: 500px) {
		.nav-container {
			flex-direction: column;
			gap: 1rem;
		}

		.nav-container ul {
			gap: 3rem;
			margin: 0;
		}

		.nav-container .brand {
			flex-direction: column;
			gap: 2rem;
		}
	}
</style>
