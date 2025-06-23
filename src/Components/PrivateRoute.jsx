// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ user, role, allowedRoles, children }) => {
//   if (!user) return <Navigate to="/login" />;

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default PrivateRoute

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ user, role, allowedRoles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}






// import React from 'react'
// import { Navigate } from 'react-router-dom'

// const PrivateRout = ({ user, role, allowedRoles, children }) => {
//   if (!user) {
//     // not signed in
//     return <Navigate to="/login" replace />
//   }
//   if (allowedRoles && !allowedRoles.includes(role)) {
//     // signed in but wrong role
//     return <Navigate to="/" replace />
//   }
//   return children
// }

// export default PrivateRoute
