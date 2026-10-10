const SAMPLE = "余白 · 回归阅读本质  此刻，留给自己。";
const SIZES = [28, 36, 48];

function familyName(file) {
  return "AuraFont-" + String(file || "font").replace(/[^A-Za-z0-9]+/g, "-");
}

function addFace(font) {
  const face = new FontFace(
    familyName(font.file),
    `url("${encodeURI(font.preview || font.download)}")`,
    { display: "swap" }
  );
  document.fonts.add(face);
  return face.load().catch(() => face);
}

function renderCard(font, sample) {
  const family = familyName(font.file);
  const card = document.createElement("article");
  card.className = "panel font-card";
  card.innerHTML = `
    <h2>${font.name}</h2>
    <div class="font-meta"><span>${font.size || ""}</span><span>TTF</span><span>/sdcard/Aura/fonts/</span></div>
    <div class="preview-stack"></div>
    <div class="actions">
      <a class="dark" href="${encodeURI(font.download)}" download="${font.file || ""}">下载</a>
    </div>
  `;
  const stack = card.querySelector(".preview-stack");
  SIZES.forEach((px) => {
    const line = document.createElement("p");
    line.className = "preview-line";
    line.style.fontFamily = `"${family}", "Songti SC", serif`;
    line.style.fontSize = px + "px";
    line.textContent = sample;
    stack.append(line);
  });
  return card;
}

function bindFonts() {
  const list = document.getElementById("fontList");
  const input = document.getElementById("previewText");
  const status = document.getElementById("fontStatus");
  if (!list) return;

  loadCatalog("fonts.md")
    .then(async (catalog) => {
      const fonts = catalog.items;
      if (!fonts.length) {
        status.textContent = "fonts.md 里还没有字体。";
        return;
      }
      status.textContent = `已托管 ${fonts.length} 款字体。目录见 fonts.md，预览用子集，下载是完整 TTF。`;
      fonts.forEach((font) => list.append(renderCard(font, input?.value || SAMPLE)));
      await Promise.all(fonts.map(addFace));
      const update = () => {
        const text = (input?.value || SAMPLE).trim() || SAMPLE;
        list.querySelectorAll(".preview-line").forEach((line) => {
          line.textContent = text;
        });
      };
      input?.addEventListener("input", update);
    })
    .catch((err) => {
      status.textContent = err.message || String(err);
    });
}

document.addEventListener("DOMContentLoaded", bindFonts);
