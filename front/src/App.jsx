import { useEffect, useRef, useState } from "react";
import { Search, MessageSquare, Copy, Send } from 'lucide-react';
import { TbArrowBarToRight } from "react-icons/tb";

import './style.css'
import './App.css'
import DeepseekInput from './DeepseekInput';
import Conversation from './Conversation';
import axios from "axios";
import DeleteModal from "./DeleteModal";

const styles={
  container:{
    display:"flex",
    width:"100vw",
    height:"100vh",
    overflowX: "hidden",

  },

  mainContent:{
    width:"100%"
  },
  deepseekLogo:{
    width:"125px",
    height: "55px", // Ajoute une hauteur fixe
    objectFit: "contain",
    marginTop:"1px",
    color:"#2c2c36",
    zIndex:"0",
    display:"flex",

  },
  deepseekLogoSmall:{
    marginTop:"10px",
    color:"#2c2c36",
    zIndex:"0",
    display:"flex",
    justifyContent:"center"

  },
  chatItem: {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#1f2937',
    marginBottom: '4px',
    fontWeight: '400',
    lineHeight: '1.5'
  },
  timeLabel: {
    fontSize: '14px',
    color: "rgb(59 58 58)",
    padding: '8px',
    marginTop: '8px',
    fontWeight: '600'
  }
}

