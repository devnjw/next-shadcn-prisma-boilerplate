import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function LoginButton({ redirect }: { redirect?: string }) {
  const url = redirect
    ? `/api/oauth/google?redirect=${redirect}`
    : '/api/oauth/google'

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 sm:bottom-6 sm:px-0">
      <Link href={url} className="w-full max-w-xs">
        <Button size="lg" className="w-full">
          Sign in with Google
        </Button>
      </Link>
    </div>
  )
}
