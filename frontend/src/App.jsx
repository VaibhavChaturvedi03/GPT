import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Login from './Login.jsx';
import { MyContext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/current-user`, {
          credentials: "include"
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user || null);

        const url = new URL(window.location.href);
        if (url.searchParams.has("authenticated")) {
          url.searchParams.delete("authenticated");
          window.history.replaceState({}, "", url);
        }

      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#1a1a1a",
        color: "white"
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">
        {sidebarOpen && (
          <div
            className="overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

export default App;
