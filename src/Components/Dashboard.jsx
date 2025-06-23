import React from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const leftNav = [
  { name: 'Archiblog', to: '/', current: false }
]

const rightNav = [
  { name: 'Become an Author', to: '/dashboard/articles/edit/:id', current: true   },
  { name: 'Sign Out', to: null, current: false, onClick: 'logout' }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Desktop menu */}
            <div className="hidden md:flex justify-between w-full items-center">
              {/* Left nav */}
              <div className="flex space-x-4">
                {leftNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right nav */}
              <div className="flex items-center space-x-4">
                {rightNav.map((item) =>
                  item.onClick === 'logout' ? (
                    <button
                      key={item.name}
                      onClick={handleLogout}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3 bg-gray-800">
            {[...leftNav, ...rightNav].map((item) =>
              item.onClick === 'logout' ? (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
 
        </div>
      </main>
    </div>
  )
}
