// import React from 'react'
// import { Link } from 'react-router-dom'


// const Sidebar = () => {
//   return (
//     <div>
//         <ul>
//             <li><Link to="/dashboard">Dashboard</Link></li>
//             <li><Link to="/dashboard/profile/:username">Profile</Link></li>
//             <li><Link to="/dashboard/settings">Settings</Link></li>
//         </ul>
//     </div>
//   )
// }


// export default Sidebar



import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ items }) {
  return (
    <div className="w-64 bg-white border-r min-h-screen p-4 space-y-4">
      {items.map(i => (
        <Link
          key={i.name}
          to={i.to}
          className="block px-3 py-2 rounded hover:bg-gray-100"
        >
          {i.icon && <i className="mr-2">{i.icon}</i>}
          {i.name}
        </Link>
      ))}
    </div>
  );
}
