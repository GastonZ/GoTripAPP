import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import './Chatbot.css';

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

  const formatResponse = (text) => {
    // Aplicar negritas donde sea necesario
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    // Reemplazar saltos de línea con etiquetas HTML para mantener formato
    text = text.replace(/\n/g, '<br/>');
    
    // Añadir emojis según palabras clave
    const emojiMap = {
      'histórico': '🏛️',
      'parque': '🌳',
      'museo': '🖼️',
      'comida': '🍽️',
      'playa': '🏖️',
      'montaña': '⛰️',
      'catedral': '⛪',
      'arte': '🎨',
      'gastronomía': '🍲',
      'evento': '🎭'
    };
    Object.keys(emojiMap).forEach((key) => {
      const regex = new RegExp(`\b${key}\b`, 'gi');
      text = text.replace(regex, `${emojiMap[key]} ${key}`);
    });
    
    return text;
  };

  const sendMessage = async (userMessage) => {
    setLoading(true);
    
    const siteSpecificPrompt = "Eres un asistente virtual diseñado para responder preguntas sobre este sitio web y actuar como guía turístico de la ciudad...";

    const messages = [
      { role: 'system', content: siteSpecificPrompt },
      ...conversation.map(entry => ({ role: entry.sender === 'user' ? 'user' : 'assistant', content: entry.message })),
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk-svcacct-fqlrQB20qaLHb_cLqgsAUUfZ1wS7S3W8OuD9AE7_-qBeHKJTrmzmxDLt-sbQF3ViT3BlbkFJ18tp28IxWo-p77QT8Nlxxx_wti2ajwDnyzcUxeMscLcboDFTDFurnlnEvSqjsJcA`,
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
      
      let botMessage = formatResponse(data.choices[0].message.content.trim());
      
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
      <div className="chat-header">GoTrip BOT</div>
      <div className="conversation-box">
        {conversation.map((entry, index) => (
          <div key={index} className={`message ${entry.sender}-message`}>
            <div className="message-bubble">
              <p dangerouslySetInnerHTML={{ __html: entry.message }}></p>
            </div>
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
