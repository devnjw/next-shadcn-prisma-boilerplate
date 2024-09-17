import { google } from '@/lib/oauth'
import { NextApiRequest } from 'next'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { lucia } from '@/lib/auth'
import { generateIdFromEntropySize } from 'lucia'
import { OAuth2RequestError } from 'arctic'

export const GET = async (req: NextApiRequest) => {
  try {
    const url = new URL(req.url!)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const codeVerifier = cookies().get('code_verifier')?.value
    const savedState = cookies().get('state')?.value
    const redirect = cookies().get('redirect')?.value

    if (
      !code ||
      !state ||
      !codeVerifier ||
      !savedState ||
      state !== savedState
    ) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { idToken } = await google.validateAuthorizationCode(
      code,
      codeVerifier,
    )
    const idTokenParts = idToken.split('.')
    const googleUser = JSON.parse(
      Buffer.from(idTokenParts[1], 'base64').toString(),
    ) as GoogleUser

    if (!googleUser.email_verified) {
      return Response.json({ error: 'Email not verified' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
      return NextResponse.redirect(
        new URL(redirect || '/', process.env.NEXT_PUBLIC_BASE_URL).toString(),
        {
          status: 302,
          headers: {
            'Set-Cookie': sessionCookie.serialize(),
          },
        },
      )
    }

    const userId = generateIdFromEntropySize(10)
    await prisma.user.create({
      data: {
        id: userId,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
    return NextResponse.redirect(
      new URL(redirect || '/', process.env.NEXT_PUBLIC_BASE_URL).toString(),
      {
        status: 302,
        headers: {
          'Set-Cookie': sessionCookie.serialize(),
        },
      },
    )
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 })
    }
    return new Response(null, { status: 500 })
  }
}

interface GoogleUser {
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture: string
}
