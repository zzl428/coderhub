const errorType = require('../constants/error-types')
const service = require('../service/user.service')
const passwordHandle = require('../utils/passwordHandle')


const verifyUser = async (ctx,next) => {
  // 获取用户名和密码
  const {name, pwd} = ctx.request.body

  // 判断用户名或密码是否为空
  if(!name || !pwd) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }

  // 判断用户名不重复
  const result = await service.getUserByName(name)
  if(result.length) {
    const err = new Error(errorType.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', err, ctx)
  }
  await next()
}

const handlePassword = async (ctx,next) => {
  const {pwd} = ctx.request.body
  ctx.request.body.pwd = passwordHandle(pwd)
  await next()
}

module.exports = {
  verifyUser,
  handlePassword
}