// ----------------------------
// تعريف اللغات (الأقسام لكل لغة)
// ----------------------------
const languages = {
    ar: { sections: { sports: "رياضة", movies: "أفلام", news: "أخبار", kids: "أطفال", countries: "قنوات دولية" }, search_placeholder: "ابحث عن قناة...", download_m3u: "تحميل ملف M3U" },
    en: { sections: { sports: "Sports", movies: "Movies", news: "News", kids: "Kids", countries: "Countries" }, search_placeholder: "Search for a channel...", download_m3u: "Download M3U File" },
    fr: { sections: { sports: "Sports", movies: "Films", news: "Actualités", kids: "Enfants", countries: "Pays" }, search_placeholder: "Rechercher une chaîne...", download_m3u: "Télécharger le fichier M3U" }
};

// ----------------------------
// عناصر الصفحة
// ----------------------------
const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");
const searchInput = document.getElementById("search-input");
const sectionButtons = document.querySelectorAll(".section-btn");
const languageSelect = document.getElementById("language-select");

let currentLanguage = "ar"; // اللغة الافتراضية
let allChannels = { sports: [], movies: [], news: [], kids: [], countries: [] };

// ----------------------------
// تشغيل القناة
// ----------------------------
function playChannel(url) {
    videoPlayer.src = url;
    videoPlayer.play();
}

// ----------------------------
// تحميل القنوات من ملف M3U تلقائياً
// ----------------------------
async function loadChannels() {
    try {
        const response = await fetch("https://iptv-org.github.io/iptv/index.m3u");
        const text = await response.text();
        const lines = text.split("\n");

        let channelName = "";
        let section = "sports"; // القسم الافتراضي

        lines.forEach(line => {
            if (line.startsWith("#EXTINF")) {
                channelName = line.split(",")[1];
                // هنا يمكن إضافة منطق ذكي لتحديد القسم من اسم القناة
                if (channelName.toLowerCase().includes("sport")) section = "sports";
                else if (channelName.toLowerCase().includes("movie") || channelName.toLowerCase().includes("cinema")) section = "movies";
                else if (channelName.toLowerCase().includes("news")) section = "news";
                else if (channelName.toLowerCase().includes("cartoon") || channelName.toLowerCase().includes("kids")) section = "kids";
                else section = "countries";
            }

            if (line.startsWith("http")) {
                allChannels[section].push({
                    name: channelName,
                    url: line,
                    description: {
                        ar: channelName, // لاحقًا يمكن تعديل أسماء القنوات بالعربية والفرنسية
                        en: channelName,
                        fr: channelName
                    }
                });
            }
        });

        displayChannels("sports"); // عرض القسم الأول افتراضي
    } catch (err) {
        console.error("خطأ في تحميل القنوات:", err);
    }
}

// ----------------------------
// عرض القنوات حسب القسم واللغة
// ----------------------------
function displayChannels(section) {
    channelList.innerHTML = "";
    allChannels[section].forEach(ch => {
        const li = document.createElement("li");
        li.textContent = ch.description[currentLanguage] || ch.name;
        li.onclick = () => playChannel(ch.url);
        channelList.appendChild(li);
    });

    // تفعيل الزر النشط
    sectionButtons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.section-btn[data-section="${section}"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

// ----------------------------
// البحث عن القنوات
// ----------------------------
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = [];
    Object.keys(allChannels).forEach(section => {
        allChannels[section].forEach(ch => {
            if (ch.description[currentLanguage].toLowerCase().includes(query)) {
                filtered.push(ch);
            }
        });
    });
    channelList.innerHTML = "";
    filtered.forEach(ch => {
        const li = document.createElement("li");
        li.textContent = ch.description[currentLanguage];
        li.onclick = () => playChannel(ch.url);
        channelList.appendChild(li);
    });
});

// ----------------------------
// تغيير اللغة
// ----------------------------
function updateLanguage(lang) {
    currentLanguage = lang;

    // تحديث أزرار الأقسام
    sectionButtons.forEach(btn => {
        const sec = btn.dataset.section;
        btn.textContent = languages[lang].sections[sec];
    });

    // إعادة عرض القسم النشط
    const activeBtn = document.querySelector(".section-btn.active") || sectionButtons[0];
    displayChannels(activeBtn.dataset.section);

    // تحديث البحث placeholder
    searchInput.placeholder = languages[lang].search_placeholder;

    // تحديث رابط تحميل M3U
    const downloadLink = document.querySelector("#download-m3u a");
    if (downloadLink) downloadLink.textContent = languages[lang].download_m3u;
}

// ----------------------------
// تغيير قسم عند الضغط على الأزرار
// ----------------------------
sectionButtons.forEach(btn => {
    btn.addEventListener("click", () => displayChannels(btn.dataset.section));
});

// ----------------------------
// Dark Mode
// ----------------------------
const darkModeBtn = document.getElementById("dark-mode-toggle");
if (darkModeBtn) {
    darkModeBtn.onclick = () => document.body.classList.toggle("dark-mode");
}

// ----------------------------
// اختيار اللغة
// ----------------------------
if (languageSelect) {
    languageSelect.addEventListener("change", () => updateLanguage(languageSelect.value));
}

// ----------------------------
// تحميل القنوات عند فتح الموقع
// ----------------------------
loadChannels();
