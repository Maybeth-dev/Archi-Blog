import React from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Nav({ items }) {
  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">📰 Archiblog</Link>

          <div className="hidden md:flex space-x-4">
            {items.map(i =>
              i.onClick ? (
                <button
                  key={i.name}
                  onClick={i.onClick}
                  className={classNames(
                    'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  {i.name}
                </button>
              ) : (
                <Link
                  key={i.name}
                  to={i.to}
                  className={classNames(
                    'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  {i.name}
                </Link>
              )
            )}
          </div>

          <div className="md:hidden">
            <DisclosureButton className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md">
              <Bars3Icon className="h-6 w-6" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden bg-gray-800">
        <div className="space-y-1 px-2 py-3">
          {items.map(i =>
            i.onClick ? (
              <DisclosureButton
                key={i.name}
                as="button"
                onClick={i.onClick}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
              >
                {i.name}
              </DisclosureButton>
            ) : (
              <DisclosureButton
                key={i.name}
                as={Link}
                to={i.to}
                className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
              >
                {i.name}
              </DisclosureButton>
            )
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
