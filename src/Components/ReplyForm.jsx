import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ReplyForm({ articleId, parentId, currentUser }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "articles", articleId, "comments"), {
      text: text.trim(),
      parentId,
      authorId: currentUser?.uid || null,
      authorName: currentUser?.username || currentUser?.email || "Guest",
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        rows={2}
        className="w-full border p-2 rounded text-sm"
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 mt-1 rounded text-sm"
      >
        {parentId ? "Reply" : "Comment"}
      </button>
    </form>
  );
}