import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import './Chatbot.css'; // Archivo de estilos separado

const Chatbot = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', message: '¡Hola! Estoy aquí para responder preguntas sobre este sitio web y brindarte información turística sobre la ciudad. ¿En qué puedo ayudarte?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const sendMessage = async (userMessage) => {
    setLoading(true);
    
    const siteSpecificPrompt = "Eres un asistente virtual diseñado para responder preguntas sobre este sitio web y actuar como guía turístico de la ciudad. Además de brindar información sobre la funcionalidad del sitio, también puedes sugerir lugares turísticos, actividades recomendadas y datos históricos o culturales de la ciudad. La principal funcionalidad del sitio es crear un plan de viaje. Indica a los usuarios que deben ir a la sección Opciones, luego seleccionar Realizar plan de viaje y seguir los pasos que se les indique.";

    const messages = [
      { role: 'system', content: siteSpecificPrompt },
      ...conversation.map(entry => ({ role: entry.sender === 'user' ? 'user' : 'assistant', content: entry.message })),
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7
        }),
      });

      const data = await response.json();
      
      if (!data || !data.choices || data.choices.length === 0) {
        throw new Error('Invalid response from OpenAI');
      }
      
      const botMessage = data.choices[0].message.content.trim();
      
      setConversation((prev) => [...prev, { sender: 'bot', message: botMessage }]);
    } catch (error) {
      console.error('Error con la API:', error);
      setConversation((prev) => [...prev, { sender: 'bot', message: 'Hubo un error, intenta nuevamente.' }]);
    } finally {
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
      <div className="chat-header">GoTrip Chat</div>
      <div className="conversation-box">
        {conversation.map((entry, index) => (
          <div key={index} className={`message ${entry.sender}-message`}>
            <p>{entry.message}</p>
          </div>
        ))}
        {loading && <div className="bot-message message"><p>GoTripBot está escribiendo...</p></div>}
        <div ref={chatEndRef}></div>
      </div>
      
      <form onSubmit={handleSubmit} className="input-box">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Pregúntame sobre el sitio o la ciudad!"
          className="input-field"
        />
        <button type="submit" disabled={loading} className="send-btn">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
