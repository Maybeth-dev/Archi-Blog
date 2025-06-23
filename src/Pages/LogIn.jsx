 // src/Pages/LogIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Components/Nav";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) throw new Error("No user profile found. Please contact support.");

      const data = snap.data();
      const role = data.role || (data.isAuthor ? "author" : "user");

      if (role === "admin") {
        navigate("/admincontrol");
      } else if (role === "author") {
        navigate(`/author/${data.username}`);
      } else {
        navigate(`/profile/${data.username}`);
      }

    } catch (err) {
      console.error(err);
      setMessage('Invalid credentials or missing profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav items={[
        { name: "Home", to: "/" },
        { name: "Sign Up", to: "/signup" }
      ]} />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 pt-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
          <div className="text-center">
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                create a new account
              </a>
            </p>
          </div>

          {message && <div className="text-sm text-red-600 text-center">{message}</div>}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 block text-sm text-gray-900">Remember me</span>
              </label>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"}`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}










// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Nav from "../Components/Nav";
// import { auth, db } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// export default function LogIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//    const handleLogin = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage("");

//   try {
//     const { user } = await signInWithEmailAndPassword(auth, email, password);
//     const snap = await getDoc(doc(db, "users", user.uid));
//     if (!snap.exists()) throw new Error("Profile not found");

//     const data = snap.data();

//           if (role === 'admin') {
//       navigate('/admincontrol');
//     }  else if (role === "author") {
//      navigate(`/author/${data.username}`);
//     } else {
//       navigate(`/profile/${data.username}`);
//     }

//     } catch (err) {
//       console.error(err);
//       setMessage('Invalid credentials. Please check your email or password.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//         <Nav items={[
//         { name: "Home", to: "/" },
//         { name: "Sign Up", to: "/signup" }
//       ]} />
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 pt-8">
//         <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
//           <div className="text-center">
//             <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
//               Sign in to your account
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Or{" "}
//               <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 create a new account
//               </a>
//             </p>
//           </div>

//           {message && <div className="text-sm text-red-600 text-center">{message}</div>}

//           <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600 focus:outline-none"
//                   >
//                     {showPassword ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="ml-2 block text-sm text-gray-900">Remember me</span>
//               </label>
//               <div className="text-sm">
//                 <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
//                 ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"}`}
//               >
//                 {loading ? "Signing in..." : "Sign In"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }


