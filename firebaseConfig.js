import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBZnSPlspkErogRio5fncgn4tKNiVwJPLk',
  authDomain: 'brokeaf-cc5d8.firebaseapp.com',
  projectId: 'brokeaf-cc5d8',
  storageBucket: 'brokeaf-cc5d8.appspot.com',
  messagingSenderId: '623692771530',
  appId: '1:623692771530:web:37f610e3ae689781ef0433',
  measurementId: 'G-BH5JKFSB9R',
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
