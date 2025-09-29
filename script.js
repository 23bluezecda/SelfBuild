// ======= script.js (Revisi Offline) =======

// Path ke file JSON lokal
const LOCAL_JSON_PATH = "chapterDatabase.json";

// Fungsi load JSON lokal
async function loadLocalJSON(path) {
    try {
        const response = await fetch(path); // fetch lokal
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Gagal load JSON lokal:", err);
        return null;
    }
}

// Fungsi populate dropdown chapter
function populateChapterSelect(chapters) {
    const select = document.getElementById("chapterSelect");
    select.innerHTML = ""; // Kosongkan dulu
    chapters.forEach((ch, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = ch.title;
        select.appendChild(option);
    });
}

// Tampilkan konten chapter
function displayContent(chapters, index) {
    const contentDiv = document.getElementById("content");
    if (!chapters[index]) {
        contentDiv.textContent = "Chapter tidak ditemukan.";
        return;
    }
    contentDiv.textContent = chapters[index].content;
}

// Fungsi translate (online Google Translate)
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
    // 1. Load JSON lokal
    const data = await loadLocalJSON(LOCAL_JSON_PATH);
    if (!data || !data.chapters) {
        console.error("Data chapter tidak ditemukan atau format JSON salah.");
        return;
    }
    const chapters = data.chapters;

    // 2. Populate dropdown dan tampilkan chapter pertama
    populateChapterSelect(chapters);
    displayContent(chapters, 0);

    // 3. Event dropdown change
    const select = document.getElementById("chapterSelect");
    select.addEventListener("change", () => {
        displayContent(chapters, select.value);
    });

    // 4. Event translate button
    const btn = document.getElementById("translateBtn");
    btn.addEventListener("click", async () => {
        const idx = select.value;
        const originalText = chapters[idx].content;
        const translated = await translateText(originalText, "id");
        document.getElementById("content").textContent = translated;
    });
}

// Jalankan program
main();
