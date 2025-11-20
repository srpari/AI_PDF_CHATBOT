import { GoogleGenAI } from "@google/genai";
import './Chat.css';
import { useState } from 'react';

function Chat({file}) {


    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY });
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

   async function handleSendMessage() {
        // Handle sending a message
        if(inputMessage.length) {
            let chatMessages = [...messages, { role: 'user', text: inputMessage}, {role: "loader", text: ""}];
            setMessages(chatMessages);
            setInputMessage('');    
             try{
        const contents = [
        { text:  
            `Answer this question about the attached document: ${inputMessage}.
            Answer as a chatbot with short messages and text only (no markdowns, tags or symbols)
            Chat history: ${JSON.stringify(messages)}`
        },
        {
            inlineData: {
                mimeType: file.type,
                data: file.file,
            }
        }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents
        });

        chatMessages = [...chatMessages.filter((msg)=> msg.role != 'loader'), { role: 'model', text: response.text}];
        setMessages(chatMessages);
     }
        catch(error){   

            chatMessages = [...chatMessages.filter((msg)=> msg.role != 'loader'), { role: 'error', text: "Error generating response. Please try again."}];
            setMessages(chatMessages);
            console.log("Error generating summary:", error);
        }
        }
    }

    return (
      <section className="chat-window">
        <h2>Chat</h2>
        {
            messages.length ?
            <div className="chat">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        <p>{message.text}</p>
                    </div>
                ))}
            
            </div> : ''
        }
        
        <div className="input-area">
            <input value={inputMessage} 
                onChange={(e)=> setInputMessage(e.target.value)}
                type="text" placeholder="Ask any question about the uploaded document..." />
            <button onClick={handleSendMessage}>Send</button>
        </div>
      </section>
    )
  }
  
  export default Chat