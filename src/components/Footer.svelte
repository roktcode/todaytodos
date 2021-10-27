<footer>
	<div class="version">
		<p>Today Todos v2.0</p>
	</div>

	<div class="author">
		<p>
			Developed by <a target="_blank" href="https://roktlandr.vercel.app"
				>Muhammad Yasser</a
			> at the 2021
		</p>
	</div>
</footer>

<style>
	footer {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		align-items: center;
		text-align: center;
		margin-top: 100px;
		font-size: 0.8rem;
		padding: 1rem;
	}

	footer p {
		margin: 0;
	}

	footer a {
		text-decoration: underline;

		color: var(--footer-link-color);
	}

	@media (max-width: 600px) {
		footer {
			flex-direction: column;
		}
	}
</style>
