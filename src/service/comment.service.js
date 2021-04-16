const connection = require('../app/database')

class CommentService {
  async create(momentId, content, id){
    const sql = `INSERT INTO COMMENT (content, moment_id, user_id) VALUES (?, ?, ?)`
    const [result] = await connection.execute(sql,[content,momentId, id])
    return result
  }

  async reply(momentId, content, commentId, id){
    const sql = `INSERT INTO COMMENT (content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?)`
    const [result] = await connection.execute(sql,[content,momentId, id, commentId])
    return result
  }

  async update(commentId, content){
    const sql = `UPDATE COMMENT SET content = ? WHERE id = ?`
    const [result] = await connection.execute(sql,[content, commentId])
    return result
  }

  async remove(commentId){
    const sql = `DELETE FROM comment WHERE id = ?`
    const [result] = await connection.execute(sql, [commentId])
    return result
  }

  async getCommentsByMomentId(momentId){
    const sql = 
                `
                SELECT 
                  c.id, c.content, c.comment_id commentId, c.createAt createTime,
                  JSON_OBJECT('id', u.id, 'name', u.name) user
                FROM COMMENT c
                left join user u on u.id = c.user_id
                WHERE moment_id = ?
                `
    const [result] = await connection.execute(sql, [momentId])
    return result
  }
}

module.exports = new CommentService()