import { useState, useEffect } from "react";
import {auth} from '../firebaseConnection' //carregando o banco de dados
import { onAuthStateChanged } from "firebase/auth"; // verificação si esta logado

import { Navigate } from "react-router";

function Private({ children }){
 const [loading, setLoading] = useState(true);
 const [signed, setSigned] = useState(false);
    

useEffect(()=> {
   async function checkLogin(){
    const unsub = onAuthStateChanged(auth, (user) =>{
        // se tem user logado
        if(user){
         const userData = {
            uid: user. uid,
            email: user.email,
         }

         localStorage.setItem("@detaiUser",JSON.stringify(userData))

         setLoading(false);
         setSigned(true);

        } else{
            // não tem user logado
            setLoading(false);
            setSigned(false);
        }
    })
   } 

   checkLogin();
}, [])
 if(loading){
    return(
        <div></div>
    )
 }
 if(!signed){
    return <Navigate to="/"/>
 }
  
    return children;
 
}
export default Private;