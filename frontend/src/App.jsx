import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Login from './Login.jsx';
import { MyContext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
  const[prompt, setPrompt] = useState("");
  const[reply, setReply] = useState(null);
  const[currThreadId, setCurrThreadId] = useState(uuidv1());
  const[prevChats, setPrevChats] = useState([]); //stores chat history of current threads
  const[newChat, setNewChat] = useState(true); //to identify if new chat is created
  const[allThreads, setAllThreads] = useState([]); //stores all chat threads
  const[sidebarOpen, setSidebarOpen] = useState(false); //for mobile sidebar toggle
  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://gpt-kwt0.onrender.com';

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/current-user`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    sidebarOpen, setSidebarOpen,
    user, setUser
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a1a1a'
      }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

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
