'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Button from '../ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn, logout } = useAuth()

  const handleSignOut = () => {
    logout()
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Your Logo
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center space-x-8 sm:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <Button label="Signout" variant="outline" size="small" onClick={handleSignOut} />
            ) : (
              <Button label="Login" variant="outline" size="small" onClick={handleLogin} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="space-y-2 px-3 py-4">
                {isLoggedIn ? (
                  <Button label="Signout" variant="outline" className="w-full" onClick={handleSignOut} />
                ) : (
                  <Button label="Login" variant="outline" className="w-full" onClick={handleLogin} />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
