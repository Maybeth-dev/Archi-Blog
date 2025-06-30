 

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ user, role, allowedRoles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}





 