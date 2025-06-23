//  import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../Components/Navbar";
// import { auth, db } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

// const SignUp = () => {
//   const [email, setemail] = useState('');
//   const [password, setpassword] = useState('');
//   const [name, setname] = useState('');
//   const [message, setmessage] = useState('');
//   const navigate = useNavigate();

//   // 🔒 Auto-redirect if user is already signed in
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         navigate(`/dashboard/profile/${name || "user"}`);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate, name]);

//   const handleSignUp = async () => {
//     setmessage("");

//     // ✅ Basic validation
//     if (!name || !email || !password) {
//       setmessage("All fields are required.");
//       return;
//     }
//     if (password.length < 6) {
//       setmessage("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       // 🔍 Check if username already exists
//       const usernameQuery = query(
//         collection(db, "users"),
//         where("username", "==", name)
//       );
//       const usernameSnapshot = await getDocs(usernameQuery);

//       if (!usernameSnapshot.empty) {
//         setmessage("Username already taken. Please choose another.");
//         return;
//       }

//       // 🔐 Create user
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // 💾 Save user to Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         username: name,
//         email,
//         uid: user.uid,
//         role: 'user',
//         isAuthor: false,
//         createdAt: new Date(),
//       });

//       console.log("User signed up:", {
//         uid: user.uid,
//         email: user.email,
//         username: name,
//       });
 
//       navigate(`/dashboard/profile/${name}`);
//     } catch (error) {
//       console.error("Signup error:", error);
//       setmessage("Signup failed: " + error.message);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
//         <div className="w-full max-w-md p-8 bg-white border rounded shadow-md">
//           <h2 className="text-2xl font-bold text-center text-gray-900">Create a new account</h2>

//           {message && <p className="text-red-500 text-sm text-center mt-2">{message}</p>}

//           <div className="mt-6 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
//                 onChange={(e) => setname(e.target.value.trim())}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
//                 onChange={(e) => setemail(e.target.value.trim())}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
//                 onChange={(e) => setpassword(e.target.value)}
//               />
//             </div>

//             <button
//               onClick={handleSignUp}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
//             >
//               Sign Up
//             </button>

//             <p className="text-sm text-center text-gray-600">
//               Already have an account?{' '}
//               <a href="/login" className="text-blue-600 hover:underline">
//                 Log in
//               </a>
//             </p>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default SignUp;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Nav from "../Components/Nav";
// import { auth, db } from "../firebase";
// import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { doc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";

// export default function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//  navigate(`/profile/${name}`);


//   const handleSignUp = async () => {
//     setMessage("");
//     if (!name || !email || !password) {
//       return setMessage("All fields are required.");
//     }
//     if (password.length < 6) {
//       return setMessage("Password must be at least 6 characters.");
//     }
//     // check username
//     const q = query(collection(db, "users"), where("username", "==", name));
//     if (!(await getDocs(q)).empty) {
//       return setMessage("Username already taken.");
//     }
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password);
//       await setDoc(doc(db, "users", user.uid), {
//         username: name,
//         email,
//         uid: user.uid,
//         role: "user",
//         isAuthor: false,
//         createdAt: serverTimestamp()
//       }, { merge: true });
//       navigate(`/profile/${name}`);
//     } catch (e) {
//       setMessage("Signup failed: " + e.message);
//     }
//   };
//      const navItems = [
//     { name: 'Home', to: '/' },
//     { name: 'Become an Author', to: '/becomeauthor' },
//     { name: 'Sign Out', onClick: handleSignOut }
//   ];
  
//   return (
//     <>
//       <Nav items={navItems} />

//       <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
//         <div className="w-full max-w-md p-8 bg-white border rounded shadow-md">
//           <h2 className="text-2xl font-bold text-center">Create a new account</h2>
//           {message && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}
//           <div className="mt-6 space-y-4">
//             <label className="block">
//               <span className="text-sm font-medium">Name</span>
//               <input type="text" onChange={e => setName(e.target.value.trim())}
//                      className="mt-1 w-full border px-3 py-2 rounded" />
//             </label>
//             <label className="block">
//               <span className="text-sm font-medium">Email</span>
//               <input type="email" onChange={e => setEmail(e.target.value.trim())}
//                      className="mt-1 w-full border px-3 py-2 rounded" />
//             </label>
//             <label className="block">
//               <span className="text-sm font-medium">Password</span>
//               <input type="password" onChange={e => setPassword(e.target.value)}
//                      className="mt-1 w-full border px-3 py-2 rounded" />
//             </label>
//             <button onClick={handleSignUp}
//                     className="w-full bg-blue-600 text-white py-2 rounded">
//               Sign Up
//             </button>
//             <p className="text-center text-sm">
//               Already have an account? <a href="/login" className="text-blue-600">Log In</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

 


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Components/Nav";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setMessage("");
    if (!name || !email || !password) {
      return setMessage("All fields are required.");
    }
    if (password.length < 6) {
      return setMessage("Password must be at least 6 characters.");
    }

    // enforce lowercase usernames
    const cleanName = name.trim().toLowerCase();

    try {
      // check username uniqueness
      const q = query(collection(db, "users"), where("username", "==", cleanName));
      const snap = await getDocs(q);
      if (!snap.empty) return setMessage("Username already taken.");

      // create auth user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: cleanName,
        email,
        uid: user.uid,
        role: "user",
        isAuthor: false,
        createdAt: serverTimestamp()
      });

      // navigate using lowercase
      navigate(`/profile/${cleanName}`);
    } catch (e) {
      console.error(e);
      setMessage("Signup failed: " + e.message);
    }
  };

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Become an Author', to: '/becomeauthor' },
  ];

  return (
    <>
      <Nav items={navItems} />

      <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 bg-white border rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Create a new account</h2>
          {message && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Username</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
              />
            </label>
            <button
              onClick={handleSignUp}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Sign Up
            </button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600">Log In</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
