 import { useState, useEffect } from 'react';
 import { db } from '../firebase';
 import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
 import { Link } from 'react-router-dom';

 export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <> 
    <div className="pt-4 max-w-6xl mx-auto">
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">📰 News Feed</h1>
        <input
          type="text"
          placeholder="Search articles…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <Link to="/articles/new" className="px-3 py-1 bg-green-500 text-white rounded">New Article</Link>
      </div>
      <ul>
        {filtered.map(a => (
          <li key={a.id} className="mb-2">
            <Link to={`/articles/${a.id}`} className="text-xl text-blue-600">
              {a.title}
            </Link>
            <div className="text-sm text-gray-600">
              by {a.authorName} — {new Date(a.createdAt.seconds * 1000).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p>No articles found.</p>}
    </div>
    </div>
    </>
  );
}
