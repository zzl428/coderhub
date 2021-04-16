const connection = require('../app/database')

class UserService {
  async create(user){
    const {name,pwd} = user
    const sql = `INSERT INTO USER (NAME,pwd) VALUES (?,?)`
    const result = await connection.execute(sql,[name,pwd])
    return result[0]
  }

  async getUserByName(name) {
    const sql = `SELECT * FROM USER WHERE NAME = ?`
    const result = await connection.execute(sql,[name])
    return result[0]
  }

  async updateAvatarUrlById(id, avatarUrl) {
    const sql = `UPDATE USER SET avatar_url = ? WHERE id = ?`
    const result = await connection.execute(sql,[avatarUrl, id])
    return result
  }
}

module.exports = new UserService()