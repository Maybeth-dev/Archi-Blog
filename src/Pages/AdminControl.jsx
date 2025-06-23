//  import React, { useEffect, useState } from 'react';
// import {
//   collection, query, getDocs, doc,
//   addDoc, updateDoc, deleteDoc, onSnapshot
// } from 'firebase/firestore';
// import { db, auth } from '../firebase';
// import { onAuthStateChanged } from 'firebase/auth';

// export default function AdminControl() {
//   const [admin, setAdmin] = useState(null);
//   const [articles, setArticles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentArticle, setCurrentArticle] = useState(null);
//   const [form, setForm] = useState({ title: '', content: '' });
//   const [snackbar, setSnackbar] = useState('');

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const docRef = doc(db, 'users', user.uid);
//         const snap = await getDocs(collection(db, 'users'), );
//         setAdmin(snap.docs.find(d => d.id === user.uid)?.data() || {});
//       }
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const articlesRef = collection(db, 'articles');
//     const unsubA = onSnapshot(articlesRef, (snapshot) => {
//       setArticles(snapshot.docs.map(d => ({
//         id: d.id, ...d.data()
//       })));
//     });

//     const usersRef = collection(db, 'users');
//     const unsubU = onSnapshot(usersRef, (snapshot) => {
//       setUsers(snapshot.docs.map(d => ({
//         id: d.id, ...d.data()
//       })));
//     });

//     return () => { unsubA(); unsubU(); };
//   }, []);

//   const resetForm = () => {
//     setCurrentArticle(null);
//     setForm({ title: '', content: '' });
//   };

//   const showSnackbar = msg => {
//     setSnackbar(msg);
//     setTimeout(() => setSnackbar(''), 3000);
//   };

//   const handleArticleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentArticle) {
//         await updateDoc(doc(db, 'articles', currentArticle.id), {
//           ...form, updatedAt: new Date()
//         });
//         showSnackbar('Article updated');
//       } else {
//         await addDoc(collection(db, 'articles'), {
//           ...form,
//           author: admin.username,
//           published: false,
//           createdAt: new Date()
//         });
//         showSnackbar('Article created');
//       }
//       resetForm();
//     } catch {
//       showSnackbar('Error saving article');
//     }
//   };

//   const handleEdit = article => {
//     setCurrentArticle(article);
//     setForm({ title: article.title, content: article.content });
//   };

//   const handleDelete = async id => {
//     await deleteDoc(doc(db, 'articles', id));
//     showSnackbar('Deleted article');
//   };

//   const togglePublish = async (article) => {
//     await updateDoc(doc(db, 'articles', article.id), {
//       published: !article.published
//     });
//     showSnackbar(article.published ? 'Unpublished article' : 'Published article');
//   };

//   const toggleAuthorRole = async (user) => {
//     const userRef = doc(db, 'users', user.id);
//     await updateDoc(userRef, { role: user.role === 'author' ? 'user' : 'author' });
//     showSnackbar(`User role updated to ${user.role === 'author' ? 'user' : 'author'}`);
//   };

//   if (!admin) return <p>Loading...</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-bold">
//         Admin Panel — Hello, {admin.username || admin.email}
//       </h1>

//       {/* Article Form */}
//       <form onSubmit={handleArticleSubmit} className="p-4 bg-gray-50 rounded shadow">
//         <h2 className="font-semibold text-xl mb-2">
//           {currentArticle ? 'Edit Article' : 'Create New Article'}
//         </h2>
//         <input
//           className="w-full border p-2 mb-2 rounded"
//           placeholder="Title"
//           value={form.title}
//           onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
//           required
//         />
//         <textarea
//           className="w-full border p-2 mb-2 rounded"
//           placeholder="Content"
//           rows="4"
//           value={form.content}
//           onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
//           required
//         />
//         <div className="flex gap-2">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             {currentArticle ? 'Update' : 'Create'}
//           </button>
//           {currentArticle && (
//             <button
//               type="button"
//               className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={resetForm}
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Article List */}
//       <div className="p-4 bg-white rounded shadow">
//         <h2 className="text-xl font-semibold mb-2">All Articles</h2>
//         <ul className="space-y-4">
//           {articles.map(a => (
//             <li key={a.id} className="border p-3 rounded">
//               <h3 className="font-bold">{a.title}</h3>
//               <p className="text-sm text-gray-600">By {a.author}</p>
//               <p>{a.content.slice(0, 100)}…</p>
//               <p className="text-sm">Published: {a.published ? 'Yes' : 'No'}</p>
//               <div className="mt-2 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(a)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => togglePublish(a)}
//                   className={`text-sm px-2 py-1 rounded ${a.published ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
//                 >
//                   {a.published ? 'Unpublish' : 'Publish'}
//                 </button>
//                 <button
//                   onClick={() => handleDelete(a.id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* User Role Management */}
//       <div className="p-4 bg-gray-50 rounded shadow">
//         <h2 className="text-xl font-semibold mb-2">Manage User Roles</h2>
//         <ul className="space-y-2">
//           {users.map(u => (
//             <li key={u.id} className="border p-2 rounded flex justify-between items-center">
//               <div>
//                 <p><strong>{u.username || u.email}</strong> ({u.email})</p>
//                 <p className="text-sm text-gray-600">Role: {u.role}</p>
//               </div>
//               <button
//                 onClick={() => toggleAuthorRole(u)}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
//               >
//                 Set as {u.role === 'author' ? 'User' : 'Author'}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Snackbar */}
//       {snackbar && (
//         <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
//           {snackbar}
//         </div>
//       )}
//     </div>
//   );
// }



  import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Nav from '../Components/Nav';

