// Simple in-memory user store
export const userStore = new Map();

export function addUser(email: string, userData: any) {
  userStore.set(email, userData);
}

export function getUser(email: string) {
  return userStore.get(email);
}

export function userExists(email: string) {
  return userStore.has(email);
}