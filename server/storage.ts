import { nanoid } from "nanoid";

interface User {
  id: string;
  username: string;
  password: string;
}

export function createUserStorage() {
  // In-memory storage for development
  const users = new Map<string, User>();
  
  // Add a default user for testing
  const defaultUser: User = {
    id: nanoid(),
    username: "admin",
    password: "password"
  };
  users.set(defaultUser.id, defaultUser);
  users.set(defaultUser.username, defaultUser);

  return {
    async findById(id: string): Promise<User | null> {
      return users.get(id) || null;
    },

    async findByUsername(username: string): Promise<User | null> {
      return users.get(username) || null;
    },

    async create(userData: Omit<User, 'id'>): Promise<User> {
      const user: User = {
        id: nanoid(),
        ...userData
      };
      users.set(user.id, user);
      users.set(user.username, user);
      return user;
    },

    async update(id: string, userData: Partial<User>): Promise<User | null> {
      const existingUser = users.get(id);
      if (!existingUser) {
        return null;
      }
      
      const updatedUser = { ...existingUser, ...userData };
      users.set(id, updatedUser);
      users.set(updatedUser.username, updatedUser);
      return updatedUser;
    },

    async delete(id: string): Promise<boolean> {
      const user = users.get(id);
      if (user) {
        users.delete(id);
        users.delete(user.username);
        return true;
      }
      return false;
    }
  };
}