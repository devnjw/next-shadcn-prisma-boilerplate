import { TodoItem } from '@/components/todo/todo-item'
import { AddTodo } from '@/components/todo/add-todo'
import { getTodos, addTodo, toggleTodo, deleteTodo } from '@/lib/action/todo'

export default async function TodoList() {
  const todos = await getTodos()

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-card p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold text-card-foreground">
        Todo List
      </h1>
      <AddTodo addTodo={addTodo} />
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  )
}
