// Global user store
declare global {
  var userStore: Map<string, any> | undefined;
}

export const users = globalThis.userStore ?? new Map();

if (process.env.NODE_ENV !== 'production') {
  globalThis.userStore = users;
}

export default users;