import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { askQuestion, QuestionResponse } from '../services/api';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Only process if message has content
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { type: 'user', content: message }]);
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      // Call API for semantic search and LLM response
      const response: QuestionResponse = await askQuestion(message);
      
      // Format the answer with source information if available
      let formattedAnswer = response.answer;
      
      // Add sources information if available
      if (response.sources && response.sources.length > 0) {
        formattedAnswer += '\n\nSources:\n';
        response.sources.forEach((source, index) => {
          formattedAnswer += `${index + 1}. ${source.name} (${Math.round(source.relevance_score)}% relevance)\n`;
        });
      }
      
      // Add response to chat history
      setChatHistory(prev => [
        ...prev,
        { type: 'assistant', content: formattedAnswer }
      ]);
    } catch (error) {
      console.error('Error getting answer:', error);
      
      // Add error message to chat
      setChatHistory(prev => [
        ...prev,
        { 
          type: 'assistant', 
          content: 'I encountered an error while processing your question. Please try again later.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when chat history changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

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
                <div className="message-content">
                  {/* Convert newlines to line breaks for better formatting */}
                  {chat.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < chat.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="chat-message assistant loading">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible element at the bottom for auto-scrolling */}
            <div ref={messagesEndRef} />
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