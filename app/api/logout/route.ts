import { lucia } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { validateRequest } from '@/lib/action/auth'

export const GET = async () => {
  const { session } = await validateRequest()
  if (!session) {
    return {
      error: 'Unauthorized',
    }
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_BASE_URL).toString(),
  )
}
