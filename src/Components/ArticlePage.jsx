import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import CommentSection from '../components/CommentSection';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const profile = snap.exists() ? snap.data() : {};
        setCurrentUser({
          uid: user.uid,
          username: profile.username || user.email,
          email: profile.email || user.email,
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'articles', id)).then((docSnap) => {
      if (docSnap.exists()) {
        setArticle({ id: docSnap.id, ...docSnap.data() });
      }
    });
  }, [id]);

  if (!article) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        by {article.author || 'Unknown'} —{' '}
        {article.createdAt?.seconds &&
          new Date(article.createdAt.seconds * 1000).toLocaleString()}
      </p>

      {article.imageUrl && (
        <div className="w-full aspect-square mb-6 overflow-hidden rounded-lg shadow">
          <img
            src={article.imageUrl}
            alt={article.title || 'Article image'}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="prose max-w-none mb-8">{article.content}</div>

      <section>
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        <CommentSection articleId={id} currentUser={currentUser} />
      </section>
    </div>
  );
}