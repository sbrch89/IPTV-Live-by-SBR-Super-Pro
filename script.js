const m3uUrl = "playlist/iptv.m3u"; // ملف M3U

fetch(m3uUrl)
.then(res => res.text())
.then(data => {
    let lines = data.split("\n");
    let channels = [];
    for(let i=0;i<lines.length;i++){
        if(lines[i].startsWith("#EXTINF")){
            let name = lines[i].split(",")[1];
            let url = lines[i+1];
            channels.push({name, url});
        }
    }
    showChannels(channels);
});

function showChannels(channels){
    let container = document.getElementById("channels");
    channels.forEach(ch => {
        let div = document.createElement("div");
        div.className = "channel";
        div.innerText = ch.name;
        div.onclick = () => play(ch.url);
        container.appendChild(div);
    });
}

function play(url){
    let video = document.getElementById("player");
    if(Hls.isSupported()){
        let hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    } else {
        video.src = url;
    }
}
