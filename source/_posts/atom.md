---
title: Atom使用心得以及插件推荐
date: 2017-05-15 21:45:42
tags:
    - tools
---
## 前言
>公司移动化办公的原因，导致我不得不抛弃台式转战笔记本。而租来的笔记本4G的内存导致我在编辑器上的选择有些捉襟见肘。

家中台式编辑器一般都是使用 **webstorm**，精神洁癖的我每天就是自定义，修修改改。鉴于公司的笔记本，**IDE** 我觉得还是算了吧，一个 **python** 服务和一个 **IDE**，再加上一向吃内存就和喝水一样的谷歌浏览器，我已然已经预见了后果，唯有长按关机键才能拯救我。
所以：
1. 抛弃 **IDE**，不是因为功能不够强大，只是过于庞大
2. 抛弃 **sublime text**，原因也有几点
    * **package control** 简直捉鸡，每次重装 **貌似** 都要重新安装一遍插件
    * 某些插件有些捉鸡，例如常用插件 **emmet** 的 **pyv8 error**
    * 不能自动识别当前编辑项目类型。我就编辑 **Python** 项目里的一个 **js** 文件，那些 **angular**、**react** 之类的插件你可以安分点嘛
    * 此外 **sublime text3** 的函数定位功能简直良心，虽然这会增加内存消耗
3. 然后刨到了 **Atom**，**github** 出品想来应该不差

<!--more-->

## 体验
正常流程的下载安装，略微有些不爽就是没让我选择安装选项，直接塞到了 **C** 盘。

**settings** 设置编码格式，字体字号，行高，**softtab**，快捷键之类，然后就是 **package** 的安装了。
因为是 **windows** 平台，再加上个人有点懒，就直接 **GUI** 页面搜索安装了，如果你倾向于命令行模式，各个插件的说明里面都有注明。

注：插件的安装有时需要翻墙，最好还是挂起 **vpn** 然后一通 **install**。
## 插件推荐
背景：**windows7**+**Python**+前端 仅此相关插件
### 工具相关
* [**File Icons**](https://atom.io/packages/file-icons) / **File Icons**

    增加图标支持，虽然我不认为没有图标会影响开发体验，但是赏心悦目总不是坏事  

    ![file icon](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/fileicon.png)

* [**git-plus**](https://atom.io/packages/git-plus) / **git-plus**

    提供编辑器内 **git** 支持，需要配置 **git.exe** 路径

    ![git-plus](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/git-setting.png)

    使用方法：**ctrl+shift+p** 输入 **git** 命令

    ![git-plus](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/git.png)

* [**minimap**](https://atom.io/packages/minimap) / **minimap**

    **sublime text** 编辑器默认带的功能，快速定位代码？可能是的

    ![minimap](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/minimap.png)

* [**platformio-ide-terminal**](https://atom.io/packages/platformio-ide-terminal) / **platformio-ide-terminal**

    编辑器中集成命令行（ **windows** 平台），**linux** 平台用着不习惯，搜索 **terminal** 就能收到

    ![terminal](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/terminal.png)

    效果如图，可以自定义 **Auto Run Command**。**service.bat** 是自己写的启动 **Python** 项目的命令。

* [**vim-mode-plus**](https://atom.io/packages/vim-mode-plus) / **vim-mode-plus**

    **vim** 爱好者的福音，编辑器内支持 **vim mode**。  
    此外 **chrome** 插件里面也有一款类似的插件 **Vimium**，命令示意如下

    ![vim](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/Vimium.png)

* [**sync-settings**](https://atom.io/packages/sync-settings) / **sync-settings**

    重头戏，**sublime** 的我不知道如何做好配置等的备份，**atom** 的这个插件简直爽到不行不行的，备份同步一气呵成。
    唯一需要注意的就是要做好 **gistId** 和 **personalAccessToken** 的配置。如果配置需要困难，移步[here]()。

    ![sync-settings](http://oh1bdpr59.bkt.clouddn.com/2017-5-8%20/sync.png)

### 前端相关
* [**emmet**](https://atom.io/packages/emmet) / **emmet**

    一款非常强大的代码提示插件，一个 **tab** 教你做人。至于 **emmet** 的相关命令，有一张[查询表](http://om8da4hip.bkt.clouddn.com/sublime%20emmet%20%E9%80%9F%E6%9F%A5%E8%A1%A8/CheatSheet.jpg)，适用大部分规则。
* [**autoprefixer**](https://atom.io/packages/autoprefixer) / **autoprefixer**

    自动添加兼容前缀插件，无需赘述。
* [**js-hyperclick**](https://atom.io/packages/js-hyperclick) / **js-hyperclick**

    js声明跳转插件，据说要和[hyperclick](https://atom.io/packages/hyperclick)搭配使用。
* [**jshint**](https://atom.io/packages/jshint) / **jshint**

    **js** 语法和风格的检查插件，帮助你规范编程习惯

### Python相关
不在赘述，单纯为了项目语言添加插件支持，名称显而易见。
* [**autocomplete-python**](https://atom.io/packages/autocomplete-python) / **autocomplete-python**
* [**python-indent**](https://atom.io/packages/python-indent) / **python-indent**
* [**python-tools**](https://atom.io/packages/python-tools) / **python-tools**
