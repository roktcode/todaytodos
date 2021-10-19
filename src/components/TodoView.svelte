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
		<div class="stats-title">STATS</div>
		<div class="stats">
			<div class="total">{todoList.length} TOTAL</div>
			<div class="completed">
				{completedTodos} ✅
			</div>
			<div class="pendinng">{pendingTodos} ⏳</div>
			<div class="progress">{Math.trunc($progress)}% 🚀</div>
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
					placeholder="what are you up to?"
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
		/* padding: 0.5rem 0; */
		/* flex-direction: column; */
		justify-content: space-between;
		gap: 4px;
		align-items: center;
		/* max-width: 400px; */
		/* border: 1px solid teal; */
		border-radius: 5px;
		transition: all 0.2s;
	}
	.content-container {
		display: flex;
		justify-content: flex-start;
		align-items: baseline;
		overflow-wrap: break-word;

		padding: 0 1rem;
		/* justify-content: space-between; */
		font-size: 1.2rem;
		flex-grow: 1;
		transition: all 0.2s;
		/* max-width: 290px; */
		overflow-wrap: break-word;
	}

	li .content-container:hover {
		background: #ddd;
		box-shadow: 1px 2px 3px #eee;
		display: flex;
	}

	li .content {
		flex-grow: 1;
		padding: 0.5rem 1rem;
		overflow-wrap: break-word;
		max-width: 100%;
		/* max-width: 300px; */
	}

	li .content:hover {
		text-decoration: line-through;
	}

	.content-prefix {
		width: 20px;
		height: 20px;
		color: teal;
		/* flex-grow: 1; */
	}

	li button {
		margin: 0;
		background: teal;
		color: white;
		outline: none;
		border: none;
		transition: all 0.2s;
		width: 100%;
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
		text-align: center;
		font-weight: bold;
		font-size: 1.6rem;
		border: none;
		border-bottom: 2px solid lightcoral;
	}

	input::placeholder {
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
		max-width: 400px;
	}

	.input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.input button {
		/* border: 1px solid teal; */
		border: none;
		border-radius: 5px;
		color: white;
		background: lightcoral;
		cursor: pointer;
		transition: all 0.15s;
		font-size: 1.4rem;
		width: 150px;
	}

	.input button:hover {
		opacity: 0.9;
		transform: scaleX(1.1);

		/* background: teal; */
		/* color: white; */
	}

	.content.completed {
		text-decoration: line-through;
		text-decoration-style: double;
		font-weight: normal;
		color: teal;
	}

	.content.completed:hover {
		text-decoration: none;
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
		color: black;
		/* background: lightcoral; */
		/* background: #ccc; */
		background: linear-gradient(270deg, #ddd, #eee);
		border-radius: 5px;
		/* box-shadow: 1px 2px 4px #666; */
		gap: 1rem;
		max-width: 400px;
	}

	.stats-title {
		display: flex;
		justify-content: center;
		font-weight: bold;
		font-size: 1.1rem;
		color: black;
	}

	.stats {
		display: flex;
		flex-direction: row;
		gap: 50px;
		justify-content: center;
		/* align-items: center; */
		/* font-weight: bold; */
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

		.content-container {
			max-width: 250px;
		}
	}
</style>
