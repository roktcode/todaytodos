// get Todos
export async function loadTodos(token) {
	try {
		const response = await fetch("http://localhost:3000/api/todos", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const todos = await response.json();

		return todos;
	} catch (error) {
		console.log(error);
	}
}

// add Todo
export async function addTodo(token, todoText) {
	try {
		const response = await fetch(" http://localhost:3000/api/todos", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: todoText }),
		});

		const addedTodo = response.json();
		return addedTodo;
	} catch (error) {
		console.log(error)
		return null;
	}
}

// delete Todos
export async function deleteTodo(token, todoId) {
	try {
		const response = await fetch(`http://localhost:3000/api/todos/${todoId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.ok;
	} catch (error) {
		console.log(error);
		return null;
	}
}

// toggle completed
export async function toggleCompletedTodo(token, id, text, completed) {
	try {
		const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: text, completed: !completed }),
		});

		const updatedTodo = await response.json();
		return updatedTodo;
	} catch (error) {
		console.log(error);
		return null;
	}
}
