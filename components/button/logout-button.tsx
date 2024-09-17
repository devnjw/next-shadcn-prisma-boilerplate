import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function LogoutButton() {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 sm:bottom-6 sm:px-0">
      <Link href="/api/logout" className="w-full max-w-xs">
        <Button size="lg" className="w-full">
          Sign out
        </Button>
      </Link>
    </div>
  )
}
