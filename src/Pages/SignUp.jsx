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

    
    const cleanName = name.trim().toLowerCase();

    try {
      
      const q = query(collection(db, "users"), where("username", "==", cleanName));
      const snap = await getDocs(q);
      if (!snap.empty) return setMessage("Username already taken.");

       
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

       
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
