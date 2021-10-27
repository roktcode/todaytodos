<script>
	import { authStore } from "../stores/authStore.js";

	let name = "";
	let email = "";
	let password = "";
	let errorText = "";

	async function signup() {
		try {
			const response = await fetch("https://today-todos-api.herokuapp.com/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});

			if (!response.ok) {
				console.log(
					response.status,
					"Sign up failed with code",
					response.statusText
				);
				// errorText = `Sign up failed with status code ${response.statusText}`;
				errorText = `Sign up failed. Make sure to enter a name with at least 2 characters, valid email, and password with at least 2 characters`;
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
	<div class="title"><h3>Sign Up</h3></div>

	<div class="name-group">
		<label for="name">Name:</label>
		<input
			type="text"
			id="name"
			bind:value={name}
			autocomplete="off"
			required
		/>
	</div>

	<form class="form" on:submit|preventDefault={signup}>
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
			<button type="submit" on:click={signup}>SUBMIT</button>
		</div>
	</form>

	<div class="signup-text">
		Already have an account?
		<a
			href=""
			on:click|preventDefault={() => ($authStore.currentPage = "login")}
			>Login</a
		>
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
