const Router = require('koa-router')

const commentRouter = new Router({prefix:'/comment'})

const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, reply, update, remove, list } = require('../controller/comment.controller.js')

commentRouter.post('/', verifyAuth, create)
commentRouter.post('/:commentId/reply', verifyAuth, reply)
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)
// 获取评论列表
commentRouter.get('/', list)

module.exports = commentRouter