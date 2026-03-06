const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");
const searchInput = document.getElementById("search-input");
const darkModeBtn = document.getElementById("dark-mode-toggle");

let allChannels = [];

function playChannel(ch) {
    videoPlayer.src = ch.url;
    videoPlayer.play();
    document.getElementById("channel-description").textContent = ch.description || "";
}

// Load channels from M3U source
async function loadChannels() {
    const response = await fetch("https://iptv-org.github.io/iptv/index.m3u");
    const text = await response.text();
    const lines = text.split("\n");
    let name = "";
    allChannels = [];

    lines.forEach(line => {
        if (line.startsWith("#EXTINF")) {
            name = line.split(",")[1] || "";
        }
        if (line.startsWith("http")) {
            allChannels.push({
                name: name,
                url: line,
                description: `${name} is a live TV channel. Watch free online.`
            });
        }
    });

    displayChannels(allChannels);
}

function displayChannels(list) {
    channelList.innerHTML = "";
    list.forEach(ch => {
        const li = document.createElement("li");
        li.textContent = ch.name;
        li.onclick = () => playChannel(ch);
        channelList.appendChild(li);
    });
}

searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    const filtered = allChannels.filter(c => c.name.toLowerCase().includes(q));
    displayChannels(filtered);
});

darkModeBtn.onclick = () => document.body.classList.toggle("dark-mode");

loadChannels();