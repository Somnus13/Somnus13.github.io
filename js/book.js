const CHAPTER_MAX = 2048;
const TITLE_BYTES = 120;
const PROBE = 1024;
const HEADING_WORDS = "章节卷回集部篇";
const CN_NUM = "零〇一二三四五六七八九十百千万两";

function utf8One(bytes, i) {
  const lead = bytes[i];
  if (lead < 0x80) return { cp: lead, n: 1, ok: true };
  const need = lead >= 0xc2 && lead <= 0xdf ? 2
    : lead >= 0xe0 && lead <= 0xef ? 3
      : lead >= 0xf0 && lead <= 0xf4 ? 4 : 0;
  if (!need || i + need > bytes.length) return { cp: 0xfffd, n: 1, ok: false, need };
  let cp = lead & (0x7f >> need);
  for (let j = 1; j < need; j += 1) {
    if ((bytes[i + j] & 0xc0) !== 0x80) return { cp: 0xfffd, n: 1, ok: false };
    cp = (cp << 6) | (bytes[i + j] & 63);
  }
  const overlong = (need === 2 && cp < 0x80) || (need === 3 && cp < 0x800) || (need === 4 && cp < 0x10000);
  if (overlong || (cp >= 0xd800 && cp <= 0xdfff) || cp > 0x10ffff) {
    return { cp: 0xfffd, n: 1, ok: false };
  }
  return { cp, n: need, ok: true };
}

function detectTxt(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return { encoding: "utf-8", bom: 3, label: "UTF-8（BOM）" };
  }
  for (let i = 0; i < Math.min(bytes.length, PROBE);) {
    const { n, ok, need } = utf8One(bytes, i);
    if (!ok && bytes[i] >= 0x80) {
      if (need && need > bytes.length - i) break;
      return { encoding: "gbk", bom: 0, label: "GBK" };
    }
    i += n;
  }
  return { encoding: "utf-8", bom: 0, label: "UTF-8" };
}

function decodeText(bytes, encoding, bom) {
  const body = bytes.slice(bom);
  try {
    return new TextDecoder(encoding, { fatal: false }).decode(body);
  } catch {
    return new TextDecoder("utf-8", { fatal: false }).decode(body);
  }
}

function isHeading(line) {
  let s = line.replace(/^[\t ]+/, "");
  if (/^chapter[\t ]+\d/i.test(s)) return true;
  if (!s.startsWith("第")) return false;
  s = s.slice(1);
  let number = false;
  let used = 3;
  for (const ch of s) {
    if (used > 33) break;
    if (HEADING_WORDS.includes(ch)) return number || ch === "章";
    if ((ch >= "0" && ch <= "9") || CN_NUM.includes(ch)) number = true;
    used += ch.length <= 1 ? 1 : 3;
  }
  return false;
}

function scanTxtChapters(text) {
  const chapters = [];
  let offset = 0;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.length > TITLE_BYTES ? raw.slice(0, TITLE_BYTES) : raw;
    if (chapters.length < CHAPTER_MAX && isHeading(line)) {
      chapters.push({ title: line.trim(), offset });
    }
    offset += raw.length + 1;
  }
  if (!chapters.length) chapters.push({ title: "正文", offset: 0 });
  return chapters;
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function xmlLocal(name) {
  return name.replace(/^.*:/, "").toLowerCase();
}

function resolvePath(base, href) {
  const clean = href.split("#")[0];
  if (!clean) return "";
  if (/^[a-z]+:/i.test(clean)) return clean;
  const root = base.includes("/") ? base.slice(0, base.lastIndexOf("/") + 1) : "";
  const parts = `${root}${clean}`.split("/");
  const out = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}

