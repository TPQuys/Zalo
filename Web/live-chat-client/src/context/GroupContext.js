import React, { createContext, useState } from 'react';

export const GroupContext = createContext();
export const GroupProvider = ({ children }) => {
    const [group, setGroup] = useState(null);
  
    const updateGroup = (groupData) => {
      setGroup(groupData);
    };
  
    return (
      <GroupContext.Provider value={{ group, updateGroup }}>
        {children}
      </GroupContext.Provider>
    );
  };