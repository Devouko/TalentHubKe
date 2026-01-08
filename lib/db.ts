import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export function getDatabase() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

export function getUsers() {
  const db = getDatabase();
  return db.users;
}

export function getGigs() {
  const db = getDatabase();
  return db.gigs;
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