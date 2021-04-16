const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const { APP_HOST, APP_PORT } = require('../app/config')
const { AVATAR_PATH } = require('../constants/file-path')

class FileController {
  async saveAvatarInfo(ctx,next) {
    const { mimetype, filename, size } = ctx.req.file
    const { id } = ctx.user

    const result = await fileService.createAvatar(filename, mimetype, size, id)

    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await userService.updateAvatarUrlById(id, avatarUrl)

    ctx.body = `上传头像成功~`
  }

  async savePictureInfo(ctx,next) {
    const files = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query

    for (let file of files) {
      const { mimetype, filename, size } = file
      await fileService.createFile(filename, mimetype, size, id, momentId)
    }
    ctx.body = `动态配图上传完成`
  }
}

module.exports = new FileController()