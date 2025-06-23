// import { db } from '../firebase';
// import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

// export async function createArticle(data) {
//   return await addDoc(collection(db, 'articles'), data);
// }

// export async function fetchArticles() {
//   const snap = await getDocs(collection(db, 'articles'));
//   return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }

// export async function getArticleById(id) {
//   const docRef = doc(db, 'articles', id);
//   const snap = await getDoc(docRef);
//   return snap.exists() ? { id: snap.id, ...snap.data() } : null;
// }




import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function createArticle(data) {
  return addDoc(collection(db, 'articles'), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function fetchArticles() {
  const snap = await getDocs(collection(db, 'articles'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getArticleById(id) {
  const snap = await getDoc(doc(db, 'articles', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}















//  import { initializeApp, getApps } from 'firebase/app';
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   addDoc,
//   serverTimestamp,
//   query,
//   orderBy
// } from 'firebase/firestore'

 
// const firebaseConfig = {
//   apiKey: "AIzaSyBtoB6e2m4cP95wDkhvL2Eh7ICRW0UP2nw",
//   authDomain: "news-blog-5b721.firebaseapp.com",
//   projectId: "news-blog-5b721",
//   storageBucket: "news-blog-5b721.appspot.com",
//   messagingSenderId: "587560020548",
//   appId: "1:587560020548:web:526e1a42f78dd22caaea11",
//   measurementId: "G-VTWR5V5PQ0"
// };

 
// const db = getFirestore(app)
// const articlesCol = collection(db, 'articles')

// /** Returns all articles, newest first */
// export async function fetchArticles() {
//   const q = query(articlesCol, orderBy('createdAt', 'desc'))
//   const snap = await getDocs(q)
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }))
// }



// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// /**
//  * Adds a new article.
//  * @param {{ title:string, content:string, authorName:string }} a
//  */
// export function createArticle({ title, content, authorName }) {
//   return addDoc(articlesCol, {
//     title,
//     content,
//     authorName,
//     createdAt: serverTimestamp()
//   })
// }
