import App from "./App.svelte";

// function getTheme() {
// 	const isDark = localStorage.getItem("isDarkMode");
// 	if (isDark) {
// 		const json = JSON.parse(isDark);
// 		if (json === true) document.body.classList.add("dark");
// 	}
// }

const app = new App({
	target: document.body,
});

// getTheme()

export default app;
