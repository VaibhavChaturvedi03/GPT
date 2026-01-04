import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, setAllThreads, sidebarOpen, setSidebarOpen, user, setUser} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'https://gpt-kwt0.onrender.com';

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        const isNewThread = prevChats.length === 0;

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_URL}/api/chat`, options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
            
            // Refresh thread list if this is a new thread
            if(isNewThread) {
                const threadsResponse = await fetch(`${API_URL}/api/thread`, {
                    credentials: 'include'
                });
                const threads = await threadsResponse.json();
                const filteredData = threads.map(thread => ({ threadId: thread.threadId, title: thread.title }));
                setAllThreads(filteredData);
            }
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                credentials: 'include'
            });
            setUser(null);
            // Clear all data
            setPrevChats([]);
            setAllThreads([]);
            setPrompt("");
            setReply(null);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div className="navbarLeft">
                    <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <span>GPT <i className="fa-solid fa-chevron-down"></i></span>
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    {user?.picture ? (
                        <img src={user.picture} alt={user.name} className="userImage" />
                    ) : (
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    )}
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="userInfo">
                        <div className="userInfoText">
                            <strong>{user?.name}</strong>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                    <div className="dropDownDivider"></div>
                    <div className="dropDownItems"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItems"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownDivider"></div>
                    <div className="dropDownItems" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    GPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;