import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function ArticleForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setBusy(true);
    const user = auth.currentUser;

    let username = 'Anonymous';
    if (!anonymous && user) {
     
      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.exists() ? snap.data() : {};
      username = data.username || user.email;
    }

    await addDoc(collection(db, 'articles'), {
      title,
      content,
      authorName: username,
      authorId: user?.uid || null,
      imageUrl: imageUrl.trim() || null,
      createdAt: serverTimestamp()
    });

    navigate('/');
  };

  return (
    <div className="pt-16 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Write a New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label>
          Title
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </label>
        <label>
          Content
          <textarea
            rows={6}
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </label>
        <label className="flex items-center px-2 space-x-2">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(prev => !prev)}
          />
          <span>Post anonymously</span>
        </label>
        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional. Will show a preview below.
          </p>
        </label>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {busy ? 'Posting…' : 'Post Article'}
        </button>
      </form>
    </div>
  );
}
