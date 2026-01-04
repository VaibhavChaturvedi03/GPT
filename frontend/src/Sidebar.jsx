import './Sidebar.css';
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
    const { allThreads, setAllThreads, setCurrThreadId, currThreadId, setNewChat, setPrompt, setReply, setPrevChats, sidebarOpen, setSidebarOpen, user, setUser } = useContext(MyContext);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_URL}/api/thread`, {
                credentials: 'include'
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setSidebarOpen(false); // Close sidebar on mobile after creating new chat
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, {
                credentials: 'include'
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setSidebarOpen(false); // Close sidebar on mobile after selecting thread
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try{
            const response = await fetch(`${API_URL}/api/thread/${threadId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const res = await response.json();

            //updated threads re-render
            setAllThreads(prev=>prev.filter(thread=>thread.threadId !== threadId)); 

            if(currThreadId === threadId){
                createNewChat();
            }
            
        }catch(err){
            console.log(err);
        }
    }

    return (
        <section className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={createNewChat}>
                    <img src="/blacklogo.png" alt="gpt logo" className="logo" />
                    <span className="new-chat-text">New Chat</span>
                    <span className="edit-icon"><i className="fa-solid fa-pen-to-square"></i></span>
                </button>
            </div>

            <div className="sidebar-content">
                <ul className="history">
                    {
                        allThreads.map((thread, idx) => (
                            <li key={idx}
                                onClick={(e) => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted": " "}
                            >
                                <i className="fa-regular fa-message"></i>
                                <span className="thread-title">{thread.title}</span>
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation(); //stop event bubbling
                                        deleteThread(thread.threadId);
                                    }}></i>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="sidebar-footer">
                {user && (
                    <>
                        <div className="user-profile">
                            <img 
                                src={user.picture || '/default-avatar.png'} 
                                alt="User profile" 
                                className="user-avatar"
                            />
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <button 
                                    className="logout-btn"
                                    onClick={async () => {
                                        try {
                                            await fetch(`${API_URL}/api/auth/logout`, {
                                                credentials: 'include'
                                            });
                                            setUser(null);
                                        } catch (error) {
                                            console.error('Logout failed:', error);
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i> Log out
                                </button>
                            </div>
                        </div>
                        <div className="branding">
                            <p>Made by Vaibhav</p>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Sidebar;