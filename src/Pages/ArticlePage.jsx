// src/pages/ArticlePage.jsx
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebase';
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   Timestamp
// } from 'firebase/firestore';

// export default function ArticlePage() {
//   const { id } = useParams();
//   const [article, setArticle] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');

//   useEffect(() => {
//     if (!id) return;

//     // Fetch the article document
//     getDoc(doc(db, 'articles', id)).then((docSnap) => {
//       if (docSnap.exists()) {
//         setArticle({ id: docSnap.id, ...docSnap.data() });
//       }
//     });

//     // Listen for comments sub-collection
//     const q = query(
//       collection(db, 'articles', id, 'comments'),
//       orderBy('createdAt', 'asc')
//     );
//     const unsubscribe = onSnapshot(q, (snap) => {
//       setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsubscribe();
//   }, [id]);

//   const postComment = async (e) => {
//     e.preventDefault();
//     await addDoc(collection(db, 'articles', id, 'comments'), {
//       authorName: 'Guest',
//       text: newComment,
//       createdAt: Timestamp.now()
//     });
//     setNewComment('');
//   };

//   if (!article) {
//     return <p className="text-center mt-10">Loading…</p>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
//       <p className="text-sm text-gray-500 mb-4">
//         by {article.authorName} —{' '}
//         {article.createdAt?.seconds &&
//           new Date(article.createdAt.seconds * 1000).toLocaleString()}
//       </p>

//       {/* === MOVED: image is now between title/metadata and content === */}
//       {article.imageUrl && (
//         <div className="w-full aspect-square mb-6 overflow-hidden rounded-lg shadow">
//           <img
//             src={article.imageUrl}
//             alt={article.title || 'Article image'}
//             className="object-cover w-full h-full"
//           />
//         </div>
//       )}

//       <div className="prose max-w-none mb-8">{article.content}</div>

//       <section>
//         <h3 className="text-xl font-semibold mb-2">Comments</h3>
//         <form onSubmit={postComment} className="mb-4">
//           <input
//             placeholder="Your comment"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             required
//             className="w-full border border-gray-300 p-2 rounded mb-2"
//           />
//           <button className="bg-blue-500 text-white px-4 py-1 rounded">
//             Post
//           </button>
//         </form>

//         {comments.map((c) => (
//           <div key={c.id} className="mb-2 border-b pb-1">
//             <strong>{c.authorName}:</strong> {c.text}
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }
 
 // src/Pages/ArticlePage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  doc, getDoc,
  collection, query, where, orderBy,
  onSnapshot, addDoc, updateDoc, deleteDoc, Timestamp
} from 'firebase/firestore';
import CommentSection from '../Components/CommentSection';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 1️⃣ Track logged‐in user & load their profile
  useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      if (!user) return setCurrentUser(null);
      const snap = await getDoc(doc(db, 'users', user.uid));
      setCurrentUser(
        snap.exists()
          ? { uid: user.uid, username: snap.data().username, email: snap.data().email }
          : { uid: user.uid, username: null, email: user.email }
      );
    });
  }, []);

  // 2️⃣ Load article
  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'articles', id)).then(snap => {
      if (snap.exists()) setArticle({ id: snap.id, ...snap.data() });
    });
  }, [id]);

  if (!article) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        by {article.authorName || 'Unknown'} —{' '}
        {article.createdAt?.seconds &&
          new Date(article.createdAt.seconds * 1000).toLocaleString()}
      </p>
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <div className="prose max-w-none mb-8">{article.content}</div>

      <CommentSection
        articleId={id}
        currentUser={currentUser}
      />
    </div>
  );
}
