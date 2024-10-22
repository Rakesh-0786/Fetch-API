import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAymRAQvkcfn2Ve01prDs8-wzskSHvRlKU",
  authDomain: "postman-api-58e8b.firebaseapp.com",
  projectId: "postman-api-58e8b",
  storageBucket: "postman-api-58e8b.appspot.com",
  messagingSenderId: "605269916",
  appId: "1:605269916:web:29416e5a7944fe0855a259",
  measurementId: "G-ZYGNYNRTSV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider();
export {auth,provider};
