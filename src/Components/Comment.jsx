import { useState } from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";

export default function Comment({ comment, articleId, currentUser }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = currentUser?.uid === comment.authorId;

  const handleDelete = async () => {
    if (confirm("Delete this comment?")) {
      await deleteDoc(doc(db, "articles", articleId, "comments", comment.id));
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, "articles", articleId, "comments", comment.id), {
      text: editText.trim()
    });
    setEditing(false);
  };

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm mb-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-semibold">{comment.authorName || "Guest"}</p>
          {editing ? (
            <textarea
              rows={2}
              className="w-full border p-2 rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">{comment.text}</p>
          )}
        </div>
        {isOwner && (
          <div className="text-sm space-x-2">
            {editing ? (
              <>
                <button onClick={handleEdit} className="text-blue-600">Save</button>
                <button onClick={() => setEditing(false)} className="text-gray-600">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="text-blue-600">Edit</button>
                <button onClick={handleDelete} className="text-red-600">Delete</button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="mt-2">
        <ReplyForm articleId={articleId} parentId={comment.id} currentUser={currentUser} />
        <button
          onClick={() => setShowReplies((prev) => !prev)}
          className="text-sm text-blue-500 mt-1"
        >
          {showReplies ? "Hide replies" : "View replies"}
        </button>
        {showReplies && <ReplyList articleId={articleId} parentId={comment.id} />}
      </div>
    </div>
  );
}