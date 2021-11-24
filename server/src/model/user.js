import { join, resolve as __dirname } from 'path';
// eslint-disable-next-line import/no-unresolved
import { Low, JSONFile } from 'lowdb';

const file = join(__dirname(), 'db', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function init() {
  await db.read();

  if (db.data == null || db.data.users == null) {
    db.data = { users: [] };
    db.write();
  }
}

init();

export function findUser(email) {
  return db.data.users.find((x) => x.email === email);
}

export function addUser(email, password, name) {
  db.data.users.push({ email, password, name });
  db.write();
}

export function removeUser(email) {
  const index = db.data.users.findIndex((x) => x.email === email);
  if (index > -1) {
    db.data.users.splice(index, 1);
    db.write();
  }
}

export default {
  findUser,
  addUser,
  removeUser,
};
