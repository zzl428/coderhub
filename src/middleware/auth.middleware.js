const jwt = require('jsonwebtoken')

const errorType = require('../constants/error-types')
const service = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/passwordHandle')
const { PUBLIC_KEY } = require('../app/config')


const verifyLogin = async (ctx,next) => {
  // 获取用户名和密码
  const {name, pwd} = ctx.request.body

  // 判断用户名和密码是否为空
  if(!name || !pwd) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }

  // 判断用户是否存在
  const result = await service.getUserByName(name)
  const user = result[0]
  if(!user) {
    const err = new Error(errorType.USER_NOT_EXISTS)
    return ctx.app.emit('error', err, ctx)
  }
  
  // 判断密码是否和数据库中的一致（加密）
  if(md5password(pwd) !== user.pwd) {
    const err = new Error(errorType.PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', err, ctx)
  }
  ctx.user = user
  await next()
}

const verifyAuth = async (ctx,next) => {
  console.log(`验证授权的middleware`);
  // 获取token
  const authorization = ctx.headers.authorization
  if(!authorization) {
    const err = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit(`error`,err, ctx)
  }
  const token = authorization.replace(`Bearer `,``)
  // console.log(token);
  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms:[`RS256`]
    })
    // console.log(`result`,result);
    ctx.user = result
    await next()
  } catch (error) {
    console.log(error);
    const err = new Error(errorType.UNAUTHORIZATION)
    ctx.app.emit(`error`,err, ctx)
  }
}

const verifyPermission = async (ctx,next) => {
  console.log(`验证权限的middleware`);
  // 获取数据
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', "")
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user

  // 查询是否具备权限
  const isPermission = await authService.checkResource(tableName, resourceId, id)
  if(!isPermission) {
    const err = new Error(errorType.UNPERMISSION)
    return ctx.app.emit('error', err, ctx)
  }
  await next()
}

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}

