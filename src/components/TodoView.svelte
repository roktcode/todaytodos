<script>
	import { flip } from "svelte/animate";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { bounceIn } from "svelte/easing";

	// load todos from localStorage before compnent renders
	onMount(() => {
		loadTodos();
		todoInputRef.focus();
	});

	let todoInput = "";
	let todoInputRef = null;

	let todoList = [];

	function addTodo() {
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
	let progress = tweened(0, {
		duration: 300,
		delay: 0,
		easing: bounceIn,
	});

	$: {
		completedTodos = todoList
			.map((todo) => todo.completed)
			.filter((c) => c).length;

		pendingTodos = todoList.length - completedTodos;
		progress.set(
			todoList.length > 0
				? Math.trunc((completedTodos / todoList.length) * 100) || 0
				: 100
		);
	}
</script>

<div class="container">
	<div class="stats-container">
		<div class="stats-title">PROGRESS 🚀 {Math.trunc($progress)}%</div>
		<div class="stats">
			<div class="total">{todoList.length} TOTAL</div>
			<div class="completed">
				{completedTodos} ✅
			</div>
			<div class="pendinng">{pendingTodos} ⏳</div>
			<!-- <div class="progress">{Math.trunc($progress)}% 🚀</div> -->
		</div>
	</div>

	<div class="add-todos">
		<div class="todo-input">
			<form on:submit|preventDefault={addTodo} class="input">
				<input
					type="text"
					id="addTodo"
					bind:this={todoInputRef}
					bind:value={todoInput}
					autocomplete="off"
					placeholder="📝 what are you up to?"
					maxlength="50"
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
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 0 1.5rem;
		max-width: 100%;
	}

	.todo-input {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}

	input {
		width: 100%;
		padding: 0.8rem 0.5rem;
		outline: none;
		text-align: center;
		font-weight: bold;
		font-size: 1.6rem;
		border: none;
		border: var(--input-border);
		border-bottom: 2px solid var(--input-border-color);
		background: var(--input-bg-color);
		caret-color: var(--input-text-indicator-color);
		color: var(--input-text-color);
	}

	input::placeholder {
		/* color: #ccc; */
		opacity: 0.5;
		font-weight: lighter;
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.add-todos {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		margin: 0 auto;
		max-width: 600px;
	}

	.input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.input button {
		/* border: 1px solid teal; */
		border: var(--input-button-border);
		border-radius: 5px;
		color: white;
		background: var(--input-button-bg-color);
		cursor: pointer;
		transition: all 0.15s;
		font-size: 1.4rem;
		width: 150px;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
	}

	.input button:hover {
		background: var(--input-button-hover-color);
		border-color: var(--input-button-hover-border-color);
	}

	.todo-list {
		max-width: 600px;
		margin: 0 auto;
	}

	ul {
		padding: 0;
		list-style-position: inside;
	}

	li {
		margin-bottom: 1.5rem;
		cursor: pointer;
		user-select: none;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		gap: 4px;
		align-items: center;
		border-radius: 5px;
		transition: all 0.2s;
	}

	.content-container {
		display: flex;
		justify-content: flex-start;
		align-items: baseline;
		overflow-wrap: break-word;
		padding-left: 0.5rem;
		font-size: 1.2rem;
		flex-grow: 1;
		transition: all 0.2s;
		overflow-wrap: break-word;
		max-width: 500px;
	}

	li .content-container:hover {
		background: var(--li-hover-color);
		box-shadow: 1px 2px 3px var(--li-hover-box-shadow-color);
		display: flex;
		color: var(--li-hover-text-color);
	}

	li .content {
		flex-grow: 1;
		padding: 0.5rem 1rem;
		overflow-wrap: break-word;
		max-width: 100%;
	}

	li .content:hover {
		text-decoration: line-through;
	}

	.content-prefix {
		width: 20px;
		height: 20px;
		color: var(--li-completed-text-color);
		/* flex-grow: 1; */
	}

	li button {
		margin: 0;
		background: inherit;
		border: 1px solid var(--li-action-color);
		border-radius: 3px;
		color: var(--li-action-color);
		outline: none;
		transition: all 0.2s;
		width: 100%;
	}

	li button:hover {
		opacity: 0.9;
		cursor: pointer;
		background: var(--li-action-color);
		color: var(--li-action-hover-text-color);
		border-color: var(--bg-color);
	}

	.content.completed {
		text-decoration: line-through;
		text-decoration-style: double;
		font-weight: normal;
		color: var(--li-completed-text-color);
	}

	.content.completed:hover {
		text-decoration: none;
		color: var(--li-completed-hover-text-color);
	}

	.stats-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		padding: 1rem;
		margin: 1rem auto;
		margin-bottom: 4rem;
		color: var(--stats-text-color);
		background: var(--stats-bg-color);
		border-radius: var(--stats-border-radius);
		gap: 1rem;
		max-width: 300px;
		border: var(--stats-container-border);
	}

	.stats-title {
		display: flex;
		justify-content: center;
		font-weight: bold;
		font-size: 1.1rem;
		color: white;
	}

	.stats {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		justify-content: center;
		/* align-items: center; */
		/* font-weight: bold; */
	}
	.empty-todos {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 5rem;
	}

	/* MEDIA QUERSIS */

	@media (max-width: 320px) {
		.container {
			max-width: 320px;
			/* padding: 1rem 0.5rem; */
		}

		.add-todos {
			max-width: 340px;
		}

		.stats-container {
			max-width: 320px;
		}

		.stats {
			text-align: center;
		}

		.todo-list {
			max-width: 320px;
		}

		.content-container {
			max-width: 200px;
			font-size: 1rem;
		}

		.content {
			max-width: 100%;
		}
		input::placeholder {
			font-size: 1rem;
		}
	}
</style>
