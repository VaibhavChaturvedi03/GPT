import './ChatWindow.css';
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { useContext , useState, useEffect } from 'react';
import {ScaleLoader} from 'react-spinners';

function ChatWindow() {

    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, sidebarOpen, setSidebarOpen, setAllThreads } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async() => {
        setLoading(true);
        setNewChat(false);
        const isNewThread = prevChats.length === 0;
        
        const options = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try{
            const response = await fetch('https://gpt-kwt0.onrender.com/api/chat', options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
            
            // Refresh thread list if this is a new thread
            if(isNewThread) {
                const threadsResponse = await fetch('https://gpt-kwt0.onrender.com/api/thread');
                const threads = await threadsResponse.json();
                const filteredData = threads.map(thread => ({ threadId: thread.threadId, title: thread.title }));
                setAllThreads(filteredData);
            }
        }catch(err){
            console.log(err);
        }
        setLoading(false);
    }

    //Append newChat to prevChats
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats,{
                    role: 'user',
                    content: prompt
                },{
                    role: 'assistant',
                    content: reply
                }
            ]
            ));
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div className="navbarLeft">
                    <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <span>GPT <i className="fa-solid fa-chevron-down"></i> </span>
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItems"><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
                    <div className="dropDownItems"><i className="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropDownItems"><i className="fa-solid fa-right-from-bracket"></i>Log Out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader
                color="#fff"
                loading={loading}
                size={150}
            />

            <div className="chatInput">
                <div className="userInput">
                    <input placeholder='Ask Anything'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"? getReply():''}
                    >
                    </input>
                    <div id='submit' onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    GPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;