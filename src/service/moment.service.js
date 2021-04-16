const connection = require('../app/database')

const fragment = `
  SELECT 
    m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name) USER
  FROM moment m
  LEFT JOIN USER u ON m.user_id = u.id
`

class MomentService {
  async create(userId, content) {
    const sql = `INSERT INTO moment (content, user_id) VALUES (?, ?)`
    const result = await connection.execute(sql,[content, userId])
    return result
  }

  async getMomentById(momentId) {
    const sql = `${fragment}
                  WHERE m.id = ?;`
    const [result] = await connection.execute(sql,[momentId])
    return result[0]
  }

  async getMomentList(offset, size) {
    const sql = `
                SELECT 
                  m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
                  JSON_OBJECT('id', u.id, 'name', u.name) USER,
                  (SELECT COUNT(*) FROM COMMENT c WHERE c.moment_id = m.id) commentCount
                FROM moment m
                LEFT JOIN USER u ON m.user_id = u.id
                LIMIT 0, 10;
                `
    const [result] = await connection.execute(sql, [offset, size])
    return result
  }

  async update(content, momentId) {
    const sql = `UPDATE moment SET content = ? WHERE id = ?`
    const [result] = await connection.execute(sql, [content, momentId])
    return result
  }

  async remove(momentId) {
    const sql = `DELETE FROM moment WHERE id = ?`
    const [result] = await connection.execute(sql, [momentId])
    return result
  }

  async hasLabel(momentId, labelId) {
    const sql = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`
    const [result] = await connection.execute(sql, [momentId, labelId])
    return result[0] ? true : false
  }

  async addLabel(momentId, labelId) {
    const sql = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?)`
    const [result] = await connection.execute(sql, [momentId, labelId])
    return result
  }
}

module.exports = new MomentService()