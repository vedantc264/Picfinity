import mysql from 'mysql2/promise';

const passwords = ['', 'root', '1234', '123456', '12345678', 'password', 'admin', 'mysql', 'root123', 'toor'];

async function testPasswords() {
  for (const pwd of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: pwd
      });
      console.log(`SUCCESS: MySQL root password is "${pwd}"`);
      await conn.end();
      return pwd;
    } catch (e) {
      // ignore and continue
    }
  }
  console.log('FAILED: None of the common default passwords matched.');
  return null;
}

testPasswords();
