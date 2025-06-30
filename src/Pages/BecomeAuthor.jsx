 import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import Nav from '../Components/Nav';

const BecomeAuthor = () => {
  const [showForm, setShowForm] = useState(false);
  const [bio, setBio] = useState('');
  const [genre, setGenre] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Sign Out', onClick: handleLogout } 
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setMessage('You must be signed in.');
      return;
    }

    try { 
      
      await setDoc(doc(db, 'users', user.uid), { 
        isAuthor: true, 
        role: 'author', 
        bio, 
        genre 
      }, { merge: true });
      
      const username = user.displayName || user.email.split('@')[0];
      navigate(`/author/${username}`);
      setMessage('Author request submitted!');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <> 
    <Nav items={navItems} />
    <div className="pt-16 min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Become an Author
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Author Application</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Genre</label>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
            {message && <p className="text-sm text-center text-red-600">{message}</p>}
          </form>
        )}
      </div>
    </div>
    </>
  );
};

export default BecomeAuthor;
 