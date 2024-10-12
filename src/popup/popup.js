import adapters from '../adapters/adapters';  // 导入适配器

document.addEventListener('DOMContentLoaded', function () {
  loadAccounts();  // 加载所有账号信息
  loadSyncStatus();  // 加载同步状态
});

// Tab 切换逻辑
document.getElementById('status-tab').addEventListener('click', function () {
  switchTab('status');
});
document.getElementById('account-tab').addEventListener('click', function () {
  switchTab('account');
});
document.getElementById('about-tab').addEventListener('click', function () {
  switchTab('about');
});

function switchTab(tab) {
  // 移除所有 active 类
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

  // 隐藏所有内容
  document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));

  // 显示当前内容
  document.getElementById(`${tab}-tab`).classList.add('active');
  document.getElementById(`${tab}-content`).classList.remove('hidden');
}

// 加载同步状态并显示在状态区域
function loadSyncStatus() {
  chrome.storage.local.get(['syncStatus'], (result) => {
    const statusContainer = document.getElementById('task-status');
    statusContainer.innerHTML = '';  // 清空之前的状态

    const syncStatus = result.syncStatus || [];

    if (syncStatus.length > 0) {
      syncStatus.forEach((task) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskName = document.createElement('span');
        taskName.classList.add('task-name');
        taskName.textContent = task.platform;

        const taskStatus = document.createElement('span');
        taskStatus.classList.add('task-status');
        taskStatus.textContent = task.status === 'success' ? '成功' : '失败';
        taskStatus.classList.add(task.status);  // 添加 success 或 failed 类

        taskItem.appendChild(taskName);
        taskItem.appendChild(taskStatus);

        statusContainer.appendChild(taskItem);
      });
    } else {
      statusContainer.innerHTML = '<p>没有可用的同步状态</p>';
    }
  });
}

async function loadAccounts() {
  const accountList = document.getElementById('account-list');
  accountList.innerHTML = '';  // 清空

  for (const adapter of adapters) {
    try {
      const accountData = await adapter.getMetaData();  // 调用每个适配器的 getMetaData 方法
      const accountItem = document.createElement('div');
      accountItem.classList.add('task-item');

      const platformIcon = document.createElement('img');
      platformIcon.src = accountData.icon;
      platformIcon.alt = accountData.displayName;
      platformIcon.style.width = '24px';

      const accountName = document.createElement('span');
      accountName.textContent = accountData.title;

      accountItem.appendChild(platformIcon);
      accountItem.appendChild(accountName);
      accountList.appendChild(accountItem);
    } catch (error) {
      console.error(`加载 ${adapter.name} 账号信息失败：`, error);
    }
  }
}

document.getElementById('group-btn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://jq.qq.com/?_wv=1027&k=5cvR0GN' });
})
document.getElementById('feedback-btn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com/iAJue/Articlesync/issues' });
})
document.getElementById('help-btn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com/iAJue/Articlesync/' });
})