 import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ArticleCard from '../Components/ArticleCard';
import Nav from '../Components/Nav';

export default function Homepage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const db = getFirestore();

  useEffect(() => {
    (async () => {
      try { 
        const q = query(
          collection(db, 'articles'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );

        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setArticles(fetched);
      } catch (e) {
        console.error('Error fetching articles:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [db]);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { name: 'Sign Up', to: '/signup' },
    { name: 'Log In', to: '/login' }
  ];

  return (
    <>
      <Nav items={navItems} />
      <main className="pt-16 bg-gray-50 min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">📰 News Feed</h1>
            <input
              type="text"
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500">No articles available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(article => (
                <Link key={article.id} to={`/articlepage/${article.id}`}>
                  <ArticleCard article={article} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
