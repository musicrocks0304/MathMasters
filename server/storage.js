
import { nanoid } from "nanoid";

export function createUserStorage() {
  // In-memory storage for development
  const users = new Map();
  
  // Add a default user for testing
  const defaultUser = {
    id: nanoid(),
    username: "admin",
    password: "password"
  };
  users.set(defaultUser.id, defaultUser);
  users.set(defaultUser.username, defaultUser);

  return {
    async findById(id) {
      return users.get(id) || null;
    },

    async findByUsername(username) {
      return users.get(username) || null;
    },

    async create(userData) {
      const user = {
        id: nanoid(),
        ...userData
      };
      users.set(user.id, user);
      users.set(user.username, user);
      return user;
    },

    async update(id, userData) {
      const existingUser = users.get(id);
      if (!existingUser) {
        return null;
      }
      
      const updatedUser = { ...existingUser, ...userData };
      users.set(id, updatedUser);
      users.set(updatedUser.username, updatedUser);
      return updatedUser;
    },

    async delete(id) {
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
