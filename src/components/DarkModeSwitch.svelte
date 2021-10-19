<script>
	import { onMount } from "svelte";

	let isDarkMode = false;

	onMount(() => {
		const isDark = localStorage.getItem("isDarkMode");
		if (isDark) {
			const json = JSON.parse(isDark);
			if (json === true) isDarkMode = true;
		}
		// console.log(isDark);
	});

	function toggleDarkMode() {
		// document.body.classList.toggle("dark");
		document.documentElement.setAttribute(
			"data-theme",
			isDarkMode ? "dark" : "light"
		);
		localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
	}
</script>

<div class="switch">
	<div class="switch-text">Light</div>
	<div>
		<input
			type="checkbox"
			bind:checked={isDarkMode}
			on:change={toggleDarkMode}
			id="switch"
			name="theme"
		/><label for="switch">Toggle</label>
	</div>
	<div class="switch-text">Dark</div>
</div>

<style>
	.switch {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	input[type="checkbox"] {
		height: 0;
		width: 0;
		visibility: hidden;
	}

	label {
		cursor: pointer;
		text-indent: -9999px;
		width: 52px;
		height: 27px;
		background: grey;
		float: right;
		border-radius: 100px;
		position: relative;
	}

	label:after {
		content: "ss";
		position: absolute;
		top: 3px;
		left: 3px;
		width: 20px;
		height: 20px;
		background: #fff;
		border-radius: 90px;
		transition: 0.3s;
	}

	input + label {
		background: var(--dark-switch-bg-color);
	}

	input:checked + label:after {
		left: calc(100% - 5px);
		transform: translateX(-100%);
	}

	/* label:active:after {
		width: 45px;
	} */
</style>
