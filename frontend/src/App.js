import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Quick questions for the sidebar
  const quickQuestions = [
    "What are the benefits of nuclear energy?",
    "How does nuclear waste get managed?",
    "Compare nuclear vs renewable energy",
    "What is carbon footprint reduction?",
    "Explain nuclear safety measures",
    "Best practices for environmental sustainability"
  ];

  // Environment facts for the sidebar
  const environmentFacts = [
    { icon: "🌍", text: "Nuclear energy prevents 2 billion tons of CO2 emissions annually" },
    { icon: "⚡", text: "1 nuclear reactor powers 1 million homes with clean energy" },
    { icon: "🔄", text: "Nuclear has the highest capacity factor of any energy source" },
    { icon: "🌱", text: "Nuclear energy saves 80,000+ acres of land compared to solar" }
  ];

  // Resource links
  const resourceLinks = [
    { icon: "📚", text: "IAEA Nuclear Energy Guide", url: "https://www.iaea.org/topics/nuclear-energy" },
    { icon: "🌐", text: "World Nuclear Association", url: "https://world-nuclear.org/" },
    { icon: "🔬", text: "EPA Environmental Resources", url: "https://www.epa.gov/environmental-topics" },
    { icon: "📊", text: "Energy Statistics Database", url: "https://www.eia.gov/" }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { sender: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:7860/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting right now. Please try again." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const exportChat = (format) => {
    const chatText = messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.text}`
    ).join('\n\n');
    
    if (format === 'text') {
      const blob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nuclear-environment-chat.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Get recent user questions for history
  const recentQuestions = messages
    .filter(msg => msg.sender === 'user')
    .slice(-5)
    .reverse();

  const handleHistoryClick = (question) => {
    sendMessage(question);
  };

  // Get a random fact
  const randomFact = environmentFacts[Math.floor(Math.random() * environmentFacts.length)];

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-title">Quick Questions</div>
          <div className="quick-questions">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question"
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Chat Stats</div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{messages.filter(m => m.sender === 'user').length}</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{messages.filter(m => m.sender === 'bot').length}</div>
              <div className="stat-label">Answers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{messages.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {messages.length > 0 ? Math.round((messages.filter(m => m.sender === 'bot').length / messages.length) * 100) : 0}%
              </div>
              <div className="stat-label">Response Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <h2 className="title">🌿 Nuclear & Environment AI Assistant</h2>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} sender={msg.sender} text={msg.text} />
          ))}
          
          {isLoading && (
            <div className="chat-message bot">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Start a conversation about nuclear energy and environment</h3>
              <p>Ask your question or click any quick question to begin</p>
            </div>
          )}
        </div>

        <div className="input-container">
          <div className="input-row">
            <input
              type="text"
              placeholder="Ask about nuclear energy, environmental science, sustainability..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button onClick={() => sendMessage()} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Updated with Useful Features */}
      <div className="sidebar-right">
        {/* Conversation History */}
        <div className="sidebar-section">
          <div className="sidebar-title">Recent Questions</div>
          <div className="conversation-history">
            {recentQuestions.length > 0 ? (
              <div className="history-list">
                {recentQuestions.map((msg, index) => (
                  <div
                    key={index}
                    className="history-item"
                    onClick={() => handleHistoryClick(msg.text)}
                  >
                    {msg.text.length > 50 ? msg.text.substring(0, 50) + '...' : msg.text}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#718096', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                No recent questions
              </div>
            )}
          </div>
        </div>

        {/* Environment Fact */}
        <div className="sidebar-section">
          <div className="sidebar-title">Did You Know?</div>
          <div className="environment-fact">
            <div className="fact-icon">{randomFact.icon}</div>
            <div className="fact-text">{randomFact.text}</div>
          </div>
        </div>

        {/* Resource Links */}
        <div className="sidebar-section">
          <div className="sidebar-title">Useful Resources</div>
          <div className="resource-links">
            {resourceLinks.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <span className="resource-icon">{resource.icon}</span>
                <span className="resource-text">{resource.text}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Export Controls */}
        <div className="sidebar-section">
          <div className="sidebar-title">Chat Tools</div>
          <div className="export-controls">
            <button 
              className="export-btn"
              onClick={() => exportChat('text')}
              disabled={messages.length === 0}
            >
              <span className="export-icon">📥</span>
              Export Chat as Text
            </button>
            <button 
              className="export-btn"
              onClick={clearChat}
              disabled={messages.length === 0}
            >
              <span className="export-icon">🗑️</span>
              Clear Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;