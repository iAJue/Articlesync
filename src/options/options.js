document.addEventListener('DOMContentLoaded', function () {
    getoPtionData();
    loadSettings();

    const saveButton = document.getElementById('save-settings');
    if (saveButton) {
        saveButton.addEventListener('click', saveSettings);
    } else {
        console.error('保存按钮未找到');
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tab) {
                    content.classList.add('active');
                }
            });
        });
    });
});

async function getoPtionData() {
    const platformSelect = document.getElementById('platform-select');
    chrome.storage.local.get(['accounts'], (result) => {
        const accounts = result.accounts || []; 
        if (accounts.length > 0) {
            accounts.forEach(account => {
                if (account.platform === "discuz") {
                    const option = document.createElement('option');
                    option.value = account.url; 
                    option.textContent = `${account.platformName}`; 
                    platformSelect.appendChild(option); 
                }
            });
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "暂无可用平台";
            platformSelect.appendChild(option);
        }
    });
}
let data = {};
function loadSettings() {
    chrome.storage.local.get([
        'selectedPlatform', 
        'syncType', 
        'promoteToggle',
        'data'
    ], function (result) {
        data = result;
        const platformSelect = document.getElementById('platform-select');
        const selectedPlatform = result.selectedPlatform || ''; 
        platformSelect.value = selectedPlatform;
        document.getElementById('forum-id').value = result.data[selectedPlatform].discuzForumId || '';
        document.getElementById('category-id').value = result.data[selectedPlatform].discuzCategoryId || '';
        document.getElementById('sync-type').value = result.syncType || '1';
        document.getElementById('promote-toggle').checked = result.promoteToggle;
    });
}


function saveSettings() {
    const selectedPlatform = document.getElementById('platform-select').value;
    const forumId = document.getElementById('forum-id').value;
    const categoryId = document.getElementById('category-id').value;
    const syncType = document.getElementById('sync-type').value;
    const promoteToggle = document.getElementById('promote-toggle').checked;
    const dataToSave = {
        syncType,
        promoteToggle,
        selectedPlatform,
        data: data.data || {}
    };
    dataToSave.data[selectedPlatform] = {
        discuzForumId: forumId,
        discuzCategoryId: categoryId
    }
    chrome.storage.local.set(dataToSave, function () {
        document.getElementById('save-settings').innerText = '成功保存';
        setTimeout(() => {
            document.getElementById('save-settings').innerText = '保存设置';
        }, 2000);
    });
}

document.getElementById('platform-select').addEventListener('change', function () {
    document.getElementById('forum-id').value = data.data[this.value] && data.data[this.value].discuzForumId || '';
    document.getElementById('category-id').value = data.data[this.value] && data.data[this.value].discuzCategoryId || ''
});