<script>
	import { flip } from "svelte/animate";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";

	// load todos from localStorage before compnent renders
	onMount(() => {
		loadTodos();
		todoInputRef.focus();
	});

	let todoInput = "";
	let todoInputRef = null;

	let todoList = [];

	function addTodo(text) {
		if (todoInput === "") return;

		const nextId =
			todoList.length > 0
				? Math.max(
						...todoList.map((todo) => {
							return todo.id;
						})
				  ) + 1
				: 1;

		todoList = [...todoList, { id: nextId, text: todoInput, completed: false }];
		todoInput = "";

		saveTodos();
	}

	function removeTodo(id) {
		const todoToDelete = todoList.find((todo) => todo.id === id);

		if (!todoToDelete) return;

		todoList = todoList.filter((todo) => todo.id !== id);

		saveTodos();
	}

	function toggleCompleted(id) {
		const targetTodo = todoList.find((todo) => todo.id === id);

		if (!targetTodo) return;

		targetTodo.completed = !targetTodo.completed;

		todoList = todoList.map((todo) => (todo.id !== id ? todo : targetTodo));

		saveTodos();
	}

	function saveTodos() {
		localStorage.setItem("todos", JSON.stringify(todoList));
	}

	function loadTodos() {
		const todosJSON = localStorage.getItem("todos");

		if (todosJSON) {
			todoList = JSON.parse(todosJSON);
		}
	}

	let completedTodos = 0;
	let pendingTodos = 0;
	let progress = 0;

	$: {
		completedTodos = todoList
			.map((todo) => todo.completed)
			.filter((c) => c).length;

		console.log("hi");

		pendingTodos = todoList.length - completedTodos;
		progress =
			todoList.length > 0
				? Math.trunc((completedTodos / todoList.length) * 100) || 0
				: 100;
	}
</script>

<div class="container">
	<div class="title">
		<h3>Today Todos <span>v1.0.0</span></h3>
	</div>
	<div class="stats-container">
		<div class="stats-title">STATS</div>
		<div class="stats">
			<div class="total">{todoList.length} TOTAL</div>
			<div class="completed">
				{completedTodos} ✅
			</div>
			<div class="pendinng">{pendingTodos} ⏳</div>
			<div class="progress">{progress}% 🏃🏼</div>
		</div>
	</div>

	<div class="add-todos">
		<div class="todo-input">
			<!-- <label id="addLabel" for="addTodo">📝 Add new item</label> -->
			<form on:submit|preventDefault={addTodo} class="input">
				<input
					type="text"
					id="addTodo"
					bind:this={todoInputRef}
					bind:value={todoInput}
					autocomplete="off"
					placeholder="What are you up to?"
					maxlength="20"
					required
				/>
				<button type="submit">ADD</button>
			</form>
		</div>
	</div>

	{#if todoList.length === 0}
		<div class="empty-todos">
			<p>No todos yet 📭</p>
		</div>
	{:else}
		<div class="todo-list">
			<ul>
				{#each todoList as { id, text, completed }, idx (id)}
					<li
						animate:flip
						in:fade
						out:fly={{ x: 100 }}
						on:click={() => toggleCompleted(id)}
					>
						<div class="content-container">
							<div class="content-prefix">
								{#if completed}
									✔
								{:else}
									⏳
								{/if}
							</div>
							<div class="content" class:completed>
								{text}
							</div>
						</div>
						<div class="actions">
							<button on:click={() => removeTodo(id)}>Remove</button>
						</div>
						<!-- <div class="content-container">

					</div> -->
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		min-width: 400px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.title {
		display: flex;
		justify-content: center;
		max-width: 400px;
		/* background: #aaa; */
		color: #333;
		margin: 0 auto 3rem;
	}

	.title span {
		font-size: 0.75rem;
		opacity: 0.5;
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
		user-select: none;
		font-weight: bold;
		display: flex;
		padding-left: 0.5rem;
		/* padding: 0.5rem 0; */
		/* flex-direction: column; */
		justify-content: space-between;
		align-items: center;
		max-width: 400px;
		/* border: 1px solid teal; */
		border-radius: 5px;
		transition: all 0.2s;
	}

	li:hover {
		background: #ddd;
		box-shadow: 1px 2px 3px #eee;
	}

	.content-container {
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		font-size: 1.2rem;
		flex-grow: 1;
	}
	li .content {
		padding: 0.5rem 1rem;
		overflow-wrap: break-word;
		max-width: 309px;
	}

	.content-prefix {
		width: 20px;
		height: 20px;
		color: teal;
		/* flex-grow: 1; */
	}

	li button {
		margin: 0;
		background: tomato;
		color: white;
		outline: none;
		border: none;
		transition: all 0.2s;
		/* font-size: 1.5rem; */
		width: 100%;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	li button:hover {
		opacity: 0.9;
		cursor: pointer;
	}

	.todo-list {
		max-width: 400px;
	}

	ul {
		max-width: 400px;
		padding: 0;
		list-style-position: inside;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		outline: none;
		/* border: 1px solid teal; */
		text-align: center;
		font-size: 1.2rem;
		font-weight: bold;
		font-size: 2rem;
	}

	input::placeholder {
		opacity: 0.5;
		font-weight: normal;
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
		color: teal;
		border: 2px solid teal;
		border-radius: 5px;
		/* color: white; */
		cursor: pointer;
		transition: all 0.15s;
		font-size: 1.4rem;
	}

	.input button:hover {
		/* opacity: 0.9; */
		background: teal;
		color: white;
	}

	/* #addLabel {
		margin: 1rem 0;
	} */

	.content.completed {
		text-decoration: line-through;
		font-weight: normal;
		color: teal;
	}

	.todo-list {
		max-width: 400px;
		margin: 0 auto;
	}

	.stats-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		padding: 1rem;
		margin: 2rem auto;
		color: #ccc;
		background: #333;
		border-radius: 5px;
		box-shadow: 1px 2px 4px #666;
		gap: 1rem;
		max-width: 400px;
	}

	.stats-title {
		display: flex;
		justify-content: center;
		font-weight: bold;
		font-size: 1.1rem;
		color: #eee;
	}

	.stats {
		display: flex;
		flex-direction: row;
		gap: 50px;
		justify-content: center;
		/* align-items: center; */
	}

	.empty-todos {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
	}

	/* MEDIA QUERSIS */

	@media (max-width: 360px) {
		.container {
			max-width: 360px;
			padding: 1rem 0.5rem;
		}

		ul {
			max-width: 360px;
		}

		.title {
			max-width: 360px;
		}

		.add-todos {
			max-width: 350px;
		}

		.stats-container {
			max-width: 360px;
		}

		.stats {
			text-align: center;
		}

		.todo-list {
			max-width: 360px;
		}
	}
</style>
