import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserSelectorProps {
  onSelectUsers: (selectedUsers: User[]) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ onSelectUsers }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleStartChat = () => {
    if (selectedUsers.length > 0) {
      onSelectUsers(selectedUsers);
    } else {
      alert("Please select at least one user to start a chat.");
    }
  };

  return (
    <div>
      <h2>Select Users to Start a Chat</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedUsers.some((u) => u.id === user.id)}
                onChange={() => toggleUserSelection(user)}
              />
              {user.username} ({user.email})
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleStartChat}>Start Chat</button>
    </div>
  );
};

export default UserSelector;