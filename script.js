// عناصر الصفحة
const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");
const searchInput = document.getElementById("search-input");
const sectionButtons = document.querySelectorAll(".section-btn");
const darkModeBtn = document.getElementById("dark-mode-toggle");

let allChannels = [];
let currentSection = "all";

// =============================
// اللغات
// =============================
const languages = {

ar: {
sections: {
all: "كل القنوات",
sports: "رياضة",
movies: "أفلام",
news: "أخبار",
kids: "أطفال",
countries: "قنوات دولية"
},
search: "ابحث عن قناة",
download: "تحميل ملف M3U"
},

en: {
sections: {
all: "All Channels",
sports: "Sports",
movies: "Movies",
news: "News",
kids: "Kids",
countries: "Countries"
},
search: "Search channel",
download: "Download M3U"
},

fr: {
sections: {
all: "Toutes les chaînes",
sports: "Sports",
movies: "Films",
news: "Actualités",
kids: "Enfants",
countries: "Pays"
},
search: "Rechercher une chaîne",
download: "Télécharger M3U"
}

};

// =============================
// تشغيل القناة
// =============================
function playChannel(url) {

videoPlayer.src = url;
videoPlayer.play();

}

// =============================
// تحميل القنوات من ملف JSON
// =============================
async function loadChannels() {

const response = await fetch("channels/channels.json");

allChannels = await response.json();

displayChannels(currentSection);

}

// =============================
// عرض القنوات
// =============================
function displayChannels(section) {

channelList.innerHTML = "";

let list = allChannels;

if(section !== "all"){

list = allChannels.filter(ch => ch.category === section);

}

list.forEach(ch => {

const li = document.createElement("li");

li.textContent = ch.name;

li.onclick = () => playChannel(ch.url);

channelList.appendChild(li);

});

}

// =============================
// تغيير القسم
// =============================
sectionButtons.forEach(btn => {

btn.onclick = () => {

currentSection = btn.dataset.section;

displayChannels(currentSection);

};

});

// =============================
// البحث
// =============================
searchInput.addEventListener("input", () => {

const query = searchInput.value.toLowerCase();

const filtered = allChannels.filter(ch =>
ch.name.toLowerCase().includes(query)
);

channelList.innerHTML = "";

filtered.forEach(ch => {

const li = document.createElement("li");

li.textContent = ch.name;

li.onclick = () => playChannel(ch.url);

channelList.appendChild(li);

});

});

// =============================
// تغيير اللغة
// =============================
function setLanguage(lang) {

const data = languages[lang];

if(!data) return;

searchInput.placeholder = data.search;

document.querySelectorAll(".section-btn").forEach(btn => {

const sec = btn.dataset.section;

if(data.sections[sec]){

btn.textContent = data.sections[sec];

}

});

}

// =============================
// Dark Mode
// =============================
if(darkModeBtn){

darkModeBtn.onclick = () => {

document.body.classList.toggle("dark-mode");

};

}

// =============================
// تشغيل الموقع
// =============================
loadChannels();
