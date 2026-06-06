/* ============================================
   MoodSync — JSON File-Based Data Store
   ============================================ */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${collection}:`, err.message);
    return [];
  }
}

function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err.message);
    return false;
  }
}

// ---- CRUD Operations ----

function findAll(collection) {
  return readCollection(collection);
}

function findById(collection, id) {
  const items = readCollection(collection);
  return items.find(item => item.id === id) || null;
}

function findOne(collection, predicate) {
  const items = readCollection(collection);
  return items.find(predicate) || null;
}

function findMany(collection, predicate) {
  const items = readCollection(collection);
  return items.filter(predicate);
}

function create(collection, item) {
  const items = readCollection(collection);
  items.push(item);
  writeCollection(collection, items);
  return item;
}

function update(collection, id, updates) {
  const items = readCollection(collection);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates, id }; // preserve id
  writeCollection(collection, items);
  return items[index];
}

function remove(collection, id) {
  const items = readCollection(collection);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  writeCollection(collection, filtered);
  return true;
}

module.exports = {
  findAll,
  findById,
  findOne,
  findMany,
  create,
  update,
  remove
};
