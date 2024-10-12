import adapters from '../adapters/adapters'; 

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
        this.adapters[adapter.type] = adapter;
    }

    // 获取支持的平台列表
    async getSupportedPlatforms() {
        const platforms = [];
        for (const platformName in this.adapters) {
            const adapter = this.adapters[platformName];
            platforms.push({
                value: adapter.type,
                label: adapter.name,
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