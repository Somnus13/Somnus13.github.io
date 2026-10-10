function parseCatalog(text) {
  const items = [];
  let dest = "";
  let current = null;

  const flush = () => {
    if (current && current.name && current.download) items.push(current);
    current = null;
  };

  String(text || "").split(/\r?\n/).forEach((raw) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const destMatch = line.match(/^>\s*dest:\s*(.+)$/i) || line.match(/^dest:\s*(.+)$/i);
    if (destMatch) {
      dest = destMatch[1].trim();
      return;
    }
    const nameMatch = line.match(/^-+\s*name:\s*(.+)$/i);
    if (nameMatch) {
      flush();
      current = { name: nameMatch[1].trim() };
      return;
    }
    const field = line.match(/^(file|size|preview|download):\s*(.+)$/i);
    if (current && field) current[field[1].toLowerCase()] = field[2].trim();
  });
  flush();
  return { dest, items };
}

function loadCatalog(path) {
  return fetch(path).then((res) => {
    if (!res.ok) throw new Error("没有资源目录 " + path);
    return res.text();
  }).then(parseCatalog);
}
