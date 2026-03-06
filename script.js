// عناصر الصفحة
const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");
const searchInput = document.getElementById("search-input");
const sectionButtons = document.querySelectorAll(".section-btn");
const darkModeBtn = document.getElementById("dark-mode-toggle");

// جميع القنوات (ستُملأ من JSON)
let allChannels = [];
let currentLanguage = "ar"; // اللغة الافتراضية

// إعداد اللغات
const languages = {
  ar: { sections: { sports: "رياضة", movies: "أفلام", news: "أخبار", kids: "أطفال", countries: "قنوات دولية" }, search_placeholder: "ابحث عن قناة...", download_m3u: "تحميل ملف M3U" },
  en: { sections: { sports: "Sports", movies: "Movies", news: "News", kids: "Kids", countries: "Countries" }, search_placeholder: "Search channel...", download_m3u: "Download M3U" },
  fr: { sections: { sports: "Sports", movies: "Films", news: "Actualités", kids: "Enfants", countries: "Pays" }, search_placeholder: "Rechercher une chaîne...", download_m3u: "Télécharger M3U" }
};

// ----------------------------
// تشغيل القناة
// ----------------------------
function playChannel(url) {
    videoPlayer.src = url;
    videoPlayer.play();
}

// ----------------------------
// عرض القنوات حسب القسم
// ----------------------------
function displayChannels(sectionOrList) {
    channelList.innerHTML = "";

    let channelsToShow = [];
    if (Array.isArray(sectionOrList)) {
        channelsToShow = sectionOrList; // قائمة جاهزة
    } else {
        channelsToShow = allChannels[sectionOrList] || [];
    }

    channelsToShow.forEach(ch => {
        const li = document.createElement("li");
        li.textContent = ch.description?.[currentLanguage] || ch.name;
        li.onclick = () => playChannel(ch.url);
        channelList.appendChild(li);
    });
}

// ----------------------------
// تحميل القنوات من ملف JSON
// ----------------------------
async function loadChannelsFromJSON() {
    try {
        const response = await fetch("channels/channels.json");
        allChannels = await response.json();
        displayChannels("sports"); // عرض القسم الأول افتراضيًا
    } catch (err) {
        console.error("Failed to load channels.json:", err);
    }
}
loadChannelsFromJSON();

// ----------------------------
// البحث عن القنوات
// ----------------------------
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = [];

    Object.keys(allChannels).forEach(section => {
        allChannels[section].forEach(ch => {
            const name = ch.description?.[currentLanguage] || ch.name;
            if (name.toLowerCase().includes(query)) {
                filtered.push(ch);
            }
        });
    });

    displayChannels(filtered);
});

// ----------------------------
// تغيير الأقسام عند الضغط على الزر
// ----------------------------
sectionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        displayChannels(section);
    });
});

// ----------------------------
// Dark Mode
// ----------------------------
if (darkModeBtn) {
    darkModeBtn.onclick = () => {
        document.body.classList.toggle("dark-mode");
    };
}

// ----------------------------
// تغيير اللغة
// ----------------------------
function setLanguage(lang) {
    if (!languages[lang]) return;
    currentLanguage = lang;

    // تحديث placeholder البحث
    searchInput.placeholder = languages[lang].search_placeholder;

    // تحديث أسماء الأقسام
    sectionButtons.forEach(btn => {
        const sec = btn.dataset.section;
        btn.textContent = languages[lang].sections[sec] || sec;
    });

    // إعادة عرض القسم الحالي أو القسم الأول
    displayChannels("sports");
}
