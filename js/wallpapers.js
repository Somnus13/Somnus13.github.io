function renderWallpaper(item) {
  const a = document.createElement("a");
  a.href = item.download;
  a.download = item.file || "";
  a.innerHTML = `<figure><img src="${item.preview || item.download}" alt="${item.name}"><figcaption>${item.name}</figcaption></figure>`;
  return a;
}

function bindWallpapers() {
  const grid = document.getElementById("wallpaperGrid");
  const status = document.getElementById("wallpaperStatus");
  if (!grid) return;

  loadCatalog("wallpaper.md")
    .then((catalog) => {
      if (!catalog.items.length) {
        if (status) status.textContent = "wallpaper.md 里还没有壁纸。";
        return;
      }
      catalog.items.forEach((item) => grid.append(renderWallpaper(item)));
      if (status) {
        status.textContent = `已托管 ${catalog.items.length} 张壁纸。目录见 wallpaper.md，预览和下载是同一张图。`;
      }
    })
    .catch((err) => {
      if (status) status.textContent = err.message || String(err);
    });
}

document.addEventListener("DOMContentLoaded", bindWallpapers);
