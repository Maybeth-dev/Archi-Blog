// import { initializeApp, getApps } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyBtoB6e2m4cP95wDkhvL2Eh7ICRW0UP2nw",
//   authDomain: "news-blog-5b721.firebaseapp.com",
//   projectId: "news-blog-5b721",
//   storageBucket: "news-blog-5b721.firebasestorage.app",
//   messagingSenderId: "587560020548",
//   appId: "1:587560020548:web:526e1a42f78dd22caaea11",
//   measurementId: "G-VTWR5V5PQ0"
// };
 
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };



import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 

const firebaseConfig = {
  apiKey: "AIzaSyBtoB6e2m4cP95wDkhvL2Eh7ICRW0UP2nw",
  authDomain: "news-blog-5b721.firebaseapp.com",
  projectId: "news-blog-5b721",
  storageBucket: "news-blog-5b721.appspot.com",          
  messagingSenderId: "587560020548",
  appId: "1:587560020548:web:526e1a42f78dd22caaea11",
  measurementId: "G-VTWR5V5PQ0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
 

export const auth = getAuth(app);
export const db = getFirestore(app);
