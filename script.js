// 模擬資料
const mockKeywords = [
    { word: 'SEO 優化策略', volume: '1,200', rank: 3, cat: 'SEO', update: '2026-03-27' },
    { word: 'Taichung BBQ', volume: '8,500', rank: 1, cat: '美食', update: '2026-03-26' }
];

const mockSubmissions = [
    { client: '大奧資訊', keyword: '熱像儀', url: 'https://...', status: 'pending', date: '2026-03-27' }
];

// 初始化圖示
lucide.createIcons();

// 角色權限選單配置
const menuConfig = {
    client: [
        { id: 'keywords', name: '關鍵字列表', icon: 'layout-dashboard' },
        { id: 'submit', name: '填寫需求', icon: 'file-spreadsheet' },
        { id: 'report', name: '報表查看', icon: 'bar-chart-3' }
    ],
    admin: [
        { id: 'keywords', name: '關鍵字列表', icon: 'layout-dashboard' },
        { id: 'admin-tasks', name: '管理審核', icon: 'settings' },
        { id: 'report', name: '報表查看', icon: 'bar-chart-3' }
    ]
};

// 狀態管理
let currentUser = null;

// DOM 元素
const loginPage = document.getElementById('login-page');
const mainSystem = document.getElementById('main-system');
const loginForm = document.getElementById('login-form');
const navLinks = document.getElementById('nav-links');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');

// 登入處理
loginForm.onsubmit = (e) => {
    e.preventDefault();
    const role = document.querySelector('input[name="role"]:checked').value;
    currentUser = { role, name: role === 'admin' ? '管理者 Ken' : '大奧資訊 (客戶)' };
    
    loginPage.classList.add('hidden');
    mainSystem.classList.remove('hidden');
    document.getElementById('user-display').innerText = currentUser.name;
    
    renderSidebar();
    switchPage('keywords');
};

// 登出
document.getElementById('logout-btn').onclick = () => {
    location.reload();
};

// 渲染側邊欄
function renderSidebar() {
    const items = menuConfig[currentUser.role];
    navLinks.innerHTML = items.map(item => `
        <a href="#" onclick="switchPage('${item.id}')" id="nav-${item.id}" class="flex items-center px-6 py-3 transition-colors hover:bg-slate-800 text-gray-400">
            <i data-lucide="${item.icon}" class="mr-3 w-5"></i> ${item.name}
        </a>
    `).join('');
    lucide.createIcons();
}

// 頁面切換邏輯
function switchPage(pageId) {
    document.querySelectorAll('#nav-links a').forEach(el => el.classList.remove('nav-active', 'text-white'));
    document.getElementById(`nav-${pageId}`).classList.add('nav-active', 'text-white');

    if (pageId === 'keywords') renderKeywordsPage();
    if (pageId === 'submit') renderSubmitPage();
    if (pageId === 'report') renderReportPage();
    if (pageId === 'admin-tasks') renderAdminPage();
}

// --- 頁面渲染函數 ---

