import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
  const[prompt, setPrompt] = useState("");
  const[reply, setReply] = useState(null);
  const[currThreadId, setCurrThreadId] = useState(uuidv1());
  const[prevChats, setPrevChats] = useState([]); //stores chat history of current threads
  const[newChat, setNewChat] = useState(true); //to identify if new chat is created
  const[allThreads, setAllThreads] = useState([]); //stores all chat threads
  const[sidebarOpen, setSidebarOpen] = useState(false); //for mobile sidebar toggle

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    sidebarOpen, setSidebarOpen
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App
