// ----------------------------
// تغيير اللغة للأقسام والقنوات
// ----------------------------
function updateLanguage(lang) {
    currentLanguage = lang; // تحديث اللغة الحالية

    // تحديث أزرار الأقسام
    document.querySelectorAll(".section-btn").forEach(btn => {
        const sec = btn.dataset.section;
        // نفترض أن لديك كائن languages مثل:
        // languages = { ar: { sections: { sports: "رياضة", movies: "أفلام", ... } }, ... }
        btn.textContent = languages[lang].sections[sec];
    });

    // إعادة عرض القنوات للقسم النشط
    const activeBtn = document.querySelector(".section-btn.active") || sectionButtons[0];
    displayChannels(activeBtn.dataset.section);
}

// ----------------------------
// تعديل displayChannels لعرض أسماء القنوات حسب اللغة
// ----------------------------
function displayChannels(section) {
    const list = allChannels[section] || [];
    channelList.innerHTML = "";

    list.forEach(ch => {
        const li = document.createElement("li");
        li.textContent = ch.description[currentLanguage] || ch.name; // يستخدم اللغة الحالية
        li.onclick = () => playChannel(ch.url);
        channelList.appendChild(li);
    });
}

// ----------------------------
// مثال على اختيار اللغة
// ----------------------------
const languageSelect = document.getElementById("language-select");
languageSelect.addEventListener("change", () => {
    updateLanguage(languageSelect.value);
});
