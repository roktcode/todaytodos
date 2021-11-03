<script>
	import { authStore } from "../stores/authStore.js";

	function goToSignupPage() {
		$authStore.currentPage = "signup";
	}

	function goToLoginPage() {
		$authStore.currentPage = "login";
	}
</script>

<div class="container">
	<div class="title">
		<h1>Today Todos</h1>
	</div>
	<div class="description">
		<p>Create and manage your todos easily</p>
	</div>

	<div class="actions">
		<div class="signup">
			<p>Don't have an acccount?</p>
			<button on:click={goToSignupPage}>SIGN UP</button>
		</div>
		<div class="login">
			<p>OR</p>
			<button on:click={goToLoginPage}>LOGIN</button>
		</div>
	</div>
</div>

<style>
	.container {
		padding: 0 1.5rem;
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 350px;
		width: 100%;
		margin: 0 auto;
	}

  .container::after {
  content: "";
  background: url(https://images.pexels.com/photos/372098/pexels-photo-372098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940);
	background-size: cover;
	background-repeat: no-repeat;
  opacity: 0.5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;   
}

	.title h1 {
		margin: 0;
	}

	.description {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin-bottom: 2rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 1rem; */
	}

	.actions > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.actions button {
		padding: 0.8rem;
		background: #000;
		color: white;
		width: 150px;
		cursor: pointer;
		box-shadow: 1px 2px 3px #111;
		outline: none;
		border: none;
		font-weight: 600;
		letter-spacing: 2px;
	}

	.login button {
		background: none;
		border: 1px solid black;
		color: black;
		box-shadow: none;
	}

	@media (max-width: 350px) {
		.title,
		.description {
			font-size: 0.7rem;
		}

		.description {
			font-size: 0.8rem;
		}
	}
</style>
