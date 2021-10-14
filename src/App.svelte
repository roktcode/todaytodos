<script>
  import {flip} from 'svelte/animate'

	let todoList = [
		{ id: 1, text: "Continue developing my website", completed: false },
		{
			id: 2,
			text: "Add new lesson to the speakArabic website",
			completed: false,
		},
		{ id: 3, text: "Learn moree about online payment", completed: false },
		{ id: 4, text: "Checkout directus CMS", completed: false },
		{ id: 5, text: "Add a blog post to mhmd.vercel.app", completed: false },
	];

	let todoInput = "";

	function addTodo(text) {
		// console.log(todoInput)
		if (todoInput === "") return;

		const nextId =
			Math.max(
				...todoList.map((todo) => {
					return todo.id;
				})
			) + 1;

		todoList = [ { id: nextId, text: todoInput, completed: false }, ...todoList];
		todoInput = "";
	}

	function toggleCompleted(id) {
		const targetTodo = todoList.find((todo) => todo.id === id);

		if (!targetTodo) return;

		targetTodo.completed = !targetTodo.completed;

		todoList = todoList.map((todo) => (todo.id !== id ? todo : targetTodo));
	}
</script>

<div class="container">
	<div class="title">
		<h3>Today Todos</h3>
	</div>

	<div class="add-todos">
		<div class="todo-input">
			<label id="addLabel" for="addTodo">📝 Add new item</label>
			<form on:submit|preventDefault={addTodo} class="input">
				<input
					type="text"
					id="addTodo"
					bind:value={todoInput}
					autocomplete="off"
          required
				/>
				<button type="submit">Add</button>
			</form>
		</div>
	</div>
	<div class="todo-list">
		<ul>
			{#each todoList as { id, text, completed }, idx (id)}
				<li animate:flip class:completed on:click={() => toggleCompleted(id)}>
					{text}
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.title {
		display: flex;
		justify-content: center;
	}

	.todo-input {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}

	li {
		margin-bottom: 1rem;
		cursor: pointer;
    overflow-wrap: break-word;
    user-select: none;
	}
  
	ul {
    max-width: 400px;
    padding: 0;
    list-style-position: inside;
	}
  
	input {
		width: 100%;
    padding: .5rem;
    outline: none;
		box-shadow: none;
    border: 1px solid black;

	}

	.add-todos {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		margin: 0 auto;
		max-width: 400px;
	}

	.input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
	}

	.input button {
		background-color: darkorchid;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.input button:hover {
		opacity: 0.9;
	}

	#addLabel {
		margin: 1rem 0;
	}

	.completed {
		text-decoration: line-through;
		font-weight: bold;
	}

	.todo-list {
		max-width: 400px;
		margin: 0 auto;
	}
</style>