async function parseEpub(file) {
  if (!window.JSZip) throw new Error("JSZip 未加载");
  const zip = await window.JSZip.loadAsync(file);
  const container = await zip.file("META-INF/container.xml")?.async("string");
  if (!container) throw new Error("缺少 META-INF/container.xml");
  const rootfile = [...container.matchAll(/<rootfile\b[^>]*>/gi)]
    .map((m) => attr(m[0], "full-path"))
    .find(Boolean);
  if (!rootfile) throw new Error("container.xml 没有 rootfile");
  const opf = await zip.file(rootfile)?.async("string");
  if (!opf) throw new Error(`找不到 OPF：${rootfile}`);

  const title = (opf.match(/<dc:title[^>]*>([^<]+)/i) || [])[1] || file.name;
  const creator = (opf.match(/<dc:creator[^>]*>([^<]+)/i) || [])[1] || "未知作者";
  const language = (opf.match(/<dc:language[^>]*>([^<]+)/i) || [])[1] || "";
  const legacyCover = (opf.match(/<meta[^>]*name=["']cover["'][^>]*content=["']([^"']+)/i) || [])[1] || "";

  const items = new Map();
  for (const match of opf.matchAll(/<item\b[^>]*>/gi)) {
    const tag = match[0];
    const id = attr(tag, "id");
    const href = attr(tag, "href");
    const media = attr(tag, "media-type");
    const properties = attr(tag, "properties");
    if (!id || !href) continue;
    const path = resolvePath(rootfile, href);
    const image = media === "image/jpeg" || media === "image/png";
    items.set(id, {
      id,
      href,
      path,
      media,
      html: media === "application/xhtml+xml" || media === "text/html",
      image,
      cover: image && (/\bcover-image\b/.test(properties) || id === legacyCover),
    });
  }

  const spine = [...opf.matchAll(/<itemref\b[^>]*>/gi)]
    .map((m) => items.get(attr(m[0], "idref")))
    .filter((item) => item && item.html);

  let coverUrl = "";
  const cover = [...items.values()].find((item) => item.cover);
  if (cover && zip.file(cover.path)) {
    const blob = await zip.file(cover.path).async("blob");
    coverUrl = URL.createObjectURL(blob);
  }

  return {
    title: title.trim(),
    creator: creator.trim(),
    language,
    items: items.size,
    chapters: spine.map((item, index) => ({
      title: item.href.split("/").pop() || `章节 ${index + 1}`,
      href: item.path,
    })),
    coverUrl,
    warnings: [
      spine.length ? "" : "OPF spine 没有 HTML 章节",
      cover ? "" : "没有识别到 EPUB 2/3 封面",
      items.size > 32768 ? "资源项超过设备上限 32768" : "",
    ].filter(Boolean),
  };
}

function formatSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function renderReport(target, report) {
  target.innerHTML = "";
  const facts = document.createElement("div");
  facts.className = "stack";
  report.facts.forEach(([k, v]) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<strong>${k}</strong><span>${v}</span>`;
    facts.append(row);
  });
  target.append(facts);

  if (report.coverUrl) {
    const img = document.createElement("img");
    img.src = report.coverUrl;
    img.alt = "封面";
    img.style.maxWidth = "160px";
    img.style.marginTop = "16px";
    img.style.border = "1px solid var(--ink)";
    target.append(img);
  }

  if (report.warnings.length) {
    const note = document.createElement("p");
    note.className = "status";
    note.textContent = report.warnings.join("；");
    target.append(note);
  }

  const list = document.createElement("ol");
  list.className = "toc";
  report.chapters.slice(0, 80).forEach((chapter) => {
    const item = document.createElement("li");
    item.textContent = chapter.title;
    list.append(item);
  });
  if (report.chapters.length > 80) {
    const more = document.createElement("li");
    more.textContent = `其余 ${report.chapters.length - 80} 章已识别，未全部展开。`;
    list.append(more);
  }
  target.append(list);
}

async function inspectFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt")) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const detected = detectTxt(bytes);
    const text = decodeText(bytes, detected.encoding, detected.bom);
    const chapters = scanTxtChapters(text);
    return {
      facts: [
        ["文件", file.name],
        ["大小", formatSize(file.size)],
        ["编码", detected.label],
        ["章节", `${chapters.length} / ${CHAPTER_MAX}`],
        ["设备路径", "/sdcard/Aura/books/"],
      ],
      chapters,
      warnings: [
        file.size > 32 * 1024 * 1024 ? "文件较大，设备上会分块扫描，打开不会整本载入。" : "",
        chapters.length >= CHAPTER_MAX ? "已达 2048 章上限，后续标题会被丢弃。" : "",
      ].filter(Boolean),
      coverUrl: "",
    };
  }
  if (name.endsWith(".epub")) {
    const epub = await parseEpub(file);
    return {
      facts: [
        ["文件", file.name],
        ["大小", formatSize(file.size)],
        ["书名", epub.title],
        ["作者", epub.creator],
        ["语言", epub.language || "未声明"],
        ["资源项", String(epub.items)],
        ["Spine 章节", String(epub.chapters.length)],
        ["设备路径", "/sdcard/Aura/books/"],
      ],
      chapters: epub.chapters,
      warnings: epub.warnings,
      coverUrl: epub.coverUrl,
    };
  }
  throw new Error("只接受 TXT 或 EPUB");
}

function bindBookTool() {
  const drop = document.getElementById("drop");
  const input = document.getElementById("bookFile");
  const report = document.getElementById("bookReport");
  const status = document.getElementById("bookStatus");
  if (!drop || !input || !report) return;

  const run = async (file) => {
    status.textContent = `正在解析 ${file.name}…`;
    report.innerHTML = "";
    try {
      const result = await inspectFile(file);
      renderReport(report, result);
      status.textContent = "解析完成。把原文件拷到 TF 卡 /sdcard/Aura/books/ 即可，不必改编码。";
    } catch (err) {
      status.textContent = err.message || String(err);
    }
  };

  drop.addEventListener("click", () => input.click());
  drop.addEventListener("dragover", (event) => {
    event.preventDefault();
    drop.classList.add("is-over");
  });
  drop.addEventListener("dragleave", () => drop.classList.remove("is-over"));
  drop.addEventListener("drop", (event) => {
    event.preventDefault();
    drop.classList.remove("is-over");
    const file = event.dataTransfer.files[0];
    if (file) run(file);
  });
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) run(file);
  });

  const sample = document.getElementById("parseSample");
  if (sample) {
    sample.addEventListener("click", async () => {
      const res = await fetch("assets/sample.txt");
      const blob = await res.blob();
      run(new File([blob], "sample.txt", { type: "text/plain" }));
    });
  }
}

document.addEventListener("DOMContentLoaded", bindBookTool);
