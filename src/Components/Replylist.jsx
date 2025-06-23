import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function ReplyList({ articleId, parentId }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "articles", articleId, "comments"),
      where("parentId", "==", parentId),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [articleId, parentId]);

  return (
    <div className="ml-4 mt-2 border-l-2 pl-3 space-y-2">
      {replies.map((r) => (
        <div key={r.id} className="bg-gray-100 rounded p-2">
          <p className="text-sm font-medium">{r.authorName}</p>
          <p className="text-sm text-gray-700">{r.text}</p>
        </div>
      ))}
    </div>
  );
}