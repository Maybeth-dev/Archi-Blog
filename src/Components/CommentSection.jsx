import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import Comment from "./Comment";
import ReplyForm from "./ReplyForm";

export default function CommentSection({ articleId, currentUser }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "articles", articleId, "comments"),
      where("parentId", "==", null),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [articleId]);

  return (
    <div>
      <ReplyForm articleId={articleId} parentId={null} currentUser={currentUser} />
      {comments.map(comment => (
        <Comment
          key={comment.id}
          articleId={articleId}
          comment={comment}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}   currentUser={currentUser}
        />
      ))}
    </div>
  );
}
