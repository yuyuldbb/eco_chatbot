import React from "react";
import "./ChatMessage.css";

function ChatMessage({ sender, text }) {
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={`chat-message ${sender === "user" ? "user" : "bot"}`}>
      <p>{formatMessage(text)}</p>
    </div>
  );
}

export default ChatMessage;