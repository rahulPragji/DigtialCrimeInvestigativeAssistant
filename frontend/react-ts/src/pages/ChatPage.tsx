import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

/**
 * ChatPage Component
 * 
 * This page allows users to ask questions about a specific crime type and device.
 * It will help them identify artifacts and provide guidance on investigations.
 */
const ChatPage: React.FC = () => {
  const { deviceType, crimeType } = useParams<{ deviceType: string; crimeType: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'assistant', content: string}>>([
    { type: 'assistant', content: `Welcome to the Digital Crime Investigation Assistant chat. How can I help you with your ${crimeType} investigation on ${deviceType} devices?` }
  ]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSendMessage = (message: string) => {
    // Add user message to chat
    setChatHistory([...chatHistory, { type: 'user', content: message }]);

    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          type: 'assistant', 
          content: `This is a placeholder response for your query about ${crimeType} on ${deviceType} devices. In the full implementation, this would provide detailed information about digital artifacts and investigation techniques.` 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="container">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="chat-main">
        <div className="cyber-grid"></div>
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat Assistant</h2>
            <p className="chat-description">
              Ask questions about artifacts, investigation techniques, or get guidance on your {crimeType} case.
            </p>
          </div>
          
          <div className="chat-messages">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.type}`}>
                <div className="message-content">{chat.content}</div>
              </div>
            ))}
          </div>
          
          <ChatBox 
            onSendMessage={handleSendMessage} 
            placeholder="Type your question here..."
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;