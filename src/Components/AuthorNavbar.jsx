import React from 'react';
import { Link } from 'react-router-dom';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...',
};

const rightNav = [
  { name: 'Sign Out', href: '/signup', current: false },
  { name: 'Create An Article', href: '/dashboard/articles/edit/:id', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
       
            <div className="hidden md:flex justify-between w-full items-center">
              <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300">
                📰 Archiblog
              </Link>

            
              <div className="flex items-center space-x-4">
                {rightNav.map((item) => (
                    <Link
                    key={item.name}
                    to={item.href}
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
 
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {['Your Profile', 'Settings', 'Sign out'].map((label) => (
                        <MenuItem key={label}>
                        {({ active }) => (
                            <a
                            href="#"
                            className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                            )}
                            >
                            {label}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div> 
            <div className="flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* Mobile Panel */}
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {/* Mobile text logo */}
            <div className="text-white px-3 py-2 font-bold text-lg">📰 Archiblog</div>
            {rightNav.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-4 pb-3">
            <div className="flex items-center px-5">
              <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
              
                 <a  href="/dashboard/articles/edit/:id"  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium" > Create New Article </a>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        </div>
      </main>
    </div>
  );
}
