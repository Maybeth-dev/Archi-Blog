 import React, { useState } from 'react';
  import { db, auth } from '../firebase';
  import { doc, setDoc } from 'firebase/firestore';
  import { useNavigate } from 'react-router-dom'; 
import Nav from '../Components/Nav';

  const BecomeAuthor = () => {
    const [showForm, setShowForm] = useState(false);
    const [bio, setBio] = useState('');
    const [genre, setGenre] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const navItems = [
      { name: 'Dashboard', to: '/dashboard' },
      { name: 'Sign Out', onClick: 'logout' }
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      const user = auth.currentUser;

      if (!user) {
        setMessage('You must be signed in.');
        return;
      }

    
  
    
    try { 
          await setDoc( { isAuthor: true, role: 'author', bio, genre }, { merge: true });
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
      <Nav items={navItems}  />
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
 

 
// export default function ArticlePage() {
//   const { id } = useParams();
//   const [article, setArticle] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');

//   useEffect(() => {
//     if (!id) return;

//     // Fetch the article
//     getDoc(doc(db, 'articles', id)).then((docSnap) => {
//       if (docSnap.exists()) {
//         setArticle({ id: docSnap.id, ...docSnap.data() });
//       }
//     });

//     // Listen for comments
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
//         by {/* now using authorUser */}
//         {article.authorUser} —{' '}
//         {article.createdAt?.seconds &&
//           new Date(article.createdAt.seconds * 1000).toLocaleString()}
//       </p>

//       {/* If you also have an imageUrl field, render that square above content */}
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
