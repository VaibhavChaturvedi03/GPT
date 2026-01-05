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
      // If we just got redirected from OAuth, wait a bit for cookies to settle
      const isAuthRedirect = new URL(window.location).searchParams.get('authenticated');
      if (isAuthRedirect) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        console.log('Checking auth with API:', API_URL);
        const response = await fetch(`${API_URL}/api/auth/current-user`, {
          credentials: 'include',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        clearTimeout(timeoutId);
        
        console.log('Auth response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          console.error('Auth response not OK:', response.status, response.statusText);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Auth data:', data);
        
        if (data.user) {
          setUser(data.user);
          // Clean up the URL after successful authentication
          const url = new URL(window.location);
          if (url.searchParams.get('authenticated')) {
            url.searchParams.delete('authenticated');
            window.history.replaceState({}, '', url);
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.error('Auth check timed out');
        } else {
          console.error('Auth check failed:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_URL]);

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
