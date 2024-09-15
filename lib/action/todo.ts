'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export async function getTodos() {
  return await prisma.todo.findMany()
}

export async function addTodo(text: string) {
  await prisma.todo.create({
    data: {
      text,
      completed: false,
    },
  })
  revalidatePath('/')
}

export async function toggleTodo(id: string) {
  const todo = await prisma.todo.findUnique({
    where: { id },
  })

  if (!todo) {
    console.warn(`Todo with id ${id} not found`)
    return
  }

  await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  })
  revalidatePath('/')
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({
    where: { id },
  })
  revalidatePath('/')
}
