 // src/App.jsx
import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Pages
import HomePage from './Pages/Homepage';
import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import UserProfile from './Pages/UserProfile';
import AuthorProfile from './Pages/AuthorProfile';
import AdminControl from './Pages/AdminControl';
import ArticlePage from './Pages/ArticlePage';
import ArticleForm from './Pages/ArticleForm';
import BecomeAuthor from './Pages/BecomeAuthor';

// Components
import Search from './Components/Search';
import PrivateRoute from './Components/PrivateRoute';
 

  function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (u) => {
        try {
          if (u) {
            setUser(u);
            const snap = await getDoc(doc(db, 'users', u.uid));
            const data = snap.exists() ? snap.data() : {};
            setRole(data.role || (data.isAuthor ? 'author' : 'user'));
          } else {
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error("Auth state setup error:", err);
        } finally {
          setLoading(false);
        }
      });
      return unsub;
    }, []);


  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/search" element={<Search />} />
      <Route path="/articlepage/:id" element={<ArticlePage />} />

      {/* Profile Routes */}
      <Route path="/profile/:username" element={<UserProfile />} />
      <Route path="/author/:username" element={<AuthorProfile />} />
      <Route path="/admincontrol" element={<AdminControl />} />

      {/* Author Features */}
      <Route path="/becomeauthor" element={<BecomeAuthor />} />
      <Route path="/articles/new" element={<ArticleForm />} />
      <Route path="/articles/edit/:id" element={<ArticleForm />} />

  

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
