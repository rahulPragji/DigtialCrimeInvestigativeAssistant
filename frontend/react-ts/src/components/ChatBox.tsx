import React, { useState } from 'react';

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  onSendMessage, 
  placeholder = "Enter your query..." 
}) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-input-wrapper">
      <form className="chat-input-container" onSubmit={handleSubmit}>
        <input 
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="chat-input-field"
        />
        <button type="submit" className="chat-submit-btn">
          <span>Send</span>
          <svg strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="chat-submit-icon">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
