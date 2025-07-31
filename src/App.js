import { useState, useEffect } from 'react';

// importa o db para consumir o banco de dados e o auth para login
import { db, auth } from './firebaseConnection';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';


import { createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
 } from 'firebase/auth';

import './app.css';


function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  // Armazena os posts encontrados
  const [posts, setPosts] = useState([]);

  // Atualizar item no banco de dados
  const [idPost, setidPost] = useState('');

  // UseState do email
  const [email, setEmail] = useState('');
  // UseState da senha
  const [senha, setSenha] = useState('');
  // useState do User
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(()=>{
        
      async function loadPosts(){
        
          const unsub = onSnapshot(collection(db, "posts"), (snapshot)=>{
            let listaPost = [];

              snapshot.forEach((doc)=>{
                  listaPost.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor,

                  })
              })

              setPosts(listaPost);
          })

      } 
      
      loadPosts();
  }, [])


  // useEffect para manter o usuário logado ao recarregar a página
  useEffect(()=> {

    async function checkLogin() {
      onAuthStateChanged(auth, (user)=>{
        if(user){
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false);
          setUserDetail({});
        }
      })
    }

    

    checkLogin();


  },[])



  async function handleAdd(){
        // addDoc é como se clicassemos para gerar um ID do document automático e gerar de forma nativa
        await addDoc(collection(db,"posts"), {
          titulo: titulo,
          autor: autor,
        })
        .then(()=>{
          console.log("Dados registrados")
          setAutor('');
          setTitulo('');
        })
        .catch((error)=>{
          console.log("Deu erro" + error)
        })
  }

  // PASSANDO ID ESTÁTICO
  //     await setDoc(doc(db, "posts", "EXEMPLO"), {
  //       titulo: titulo,
  //       autor: autor,
  //     })
  //     .then(()=>{
  //       console.log("dados registrados");
  //     })
  //     .catch((error)=>{
  //       console.log("GEROU ERRO: "+ error);
  //     })


  async function buscarPost(){
    
          const postsRef = collection(db, "posts")
          await getDocs(postsRef)
          .then((snapshot)=>{
              let lista = [];

              snapshot.forEach((doc)=>{
                  lista.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor,

                  })
              })

              setPosts(lista);


          })
          .catch(()=>{
            console.log("DEU ERRO AO BUSCAR")
          })

     }

    //BUSCA ITEM ÚNICO NÃO DINÂMICO
    // // armazena na variável postRef os campos do document desse id
    // const postRef = doc(db, "posts", "INW5w8D2xj1xypoFHarU")

    // // função getDoc, passa os valores da variável para a função
    // // se der certo (then), armzena os valores no setAutor e setTitulo
    // // Aparecendo nas caixa de "input", da aplicação
    // await getDoc(postRef)
    // .then((snapshot)=>{
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)
    // })
    // .catch(()=>{
    //   console.log("ERRO")
    // })

 
    async function editarPost(){
        const docRef = doc(db,"posts", idPost)

        await updateDoc(docRef, {
          titulo: titulo,
          autor: autor,
        })
        .then(()=>{
          console.log('POST ATUALIZADO')
          setidPost('');
          setAutor('');
          setTitulo(''); 
        })
        .catch(()=>{
          console.log("ERRO AO ATUALIZAR")
        })
    } 

    async function excluirPost(id){

      const docRef = doc(db, "posts", id)
      await deleteDoc(docRef)
      .then(()=>{
        alert('DELETADO')
      })
      
    }


    async function novoUsuario(){
        await createUserWithEmailAndPassword(auth, email, senha)
        .then((value)=>{
          console.log('CADASTRADO COM SUCESSO')
          console.log(value)
          setEmail('')
          setSenha('')
          
        })
        .catch((error)=>{
          if(error.code === 'auth/weak-password'){
              alert('Senha fraca')
          }else if(error.code === 'auth/email-already-in-use'){
            alert('Email ja utilizado')
          }
        })
    }




    async function logarUsuario() {
      await signInWithEmailAndPassword(auth, email, senha)
      .then((value)=>{
        console.log("USER LOGADO COM SUCESSO")
        console.log(value.user)

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        })
        setUser(true);

        setEmail('')
        setSenha('')
      })
      .catch(()=>{
        console.log('ERRO AO FAZER LOGIN')
      })
    }



    async function fazerLogout() {
      await signOut(auth)
      setUser(false);
      setUserDetail({});
    }



  return (
    <div className="App">
      <h1>ReactJS + FireBase</h1>

      { user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado)</strong> <br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span><br/>
          <button onClick={fazerLogout}>Logout</button>
          <br/><br/>
        </div>
      )}

      <div className='container'>
        <h2>Usuários</h2>
        <label>Email</label>
        <input 
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          placeholder='Digite seu Email'
          
        /> <br/>

        <label>Senha</label>
        <input 
          value={senha}
          onChange={(e)=> setSenha(e.target.value)}
          placeholder='Digite sua Senha'
        /><br/>

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>

      </div>


      <br/><br/>
      <hr/>
      <br/><br/>


      <div className='container'> 
        <h2>Posts</h2>

        <label>ID do Post</label>
        <input
          placeholder='Digite um ID do Post'
          value={idPost}
          onChange={(e)=>setidPost(e.target.value)}
        />
        <br/>

        <label>Titulo:</label>
        <textarea
        type="text" 
        placeholder='Digite o titulo'
        value={titulo}
        onChange={(e)=> setTitulo(e.target.value)}
        // textarea no React serve para criar campos de entrada de texto multilinha
        // onChange, a cda vez que mudar o valor do textArea, vai aplicar a função anônima
        // armazenado o valor digitado no useState titulo
        // .targe.value pega o que foi digitado pelo usuário
      />

        <label>Autor:</label>
        <input 
        type="text"
        placeholder='Autor do post'
        value={autor}
        onChange={(e)=> setAutor(e.target.value)}
      />
      <br/>
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button> <br/>

        <button onClick={editarPost}>Atualizar Post</button>

      <ul>
        {posts.map((post)=>{
          return(
            <li key={post.id}>
              <strong>ID: {post.id}</strong> <br/>
              <span>Titulo: {post.titulo} </span> <br/>
              <span>Autor: {post.autor}</span> <br/> 
              <button onClick={() => excluirPost(post.id)}>Excluir</button> <br/><br/>           
            </li>
          )
        })}
      </ul>

      </div>

    </div>
  );
}

export default App;
