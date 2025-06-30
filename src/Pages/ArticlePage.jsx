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

  //  Track logged‐in user & load their profile
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
