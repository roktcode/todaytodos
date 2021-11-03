<script>
	import { authStore } from "../stores/authStore.js";
	import todoListStore from "../stores/todoListStore.js";
	import { flip } from "svelte/animate";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { expoOut } from "svelte/easing";
	import {
		loadTodos,
		addTodo,
		deleteTodo,
		toggleCompletedTodo,
	} from "../utils/todosApi.js";

	let todoInput = "";
	let todoInputRef = null;

	let completedTodos = 0;
	let pendingTodos = 0;
	let progress = tweened(0, {
		duration: 300,
		delay: 0,
		easing: expoOut,
	});

	onMount(() => {
		todoInputRef.focus();
	});

	async function getTodos() {
		const todos = await loadTodos($authStore.user.token);
		$todoListStore = todos;
	}

	async function addNewTodo() {
		if (todoInput.trim() === "") return;

		const addedTodo = await addTodo($authStore.user.token, todoInput);

		if (!addedTodo) return;

		$todoListStore = [...$todoListStore, addedTodo];
		todoInput = "";
	}

	async function removeTodo(id) {
		const isDeleted = await deleteTodo($authStore.user.token, id);

		if (!isDeleted) return;

		$todoListStore = $todoListStore.filter((todo) => todo._id !== id);
	}

	async function toggleCompleted(id, text, completed) {
		const updatedTodo = await toggleCompletedTodo(
			$authStore.user.token,
			id,
			text,
			completed
		);

		if (!updatedTodo) return;

		$todoListStore = $todoListStore.map((todo) =>
			todo._id !== id ? todo : updatedTodo
		);
	}

	$: {
		completedTodos = $todoListStore
			.map((todo) => todo.completed)
			.filter((c) => c).length;
		pendingTodos = $todoListStore.length - completedTodos;
		progress.set(
			$todoListStore.length > 0
				? Math.trunc((completedTodos / $todoListStore.length) * 100) || 0
				: 100
		);
	}
</script>

<div class="container">
	<!-- <div class="stats-container">
		<div class="stats-title">🚀 PROGRESS {Math.trunc($progress)}%</div>
		<div class="stats">
			<div class="total">{$todoListStore.length} TOTAL</div>
			<div class="completed">
				{completedTodos} ✅
			</div>
			<div class="pendinng">{pendingTodos} ⏳</div>
		</div>
	</div> -->

	<div class="add-todos">
		<div class="todo-input">
			<form on:submit|preventDefault={addNewTodo}>
				<input
					type="text"
					id="addTodo"
					bind:this={todoInputRef}
					bind:value={todoInput}
					autocomplete="off"
					maxlength="70"
					placeholder="&#xf56b"
					required
					/>
			</form>
			<div class="submit" on:click={addNewTodo}>
				<!-- <input value="&#x2b" class="button" type="submit" on:click={addNewTodo}/> -->
				<!-- <div class="button-div"> -->
					<!-- <i class="fa-solid fa-circle-plus"></i> -->
					<!-- ➕	 -->
					<!-- <i class="fa-solid fa-square-plus"></i> -->
				<!-- </div> -->
				+
			</div>
		</div>
	</div>

	<div class="todo-list">
		{#await getTodos()}
			<div class="loading-todos">Loading todos...</div>
		{:then _}
			<ul>
				{#each $todoListStore as { _id, text, completed } (_id)}
					<li animate:flip in:fade out:fly={{ x: 100 }}>
						<div
							class="content-container"
							on:click={() => toggleCompleted(_id, text, completed)}
						>
							<div class="content-prefix">
								{#if completed}
									<!-- <i class="fa-solid fa-check"></i> -->
									✅
									<!-- <i class=""></i> -->
								{:else}
									<!-- <i class="fa-solid fa-hourglass"></i> -->
									⏳
								{/if}
							</div>
							<div class="content" class:completed>
								<p>{text}</p>
							</div>
						</div>
						<div class="actions">
							<button on:click={() => removeTodo(_id)}>Remove</button>
						</div>
					</li>
				{/each}
			</ul>
		{/await}
	</div>
</div>

<style>
	.container {
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 350px;
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
	}

	.add-todos {
		margin: 1rem 0;
		width: 100%;
	}
	.todo-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: 8px;
		gap: 10px;
	}

	form {
		flex-grow: 1;
		border-bottom: 1px solid var(--input-border-color);

	}

	input {
		width: 100%;
		outline: none;
		text-align: start;
		font-weight: bold;
		font-size: 1.2rem;
		border: none;
		background: var(--input-bg-color);
		caret-color: var(--input-text-indicator-color);
		color: var(--input-text-color);
		font-family: "Noto Sans Mono", monospace;

		padding-left: 4px;
		padding-bottom: 4px;
	
	}

	input:-webkit-search-cancel-button{
    position:relative;
    right:20px;    
}

	input::placeholder {
		opacity: 0.7;
		color: black;
		font-weight: lighter;
		font-size: 0.8rem;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: end;
		transform: scaleX(-1);
		font-family: FontAwesome;
	}

	.submit {
		min-width: 30px;
		height: 30px;
		border-radius: 10%;
		background-color: transparent;
		border: 1px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		font-size: 2rem;
		font-weight: 600;
		padding: 0;
		cursor: pointer;
		transition: all 0.15s;
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
		margin-bottom: 1rem;
	}

	.content-container {
		display: flex;
		justify-content: stretch;
		align-items: center;
		font-size: 1rem;
		transition: all 0.2s;
		flex-grow: 1;
		min-width: 0;
		gap: 0.8rem;
	}

	.content-prefix {
		min-width: 20px;
		min-height: 20px;
		color: var(--li-completed-text-color);
		display: flex;
		justify-content: center;
		align-items: center;
		font-style: normal;
	}

	.content {
		flex-grow: 1;
		min-width: 0;
	}

	.content p {
		overflow-wrap: break-word;
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
		padding: 0.3rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.content.completed {
		text-decoration: line-through;
		/* text-decoration-style: double; */
		font-weight: normal;
		color: var(--li-completed-text-color);
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
			/* justify-content: ; */
		}

		/* .form {
			flex-grow: 1;
		} */
	}

	@media (min-width: 601px) {
		.content-container {
			gap: 1rem;
			font-size: 1.1rem;
		}

		li {
			gap: 1rem;
		}

		.stats-container {
			padding: 1rem;
		}

		.submit {
			width: 40px;
			height: 40px;
		}
	}

	@media (hover: hover) {
		/* .todo-input button:hover {
			background: var(--input-button-hover-color);
			border-color: var(--input-button-hover-border-color);
		} */

		.content-container:hover {
			background: var(--li-hover-color);
			box-shadow: 1px 2px 3px var(--li-hover-box-shadow-color);
			color: var(--li-hover-text-color);
		}

		.content:hover {
			text-decoration: line-through;
		}

		.content.completed:hover {
			text-decoration: none;
			color: var(--li-completed-hover-text-color);
		}

		li button:hover {
			opacity: 0.9;
			cursor: pointer;
			background: var(--li-action-color);
			color: var(--li-action-hover-text-color);
			border-color: var(--bg-color);
		}

		.submit:hover {
			background-color: black;
			color: white;
			border: 1px solid transparent;
		}
	}
</style>
