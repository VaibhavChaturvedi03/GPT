import './Sidebar.css';
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
    const { allThreads, setAllThreads, setCurrThreadId, currThreadId, setNewChat, setPrompt, setReply, setPrevChats, sidebarOpen, setSidebarOpen, user } = useContext(MyContext);

    const API_URL = import.meta.env.VITE_API_URL || 'https://gpt-kwt0.onrender.com';

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
            <button onClick={createNewChat}>
                <img src="/blacklogo.png" alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span> {/* icon from font awesome */}
            </button>

            <ul className="history">
                {
                    allThreads.map((thread, idx) => (
                        <li key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}></i>
                        </li>
                    ))
                }
            </ul>

            <div className="user-profile">
                {user && (
                    <>
                        <img 
                            src={user.photo} 
                            alt="User profile" 
                            className="user-avatar"
                        />
                        <span className="user-name">{user.displayName}</span>
                    </>
                )}
            </div>
        </section>
    )
}

export default Sidebar;