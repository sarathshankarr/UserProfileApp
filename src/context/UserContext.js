import React, { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockUsers';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const searchUsers = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const getUserById = (id) => {
    return users.find(user => user.id === id);
  };

  return (
    <UserContext.Provider value={{
      users,
      filteredUsers,
      searchQuery,
      searchUsers,
      getUserById
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};