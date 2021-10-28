import { writable } from "svelte/store";

export const authStore = writable(loadUserData());

function loadUserData() {
	const userString = localStorage.getItem("user");

	if (!userString) {
		return {
			currentPage: "welcome",
			user: null,
		};
	}

	const json = JSON.parse(userString);

	return {
		currentPage: "dashboard",
		user: json,
	};
}
