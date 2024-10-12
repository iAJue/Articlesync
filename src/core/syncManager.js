import adapters from '../adapters/adapters';  // 导入所有适配器

class SyncManager {
  constructor() {
    this.adapters = {};
    this.registerAdapters();
  }

  // 动态注册所有适配器
  registerAdapters() {
    adapters.forEach(adapter => {
      this.registerAdapter(adapter);
    });
  }

  // 注册单个适配器
  registerAdapter(adapter) {
    this.adapters[adapter.name] = adapter;
  }

  // 获取支持的平台列表
  async getSupportedPlatforms() {
    const platforms = [];
    for (const platformName in this.adapters) {
      const adapter = this.adapters[platformName];
      const metaData = await adapter.getMetaData();
      platforms.push({
        value: platformName,  // 平台的标识符
        label: metaData.displayName,  // 平台的名称
        icon: metaData.icon  // 平台的图标
      });
    }
    return platforms;
  }

  // 获取平台元数据
  async getPlatformMeta(platformName) {
    const adapter = this.adapters[platformName];
    if (!adapter) throw new Error(`Adapter for platform ${platformName} not found.`);
    return await adapter.getMetaData();
  }

  // 同步文章
  async syncPost(platformName, post) {
    const adapter = this.adapters[platformName];
    if (!adapter) throw new Error(`Adapter for platform ${platformName} not found.`);
    return await adapter.addPost(post);
  }

  // 编辑文章
  async editPost(platformName, post_id, post) {
    const adapter = this.adapters[platformName];
    if (!adapter) throw new Error(`Adapter for platform ${platformName} not found.`);
    return await adapter.editPost(post_id, post);
  }
}

export default new SyncManager();