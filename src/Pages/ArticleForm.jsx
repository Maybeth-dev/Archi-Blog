//  // src/pages/ArticleForm.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createArticle } from '../Api/articles'; // your API helper
// import { auth } from '../firebase';

// export default function ArticleForm() {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [author, setAuthor] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [submitting, setBusy] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !content) return;

//     setBusy(true);

//     // (Optional) Double‐check currentUser just in case:
//     const user = auth.currentUser;
//     if (!user) {
//       console.error('No user signed in');
//       setBusy(false);
//       return;
//     }

//     try {
//       await createArticle({
//         title,
//         content,
//         authorName: author.trim() || user.email || 'Anonymous',
//         imageUrl: imageUrl.trim() || null
//       });
//       navigate('/');
//     } catch (err) {
//       console.error('Create failed:', err);
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">📝 Write a New Article</h1>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Title input */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Title</label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
//           />
//         </div>

//         {/* Content textarea */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Content</label>
//           <textarea
//             rows={6}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
//           />
//         </div>

//         {/* Author Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Author Name</label>
//           <input
//             value={author}
//             onChange={(e) => setAuthor(e.target.value)}
//             placeholder="Anonymous if blank"
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
//           />
//         </div>

//         {/* Image URL + Preview */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Image URL</label>
//           <input
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             placeholder="https://example.com/image.jpg"
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
//           />
//           {imageUrl && (
//             <img
//               src={imageUrl}
//               alt="Preview"
//               className="mt-3 h-48 w-full object-cover rounded border"
//             />
//           )}
//         </div>

//         {/* Submit button */}
//         <button
//           type="submit"
//           disabled={submitting}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-60"
//         >
//           {submitting ? 'Posting…' : 'Post Article'}
//         </button>
//       </form>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../Api/articles';
import { auth } from '../firebase';

export default function ArticleForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

   const handleSubmit = async e => {
  e.preventDefault();
  if (!title || !content) return;

  setBusy(true);
  const user = auth.currentUser;

  let username = 'Anonymous';
  if (!anonymous && user) {
    // Fetch user's Firestore profile
    const snap = await getDoc(doc(db, 'users', user.uid));
    const data = snap.exists() ? snap.data() : {};
    username = data.username || user.email;
  }

  await createArticle({
    title,
    content,
    authorName: username,
    authorId: user.uid,
    imageUrl: imageUrl.trim() || null
  });

  navigate('/');
};


  return (
    <div className="pt-16 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Write a New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label>
          Title
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </label>
        <label>
          Content
          <textarea
            rows={6}
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </label>
        <label className="flex items-center px-2 space-x-2">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(prev => !prev)}
          />
          <span>Post anonymously</span>
        </label>
        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional. Will show a preview below.
          </p>
        </label>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {busy ? 'Posting…' : 'Post Article'}
        </button>
      </form>
    </div>
  );
}