function App() {
  var userId = "67b30ce5f20177e108829679";
  const [conversationId, setConversationId] = useState(undefined)
  const containerRef = useRef(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [conversations, setConversations] = useState([]);
  const [timeCategories, setTimeCategories] = useState([]);
  const [conversationTitle, setConversationTitle] = useState("");
  const [convLoading, setConvLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showFirstMessages, setShowFirstMessages] = useState(false);
  const [newChat, setNewChat] = useState(true);
  const [newConversation, setNewConversation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState(undefined)

  const handleDelete = () => {
    console.log("Deleting chat...");
    setIsModalOpen(false);
  };


  const fetchConversation = async () => {
      
    if (conversationId !== undefined) {
      setConvLoading(true)
      try {
        const response = await axios.get(`http://localhost:4000/api/conversations/onlyone/${conversationId}`);
        console.log("Conversations:", response.data);
        setConvLoading(false)
        setMessages(response.data.conversation.messages);
      } catch (error) {
        console.error("Error fetching conversations:", error.response ? error.response.data : error.message);
      }
    }
  };

  const getUserConversations = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/conversations/user/${userId}`);
  
      console.log("Conversations:", response.data);
      setConversations(response.data.conversations)
      categorizeConversations(response.data.conversations)
    } catch (error) {
      console.error("Error fetching conversations:", error.response ? error.response.data : error.message);
    }
  };

  const categorizeConversations = (conversations) => {
    const today = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
  
    const categories = {
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      "Last 30 Days": [],
    };
  
    conversations.forEach((conversation) => {
      const updatedAt = new Date(conversation.updatedAt);
      const diffDays = Math.floor((today - updatedAt) / oneDay);
      console.log(categories)
      console.log(diffDays)
      if (diffDays === 0) {
        categories.Today.push(conversation);
      } else if (diffDays === 1) {
        categories.Yesterday.push(conversation);
      } else if (diffDays > 1&&diffDays <= 7) {
        categories["Last 7 Days"].push(conversation);
      } else if (diffDays > 7&&diffDays <= 30) {
        categories["Last 30 Days"].push(conversation);
       
      }
    });
    Object.keys(categories).forEach((key) => {
      categories[key].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    setTimeCategories(categories);
  };

  useEffect(() => {

    getUserConversations(userId)

  }, [newConversation]); 


  useEffect(() => {

    getUserConversations(userId)

  }, []); 

  useEffect(() => {
    if(!newChat){
      fetchConversation();
    }
  }, [conversationId]); 

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]); 

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={styles.container} ref={containerRef}>
      <div className='side-bar' style={{ display: (isVisible&& screenWidth > 880) ? "block" : "none" }}>
        <div style={styles.deepseekLogo}>
          <img src="seekdeep.png" alt="seekdeep" width="170"/>
          <button onClick={() => setIsVisible(!isVisible)}  
          className='expand-left'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>

        </button>
        </div>
        <button onClick={() => {setConversationId(undefined); setNewChat(true);setShowFirstMessages(false); setMessages([])}}  className='new-chat-button'>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-plus"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>
                    <span>New chat</span>
        </button>
        <div style={{height:"70vh"}}>
          {Object.entries(timeCategories).map(([label, convs]) =>
                  convs.length > 0 ? (
                    <div key={label}>
                      <div style={styles.timeLabel}>{label}</div>
                        {convs.map((conversation) => (
                          <div
                            className="conversation"
                            key={conversation._id}
                            style={{

                              display:"flex",
                              marginRight: "5px",
                              ...styles.chatItem,
                              backgroundColor: conversation._id === conversationId ? '#dbeafe' : 'transparent', // Color for selected conversation
                              transition: 'background-color 0.3s', // Smooth transition for hover
                            }}
                            onClick={() => {setConversationId(conversation._id);
                              setConversationTitle(conversation.title);
                              setNewChat(false)
                            }
                            }
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9f2fd'} // Hover color
                            onMouseLeave={(e) => e.target.style.backgroundColor = conversation._id === conversationId ? '#dbeafe' : 'transparent'} // Reset color on mouse leave
                          >
                            {conversation.title}
                            <div     
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent click from reaching parent
                                setIsModalOpen(true);
                                setDeleteConversationId(conversation._id)

                              }}
                              className="delete-conversation" style={{marginLeft:"5px", alignItems:"center"}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>

                            </div>
                          </div>
                        ))}
                    </div>
                  ) : null
                )}
        </div>
      </div>

      <div className='side-bar-small' style={{ display: (!isVisible&& screenWidth > 880) ? "block" : "none" }}>
        <div style={styles.deepseekLogoSmall}>
          <img src="logo1.png" alt="seekdeep" width="40"/>
        </div>
        <button onClick={() => setIsVisible(!isVisible)}  
          className='expand-right'>
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>     
        </button>
   
        <button onClick={() => {setConversationId(undefined); setNewChat(true);setShowFirstMessages(false); setMessages([])}}  
          className='new-chat-button-small'>
          <svg width="23" height="23" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.10999 27C8.92999 27 8.76001 26.96 8.60001 26.9C8.43001 26.83 8.29 26.74 8.16 26.61C8.03 26.49 7.94 26.3499 7.87 26.1899C7.79999 26.0299 7.76001 25.8599 7.76001 25.6899L7.73001 23.04C7.34001 22.98 6.95001 22.8799 6.57001 22.7599C6.19001 22.6299 5.83001 22.48 5.48001 22.29C5.13001 22.1 4.79999 21.88 4.48999 21.63C4.17999 21.39 3.89 21.1199 3.63 20.82C3.37 20.52 3.13999 20.21 2.92999 19.87C2.72999 19.53 2.56001 19.18 2.42001 18.82C2.28001 18.45 2.17001 18.07 2.10001 17.69C2.03001 17.3 2 16.92 2 16.53V9.46995C2 9.03995 2.04 8.61995 2.12 8.19995C2.21 7.77995 2.34 7.36995 2.5 6.96995C2.67 6.57995 2.88 6.19995 3.12 5.84995C3.36 5.48995 3.64001 5.15995 3.95001 4.85995C4.26001 4.55995 4.59999 4.28995 4.95999 4.04995C5.32999 3.80995 5.70999 3.60995 6.10999 3.44995C6.51999 3.27995 6.94 3.15995 7.37 3.07995C7.79999 2.98995 8.23001 2.94995 8.67001 2.94995H13.3C13.46 2.94995 13.61 2.97995 13.76 3.03995C13.9 3.09995 14.03 3.17995 14.14 3.28995C14.25 3.39995 14.33 3.51995 14.39 3.65995C14.45 3.79995 14.48 3.94995 14.48 4.09995C14.48 4.25995 14.45 4.39995 14.39 4.54995C14.33 4.68995 14.25 4.80995 14.14 4.91995C14.03 5.02995 13.9 5.10995 13.76 5.16995C13.61 5.22995 13.46 5.25995 13.3 5.25995H8.67001C8.38001 5.25995 8.09999 5.27995 7.82999 5.33995C7.54999 5.38995 7.27999 5.46995 7.01999 5.57995C6.75999 5.67995 6.50999 5.80995 6.26999 5.96995C6.03999 6.11995 5.82 6.29995 5.62 6.48995C5.42 6.68995 5.23999 6.89995 5.07999 7.12995C4.92999 7.35995 4.78999 7.59995 4.67999 7.85995C4.57999 8.10995 4.49 8.37995 4.44 8.64995C4.38 8.91995 4.35999 9.18995 4.35999 9.46995V16.53C4.35999 16.81 4.38 17.08 4.44 17.36C4.5 17.63 4.58 17.9 4.69 18.16C4.8 18.42 4.93 18.67 5.09 18.9C5.25 19.13 5.43001 19.3499 5.64001 19.5499C5.84001 19.75 6.05999 19.92 6.29999 20.08C6.53999 20.24 6.79 20.37 7.06 20.47C7.32 20.58 7.6 20.66 7.88 20.72C8.16001 20.77 8.44001 20.7999 8.73001 20.7999C8.91001 20.7999 9.08 20.83 9.25 20.9C9.41 20.97 9.55999 21.0599 9.67999 21.18C9.80999 21.3099 9.91001 21.45 9.98001 21.61C10.05 21.77 10.08 21.94 10.09 22.11L10.1 23.74L13.08 21.61C13.84 21.07 14.69 20.7999 15.63 20.7999H19.32C19.61 20.7999 19.89 20.77 20.16 20.72C20.44 20.67 20.71 20.59 20.97 20.4799C21.23 20.3699 21.48 20.24 21.72 20.09C21.95 19.94 22.17 19.76 22.37 19.57C22.57 19.3699 22.75 19.16 22.91 18.93C23.07 18.7 23.2 18.46 23.31 18.2C23.41 17.95 23.5 17.68 23.55 17.41C23.61 17.14 23.63 16.87 23.63 16.59V12.94C23.63 12.79 23.66 12.64 23.72 12.5C23.78 12.36 23.87 12.23 23.98 12.13C24.09 12.02 24.22 11.93 24.36 11.88C24.51 11.82 24.66 11.79 24.82 11.79C24.97 11.79 25.12 11.82 25.27 11.88C25.41 11.93 25.54 12.02 25.65 12.13C25.76 12.23 25.85 12.36 25.91 12.5C25.97 12.64 26 12.79 26 12.94V16.59C26 17.02 25.95 17.44 25.87 17.86C25.78 18.28 25.66 18.69 25.49 19.08C25.32 19.48 25.11 19.8499 24.87 20.2099C24.63 20.57 24.35 20.9 24.04 21.2C23.73 21.5 23.39 21.7699 23.03 22.0099C22.67 22.2499 22.28 22.45 21.88 22.61C21.47 22.77 21.06 22.9 20.63 22.9799C20.2 23.07 19.76 23.11 19.32 23.11H16.4C15.47 23.11 14.62 23.3799 13.86 23.9199L9.91 26.74C9.67 26.91 9.39999 27 9.10999 27Z" fill="currentColor"></path><path d="M24.6805 5.14453H18.1874C17.5505 5.14453 17.0342 5.66086 17.0342 6.29778C17.0342 6.9347 17.5505 7.45102 18.1874 7.45102H24.6805C25.3175 7.45102 25.8338 6.9347 25.8338 6.29778C25.8338 5.66086 25.3175 5.14453 24.6805 5.14453Z" fill="currentColor"></path><path d="M22.6137 3.1804C22.6137 2.52848 22.0852 2 21.4333 2C20.7814 2 20.2529 2.52848 20.2529 3.1804V9.4168C20.2529 10.0687 20.7814 10.5972 21.4333 10.5972C22.0852 10.5972 22.6137 10.0687 22.6137 9.4168V3.1804Z" fill="currentColor"></path></svg>
        </button>


      </div>
      
      <div style={{ display: screenWidth > 880 ? "none" : "block" }}>
      
      
      <div className='side-bar-small-expended' style={{ display: (isVisible&& screenWidth < 880) ? "none" : "block" }} >

        <div style={styles.deepseekLogo}>
          <img src="seekdeep.png" alt="seekdeep" width="170"/>
          <button onClick={() => setIsVisible(!isVisible)}  
          className='expand-left'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>

        </button>
        </div>

        
        <button onClick={() => {setConversationId(undefined); setNewChat(true);setShowFirstMessages(false); setMessages([])}}  className='new-chat-button'>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-plus"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>
          <span>New chat</span>
        </button>
        <div style={{height:"70vh"}}>
          {Object.entries(timeCategories).map(([label, convs]) =>
                  convs.length > 0 ? (
                    <div key={label}>
                      <div  style={styles.timeLabel}>{label}</div>
                        {convs.map((conversation) => (
                          <div
                            key={conversation._id}
                            className="conversation"
                            style={{
                              display:"flex",
                              marginRight: "5px",
                              ...styles.chatItem,
                              backgroundColor: conversation._id === conversationId ? '#dbeafe' : 'transparent', // Color for selected conversation
                              transition: 'background-color 0.3s', // Smooth transition for hover
                            }}
                            onClick={() => {setConversationId(conversation._id);
                              setConversationTitle(conversation.title);
                              setNewChat(false)
                            }
                            }
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9f2fd'} // Hover color
                            onMouseLeave={(e) => e.target.style.backgroundColor = conversation._id === conversationId ? '#dbeafe' : 'transparent'} // Reset color on mouse leave
                          >
                            {conversation.title}
                            <div                              
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent click from reaching parent
                                setIsModalOpen(true);
                                setDeleteConversationId(conversation._id)
                              }}
                              className="delete-conversation" style={{marginLeft:"5px", alignItems:"center"}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>

                            </div>
                          </div>
                        ))}
                    </div>
                  ) : null
                )}
        </div>
      </div>
      </div>

      <div className='side-bar-small' style={{ display: isVisible&&screenWidth < 880? "block" : "none" }}>
        <div style={styles.deepseekLogoSmall}>
          <img src="logo1.png" alt="seekdeep" width="40"/>
        </div>
        <button onClick={() => setIsVisible(!isVisible)}  
          className='expand-right'>
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>     
        </button>
   
        <button onClick={() => {setConversationId(undefined); setNewChat(true);setShowFirstMessages(false); setMessages([])}}  
          className='new-chat-button-small'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-plus"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>
        </button>


      </div>
      <div style={styles.mainContent} >
        {
          conversationId||showFirstMessages?
              <div>
                <Conversation conversationTitle={conversationTitle} convLoading={convLoading} messages={messages} loading={loading} conversationId={conversationId}/>
              </div>

          :
          <div>
            <div>
              <div style={{height:"35vh", display:"flex", justifyContent:"center", alignItems:"end", width:"100%"}}>
                <div style={{display:"flex", height:"60px"}}>
                <img src="logo1.png" alt="seekdeep" style={{height:"57px", marginRight:"10px",display:  screenWidth < 880? "none" : "block"}}/>
                <div style={{marginLeft:"10px",display:"flex",fontSize:"30px", alignItems:"center", fontWeight:"500"}}>
                Hi, I'm SeekDeep.
                </div>
                </div>
              </div>
              <div style={{paddingBottom:"20px",width:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#404040", fontSize:"14px", marginTop:"5px"}}>
                How can I help you today?
              </div>
              </div>

          </div>
        }
          <div>
              <DeepseekInput
                userId={userId}
                setNewConversation={setNewConversation}
                newConversation={newConversation}
                newChat={newChat}
                setConversationTitle={setConversationTitle}
                conversationId={conversationId} 
                setConversationId={setConversationId} 
                response={response} 
                setResponse={setResponse} 
                setLoading={setLoading} 
                loading={loading} 
                prompt={prompt} 
                setPrompt={setPrompt} 
                messages={messages} 
                setMessages={setMessages}   
                showFirstMessages={showFirstMessages}
                setShowFirstMessages={setShowFirstMessages}           
              />
          </div>
      </div>
      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onDelete={handleDelete} 
        conversationId={deleteConversationId}
      />
    </div>
  )
}

export default App
