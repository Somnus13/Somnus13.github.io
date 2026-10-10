# 小纸 Pico · 资源站

静态站：浏览器刷固件、下载字体和锁屏壁纸、本地解析 TXT / EPUB。

```
index.html          概览
flash.html          ESP Web Tools 刷写
fonts.html          字体预览与下载
fonts.md            字体目录：名称、预览、下载地址
wallpapers.html     Aura 锁屏图
wallpaper.md        壁纸目录：名称、预览、下载地址
books.html          书籍解析
firmware/           bootloader / 分区表 / 应用 / 内置字体
assets/fonts/       TTF 与预览子集
assets/wallpapers/  六张壁纸
```

资源目录是普通 Markdown，页面和以后的设备都读同一份。字段：`name` / `file` / `size` / `preview` / `download`。地址相对站点根，例如 `assets/fonts/霞鹜文楷.preview.woff2`。

重新生成目录和字体预览子集：

```
python3 tools/build_font_catalog.py
```

本地预览：

```
python3 -m http.server 4173
```

打开 <http://127.0.0.1:4173>。不要直接用文件协议打开，Web Serial 和固件 HEAD 检查会失败。

从 pico-reader 更新固件产物：

```
python3 ../pico-reader/tools/pack_github_pages.py
```

刷写需要 Chrome 或 Edge，USB 连小纸 Pico（VID 303A / PID 1001）。
