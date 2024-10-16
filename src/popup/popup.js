import adapters from '../adapters/adapters'; 

document.addEventListener('DOMContentLoaded', function () {
    loadAccounts(); 
    loadSyncStatus(); 
});

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
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.getElementById(`${tab}-content`).classList.remove('hidden');
}

// 加载同步状态并显示在状态区域
function loadSyncStatus() {
    chrome.storage.local.get(['syncStatus'], (result) => {
        const statusContainer = document.getElementById('task-status');
        statusContainer.innerHTML = '';

        const syncStatus = result.syncStatus || [];

        if (syncStatus.length > 0) {
            syncStatus.forEach((task) => {
                console.log(task)
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-items');
                const taskTitle = document.createElement('span');
                taskTitle.classList.add('task-title');
                if(task.status === 'success'){
                    taskTitle.textContent = `${task.platform}: ${task.title}`;
                }else{
                    taskTitle.textContent = `${task.platform}: ${task.title} - ${task.message}`;
                }
                const taskStatus = document.createElement('span');
                taskStatus.classList.add('task-status');
                taskStatus.textContent = task.status === 'success' ? '成功' : '失败';
                taskStatus.classList.add(task.status);
                taskItem.appendChild(taskTitle);
                taskItem.appendChild(taskStatus);
                statusContainer.appendChild(taskItem);
            });
        } else {
            statusContainer.innerHTML = '<p>暂无同步任务!</p>';
        }
    });
}

// 加载账号信息
async function loadAccounts() {
    const accountList = document.getElementById('account-list');
    accountList.innerHTML = '';

    for (const adapter of adapters) {
        try {
            const accountData = await adapter.getMetaData(); 
            const accountDataArray = Array.isArray(accountData) ? accountData : [accountData];
            for (const account of accountDataArray) {
                const accountItem = document.createElement('div');
                accountItem.classList.add('task-item');
                const platformIcon = document.createElement('img');
                platformIcon.src = account.icon;
                platformIcon.alt = account.displayName;
                platformIcon.style.width = '24px';
                const avatarIcon = document.createElement('img');
                avatarIcon.src = account.avatar;
                avatarIcon.style.width = '24px';
                avatarIcon.style.borderRadius = '50%'; 
                const accountName = document.createElement('span');
                accountName.textContent = account.title;
                const accountDisplayName = document.createElement('span');
                accountDisplayName.textContent = account.displayName; 
    
                accountItem.appendChild(platformIcon);
                accountItem.appendChild(accountDisplayName);
                accountItem.appendChild(avatarIcon); 
                accountItem.appendChild(accountName);
                accountList.appendChild(accountItem);
            }
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
document.getElementById('clear-btn').addEventListener('click', () => {
    chrome.storage.local.clear();
    document.getElementById('task-status').innerHTML = '<p>暂无同步任务!</p>';
})

document.getElementById('add-account-btn').addEventListener('click', () => {
    document.querySelector('.nav-tabs').classList.add('hidden'); 
    document.querySelector('.content').classList.add('hidden'); 
    document.querySelector('.bottom-buttons').classList.add('hidden'); 
    document.getElementById('add-account-section').classList.remove('hidden'); 
    loadSavedAccounts();
});
document.getElementById('back-to-tabs-btn').addEventListener('click', () => {
    document.querySelector('.nav-tabs').classList.remove('hidden'); 
    document.querySelector('.content').classList.remove('hidden'); 
    document.querySelector('.bottom-buttons').classList.remove('hidden'); 
    document.getElementById('add-account-section').classList.add('hidden'); 
});

document.querySelectorAll('.account-option').forEach(option => {
    option.addEventListener('click', (event) => {
        document.querySelectorAll('.account-option').forEach(item => {
            item.classList.remove('selected');
        });
        const selectedOption = event.currentTarget;
        selectedOption.classList.add('selected');
        const platform = selectedOption.getAttribute('data-platform');
        document.getElementById('account-url-input').classList.remove('hidden');
        document.getElementById('save-account-btn').setAttribute('data-platform', platform);
    });
});

document.getElementById('save-account-btn').addEventListener('click', () => {
    const url = document.getElementById('account-url').value;
    const platformName = document.getElementById('account-name').value; 
    const platform = document.getElementById('save-account-btn').getAttribute('data-platform');

    if(platform == 'Typecho'){
        alert('暂不支持Typecho平台');
        return;
    }

    if (url && platformName) {
        chrome.storage.local.get(['accounts'], (result) => {
            const accounts = result.accounts || [];
            const existingAccount = accounts.find(account => account.url === url);
            if (existingAccount) {
                alert('此网址已经存在，无法重复添加。');
            } else {
                accounts.push({ platform, platformName, url });
                chrome.storage.local.set({ accounts }, () => {
                    console.log('账号已保存:', platform, platformName, url);
                    document.getElementById('account-url-input').classList.add('hidden');
                    document.getElementById('account-url').value = '';
                    document.getElementById('account-name').value = '';
                    document.getElementById('add-account-list').classList.remove('hidden');

                    loadSavedAccounts();
                });
            }   
        });
    } else {
        alert('请输入有效的网址和平台名称。');
    }
});



function deleteAccount(index) {
    chrome.storage.local.get(['accounts'], (result) => {
        const accounts = result.accounts || [];
        accounts.splice(index, 1); 
        chrome.storage.local.set({ accounts }, () => {
            loadSavedAccounts(); 
        });
    });
}

function loadSavedAccounts() {
    chrome.storage.local.get(['accounts'], (result) => {
        const accountList = document.getElementById('other-account-list');
        accountList.innerHTML = '';

        const accounts = result.accounts || [];

        if (accounts.length > 0) {
            accounts.forEach((account, index) => {
                const accountItem = document.createElement('div');
                accountItem.classList.add('task-items');
                const platformName = document.createElement('span');
                platformName.textContent = `${account.platform}: ${account.platformName} - ${account.url}`;
                accountItem.appendChild(platformName);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => {
                    deleteAccount(index);
                });
                
                accountItem.appendChild(deleteButton);
                accountList.appendChild(accountItem);
            });
        } 
    });
}