// 1. 初始化：從瀏覽器緩存讀取資料，如果沒有則用預設值
let keywordData = JSON.parse(localStorage.getItem('seo_keywords')) || [
    { word: '範例關鍵字', difficulty: '中', volume: '1,000' }
];
// 2. 客戶端：渲染關鍵字列表頁
function renderKeywordsPage() {
    pageTitle.innerText = "關鍵字清單";
    const data = JSON.parse(localStorage.getItem('seo_keywords')) || keywordData;
    
    contentArea.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b text-gray-600">
                    <tr>
                        <th class="p-4 font-semibold">關鍵字</th>
                        <th class="p-4 font-semibold text-center">難易度</th>
                        <th class="p-4 font-semibold text-center">搜索量</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${data.map(k => `
                        <tr class="hover:bg-blue-50/50 transition">
                            <td class="p-4 font-medium text-slate-800">${k.word}</td>
                            <td class="p-4 text-center">
                                <span class="px-2 py-1 rounded text-xs ${getDiffClass(k.difficulty)}">
                                    ${k.difficulty}
                                </span>
                            </td>
                            <td class="p-4 text-center text-slate-600 font-mono">${k.volume}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 難易度標籤顏色控制
function getDiffClass(diff) {
    if (diff.includes('高')) return 'bg-red-100 text-red-600';
    if (diff.includes('中')) return 'bg-orange-100 text-orange-600';
    return 'bg-green-100 text-green-600';
}


function renderSubmitPage() {
    pageTitle.innerText = "提交 SEO 需求";
    contentArea.innerHTML = `
        <div class="bg-white p-6 rounded-xl border shadow-sm">
            <p class="mb-4 text-gray-500">請輸入您想操作的關鍵字與目標網址：</p>
            <table class="w-full mb-4" id="submission-table">
                <thead><tr class="text-left text-sm text-gray-400"><th>關鍵字</th><th>目標網址</th><th>備註</th></tr></thead>
                <tbody>
                    <tr>
                        <td class="p-1"><input type="text" class="excel-input w-full p-2 border rounded" placeholder="例如：SEO"></td>
                        <td class="p-1"><input type="text" class="excel-input w-full p-2 border rounded" placeholder="https://..."></td>
                        <td class="p-1"><input type="text" class="excel-input w-full p-2 border rounded"></td>
                    </tr>
                </tbody>
            </table>
            <button onclick="alert('送出成功！')" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">確認送出需求</button>
        </div>
    `;
}

function renderReportPage() {
    pageTitle.innerText = "Looker Studio 報表";
    // 將下方的 https://... 替換為你剛才複製的嵌入網址
    contentArea.innerHTML = `
        <div class="w-full h-[800px] bg-white rounded-xl border overflow-hidden shadow-inner">
            <iframe 
                src="https://lookerstudio.google.com/embed/reporting/e6dc384f-fca1-4836-81e7-412c06112a41/page/4VDGB" 
                class="w-full h-full border-0"
                allowfullscreen>
            </iframe>
        </div>
    `;
}



// 3. 管理者端：渲染匯入頁面
function renderAdminPage() {
    pageTitle.innerText = "管理與匯入中心";
    contentArea.innerHTML = `
        <div class="bg-white p-8 rounded-xl border-2 border-dashed border-blue-200 mb-8 text-center">
            <i data-lucide="file-up" class="mx-auto w-12 h-12 text-blue-400 mb-4"></i>
            <h3 class="text-lg font-bold text-slate-800 mb-2">上傳最新關鍵字報表</h3>
            <p class="text-sm text-slate-500 mb-6">請上傳包含「關鍵字, 難易度, 搜索量」的 CSV 檔案</p>
            
            <input type="file" id="csv-upload" accept=".csv" class="hidden" />
            <button onclick="document.getElementById('csv-upload').click()" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                選擇 CSV 檔案
            </button>
        </div>

        <div id="preview-section" class="hidden bg-white rounded-xl border shadow-sm overflow-hidden">
            <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
                <span class="font-bold">匯入預覽</span>
                <button onclick="saveImportedData()" class="bg-emerald-600 text-white px-4 py-1 rounded text-sm hover:bg-emerald-700">確認並發佈給客戶</button>
            </div>
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-100 text-gray-500">
                    <tr><th class="p-4">關鍵字</th><th class="p-4 text-center">難易度</th><th class="p-4 text-center">搜索量</th></tr>
                </thead>
                <tbody id="import-preview-body" class="divide-y"></tbody>
            </table>
        </div>
    `;
    lucide.createIcons();
    document.getElementById('csv-upload').addEventListener('change', handleCSVUpload);
}

// 4. 解析 CSV
let tempImportData = [];
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').slice(1);
        
        tempImportData = rows.map(row => {
            const cols = row.split(',');
            if (cols.length < 2) return null;
            return {
                word: cols[0]?.trim(),
                difficulty: cols[1]?.trim(),
                volume: cols[2]?.trim() || '0'
            };
        }).filter(item => item !== null && item.word !== "");

        showPreview();
    };
    reader.readAsText(file);
}

function showPreview() {
    const section = document.getElementById('preview-section');
    const tbody = document.getElementById('import-preview-body');
    section.classList.remove('hidden');
    
    tbody.innerHTML = tempImportData.map(k => `
        <tr>
            <td class="p-4 font-medium">${k.word}</td>
            <td class="p-4 text-center">${k.difficulty}</td>
            <td class="p-4 text-center">${k.volume}</td>
        </tr>
    `).join('');
}

// 5. 儲存至瀏覽器緩存 (模擬發佈)
function saveImportedData() {
    if (tempImportData.length === 0) return;
    localStorage.setItem('seo_keywords', JSON.stringify(tempImportData));
    alert('資料已發佈！客戶現在登入後可以看到最新版本。');
    switchPage('keywords');
}