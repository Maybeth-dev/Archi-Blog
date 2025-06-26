import { useState } from 'react';
import { db } from '../firebase';
import { deleteDoc, updateDoc, doc } from 'firebase/firestore';

export default function Comment({
  comment,
  allComments,
  articleId,
  currentUser,
  setReplyTo
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  const isOwner = currentUser?.uid === comment.authorId;

  const save = async () => {
    if (!text.trim()) return;
    await updateDoc(
      doc(db, 'articles', articleId, 'comments', comment.id),
      { text: text.trim() }
    );
    setEditing(false);
  };

  const remove = async () => {
    if (confirm('Delete this comment?')) {
      await deleteDoc(
        doc(db, 'articles', articleId, 'comments', comment.id)
      );
    }
  };

   
  const replies = allComments.filter(c => c.parentId === comment.id);

  return (
    <div className="ml-4 mb-4 border-l-2 pl-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-semibold">
            {comment.authorName || 'Guest'}
          </p>
          {editing ? (
            <textarea
              rows={2}
              className="w-full border p-2 rounded"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">{comment.text}</p>
          )}
        </div>
        <div className="text-sm space-x-2">
          {isOwner && (
            editing ? (
              <>
                <button onClick={save} className="text-blue-600">Save</button>
                <button onClick={() => setEditing(false)} className="text-gray-600">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="text-blue-600">Edit</button>
                <button onClick={remove} className="text-red-600">Delete</button>
              </>
            )
          )}
          <button
            onClick={() => setReplyTo(comment.id)}
            className="text-green-600"
          >
            Reply
          </button>
        </div>
      </div>
 
      {replies.map(r => (
        <Comment
          key={r.id}
          comment={r}
          allComments={allComments}
          articleId={articleId}
          currentUser={currentUser}
          setReplyTo={setReplyTo}
        />
      ))}
    </div>
  );
}
