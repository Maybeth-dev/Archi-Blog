 import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  doc, getDoc,
  collection, query, where, orderBy, getDocs,
  getCountFromServer, updateDoc, deleteDoc
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Nav from '../Components/Nav';

export default function AuthorProfile() {
  const [info, setInfo] = useState({});
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '' });

  // Load profile & articles
  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Profile info
      const snap = await getDoc(doc(db, 'users', user.uid));
      setInfo(snap.data() || {});

      // Articles by this author
      const q = query(
        collection(db, 'articles'),
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const artSnap = await getDocs(q);

      const list = await Promise.all(
        artSnap.docs.map(async d => {
          const data = d.data();
          const countSnap = await getCountFromServer(
            query(collection(db, 'articles', d.id, 'comments'))
          );
          return {
            id: d.id,
            title: data.title,
            content: data.content,
            imageUrl: data.imageUrl,
            published: data.published,
            createdAt: data.createdAt,
            commentCount: countSnap.data().count
          };
        })
      );

      setArticles(list);
    };

    load();
  }, []);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'New Article', to: '/articles/new' },
    { name: 'Sign Out', to: '/login' }
  ];

  const startEdit = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title || '',
      content: article.content || '',
      imageUrl: article.imageUrl || ''
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    await updateDoc(doc(db, 'articles', editingId), {
      title: form.title,
      content: form.content,
      imageUrl: form.imageUrl
    });
    // refresh list
    setArticles(arts => arts.map(a => a.id === editingId ? { ...a, ...form } : a));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const removeArticle = async (id) => {
    await deleteDoc(doc(db, 'articles', id));
    setArticles(arts => arts.filter(a => a.id !== id));
  };

  return (
    <>
      <Nav items={navItems} />

      <div className="pt-16 bg-gray-50 py-10 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">

          <h1 className="text-3xl font-bold mb-4">{info.username}'s Profile</h1>
          <p className="mb-2"><strong>Bio:</strong> {info.bio || '—'}</p>
          <p className="mb-6"><strong>Genre:</strong> {info.genre || '—'}</p>

          <h2 className="text-2xl font-semibold mb-4">
            Articles ({articles.length})
          </h2>

          <ul className="space-y-6">
            {articles.map(article => (
              <li key={article.id} className="border p-4 rounded relative">

                {/* Title & link */}
                <Link to={`/articlepage/${article.id}`}>
                  <h3 className="text-xl font-medium text-blue-600 hover:underline">
                    {article.title}
                  </h3>
                </Link>

                {/* Meta */}
                <p className="text-sm text-gray-600 mb-2">
                  {article.createdAt?.seconds
                    ? new Date(article.createdAt.seconds * 1000).toLocaleDateString()
                    : 'Unknown date'} • {article.commentCount} comments •{' '}
                  <span className={article.published ? 'text-green-600' : 'text-yellow-600'}>
                    {article.published ? 'Published' : 'Not published'}
                  </span>
                </p>

                {/* Edit/Delete controls */}
                {editingId !== article.id && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => startEdit(article)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeArticle(article.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Inline Edit Form */}
                {editingId === article.id && (
                  <form onSubmit={saveEdit} className="mt-4 space-y-3 bg-gray-50 p-4 rounded">
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                    <textarea
                      rows="4"
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
                    <div className="flex space-x-2">
                      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

              </li>
            ))}
          </ul>

        </div>
      </div>
    </>
  );
}
