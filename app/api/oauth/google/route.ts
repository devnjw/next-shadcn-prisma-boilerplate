import { generateCodeVerifier, generateState } from 'arctic'
import { google } from '@/lib/oauth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { NextApiRequest } from 'next'

const cookeOptions = {
  sameSite: 'lax' as const,
  httpOnly: true,
  maxAge: 60 * 10, // 10 minutes
  secure: process.env.NODE_ENV === 'production',
}

export const GET = async (req: NextApiRequest) => {
  const url = new URL(req.url!)
  const redirect = url.searchParams.get('redirect')
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  cookies().set('code_verifier', codeVerifier, cookeOptions)
  cookies().set('state', state, cookeOptions)
  if (redirect) cookies().set('redirect', redirect, cookeOptions)

  const authorizationURL = await google.createAuthorizationURL(
    state,
    codeVerifier,
    {
      scopes: ['email', 'profile'],
    },
  )

  return NextResponse.redirect(authorizationURL)
}
