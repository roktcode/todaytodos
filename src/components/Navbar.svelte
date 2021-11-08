<script>
	import { authStore } from "../stores/authStore.js";
	import ProgressBar from "@okrad/svelte-progressbar";
	import todoListStore from "../stores/todoListStore.js";

	let completedTodos;
	let progress;

	$: {
		completedTodos = $todoListStore
			.map((todo) => todo.completed)
			.filter((c) => c).length;

		progress =
			$todoListStore.length > 0
				? Math.trunc((completedTodos / $todoListStore.length) * 100) || 0
				: 0;
	}

	function logout() {
		$authStore = { currentPage: "welcome", user: null };
		localStorage.removeItem("user");
	}
</script>

<nav>
	<div class="nav-container">
		<div class="left">
			<div class="brand">
				<div class="logo">
					<a href="/">
						{$authStore.user ? $authStore.user.name + "'s" : "Today"} Todos
					</a>
				</div>
			</div>

			{#if $authStore.user}
				<div class="logout">
					<a href="" on:click|preventDefault={logout}>Logout</a>
				</div>
			{/if}
		</div>

		<div class="stats-container">
			<div id="stats">
				<ProgressBar
					series={[
						{
							perc: progress,
							color: "#008080",
						},
					]}
					bgColor="#444"
					valueLabel={progress < 100 ? `PROGRESS: ${progress}%` : "ALL DONE 💪🏼"}
					labelColor="white"
					height="40"
					width="200"
					ry={5}
					rx={5}
					textSize={120}
				/>
			</div>
		</div>
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
		gap: 5rem;
	}

	.left {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
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

	.nav-container .logo a {
		color: var(--navbar-text-color);
		font-size: 1.2rem;
		font-weight: 600;
	}

	@media (max-width: 500px) {
		.nav-container {
			flex-direction: column;
			gap: 1rem;
		}

		.brand {
			order: 1;
		}

		.stats-container {
			order: 3;
			margin-top: 1rem;
		}

		.logout {
			order: 2;
		}

		.nav-container .brand {
			flex-direction: column;
			gap: 2rem;
		}
	}
</style>
