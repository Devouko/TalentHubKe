import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

/**
 * Reads and parses the database file
 * @returns {Object} Parsed database object
 */
export function getDatabase() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

/**
 * Writes data to the database file
 * @param {Object} data - Data to write to database
 */
function saveDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

/**
 * Gets all users from database
 * @returns {Array} Array of user objects
 */
export function getUsers() {
  const db = getDatabase();
  return db.users || [];
}

/**
 * Gets a user by ID
 * @param {string} id - User ID
 * @returns {Object|null} User object or null if not found
 */
export function getUserById(id) {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
}

/**
 * Creates a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user object
 */
export function createUser(userData) {
  const db = getDatabase();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (!db.users) db.users = [];
  db.users.push(newUser);
  saveDatabase(db);
  return newUser;
}

/**
 * Updates an existing user
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Object|null} Updated user object or null if not found
 */
export function updateUser(id, userData) {
  const db = getDatabase();
  const userIndex = db.users?.findIndex(user => user.id === id);
  
  if (userIndex === -1 || userIndex === undefined) return null;
  
  db.users[userIndex] = {
    ...db.users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  saveDatabase(db);
  return db.users[userIndex];
}

/**
 * Deletes a user
 * @param {string} id - User ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteUser(id) {
  const db = getDatabase();
  const userIndex = db.users?.findIndex(user => user.id === id);
  
  if (userIndex === -1 || userIndex === undefined) return false;
  
  db.users.splice(userIndex, 1);
  saveDatabase(db);
  return true;
}

/**
 * Gets all gigs from database
 * @returns {Array} Array of gig objects
 */
export function getGigs() {
  const db = getDatabase();
  return db.gigs || [];
}

/**
 * Gets a gig by ID
 * @param {string} id - Gig ID
 * @returns {Object|null} Gig object or null if not found
 */
export function getGigById(id) {
  const gigs = getGigs();
  return gigs.find(gig => gig.id === id) || null;
}

/**
 * Creates a new gig
 * @param {Object} gigData - Gig data
 * @returns {Object} Created gig object
 */
export function createGig(gigData) {
  const db = getDatabase();
  const users = getUsers();
  const seller = users.find(user => user.id === gigData.sellerId);
  
  const newGig = {
    id: Date.now().toString(),
    ...gigData,
    currency: 'KES',
    deliveryTime: `${gigData.deliveryTime} days`,
    subcategory: gigData.category,
    sellerName: seller?.name || 'Unknown',
    sellerAvatar: seller?.avatar || '/avatars/default.jpg',
    sellerRating: seller?.rating || 5.0,
    images: [],
    tags: gigData.tags ? gigData.tags.split(',').map(tag => tag.trim()) : [],
    orders: 0,
    featured: false,
    createdAt: new Date().toISOString()
  };
  
  if (!db.gigs) db.gigs = [];
  db.gigs.push(newGig);
  saveDatabase(db);
  return newGig;
}

/**
 * Updates an existing gig
 * @param {string} id - Gig ID
 * @param {Object} gigData - Updated gig data
 * @returns {Object|null} Updated gig object or null if not found
 */
export function updateGig(id, gigData) {
  const db = getDatabase();
  const gigIndex = db.gigs?.findIndex(gig => gig.id === id);
  
  if (gigIndex === -1 || gigIndex === undefined) return null;
  
  db.gigs[gigIndex] = {
    ...db.gigs[gigIndex],
    ...gigData,
    updatedAt: new Date().toISOString()
  };
  
  saveDatabase(db);
  return db.gigs[gigIndex];
}

/**
 * Deletes a gig
 * @param {string} id - Gig ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteGig(id) {
  const db = getDatabase();
  const gigIndex = db.gigs?.findIndex(gig => gig.id === id);
  
  if (gigIndex === -1 || gigIndex === undefined) return false;
  
  db.gigs.splice(gigIndex, 1);
  saveDatabase(db);
  return true;
}

export function getProjects() {
  const db = getDatabase();
  return db.projects;
}

export function getCategories() {
  const db = getDatabase();
  return db.categories;
}

export function getOrders() {
  const db = getDatabase();
  return db.orders;
}

export function getReviews() {
  const db = getDatabase();
  return db.reviews;
}

export function getNotifications() {
  const db = getDatabase();
  return db.notifications;
}

export function getTransactions() {
  const db = getDatabase();
  return db.transactions;
}