// عناصر الصفحة
const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");
const searchInput = document.getElementById("search-input");

let allChannels = [];

// تشغيل القناة
function playChannel(url) {
    videoPlayer.src = url;
    videoPlayer.play();
}

// تحميل القنوات من ملف M3U
async function loadChannels() {

    const response = await fetch("https://iptv-org.github.io/iptv/index.m3u");
    const text = await response.text();

    const lines = text.split("\n");

    let name = "";
    let group = "";

    allChannels = [];

    lines.forEach(line => {

        if (line.startsWith("#EXTINF")) {

            const nameMatch = line.split(",");

            name = nameMatch[nameMatch.length - 1];

            const groupMatch = line.match(/group-title="(.*?)"/);

            group = groupMatch ? groupMatch[1] : "other";

        }

        if (line.startsWith("http")) {

            allChannels.push({
                name: name,
                group: group,
                url: line
            });

        }

    });

    displayChannels(allChannels);

}

loadChannels();


// عرض القنوات
function displayChannels(list) {

    channelList.innerHTML = "";

    list.forEach(ch => {

        const li = document.createElement("li");

        li.textContent = ch.name;

        li.onclick = () => playChannel(ch.url);

        channelList.appendChild(li);

    });

}


// البحث
searchInput.addEventListener("input", () => {

    const query = searchInput.value.toLowerCase();

    const filtered = allChannels.filter(ch =>
        ch.name.toLowerCase().includes(query)
    );

    displayChannels(filtered);

});


// Dark Mode
const darkBtn = document.getElementById("dark-mode-toggle");

if (darkBtn) {

    darkBtn.onclick = () => {
        document.body.classList.toggle("dark-mode");
    };

}


// تغيير اللغة
const languages = {

    ar: {
        search: "ابحث عن قناة..."
    },

    en: {
        search: "Search channel..."
    },

    fr: {
        search: "Rechercher une chaîne..."
    }

};

function setLanguage(lang) {

    searchInput.placeholder = languages[lang].search;

}

