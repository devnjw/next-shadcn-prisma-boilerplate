import { TodoItem } from '@/components/todo/todo-item'
import { AddTodo } from '@/components/todo/add-todo'
import { getTodos, addTodo, toggleTodo, deleteTodo } from '@/lib/action/todo'

export default async function TodoList() {
  const todos = await getTodos()

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-card-foreground">
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
