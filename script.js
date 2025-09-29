// ======= script.js (Versi Lengkap Offline) =======

// Path ke JSON lokal
const LOCAL_JSON_PATH = "assets/data/chapterDatabase.json";

// Load JSON lokal
async function loadLocalJSON(path) {
    try {
        const response = await fetch(path);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Gagal load JSON lokal:", err);
        return null;
    }
}

// Populate dropdown chapter
function populateChapterSelect(chapters) {
    const select = document.getElementById("chapterSelect");
    select.innerHTML = "";
    chapters.forEach((ch, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = ch.title;
        select.appendChild(option);
    });
}

// Tampilkan konten dan asset
function displayContent(chapters, index) {
    const contentDiv = document.getElementById("content");
    const img = document.getElementById("chapterImage");
    const audio = document.getElementById("chapterAudio");

    if (!chapters[index]) {
        contentDiv.textContent = "Chapter tidak ditemukan.";
        img.src = "";
        audio.src = "";
        return;
    }

    const chapter = chapters[index];
    contentDiv.textContent = chapter.content;

    // Image
    img.src = chapter.image || "";
    img.style.display = chapter.image ? "block" : "none";

    // Audio
    audio.src = chapter.audio || "";
    audio.style.display = chapter.audio ? "block" : "none";
}

// Translate online
async function translateText(text, targetLang = "id") {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
        );
        const result = await response.json();
        return result[0].map(item => item[0]).join("");
    } catch (err) {
        console.error("Translate error:", err);
        return text;
    }
}

// ====== Program Utama ======
async function main() {
    const data = await loadLocalJSON(LOCAL_JSON_PATH);
    if (!data || !data.chapters) {
        console.error("Data chapter tidak ditemukan atau format JSON salah.");
        return;
    }
    const chapters = data.chapters;

    populateChapterSelect(chapters);
    displayContent(chapters, 0);

    // Event dropdown
    const select = document.getElementById("chapterSelect");
    select.addEventListener("change", () => displayContent(chapters, select.value));

    // Event translate
    const btn = document.getElementById("translateBtn");
    btn.addEventListener("click", async () => {
        const idx = select.value;
        const originalText = chapters[idx].content;
        const translated = await translateText(originalText, "id");
        document.getElementById("content").textContent = translated;
    });
}

// Jalankan
main();
