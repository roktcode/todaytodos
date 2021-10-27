<script>
	import { authStore } from "../stores/authStore.js";
	import LoginPage from "./LoginPage.svelte";
	import SignupPage from "./SignupPage.svelte";
	import DashboardPage from "./DashboardPage.svelte";
</script>


{#if $authStore.currentPage === "login"}
	<LoginPage />
{:else if $authStore.currentPage === "signup"}
	<SignupPage />
{:else if $authStore.currentPage === "dashboard"}
	<DashboardPage />
{:else}
	<LoginPage />
{/if}
