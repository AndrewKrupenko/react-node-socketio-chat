import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
  const [ currentMessage, setCurrentMessage ] = useState('');
  const [ messageList, setMessageList ] = useState([]);

  useEffect(() => {
    socket.on('receive_message', data => { // get from backend to my frontend
      setMessageList(list => [...list, data]);
    })
  }, [socket]); // listen to any messages that we receive

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList(list => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  const handleInputChange = e => {
    setCurrentMessage(e.target.value);
  };

  const handleEnterPress = e => {
    e.key === "Enter" && sendMessage();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map(messageContent => {
            return (
              <div
                className="message"
                key={`${messageContent.message}-${new Date(Date.now()).getSeconds()}`}
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          value={currentMessage}
          onChange={handleInputChange}
          onKeyPress={handleEnterPress}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;