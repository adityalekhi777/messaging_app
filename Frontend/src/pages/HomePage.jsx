import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import MainNavbar from '../components/MainNavbar/MainNavbar';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
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
              {/* Chat messages will go here */}
            </div>
            <div className={styles['chat-input']}>
              <input type="text" placeholder="Type a message..." />
            </div>
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