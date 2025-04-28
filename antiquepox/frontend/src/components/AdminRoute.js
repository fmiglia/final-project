import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Importing Navigate component from react-router-dom for navigation
import { Store } from '../Store'; // Importing Store context to access user information

export default function AdminRoute({ children }) {
  const { state } = useContext(Store); // Accessing global state from Store context
  const { userInfo } = state; // Destructuring userInfo from global state

  // Rendering children if userInfo exists and user is admin, otherwise navigating to sign-in page
  return userInfo && userInfo.isAdmin ? children : <Navigate to='/signin' />;
}
