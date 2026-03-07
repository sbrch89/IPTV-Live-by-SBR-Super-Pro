const video = document.getElementById('video');
const searchInput = document.getElementById('search-input');
const channelsContainer = document.getElementById('channels');

let allChannels = []; // لتخزين جميع القنوات

// تشغيل القناة
function play(url){
  if(Hls.isSupported() && url.endsWith(".m3u8")){
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
  video.play();
}

// تحميل القنوات من أي ملف M3U
async function loadChannelsFromM3U(url){
  try{
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split("\n");
    for(let i=0;i<lines.length;i++){
      if(lines[i].startsWith("#EXTINF")){
        const name = lines[i].split(",")[1];
        const stream = lines[i+1];
        allChannels.push({name, url: stream});
      }
    }
    displayChannels(allChannels);
  } catch(e){
    console.log("تعذر تحميل القنوات من:", url);
  }
}

// عرض القنوات
function displayChannels(list){
  channelsContainer.innerHTML = "";
  list.forEach(ch=>{
    const div = document.createElement("div");
    div.className = "channel";
    div.innerText = ch.name;
    div.onclick = ()=>play(ch.url);
    channelsContainer.appendChild(div);
  });
}

// البحث في القنوات
searchInput.addEventListener("input", e=>{
  const query = e.target.value.toLowerCase();
  const filtered = allChannels.filter(ch=> ch.name.toLowerCase().includes(query));
  displayChannels(filtered);
});

// المصادر الرئيسية
const sources = [
  "https://iptv-org.github.io/iptv/index.m3u",
  "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8",
  "https://raw.githubusercontent.com/iptv-restream/iptv-channels/master/channels.m3u"
];
const sources = [

"https://iptv-org.github.io/iptv/index.m3u",

"https://iptv-org.github.io/iptv/languages/ara.m3u",

"https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8",

"https://raw.githubusercontent.com/iptv-restream/iptv-channels/master/channels.m3u"

];
// تحميل جميع المصادر تلقائيًا
sources.forEach(src=>loadChannelsFromM3U(src));



