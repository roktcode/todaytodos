import { writable } from "svelte/store";



export default writable(loadTodos() || []);

function loadTodos() {
	const todosString = localStorage.getItem("todos");

	if (todosString) {
		const json = JSON.parse(todosString);
		return json
	}
}
