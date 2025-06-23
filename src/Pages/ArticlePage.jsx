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
 
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  doc, getDoc, collection, query, orderBy, onSnapshot,
  addDoc, Timestamp, deleteDoc, updateDoc, where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [replyingTo, setReplyingTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');

  // 1. Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  // 2. Fetch Firestore profile of current user
  useEffect(() => {
    const getUserData = async () => {
      if (!user?.uid) {
        setUserInfo(null);
        return;
      }
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setUserInfo(snap.data());
      }
    };
    getUserData();
  }, [user?.uid]);

  // 3. Fetch article and top-level comments
  useEffect(() => {
    if (!id) return;

    // Article
    getDoc(doc(db, 'articles', id)).then((docSnap) => {
      if (docSnap.exists()) {
        setArticle({ id: docSnap.id, ...docSnap.data() });
      }
    });

    // Comments (only top-level)
    const q = query(
      collection(db, 'articles', id, 'comments'),
      where('parentId', '==', null),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [id]);

  // 4. Post comment or reply
  const postComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const name = userInfo?.username || userInfo?.email || 'Guest';
    const commentData = {
      authorId: user?.uid || null,
      authorName: name,
      text: newComment.trim(),
      createdAt: Timestamp.now(),
      parentId: replyingTo || null
    };

    await addDoc(collection(db, 'articles', id, 'comments'), commentData);
    setNewComment('');
    setReplyingTo(null);
  };

  const postReply = (parentId) => {
    setReplyingTo(parentId);
  };

  const startEdit = (comment) => {
    setEditing(comment.id);
    setEditText(comment.text);
  };

  const saveEdit = async (commentId) => {
    await updateDoc(doc(db, 'articles', id, 'comments', commentId), {
      text: editText.trim()
    });
    setEditing(null);
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    await deleteDoc(doc(db, 'articles', id, 'comments', commentId));
  };

  const fetchReplies = (parentId) => {
    return query(
      collection(db, 'articles', id, 'comments'),
      where('parentId', '==', parentId),
      orderBy('createdAt', 'asc')
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {article && (
        <>
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            by {article.author || 'Unknown Author'} —{' '}
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
        </>
      )}

      {/* Comment form */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        <form onSubmit={postComment} className="mb-4">
          <input
            placeholder={replyingTo ? "Your reply" : "Your comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            {replyingTo ? "Reply" : "Comment"}
          </button>
          {replyingTo && (
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="ml-2 text-sm text-gray-600"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Display Comments */}
        {comments.map((c) => (
          <div key={c.id} className="mb-4 border-b pb-2">
            <p className="text-sm text-gray-700 font-medium">{c.authorName || 'Guest'}</p>
            {editing === c.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <div className="space-x-2 mt-1">
                  <button onClick={() => saveEdit(c.id)} className="text-blue-600">Save</button>
                  <button onClick={() => setEditing(null)} className="text-gray-600">Cancel</button>
                </div>
              </div>
            ) : (
              <p>{c.text}</p>
            )}

            {/* Actions */}
            <div className="text-sm mt-1 space-x-2">
              {user?.uid === c.authorId && (
                <>
                  <button onClick={() => startEdit(c)} className="text-blue-600">Edit</button>
                  <button onClick={() => deleteComment(c.id)} className="text-red-600">Delete</button>
                </>
              )}
              <button onClick={() => postReply(c.id)} className="text-green-600">Reply</button>
            </div>

            {/* Replies */}
            <Replies articleId={id} parentId={c.id} />
          </div>
        ))}
      </section>
    </div>
  );
}

// Subcomponent to render replies
function Replies({ articleId, parentId }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'articles', articleId, 'comments'),
      where('parentId', '==', parentId),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [articleId, parentId]);

  if (replies.length === 0) return null;

  return (
    <div className="ml-4 mt-2 border-l-2 pl-3 space-y-2">
      {replies.map((r) => (
        <div key={r.id} className="bg-gray-100 rounded p-2">
          <p className="text-sm font-medium">{r.authorName || 'Guest'}</p>
          <p className="text-sm text-gray-700">{r.text}</p>
        </div>
      ))}
    </div>
  );
}



 