const momentService = require('../service/moment.service')



class MomentController {
  async create(ctx, next) {
    
    // 获取数据（用户，内容，标题，图片等）
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    // 数据插入到数据库
    const result = await momentService.create(userId, content)
    ctx.body = result
  }

  async detail(ctx, next) {
    // 获取数据
    const momentId = ctx.params.momentId

    // 根据id查询数据
    const result = await momentService.getMomentById(momentId)
    
    ctx.body = result
  }

  async list(ctx, next) {
    // 获取数据(offset,size)
    const { offset, size } = ctx.query

    // 根据id查询数据
    const result = await momentService.getMomentList(offset, size)
    
    ctx.body = result
  }

  async update(ctx, next) {
    // 获取数据()
    const { momentId } = ctx.params
    const { content } = ctx.request.body
    // 根据id修改数据
    const result = await momentService.update(content, momentId)
    ctx.body = result
  }

  async remove(ctx, next) {
    // 获取数据()
    const { momentId } = ctx.params
    
    // 根据id删除数据
    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  async addLabels(ctx, next) {
    // 获取数据()
    const { labels } = ctx
    const { momentId } = ctx.params
    // console.log(labels);
    for (let label of labels) {
      const isExists = await momentService.hasLabel(momentId, label.id)
      if (!isExists) {
        await momentService.addLabel(momentId, label.id)
      }
    }
    ctx.body = `给动态添加标签成功`
  }
}

module.exports = new MomentController()