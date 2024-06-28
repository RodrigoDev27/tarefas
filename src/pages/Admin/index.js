import { useState, useEffect } from 'react';
import './admin.css'
import {auth, db} from '../../firebaseConnection'
import { signOut } from 'firebase/auth';

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc 
} from 'firebase/firestore'


function Admin(){

const [tarefaInput, setTarefaInput] = useState('');
const [user, setUser] = useState({})
const [edit, setEdit] = useState({})

const [tarefas, setTarefas] = useState([])

useEffect(()=>{
  async function loadTarefas(){
   const userDetali = localStorage.getItem("@detaiUser")
   setUser(JSON.parse(userDetali))

   if(userDetali){
    const data = JSON.parse(userDetali);

    const tarefaRef = collection(db, "tarefas")
    const q = query(tarefaRef,orderBy("created", "desc"), where("userUid", "==", data?.uid))
    const unsub = onSnapshot(q, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc)=>{
         lista.push({
           id: doc.id,
           tarefa: doc.data().tarefa,
           userUid: doc.data().userUid 
         })
        })
       
       setTarefas(lista);
    })
   }
    
  }


  loadTarefas();
}, [])

 async function handleRegister(e){
    e.preventDefault();
   
    if(tarefaInput === ''){
        alert("Digite a sua tarefa...")
        return;
    }

    if(edit?.id){  // Buscando o registro para editar
      handleUpdateTarefa();
      return;  
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      created: new Date(),
      userUid: user?.uid  
    })
    .then(()=>{
     console.log("REGISTRO EFETUADO COM SUCESSO")
     setTarefaInput('')
    })
   .catch((error)=>{
     console.log("ERRO DO REGISTRO" + error);
   })
}

 async function handleLogout(){
  await signOut(auth);
}

async function deleteTarefa(id){
 const docRef = doc(db, "tarefas", id) //deletando tarefas da web e do banco
 await deleteDoc(docRef)
}

function editTarefa(item){
 setTarefaInput(item.tarefa)
 setEdit(item);
}

 async function handleUpdateTarefa(){
    const docRef = doc(db,"tarefas", edit?.id) // editando o item na web e no banco
    await updateDoc(docRef, {
        tarefa: tarefaInput
    })
    .then(() =>{
        console.log("ITEM EDITADO COM SUCESSO!")
        setTarefaInput('')
        setEdit({})
    })
    .catch(() =>{
     console.log("ERRO NA EDICAO")
     setTarefaInput('')
     setEdit({})
    })
 }

    return(
        <div className="admin-container">
            <h1>Minhas Tarefas</h1>
            <form className="form" onSubmit={handleRegister}>
                <textarea placeholder="digite sua tarefa.." 
                value={tarefaInput} 
                onChange={(e) => setTarefaInput(e.target.value)}/>

                {Object.keys(edit).length > 0 ? (
                 <button className="btn-register" style={{backgroundColor: '#6add39'}} type="submit">Atualizar tarefa</button>
                ) : (
                  <button className="btn-register" type="submit">Registrar tarefa</button>
                )}
            </form>

              {tarefas.map((item) => (
                   <article key={item.id} className="list">
                   <p>{item.tarefa}</p>
                   <div>
                    
                       <button className="btn-edit" onClick={() => editTarefa(item)}>Editar</button>


                       <button onClick={() => deleteTarefa(item.id)} className="btn-delete">Concluir</button>
                   </div>
               </article>   


              ))}

            <button className="btn-logout" onClick={handleLogout}>Sair</button>
           
            
        </div>
    )
}
export default Admin;