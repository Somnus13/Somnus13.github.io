#!/usr/bin/env python3
"""扫描静态资源，生成 fonts.md / wallpaper.md 以及预览子集。"""

from pathlib import Path
import json

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "assets/fonts"
WALL_DIR = ROOT / "assets/wallpapers"
PREVIEW = "余白回归阅读本质此刻留给自己慢慢一点也很好一页一世界在字里行间暂时停留把时间交还阅读晚安未完待续Aura Reader 0123456789 THE QUIET PAGE"
UNICODES = {ord(ch) for ch in PREVIEW} | set(range(0x20, 0x7F))
WALLPAPER_NAMES = {
    "Aura1.png": "01 余白",
    "Aura2.png": "02 慢读",
    "Aura3.png": "03 书页",
    "Aura4.png": "04 字间",
    "Aura5.png": "05 阅读",
    "Aura6.png": "06 未完",
}


def is_font(path: Path) -> bool:
    if path.name.startswith("."):
        return False
    if ".preview." in path.name:
        return False
    return path.suffix.lower() in {".ttf", ".otf"}


def format_size(n: int) -> str:
    if n < 1024 * 1024:
        return f"{n / 1024:.0f} KB"
    return f"{n / (1024 * 1024):.1f} MB"


def subset_preview(src: Path, dst: Path) -> None:
    font = TTFont(src)
    options = Options()
    options.layout_features = ["*"]
    options.desubroutinize = True
    options.flavor = "woff2"
    sub = Subsetter(options=options)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(dst)
    font.close()


def write_markdown(path: Path, title: str, dest: str, items: list[dict]) -> None:
    lines = [
        f"# {title}",
        "",
        f"> dest: {dest}",
        "",
    ]
    for item in items:
        lines.extend([
            f"- name: {item['name']}",
            f"  file: {item['file']}",
            f"  size: {item['size']}",
            f"  preview: {item['preview']}",
            f"  download: {item['download']}",
            "",
        ])
    path.write_text("\n".join(lines), encoding="utf-8")


def build_fonts() -> list[dict]:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    fonts = []
    for src in sorted(FONT_DIR.iterdir(), key=lambda p: p.name.lower()):
        if not is_font(src):
            continue
        preview = src.with_name(src.stem + ".preview.woff2")
        if not preview.exists() or preview.stat().st_mtime < src.stat().st_mtime:
            try:
                subset_preview(src, preview)
            except Exception as err:
                print(f"preview failed {src.name}: {err}")
                preview = src
        item = {
            "name": src.stem,
            "file": src.name,
            "size": format_size(src.stat().st_size),
            "preview": f"assets/fonts/{preview.name}",
            "download": f"assets/fonts/{src.name}",
        }
        fonts.append(item)
        print(f"{src.name} -> {preview.name}")
    write_markdown(ROOT / "fonts.md", "字体 · 小纸 Pico", "/sdcard/Aura/fonts/", fonts)
    (FONT_DIR / "fonts.json").write_text(
        json.dumps(fonts, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return fonts


def build_wallpapers() -> list[dict]:
    WALL_DIR.mkdir(parents=True, exist_ok=True)
    walls = []
    for src in sorted(WALL_DIR.iterdir(), key=lambda p: p.name.lower()):
        if src.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        rel = f"assets/wallpapers/{src.name}"
        walls.append({
            "name": WALLPAPER_NAMES.get(src.name, src.stem),
            "file": src.name,
            "size": format_size(src.stat().st_size),
            "preview": rel,
            "download": rel,
        })
        print(f"{src.name} -> {rel}")
    write_markdown(ROOT / "wallpaper.md", "壁纸 · 小纸 Pico", "/sdcard/Aura/lock/", walls)
    return walls


def main() -> None:
    fonts = build_fonts()
    walls = build_wallpapers()
    print(f"wrote fonts.md ({len(fonts)}) and wallpaper.md ({len(walls)})")


if __name__ == "__main__":
    main()
