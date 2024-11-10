// src/app/chat/page.tsx
"use client";

import { useState } from 'react';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div>
      <h1>Chat with OpenAI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
      {reply && (
        <div>
          <h2>Response:</h2>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
