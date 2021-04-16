const Koa = require('koa')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const fs = require('fs')

const app = new Koa()

const testRouter = new Router()

const PRIVATE_KEY = fs.readFileSync('./keys/private.key')
const PUBLIC_KEY = fs.readFileSync('./keys/public.key')
// const SERECT_KEY = `abccba123`

// 登录接口
testRouter.post('/test',(ctx,next) => {
  const user = {id:110, name:`why`}
  const token = jwt.sign(user, PRIVATE_KEY, {
    expiresIn:30,
    algorithm:`RS256`
  })
  ctx.body = token
})
// 验证接口
testRouter.post('/demo',(ctx,next) => {
  const authorization = ctx.header.authorization
  const token = authorization.replace(`Bearer `,``)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithm:[`RS256`]
    })
    ctx.body = result
  } catch (error) {
    ctx.body = `token无效`
  }
  
})

app.use(testRouter.routes())
app.use(testRouter.allowedMethods)

app.listen(8000, () => {
  console.log(`start`);
})