import React, { useRef, useState } from 'react';
import './App.css';
import GoogleButton from 'react-google-button';
import {FaSignOutAlt,FaRocketchat } from 'react-icons/fa';
import { IoMdSend} from "react-icons/io";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

if (!firebase.apps.length) {
firebase.initializeApp({
  apiKey: "AIzaSyANPPivxeXYiNdHoxVRn_KWCDv10ns6EC0",
  authDomain: "realtime-globalchat.firebaseapp.com",
  projectId: "realtime-globalchat",
  storageBucket: "realtime-globalchat.appspot.com",
  messagingSenderId: "575741010308",
  appId: "1:575741010308:web:a255487eb6bdace2937dd1",
  measurementId: "G-4Q8MZ1XK5J"
}); 
} else {
  firebase.app(); // if already initialized
}


const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1><FaRocketchat  /> RealTimeChat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatPage /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div>
    <h4>Chat app for Real-time engagement</h4><br></br>
    <h4>Find new people, chat with them, and share your interest</h4><br></br>
    <h4>To get Started Sign In</h4><br></br>
     <GoogleButton className="sign-in" onClick={signInWithGoogle} /><br></br>
     <h4>Made by Akshat Jalan</h4>
    </div>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}><FaSignOutAlt style={{verticalAlign: 'middle'}}  /></button>
  )
}


function ChatPage() {
  const trial = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    trial.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<div>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={trial}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type your text here" />

      <button type="submit" disabled={!formValue}><IoMdSend style={{verticalAlign: 'middle'}} size="35px" /></button>

    </form>
  </div>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<div>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </div>)
}


export default App;
