'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/action/auth'

export async function getTodos() {
  const { user } = await validateRequest()
  return await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
    where: user ? { userId: user.id } : { userId: null },
  })
}

export async function addTodo(text: string) {
  const { user } = await validateRequest()
  await prisma.todo.create({
    data: {
      text,
      completed: false,
      userId: user?.id,
    },
  })
  revalidatePath('/')
}

export async function toggleTodo(id: string) {
  const { user } = await validateRequest()
  const todo = await prisma.todo.findUnique({
    where: { id },
  })

  if (!todo) {
    console.warn(`Todo with id ${id} not found`)
    return
  }

  await prisma.todo.update({
    where: { id, userId: user?.id },
    data: { completed: !todo.completed },
  })
  revalidatePath('/')
}

export async function deleteTodo(id: string) {
  const { user } = await validateRequest()
  await prisma.todo.delete({
    where: { id, userId: user?.id },
  })
  revalidatePath('/')
}
