import React, { useState } from 'react';

const Chatbot = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', message: '¡Hola! Estoy aquí para responder preguntas sobre este sitio web. ¿En qué puedo ayudarte?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage) => {
    setLoading(true);
    
    const siteSpecificPrompt = "Eres un asistente virtual diseñado para responder únicamente preguntas sobre este sitio web en español. Responde de manera breve, clara y útil solo sobre el contenido del sitio.";

    
    const conversationHistory = conversation.map(
      entry => `${entry.sender === 'user' ? 'User' : 'Bot'}: ${entry.message}`
    ).join("\n");
    
    const fullPrompt = `${siteSpecificPrompt}\n${conversationHistory}\nUser: ${userMessage}\nBot:`;

    try {
      const response = await fetch('https://api.cohere.ai/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer yqop16yV3DJjWrWxLrNV7EdPF2sjduKU9wDZYqdO`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: 'command',
          temperature: 0.7,
          k: 0,
          p: 0.75,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        }),
      });

      const data = await response.json();
      
      if (!data || !data.text) {
        throw new Error('Invalid response from Cohere');
      }
      
      const botMessage = data.text.trim();
      
      setConversation((prev) => [...prev, { sender: 'bot', message: botMessage }]);
      setLoading(false);
    } catch (error) {
      console.error('Error with Cohere API:', error);
      setConversation((prev) => [...prev, { sender: 'bot', message: 'Sorry, something went wrong. Please try again.' }]);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    setConversation((prev) => [...prev, { sender: 'user', message: inputMessage }]);
    
    sendMessage(inputMessage);

    setInputMessage('');
  };

  return (
    <div className="chatbot-container">
      <div className="conversation-box">
        {conversation.map((entry, index) => (
          <div
            key={index}
            className={entry.sender === 'user' ? 'message user-message' : 'message bot-message'}
          >
            <p>{entry.message}</p>
          </div>
        ))}
        {loading && <div className="bot-message message"><p>GoTripBot esta escribiendo...</p></div>}
      </div>
      
      <form onSubmit={handleSubmit} className="input-box">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Preguntame sobre el sitio!"
          className="input-field"
        />
        <button type="submit" disabled={loading} className="send-btn">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;