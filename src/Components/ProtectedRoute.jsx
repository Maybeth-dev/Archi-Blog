 import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthorRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return setAuthorized(false);

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();

      setAuthorized(userData?.isAuthor === true);
    });

    return () => unsubscribe();
  }, []);

  if (authorized === null) return <p className="text-center mt-10">Checking permissions...</p>;
  return authorized ? children : <Navigate to="/userpage" />;
};

export default AuthorRoute;
