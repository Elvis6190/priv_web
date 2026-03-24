// 1. Translation Map
const i18n = {
    tc: {
        nav_home: "首頁", nav_menu: "菜單/價目", nav_news: "最新消息", nav_contact: "聯絡我們",
        hero_title: "健康 · 慈悲 · 美味", hero_sub: "位於尖沙咀核心地帶的傳統素食風味",
        table_time: "時間", table_mon_thu: "周一至周四", table_fri_sun: "周五至周日/公眾假期",
        time_lunch: "11:30 - 15:00 (自助午餐)", time_tea: "15:00 - 17:00 (定食下午茶)", time_dinner: "17:30 - 21:00 (自助晚餐)",
        note_1: "* 自助餐用餐時間90分鐘", note_2: "* 出示學生證減 $10 | 出示菩提學會會員證減 $20",
        address: "尖沙咀金巴利道53至59號地下及一樓", gallery_title: "餐廳環境", buffet_title: "自助餐收費"
    },
    sc: {
        nav_home: "首页", nav_menu: "菜单/价目", nav_news: "最新消息", nav_contact: "联络我们",
        hero_title: "健康 · 慈悲 · 美味", hero_sub: "位于尖沙咀核心地带的传统素食风味",
        table_time: "时间", table_mon_thu: "周一至周四", table_fri_sun: "周五至周日/公众假期",
        time_lunch: "11:30 - 15:00 (自助午餐)", time_tea: "15:00 - 17:00 (定食下午茶)", time_dinner: "17:30 - 21:00 (自助晚餐)",
        note_1: "* 自助餐用餐时间90分钟", note_2: "* 出示学生证减 $10 | 出示菩提学会会员证减 $20",
        address: "尖沙咀金巴利道53至59号地下及一楼", gallery_title: "餐厅环境", buffet_title: "自助餐收费"
    },
    en: {
        nav_home: "Home", nav_menu: "Menu", nav_news: "News", nav_contact: "Contact",
        hero_title: "Healthy. Compassionate. Delicious.", hero_sub: "Traditional vegetarian flavors in Tsim Sha Tsui.",
        table_time: "Time", table_mon_thu: "Mon-Thu", table_fri_sun: "Fri-Sun/PH",
        time_lunch: "11:30 - 15:00 (Lunch Buffet)", time_tea: "15:00 - 17:00 (Tea Set)", time_dinner: "17:30 - 21:00 (Dinner Buffet)",
        note_1: "* Buffet time limit 90 mins", note_2: "* Student -$10 | Member -$20",
        address: "G/F & 1/F, 53-59 Kimberley Rd, TST", gallery_title: "Gallery", buffet_title: "Buffet Pricing"
    }
};

// 2. Configuration (Replace with your Google Web App URL)
const APPS_SCRIPT_URL = "YOUR_DEPLOYED_URL_HERE";

// 3. Language Logic
function setLanguage(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        el.innerText = i18n[lang][key];
    });
    localStorage.setItem('preferredLang', lang);
}

// Initial Load
window.onload = () => {
    const savedLang = localStorage.getItem('preferredLang') || 'tc';
    setLanguage(savedLang);
    loadData();
};

// 4. Hidden Admin Logic
window.addEventListener('hashchange', () => {
    if(window.location.hash === "#/login") {
        document.getElementById('login-overlay').style.display = 'flex';
    }
});

function doLogin() {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;
    if(u === "Admin" && p === "Admin") {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-overlay').style.display = 'flex';
    } else {
        alert("錯誤的帳號或密碼");
    }
}

// 5. Data Handling (Fetching from Sheets)
async function loadData() {
    // Fetch News & Gallery from Sheets
    try {
        const res = await fetch(APPS_SCRIPT_URL);
        const data = await res.json();
        renderNews(data.news);
        renderGallery(data.gallery);
    } catch (e) { console.log("Connect to Google Sheets to load live data."); }

    // Hardcoded 4 Set Menus
    const sets = [
        {name: "精選套餐 A", price: "$88", detail: "招牌羅漢齋"},
        {name: "精選套餐 B", price: "$92", detail: "菠蘿咕嚕肉"},
        {name: "精選套餐 C", price: "$85", detail: "松露野菌片"},
        {name: "精選套餐 D", price: "$98", detail: "廚師推介豆腐"}
    ];
    const container = document.getElementById('set-menu-container');
    sets.forEach(s => {
        container.innerHTML += `<div class="set-card"><h4>${s.name}</h4><p>${s.detail}</p><b>${s.price}</b></div>`;
    });
}

async function submitToSheet() {
    const payload = {
        type: document.getElementById('post-type').value,
        title: document.getElementById('post-title').value,
        img: document.getElementById('post-img').value,
        body: document.getElementById('post-body').value
    };

    await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    alert("成功發布！");
    location.reload();
}
