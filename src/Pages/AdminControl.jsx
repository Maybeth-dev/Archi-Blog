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

 
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'articles'), snap => {
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(all);
    });
    return unsub;
  }, []);

 
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
    if (u.role === 'admin') return;  
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
 
        {snackbar && (
          <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow">
            {snackbar}
          </div>
        )}
      </div>
    </>
  );
}
