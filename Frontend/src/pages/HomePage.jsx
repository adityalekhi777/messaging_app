import React, { useState, useEffect, useRef } from 'react';
import styles from './HomePage.module.css';
import MainNavbar from '../components/MainNavbar/MainNavbar';
import { useSocket } from '../context/SocketContext';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setCurrentUser(data.currentUser);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/messages/${selectedUser.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            console.error('Failed to fetch messages');
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('addUser', currentUser.id);
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (selectedUser && message.senderId === selectedUser.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
        socket.emit('sendMessage', sentMessage);
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredUsers = (users || []).filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles['home-container']}>
      <div className={styles['left-pane']}>
        <div className={styles['search-bar']}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles['user-list']}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`${styles['user-profile']} ${
                selectedUser?.id === user.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['right-pane']}>
        <MainNavbar />
        {selectedUser ? (
          <>
            <div className={styles['chat-header']}>{selectedUser.username}</div>
            <div className={styles['chat-messages']}>
              {messages.map((message) => (
                <div key={message.id} className={`${styles.message} ${message.senderId !== currentUser.id ? styles.received : styles.sent}`}>
                  {message.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className={styles['chat-input']} onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className={styles['select-chat-prompt']}>
            <h2>Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;