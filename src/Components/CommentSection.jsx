import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc, Timestamp
} from 'firebase/firestore';
import Comment from './Comment';

export default function CommentSection({ articleId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
 
  useEffect(() => {
    const q = query(
      collection(db, 'articles', articleId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [articleId]);

  const post = async (text, parentId = null) => {
    await addDoc(collection(db, 'articles', articleId, 'comments'), {
      text,
      parentId,
      authorId: currentUser?.uid || null,
      authorName: currentUser?.username || currentUser?.email || 'Guest',
      createdAt: Timestamp.now()
    });
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-2">Comments</h3>
 
      <form
        onSubmit={e => {
          e.preventDefault();
          post(newText, replyTo);
          setNewText('');
          setReplyTo(null);
        }}
        className="mb-4"
      >
        <input
          type="text"
          placeholder={replyTo ? 'Your reply…' : 'Your comment…'}
          value={newText}
          onChange={e => setNewText(e.target.value)}
          required
          className="w-full border p-2 rounded mb-2"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            {replyTo ? 'Reply' : 'Comment'}
          </button>
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="px-4 py-1 text-gray-600 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
 
      {comments
        .filter(c => c.parentId === null)
        .map(c => (
          <Comment
            key={c.id}
            comment={c}
            allComments={comments}
            articleId={articleId}
            currentUser={currentUser}
            setReplyTo={setReplyTo}
          />
        ))}
    </section>
  );
}
