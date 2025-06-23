// // Nav.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
// import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
// import { Bars3Icon } from '@heroicons/react/24/outline';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Nav({ items, user, onSignOut }) {
//   return (
//     <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full z-50">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link to="/" className="text-2xl font-bold text-white">📰 Archiblog</Link>

//           <div className="hidden md:flex space-x-4">
//             {items.map(item => (
//               item.onClick === 'logout' ? (
//                 <button
//                   key={item.name}
//                   onClick={onSignOut}
//                   className={classNames('rounded-md px-3 py-2 text-sm font-medium', item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white')}
//                 >
//                   {item.name}
//                 </button>
//               ) : (
//                 <Link
//                   key={item.name}
//                   to={item.to}
//                   className={classNames('rounded-md px-3 py-2 text-sm font-medium', item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white')}
//                 >
//                   {item.name}
//                 </Link>
//               )
//             ))}

//             {user && (
//               <Menu as="div" className="relative ml-4">
//                 <MenuButton className="flex items-center rounded-full focus:ring-2 focus:ring-white">
//                   <img className="h-8 w-8 rounded-full" src={user.photoURL || '/default-avatar.png'} alt="User avatar"/>
//                 </MenuButton>
//                 <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
//                   {['Profile', 'Settings', 'Sign out'].map(label => (
//                     <MenuItem key={label}>
//                       {({ active }) => (
//                         <Link
//                           to={label === 'Profile' ? `/dashboard/profile/${user.displayName}` : '#'}
//                           onClick={label === 'Sign out' ? onSignOut : undefined}
//                           className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
//                         >
//                           {label}
//                         </Link>
//                       )}
//                     </MenuItem>
//                   ))}
//                 </MenuItems>
//               </Menu>
//             )}
//           </div>

//           <div className="md:hidden">
//             <DisclosureButton className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
//               <Bars3Icon className="h-6 w-6"/>
//             </DisclosureButton>
//           </div>
//         </div>
//       </div>

//       <DisclosurePanel className="md:hidden bg-gray-800">
//         {items.map(item => (
//           item.onClick === 'logout' ? (
//             <button key={item.name} onClick={onSignOut} className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
//               {item.name}
//             </button>
//           ) : (
//             <Link key={item.name} to={item.to} className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
//               {item.name}
//             </Link>
//           )
//         ))}
//       </DisclosurePanel>
//     </Disclosure>
//   );
// }
 // src/Components/Nav.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
// import { Bars3Icon } from '@heroicons/react/24/outline';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Nav({ items }) {
//   return (
//     <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full z-50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-white">
//             📰 Archiblog
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex md:space-x-4">
//             {items.map(item =>
//               item.onClick ? (
//                 <button
//                   key={item.name}
//                   onClick={item.onClick}
//                   className={classNames(
//                     'text-gray-300 hover:bg-gray-700 hover:text-white',
//                     'rounded-md px-3 py-2 text-sm font-medium'
//                   )}
//                 >
//                   {item.name}
//                 </button>
//               ) : (
//                 <Link
//                   key={item.name}
//                   to={item.to}
//                   className={classNames(
//                     'text-gray-300 hover:bg-gray-700 hover:text-white',
//                     'rounded-md px-3 py-2 text-sm font-medium'
//                   )}
//                 >
//                   {item.name}
//                 </Link>
//               )
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
//               <span className="sr-only">Open main menu</span>
//               <Bars3Icon className="h-6 w-6" aria-hidden="true" />
//             </DisclosureButton>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <DisclosurePanel className="md:hidden bg-gray-800">
//         <div className="space-y-1 px-2 pb-3 pt-2">
//           {items.map(item =>
//             item.onClick ? (
//               <DisclosureButton
//                 key={item.name}
//                 as="button"
//                 onClick={item.onClick}
//                 className={classNames(
//                   'text-gray-300 hover:bg-gray-700 hover:text-white',
//                   'block rounded-md px-3 py-2 text-base font-medium w-full text-left'
//                 )}
//               >
//                 {item.name}
//               </DisclosureButton>
//             ) : (
//               <DisclosureButton
//                 key={item.name}
//                 as={Link}
//                 to={item.to}
//                 className={classNames(
//                   'text-gray-300 hover:bg-gray-700 hover:text-white',
//                   'block rounded-md px-3 py-2 text-base font-medium'
//                 )}
//               >
//                 {item.name}
//               </DisclosureButton>
//             )
//           )}
//         </div>
//       </DisclosurePanel>
//     </Disclosure>
//   );
// }





// src/Components/Nav.jsx
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
