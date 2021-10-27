<script>
	import { authStore } from "../stores/authStore.js";

	let email = "";
	let password = "";
	let errorText = "";

	async function login() {
		try {
			const response = await fetch(" http://localhost:3000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				console.log("Login failed with code", response.status);
				// errorText = `Login failed with status code ${response.status}`;
				errorText = `Login failed. Try again with valid email, password`;
				return;
			}

			console.log("signup successful");
			const json = await response.json();
			$authStore = { user: json, currentPage: "dashboard" };
			localStorage.setItem("user", JSON.stringify(json));
		} catch (error) {}
	}
</script>

<div class="content">
	<div class="title">
		<h3>LOGIN</h3>
	</div>
	<form class="form" on:submit|preventDefault={login}>
		<div class="email-group">
			<label for="email">Email:</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				autocomplete="off"
				required
			/>
		</div>

		<div class="password-group">
			<label for="password">Password:</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				autocomplete="off"
				required
			/>
		</div>

		<div class="submit-group">
			<button type="submit" on:click={login}>SUBMIT</button>
		</div>
	</form>

	<div class="signup-text">
		<!-- Don't have an account? <a href="/signup" use:link> Sign Up</a> -->
		Don't have account?
		<a
			href=""
			on:click|preventDefault={() => ($authStore.currentPage = "signup")}
			>Sign Up</a
		>

		<!-- <button on:click={() => ($authStore.currentPage = "signup")}>Sign Up</button -->
	</div>
	{#if errorText}
		<div class="error">{errorText}</div>
	{/if}
</div>

<style>
	.title {
		display: flex;
		justify-content: center;
	}

	.content {
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		max-width: 350px;
		width: 100%;
		margin: 0 auto;
		/* margin-top: 4rem; */
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		gap: 10px;
		margin-bottom: 1rem;
	}

	button {
		cursor: pointer;
	}

	.submit-group {
		display: flex;
		justify-content: center;
	}

	input {
		width: 100%;
	}

	.signup-text {
		margin: 1rem 0;
	}

	.signup-text a {
		text-decoration: underline;
	}

	.error {
		margin-top: 2rem;
		color: red;
	}
</style>
