const connection = require('../app/database')

class FileService {
  async createAvatar(filename, mimetype, size, userId) {
    const sql =  `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?)`
    const [result] = await connection.execute(sql, [filename, mimetype, size, userId])
    return result
  }

  async getAvatarByUserId(userId) {
    const sql = `SELECT * FROM avatar WHERE user_id = ?`
    const [result] = await connection.execute(sql, [userId])
    return result[0]
  }

  async createFile(filename, mimetype, size, userId, momentId) {
    const sql =  `INSERT INTO FILE (filename, mimetype, size, moment_id, user_id) VALUES (?, ?, ?, ?, ?)`
    const [result] = await connection.execute(sql, [filename, mimetype, size, momentId, userId])
    return result
  }
}

module.exports = new FileService()