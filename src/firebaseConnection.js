import { initializeApp } from 'firebase/app'
import { getFirestore} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCwwLuu_vRM4yFP88DjDbbLI-5pjNRFvow",
    authDomain: "curso-ff259.firebaseapp.com",
    projectId: "curso-ff259",
    storageBucket: "curso-ff259.appspot.com",
    messagingSenderId: "160328381901",
    appId: "1:160328381901:web:c269c8ae5be9516a320084"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth };