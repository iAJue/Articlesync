export default class BaseAdapter {
    constructor() {
      if (new.target === BaseAdapter) {
        throw new Error("Cannot instantiate BaseAdapter directly.");
      }
    }
  
    // 获取平台元数据的方法
    async getMetaData() {
      throw new Error("getMetaData() must be implemented.");
    }
  
    // 发布文章的方法
    async addPost(post) {
      throw new Error("addPost() must be implemented.");
    }
  
    // 编辑文章的方法
    async editPost(post_id, post) {
      throw new Error("editPost() must be implemented.");
    }
  
    // 上传文件的方法
    async uploadFile(file) {
      throw new Error("uploadFile() must be implemented.");
    }
  }