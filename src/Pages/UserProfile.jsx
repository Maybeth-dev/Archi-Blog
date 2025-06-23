//  // src/pages/UserProfile.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Nav from '../Components/Nav';
// import { auth, db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';

// const UserProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(db, 'users', user.uid));
//         if (userDoc.exists()) {
//           setUserData(userDoc.data());
//         }
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   const handleSignOut = async () => {
//     await signOut(auth);
//     navigate('/login');
//   };

//   const navItems = [
//     { name: 'Home', to: '/' },
//     { name: 'Become an Author', to: '/becomeauthor' },
//     { name: 'Sign Out', onClick: handleSignOut }
//   ];

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <>
//       <Nav items={navItems} />
//       <main className="pt-16 min-h-screen bg-gray-50 py-10">
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
//           <h1 className="text-2xl font-semibold text-gray-800 mb-2">
//             Welcome to your Profile, {userData?.username || 'User'}!
//           </h1>
//           <p className="text-gray-600">
//             This is your dashboard. You can manage your account here.
//           </p>

//           <div className="mt-6 grid gap-4 sm:grid-cols-2">
//             <div className="bg-gray-100 p-4 rounded">
//               <p className="font-medium">Email:</p>
//               <p className="text-gray-700">{userData?.email}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded">
//               <p className="font-medium">Role:</p>
//               <p className="text-gray-700">
//                 {userData?.role || (userData?.isAuthor ? 'Author' : 'User')}
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//             <button
//               onClick={() => navigate('/')}
//               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//             >
//               See the Latest Updates
//             </button>

//             <button
//               onClick={() => navigate('/becomeauthor')}
//               className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
//             >
//               Become an Author
//             </button>

//             <button
//               onClick={handleSignOut}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default UserProfile; 

//  

























import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Nav from '../Components/Nav';

export default function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserByUsername = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('username', '==', username.toLowerCase())
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          console.error('No user found with username:', username);
          return;
        }
        const data = snapshot.docs[0].data();
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserByUsername();
  }, [username]);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Sign Out', to: '/login' },
  ];

  return (
    <>
      <Nav items={navItems} />
      <main className="pt-16 min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to your Profile, {userData?.username || 'User'}!
          </h1>
          <p className="text-gray-600">
            This is your dashboard. You can manage your account here.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-medium">Email:</p>
              <p className="text-gray-700">{userData?.email}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-medium">Role:</p>
              <p className="text-gray-700">{userData?.role || 'User'}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              See the Latest Updates
            </button>

            <button
              onClick={() => navigate('/becomeauthor')}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Become an Author
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
