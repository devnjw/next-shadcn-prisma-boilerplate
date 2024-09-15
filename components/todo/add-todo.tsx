'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AddTodo({
  addTodo,
}: {
  addTodo: (text: string) => Promise<void>
}) {
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      await addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
        className="mr-2 flex-grow text-primary"
      />
      <Button type="submit">Add</Button>
    </form>
  )
}
