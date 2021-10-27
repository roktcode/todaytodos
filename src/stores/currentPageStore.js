import { writable } from "svelte/store";

export const currentPageStore = writable(
	isAuthenticated() ? "dashboard" : "login"
);

function isAuthenticated() {
	const userString = localStorage.getItem("user");

	if (!userString) return null;

	const json = JSON.parse(userString);

	return json;
}
