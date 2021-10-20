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
		<div class="stats-title">🚀 PROGRESS {Math.trunc($progress)}%</div>
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
			<div class="form">
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
				</form>
			</div>
			<div class="submit">
				<button type="submit" on:click={addTodo}>ADD</button>
			</div>
		</div>
	</div>

	<!-- {#if todoList.length === 0}
		<div class="empty-todos">
			<p>No todos yet 📭</p>
		</div>
	{:else} -->
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
						{#if completed}
							<div class="content-prefix">✔</div>
						{/if}
						<div class="content" class:completed>
							<p>{text}</p>
						</div>
					</div>
					<div class="actions">
						<button on:click={() => removeTodo(id)}>Remove</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
	<!-- {/if} -->
</div>

<style>
	.container {
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 350px;
		width: 100%;
		margin: 0 auto;
	}

	.stats-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		padding: 0.5rem;
		margin: 1rem auto;
		margin-bottom: 2rem;
		color: var(--stats-text-color);
		background: var(--stats-bg-color);
		border-radius: var(--stats-border-radius);
		gap: 1rem;
		max-width: 250px;
		border: var(--stats-container-border);
		box-shadow: var(--stats-container-box-shadow);
	}

	.stats-title {
		display: flex;
		justify-content: center;
		font-weight: bold;
		font-size: 1rem;
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

	.add-todos {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		margin: 1rem 0;
		width: 100%;
	}

	.todo-input {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}

	.submit {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	input {
		width: 100%;
		outline: none;
		text-align: center;
		font-weight: bold;
		font-size: 1.2rem;
		border: none;
		border: var(--input-border);
		border-bottom: 1px solid var(--input-border-color);
		background: var(--input-bg-color);
		caret-color: var(--input-text-indicator-color);
		color: var(--input-text-color);
	}

	input::placeholder {
		/* color: #ccc; */
		opacity: 0.5;
		font-weight: lighter;
		font-size: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	.todo-input button {
		border: var(--input-button-border);
		border-radius: 5px;
		color: white;
		background: var(--input-button-bg-color);
		cursor: pointer;
		transition: all 0.15s;
		font-size: 1rem;
		width: 80px;
		height: 35px;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0.5rem 0;
	}

	.todo-input button:hover {
		background: var(--input-button-hover-color);
		border-color: var(--input-button-hover-border-color);
	}

	.todo-list {
		width: 100%;
	}

	ul {
		padding: 0;
		list-style-position: inside;
		width: 100%;
	}

	li {
		cursor: pointer;
		user-select: none;
		font-weight: bold;
		display: flex;
		justify-content: stretch;
		align-items: center;
		gap: 0.5rem;
		border-radius: 5px;
		transition: all 0.2s;
	}

	.content-container {
		display: flex;
		justify-content: stretch;
		align-items: baseline;
		font-size: 1.3rem;
		transition: all 0.2s;
		flex-grow: 1;
		min-width: 0;
		gap: 0.5rem;
	}

	.content-container:hover {
		background: var(--li-hover-color);
		box-shadow: 1px 2px 3px var(--li-hover-box-shadow-color);
		display: flex;
		color: var(--li-hover-text-color);
	}

	.content-prefix {
		width: 20px;
		height: 20px;
		color: var(--li-completed-text-color);
		/* flex-grow: 1; */
	}

	.content {
		flex-grow: 1;
		/* padding: 0.5rem 1rem; */
		min-width: 0;
	}

	.content p {
		overflow-wrap: break-word;
	}

	.content:hover {
		text-decoration: line-through;
	}

	li button {
		margin: 0;
		background: inherit;
		border: 1px solid var(--li-action-color);
		border-radius: 3px;
		color: var(--li-action-color);
		outline: none;
		transition: all 0.2s;
		font-size: 0.8rem;
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
		/* text-decoration-style: double; */
		font-weight: normal;
		color: var(--li-completed-text-color);
	}

	.content.completed:hover {
		text-decoration: none;
		color: var(--li-completed-hover-text-color);
	}

	@media (min-width: 400px) and (max-width: 600px) {
		.container {
			max-width: 450px;
		}

		li button {
			font-size: 0.9rem;
		}
	}

	@media (min-width: 601px) and (max-width: 700px) {
		.container {
			max-width: 500px;
		}

		input {
			font-size: 1.4rem;
		}

		li button {
			font-size: 1rem;
		}
	}

	@media (min-width: 701px) {
		.container {
			max-width: 600px;
		}

		.add-todos button {
			width: 100px;
			height: 42px;
		}

		li button {
			font-size: 1rem;
		}

		input {
			font-size: 1.6rem;
		}

		input::placeholder {
			font-size: 1.2rem;
		}

		.todo-input {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1rem;
			/* justify-content: ; */
		}

		.form {
			flex-grow: 1;
		}
	}

	@media (min-width: 601px) {
		.content-container {
			gap: 1rem;
		}

		li {
			gap: 1rem;
		}

		.stats-container {
			padding: 1rem;
		}
	}
</style>
