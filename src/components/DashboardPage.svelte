<script>
	import { authStore } from "../stores/authStore.js";
	import todoListStore from "../stores/todoListStore.js";
	import { flip } from "svelte/animate";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";

	import {
		loadTodos,
		addTodo,
		deleteTodo,
		toggleCompletedTodo,
	} from "../utils/todosApi.js";

	let todoInput = "";
	let todoInputRef = null;
	let buttonAddTodoRef = null;
	let todoListRef = null;

	onMount(() => {
		todoInputRef.focus();

		// buttonAddTodoRef.addEventListener("longpress", function (e) {
		// 	console.log("long live us");
		// });

		// todoListRef.addEventListener("longpress", (e) => {
		// 	// console.log("Hello todoList");
		// 	console.log(e.target);
		// });
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
		todoInputRef.focus();
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
</script>

<div class="container">
	<div class="add-todos">
		<div class="todo-input">
			<form on:submit|preventDefault={addNewTodo}>
				<div class="input-prefix">
					{#if todoInput !== ""}
						<i
							class="fa-solid fa-eraser clear-input"
							on:click={() => {
								todoInput = "";
								todoInputRef.focus();
							}}
						/>
					{:else}
						<i class="fa-solid fa-feather" />
					{/if}
				</div>
				<div class="input-content">
					<input
						type="text"
						id="addTodo"
						bind:this={todoInputRef}
						bind:value={todoInput}
						autocomplete="off"
						maxlength="70"
						required
					/>
					<!-- placeholder="&#xf56b" -->
				</div>
			</form>
			<div
				class="submit"
				on:click={addNewTodo}
				bind:this={buttonAddTodoRef}
				data-long-press-delay="200"
			>
				+
			</div>
		</div>
	</div>

	<div class="todo-list" bind:this={todoListRef} data-long-press-delay="300">
		{#await getTodos()}
			<div class="loading-todos">Loading todos...</div>
		{:then _}
			<ul>
				{#each $todoListStore as { _id, text, completed } (_id)}
					<li
						class:completed
						animate:flip
						in:fade
						out:fly={{ x: 200 }}
						on:longpress={() => console.log("LI pressed")}
					>
						<div class="content-container">
							{#if completed}
								<div class="content-prefix">
									<!-- <i class="fa-solid fa-check"></i> -->
									✅
									<!-- <i class=""></i> -->
								</div>
							{/if}
							<div class="content" class:completed>
								<p>{text}</p>
							</div>
						</div>
						<div class="actions">
							<div
								class="edit"
								on:click={() => toggleCompleted(_id, text, completed)}
							>
								<!-- <i class="fa-solid fa-trash" /> -->
								<i class="fa-solid fa-check" />
							</div>
							<div class="delete" on:click={() => removeTodo(_id)}>
								<!-- <i class="fa-solid fa-minus" /> -->
								<!-- <i class="fa-solid fa-trash"></i> -->
								<i class="fa-solid fa-trash" />
								<!-- DELETE -->
							</div>
						</div>

						<!-- modal start -->

						<!-- modal end -->
					</li>
				{/each}
			</ul>
		{/await}
	</div>
</div>

<style>
	.actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
		/* align-items: baseline; */
		gap: 2rem;
		display: none;
		padding: 0 10px;
	}

	.edit,
	.delete {
		cursor: pointer;
		color: teal;
		/* border: 1px solid teal; */
		/* padding: 1rem; */
		transition: background 0.15s;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.clear-input {
		cursor: pointer;
	}

	.container {
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 350px;
		width: 100%;
		margin: 0 auto;
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
		/* padding-left: 1rem; */
		/* border-bottom: 1px solid var(--input-border-color); */
	}

	form {
		flex-grow: 1;
		border-bottom: 1px solid var(--input-border-color);
		display: flex;
		justify-content: stretch;
		align-items: center;
		gap: 1rem;
	}

	.input-prefix {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: FontAwesome;
		transform: scaleX(-1);
	}

	.input-content {
		flex-grow: 1;
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
		/* padding-left: 4px; */
		padding-bottom: 4px;
		/* text-indent: 2rem; */
		/* border-bottom: 1px solid var(--input-border-color); */
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
		/* max-height: 280px; */
		/* overflow-y: auto; */
		/* padding-right: 1rem; */
		/* -ms-overflow-style: 3px; */
		/* scrollbar-width: 3px; */
		/* direction: rtl; */
		/* padding-right: 1rem; */
	}

	/* .todo-list::-webkit-scrollbar {
		width: 6px;
		background-color: #ddd;
	}

	.todo-list::-webkit-scrollbar-thumb {
		border-radius: 5px;
		background-color: #aaa;
	} */

	.loading-todos {
		direction: ltr;
	}

	ul {
		padding: 0;
		margin: 0;
		list-style-position: inside;
		width: 100%;
		/* direction: ltr; */
	}

	li {
		user-select: none;
		font-weight: 600;
		display: flex;
		justify-content: stretch;
		align-items: center;
		gap: 0.5rem;
		border-radius: 5px;
		transition: all 0.2s;
		margin-bottom: 1rem;
		/* background: var(--li-hover-color); */
		/* background: #dedede; */
		/* background: #333; */
		/* color: white; */
		/* padding: 0 0.5rem; */
		border: 1px solid transparent;
	}

	li.completed {
		background: transparent;
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
		/* cursor: pointer; */
		/* padding: 0 1rem; */
	}

	.content-prefix {
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

	.content.completed {
		text-decoration: line-through;
		font-weight: normal;
		color: var(--li-completed-text-color);
	}

	@media (min-width: 400px) and (max-width: 600px) {
		.container {
			max-width: 450px;
		}
	}

	@media (min-width: 601px) and (max-width: 700px) {
		.container {
			max-width: 500px;
		}

		input {
			font-size: 1.4rem;
		}
	}

	@media (min-width: 701px) {
		.container {
			max-width: 650px;
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
		}
	}

	@media (min-width: 601px) {
		.content-container {
			gap: 1rem;
			font-size: 1.1rem;
		}

		li {
			gap: 1rem;
			/* padding: 0 1rem; */
		}

		.submit {
			width: 40px;
			height: 40px;
		}

		.todo-list {
			/* max-height: 500px; */
			padding-bottom: 2rem;
			margin-top: 1rem;
		}

		/* .actions {
			display: block;
		} */
	}

	@media (hover: hover) {
		/* .content:hover {
			text-decoration: line-through;
			text-decoration-thickness: 3px;
			text-decoration-color: teal;
			font-weight: 600;
		} */

		/* .content.completed:hover {
			text-decoration: none;
			color: var(--li-completed-hover-text-color);
		} */

		.submit:hover {
			background-color: black;
			color: white;
			border: 1px solid transparent;
		}

		li:hover .actions {
			display: flex;
		}

		li:hover {
			border: 1px solid rgba(0, 128, 128, 0.8);
		}

		i {
			font-size: 1.5rem;
		}

		.edit:hover,
		.delete:hover {
			/* background: teal; */
			color: rgba(0, 128, 128, 0.8);
		}
	}
</style>
