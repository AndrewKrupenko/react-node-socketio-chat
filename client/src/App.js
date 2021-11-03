import './App.css';
import io from 'socket.io-client';
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect(process.env.REACT_APP_SEVER_URL);

function App() {
  const [ username, setUsername ] = useState('');
  const [ room, setRoom ] = useState('');
  const [ showChat, setShowChat ] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <form onSubmit={joinRoom} noValidate>
            <fieldset>
              <label>
                <input
                  type="text"
                  placeholder="John..."
                  onChange={event => setUsername(event.target.value.trim())}
                />
              </label>
              <label>
                <input
                  type="text"
                  placeholder="Room id..."
                  onChange={event => setRoom(event.target.value.trim())}
                />
              </label>
            </fieldset>
            <button>Join A Room</button>
          </form>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
        />
      )}
    </div>
  );
}

export default App;
