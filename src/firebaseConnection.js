// app do firebase
import { initializeApp } from "firebase/app";
// importa o banco de dados
import { getFirestore } from "firebase/firestore";
// Importar o sistema de Authentication
import { getAuth } from "firebase/auth";

// Configuração
const firebaseConfig = {
  apiKey: "AIzaSyCqMTFawv5jWcqfePldTW9OejH4gG9hIRg",
  authDomain: "projeto-68c08.firebaseapp.com",
  projectId: "projeto-68c08",
  storageBucket: "projeto-68c08.firebasestorage.app",
  messagingSenderId: "1062368983704",
  appId: "1:1062368983704:web:0d8d2363f0574a35e2aeed",
  measurementId: "G-ZN7ZMZNRSL"
};

// Inicializa as configurações do app
const firebaseApp = initializeApp(firebaseConfig);

// Passsa as configurações para serem inicializadas com o FireStore
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// exporta para conectar com o FireStore (banco de daods)
// para outro arquivo se precisar importar esse db e consumir arquivos do banco de dados
export {db, auth};