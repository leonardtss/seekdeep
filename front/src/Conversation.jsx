import React from "react";
import DOMPurify from "dompurify";
import {  useEffect } from "react";

const styles = {

    userMessage: {
        color: "#262626",
        boxSizing: "border-box",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        backgroundColor: "#eff6ff",
        maxWidth: "100%",
        borderRadius: '14px',
        padding: '16px',
        fontSize: '14px',
        lineHeight: '1.6',
        fontWeight: '400',
        width: 'fit-content',
        border: 'none',
        marginLeft:"auto"
      },
      botMessage: {
        color: "#262626",
        boxSizing: "border-box",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        maxWidth: "100%",
        borderRadius: '14px',
        padding: '16px',
        fontSize: '14px',
        lineHeight: '1.6',
        fontWeight: '400',
        width: '100%',
        border: 'none',
        paddingLeft:"0",
        marginRight:"auto"

      },
      topBar:{
        position: "fixed",
        top: "0",
        height: "64px",
        backgroundColor: "white",
        zIndex: "100",
        width: "calc(100% - 205px)",
        webkitBoxShadow: "0px 34px 26px -20px rgb(255, 255, 255)",
        mozBoxShadow: "0px 34px 26px -20px rgb(255, 255, 255)",
        boxShadow: "0px 34px 26px -20px rgb(255, 255, 255)"
      },
      spinner: {
        width: '20px',
        height: '20px',
        border: '2px solid #e5e7eb',
        borderTop: '2px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }
}

const Conversation = ({conversationTitle, convLoading, messages, loading, conversationId, }) => {
    

    

    return (
        <div style={{height:"auto", minHeight:"calc(100vh - 140px)", overflowY:"hidden"}} >
            <div style={styles.topBar}>
                <div style={{fontWeight: "600",lineHeight: "24px",  boxSizing: "border-box",position:"relative",height:"64px", color:"#262626", display:"flex", justifyContent:"center", alignItems:"center",whiteSpace: "nowrap",textOverflow: "ellipsis"}}>
                    {conversationTitle}
                </div>
            </div>
            {convLoading?
                <div style={{width:"100%", display:"flex", height:"30vh", alignItems:"center",justifyContent:"center"}}>
                    <div style={styles.spinner} />
                </div>
            :
            <div style={{width:"60%", marginLeft:"auto", marginRight:"auto", marginTop:"90px"}}>
                  

                  {messages?.map((msg, index) => (
                      <div style={{paddingBottom:"32px", marginBottom:"16px", display:"flex"}}>
                          {msg.role==="user"?
                              <div style={{marginRight:"15px",height:"30px", width:"30px", display:"flex", justifyContent:"center", alignItems:"center", flexShrink: "0",flexGrow: "0"}}>
                              </div>:
                                <div style={{position:'relative', marginTop:"30px"}}>
                                    <div style={{marginRight:"15px",height:"35px", width:"35px", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", border:"1px solid rgb(66 121 237)",   flexShrink: "0",flexGrow: "0"}}>
                                        {/* <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="path" d="M27.501 8.46875C27.249 8.3457 27.1406 8.58008 26.9932 8.69922C26.9434 8.73828 26.9004 8.78906 26.8584 8.83398C26.4902 9.22852 26.0605 9.48633 25.5 9.45508C24.6787 9.41016 23.9785 9.66797 23.3594 10.2969C23.2275 9.52148 22.79 9.05859 22.125 8.76172C21.7764 8.60742 21.4238 8.45312 21.1807 8.11719C21.0098 7.87891 20.9639 7.61328 20.8779 7.35156C20.8242 7.19336 20.7695 7.03125 20.5879 7.00391C20.3906 6.97266 20.3135 7.13867 20.2363 7.27734C19.9258 7.84375 19.8066 8.46875 19.8174 9.10156C19.8447 10.5234 20.4453 11.6562 21.6367 12.4629C21.7725 12.5547 21.8076 12.6484 21.7646 12.7832C21.6836 13.0605 21.5869 13.3301 21.501 13.6074C21.4473 13.7852 21.3662 13.8242 21.1768 13.7461C20.5225 13.4727 19.957 13.0684 19.458 12.5781C18.6104 11.7578 17.8438 10.8516 16.8877 10.1426C16.6631 9.97656 16.4395 9.82227 16.207 9.67578C15.2314 8.72656 16.335 7.94727 16.5898 7.85547C16.8574 7.75977 16.6826 7.42773 15.8193 7.43164C14.957 7.43555 14.167 7.72461 13.1611 8.10938C13.0137 8.16797 12.8594 8.21094 12.7002 8.24414C11.7871 8.07227 10.8389 8.0332 9.84766 8.14453C7.98242 8.35352 6.49219 9.23633 5.39648 10.7441C4.08105 12.5547 3.77148 14.6133 4.15039 16.7617C4.54883 19.0234 5.70215 20.8984 7.47559 22.3633C9.31348 23.8809 11.4307 24.625 13.8457 24.4824C15.3125 24.3984 16.9463 24.2012 18.7881 22.6406C19.2529 22.8711 19.7402 22.9629 20.5498 23.0332C21.1729 23.0918 21.7725 23.002 22.2373 22.9062C22.9648 22.752 22.9141 22.0781 22.6514 21.9531C20.5186 20.959 20.9863 21.3633 20.5605 21.0371C21.6445 19.752 23.2783 18.418 23.917 14.0977C23.9668 13.7539 23.9238 13.5391 23.917 13.2598C23.9131 13.0918 23.9512 13.0254 24.1445 13.0059C24.6787 12.9453 25.1973 12.7988 25.6738 12.5352C27.0557 11.7793 27.6123 10.5391 27.7441 9.05078C27.7637 8.82422 27.7402 8.58789 27.501 8.46875ZM15.46 21.8613C13.3926 20.2344 12.3906 19.6992 11.9766 19.7227C11.5898 19.7441 11.6592 20.1875 11.7441 20.4766C11.833 20.7617 11.9492 20.959 12.1123 21.209C12.2246 21.375 12.3018 21.623 12 21.8066C11.334 22.2207 10.1768 21.668 10.1221 21.6406C8.77539 20.8477 7.64941 19.7988 6.85547 18.3652C6.08984 16.9844 5.64453 15.5039 5.57129 13.9238C5.55176 13.541 5.66406 13.4062 6.04297 13.3379C6.54199 13.2461 7.05762 13.2266 7.55664 13.2988C9.66602 13.6074 11.4619 14.5527 12.9668 16.0469C13.8262 16.9004 14.4766 17.918 15.1465 18.9121C15.8584 19.9688 16.625 20.9746 17.6006 21.7988C17.9443 22.0879 18.2197 22.3086 18.4824 22.4707C17.6895 22.5586 16.3652 22.5781 15.46 21.8613ZM16.4502 15.4805C16.4502 15.3105 16.5859 15.1758 16.7568 15.1758C16.7949 15.1758 16.8301 15.1836 16.8613 15.1953C16.9033 15.2109 16.9424 15.2344 16.9727 15.2695C17.0273 15.3223 17.0586 15.4004 17.0586 15.4805C17.0586 15.6504 16.9229 15.7852 16.7529 15.7852C16.582 15.7852 16.4502 15.6504 16.4502 15.4805ZM19.5273 17.0625C19.3301 17.1426 19.1328 17.2129 18.9434 17.2207C18.6494 17.2344 18.3281 17.1152 18.1533 16.9688C17.8828 16.7422 17.6895 16.6152 17.6074 16.2168C17.5732 16.0469 17.5928 15.7852 17.623 15.6348C17.6934 15.3105 17.6152 15.1035 17.3877 14.9141C17.2012 14.7598 16.9658 14.7188 16.7061 14.7188C16.6094 14.7188 16.5205 14.6758 16.4541 14.6406C16.3457 14.5859 16.2568 14.4512 16.3418 14.2852C16.3691 14.2324 16.501 14.1016 16.5322 14.0781C16.8838 13.877 17.29 13.9434 17.666 14.0938C18.0146 14.2363 18.2773 14.498 18.6562 14.8672C19.0439 15.3145 19.1133 15.4395 19.334 15.7734C19.5078 16.0371 19.667 16.3066 19.7754 16.6152C19.8408 16.8066 19.7559 16.9648 19.5273 17.0625Z" fill-rule="nonzero" fill="#4D6BFE"></path></svg> */}
                                        <img src="logo1.png" alt="seekdeep" height="27"/>

                                    </div>
                                </div>
                          }
      
                          <div
                              key={index}
                              style={msg.role === "user" ? styles.userMessage : styles.botMessage}
                              dangerouslySetInnerHTML={msg.role === "bot" ? { __html: DOMPurify.sanitize(msg.content.replace(/\\n/g, "")) } : undefined}
                          >
                              {msg.role === "user" ? msg.content : null}
                          </div>
                      </div>
      
                  ))}
            
            </div>
}
        </div>

    );
};

export default Conversation;