export default function AdminControl() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState({});
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '' });
  const [snackbar, setSnackbar] = useState('');

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) setAdmin(snap.data());
      } else {
        setUser(null);
        setAdmin({});
      }
    });
    return unsubscribe;
  }, []);

  // Fetch all articles
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'articles'), snap => {
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(all);
    });
    return unsub;
  }, []);

  // Fetch all users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(all);
    });
    return unsub;
  }, []);

  const navItems = [{ name: 'Dashboard', to: '/' }];

  const notify = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(''), 3000);
  };

  const reset = () => {
    setCurrent(null);
    setForm({ title: '', content: '', imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin.username && !admin.email) {
      notify("Admin info not loaded. Try again shortly.");
      return;
    }

    const data = {
      ...form,
      authorName: admin.username || admin.email || 'Admin',
      authorId: user?.uid,
      published: false,
      createdAt: new Date()
    };

    try {
      if (current) {
        await updateDoc(doc(db, 'articles', current.id), data);
        notify('Article updated.');
      } else {
        await addDoc(collection(db, 'articles'), data);
        notify('Article created.');
      }
      reset();
    } catch (err) {
      console.error(err);
      notify('Error saving article.');
    }
  };

  const togglePublish = async (article) => {
    try {
      await updateDoc(doc(db, 'articles', article.id), {
        published: !article.published
      });
      notify(`Article ${article.published ? 'unpublished' : 'published'}.`);
    } catch (err) {
      console.error(err);
      notify('Failed to update publish status.');
    }
  };

  const toggleRole = async (u) => {
    if (u.role === 'admin') return; // don't allow changing admin role
    const newRole = u.role === 'author' ? 'user' : 'author';
    await updateDoc(doc(db, 'users', u.id), { role: newRole });
    notify(`User role changed to ${newRole}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'articles', id));
      notify('Article deleted.');
    } catch (err) {
      console.error(err);
      notify('Failed to delete article.');
    }
  };
 console.log("Creating article with author:", admin);

  return (
    <>
      <Nav items={navItems} user={user} />
      <div className="pt-16 min-h-screen bg-gray-50 p-6 space-y-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

          {/* Article Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold mb-2">
              {current ? 'Edit Article' : 'Create New Article'}
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Content"
              rows="5"
              className="w-full border p-2 rounded"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
            />
            <input
              type="url"
              placeholder="Image URL"
              className="w-full border p-2 rounded"
              value={form.imageUrl}
              onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {current ? 'Update' : 'Create'}
              </button>
              {current && (
                <button type="button" onClick={reset} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* All Articles */}
          <div className="bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">All Articles</h2>
            <ul className="space-y-4">
              {articles.map(a => (
                <li key={a.id} className="border p-4 rounded space-y-2">
                  <h3 className="text-lg font-bold">{a.title}</h3>
                  <p className="text-sm text-gray-600">By {a.author || 'Unknown Author'}</p>
                  {a.imageUrl && (
                    <img src={a.imageUrl} alt={a.title} className="w-full max-h-64 object-cover rounded" />
                  )}
                  <p className="text-gray-700">{a.content}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setCurrent(a);
                        setForm({
                          title: a.title,
                          content: a.content,
                          imageUrl: a.imageUrl || ''
                        });
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(a)}
                      className={`text-white px-3 py-1 rounded ${a.published ? 'bg-green-600' : 'bg-yellow-600'}`}
                    >
                      {a.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Manage Users */}
          <div className="bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            <ul className="space-y-2">
              {users.map(u => (
                <li key={u.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{u.username || u.email}</p>
                    <p className="text-sm text-gray-500">Email: {u.email}</p>
                    <p className="text-sm text-gray-500">Role: {u.role || 'user'}</p>
                  </div>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleRole(u)}
                      className="bg-indigo-600 text-white px-4 py-1 rounded"
                    >
                      Set as {u.role === 'author' ? 'User' : 'Author'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Snackbar */}
        {snackbar && (
          <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow">
            {snackbar}
          </div>
        )}
      </div>
    </>
  );
}
