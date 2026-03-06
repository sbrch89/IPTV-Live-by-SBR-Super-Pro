// ----------------------------
// عناصر الصفحة
// ----------------------------
const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");
const searchInput = document.getElementById("search-input");
const sectionButtons = document.querySelectorAll(".section-btn");
const languageSelect = document.getElementById("language-select");

let allChannels = {}; // يحتوي على الأقسام
let currentLanguage = "ar";

// ----------------------------
// تشغيل القناة
// ----------------------------
function playChannel(url) {
    videoPlayer.src = url;
    videoPlayer.play();
}

// ----------------------------
// تحميل القنوات من iptv-org وتصنيفها
// ----------------------------
async function loadChannelsFromIPTV() {
    try {
        const response = await fetch("https://iptv-org.github.io/iptv/index.m3u");
        const text = await response.text();
        const lines = text.split("\n");

        allChannels = {
            sports: [],
            movies: [],
            news: [],
            kids: [],
            countries: []
        };

        let channelName = "";

        lines.forEach(line => {
            if (line.startsWith("#EXTINF")) {
                channelName = line.split(",")[1] || "Unknown";
            }
            if (line.startsWith("http")) {
                const lowerName = channelName.toLowerCase();
                let section = "countries"; // افتراضي

                if (lowerName.includes("sport") || lowerName.includes("beIN") || lowerName.includes("espn")) section = "sports";
                else if (lowerName.includes("movie") || lowerName.includes("hbo") || lowerName.includes("cinema") || lowerName.includes("cinemax")) section = "movies";
                else if (lowerName.includes("news") || lowerName.includes("cnn") || lowerName.includes("bbc")) section = "news";
                else if (lowerName.includes("cartoon") || lowerName.includes("disney") || lowerName.includes("nick")) section = "kids";

                allChannels[section].push({
                    name: channelName,
                    url: line,
                    description: {
                        ar: channelName,
                        en: channelName,
                        fr: channelName
                    }
                });
            }
        });

        displayChannels("sports"); // القسم الافتراضي عند التحميل

        // البحث
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            const filtered = [];
            Object.keys(allChannels).forEach(sec => {
                allChannels[sec].forEach(ch => {
                    if (ch.name.toLowerCase().includes(query)) filtered.push(ch);
                });
            });
            displayFilteredChannels(filtered);
        });

        // أزرار الأقسام
        sectionButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                sectionButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                displayChannels(btn.dataset.section);
            });
        });

    } catch (err) {
        console.error("Error loading IPTV channels:", err);
    }
}

// ----------------------------
// عرض القنوات حسب القسم
// ----------------------------
function displayChannels(section) {
    const list = allChannels[section] || [];
    displayFilteredChannels(list);
}

// ----------------------------
// عرض قائمة القنوات
// ----------------------------
function displayFilteredChannels(list) {
    channelList.innerHTML = "";
    list.forEach(ch => {
        const li = document.createElement("li");
        li.textContent = ch.description[currentLanguage] || ch.name;
        li.onclick = () => playChannel(ch.url);
        channelList.appendChild(li);
    });
}

// ----------------------------
// تغيير اللغة
// ----------------------------
languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value;
    const activeSectionBtn = document.querySelector(".section-btn.active") || sectionButtons[0];
    displayChannels(activeSectionBtn.dataset.section);
});

// ----------------------------
// Dark Mode
// ----------------------------
const darkModeBtn = document.getElementById("dark-mode-toggle");
if (darkModeBtn) {
    darkModeBtn.onclick = () => document.body.classList.toggle("dark-mode");
}

// ----------------------------
// بدء التحميل عند فتح الموقع
// ----------------------------
loadChannelsFromIPTV();
