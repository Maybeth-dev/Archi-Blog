//  import React, { useEffect, useState } from 'react';
// import Navbar from '../Components/Navbar';
// import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import ArticleCard from '../Components/ArticleCard';  

// export default function Homepage() {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const db = getFirestore();

//   useEffect(() => {
//     async function fetchArticles() {
//       setLoading(true);
//       try {
//         const articlesRef = collection(db, 'articles');
//         const q = query(articlesRef, orderBy('createdAt', 'desc'));
//         const snapshot = await getDocs(q);
//         const data = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setArticles(data);
//       } catch (err) {
//         console.error('Error fetching articles:', err);
//       }
//       setLoading(false);
//     }

//     fetchArticles();
//   }, [db]);

//   const filteredArticles = articles.filter(article =>
//     article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     article.content?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-semibold">📰 News Feed</h1>
//             <input
//               type="text"
//               placeholder="Search articles…"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
 
//           {loading ? (
//             <p className="text-center text-gray-500">Loading articles...</p>
//           ) : filteredArticles.length === 0 ? (
//             <p className="text-center text-gray-500">No articles found.</p>
//           ) : (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {filteredArticles.map(article => (
//                 <Link key={article.id} to={`/articlepage/${article.id}`} className="block">
//                   <ArticleCard article={article} />
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


//  import React, { useEffect, useState } from 'react';
// import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import ArticleCard from '../Components/ArticleCard';
// import Nav from '../Components/Nav';

// export default function Homepage() {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const db = getFirestore();

//   useEffect(() => {
//     async function fetchArticles() {
//       setLoading(true);
//       try {
//         const articlesRef = collection(db, 'articles');
//         const q = query(articlesRef, orderBy('createdAt', 'desc'));
//         const snapshot = await getDocs(q);
//         setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } catch (err) {
//         console.error('Error fetching articles:', err);
//       }
//       setLoading(false);
//     }
//     fetchArticles();
//   }, [db]);

//   const filtered = articles.filter(a =>
//     a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     a.content?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const navItems = [  
//     { name: 'Sign Up', to: '/signup' , current: true },
//     { name: 'Log In', to: '/login' , current:true },
//   ];

//   return (
//     <>
//       <Nav items={navItems} />

//       <main className="pt-16 min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
//         <div className="max-w-6xl mx-auto">

          
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-semibold">📰 News Feed</h1>
//             <input
//               type="text"
//               placeholder="Search articles…"
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Loading / No articles / Grid */}
//           {loading ? (
//             <p className="text-center text-gray-500">Loading articles...</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-center text-gray-500">No articles available.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map(article => (
//                 <Link
//                   key={article.id}
//                   to={`/articlepage/${article.id}`}
//                   className="bg-white border rounded shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
//                 >
//                   {article.imageUrl ? (
//                     <img
//                       src={article.imageUrl}
//                       alt={article.title}
//                       className="h-48 w-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
//                       No image
//                     </div>
//                   )}

//                   <div className="p-4 flex-1 flex flex-col justify-between">
//                     <div>
//                       <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
//                       <p className="text-sm text-gray-600 mb-4 line-clamp-3">
//                         {article.content || 'No content available'}
//                       </p>
//                     </div>
//                     <span className="text-blue-600 hover:underline mt-auto">
//                       Read more →
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}

//         </div>
//       </main>
//     </>
//   );
// }
  


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
