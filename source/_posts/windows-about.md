---
title: windows 下面那些让人抓狂的东西
date: 2017-10-08 22:24:29
categories:
    - OS
tags:
    - windows
---

> 作为一个混迹windows的程序员，没事重装一下电脑简直和吃饭一样简单，但是每次装完都会被有些东东恶心到。。

## 系统重装
### 开机的无效索引
装完系统，如果是u盘安装之类的话，大都会多出一个无效索引，也就是旧系统的索引，不能忍！
1. **Win + R** 键入 **msconfig**，打开系统配置
2. 点击 “**引导**” 菜单进行管理，删除无效项即可

### window.old文件夹删除
“Windows.old” 文件夹包含升级win10前系统的 “Windows”、“Program Files”、“Users”这三个目录中的文件，将之前的系统文件和安装的程序文件都做了备份。这是微软出于人性化的考虑，让没有来得及备份重要文件的用户可以再次选择备份。  
对不起，我不打算考虑！  
1. 系统盘右键 - 属性 - 磁盘清理
2. 扫描完成 - 清理系统文件 列表中勾选"以前的Windows安装"，确定，待完成退出
<!-- more -->

### dll库error
MSVCR10.dll曾经困扰我多次的东东，每次都要百度一下，捉急！
安装对应版本的VC库 vcredist_x64.exe 和vcredist_x86.exe
下载地址：[vcredist.exe](http://www.microsoft.com/zh-cn/download/details.aspx?id=30679)

## 软件error
### chrome
熟悉的提示：“Google Chrome 未响应。是否立即重新启动”，选项给你的选择并不能解救你。  
1. **Win + R** 输入 **cmd** 打开命令行
2. 输入 **taskkill /f /im chrome.exe** ,回车执行
3. 重新打开**Google Chrome**

### Wampserver
经常本地 demo 手机测试都会暂时用它架一个静态服务器，之前 php 学习用的工具，但 php 早忘光了。安装完成不做一点配置的话就会出现手机访问 403，做个备份省的再查。
1. 关闭防火墙
2. 修改 **apache** 目录下的 **httpd.conf**文件
```
//path: apache\apache2.4.17\conf\httpd.conf 291行左右
修改 Require local => Require all granted
```
3. 修改 **httpd-vhosts.conf** 文件
```
//path: 目录下搜索 httpd-vhosts.conf 找到 <VirtualHost *:80>节点上的所有虚拟站点
修改 Require local => Require all granted
```
4. 重启服务

注：此方法仅支持2.4以后的版本
### 百度云
说不上是错误，但是着实恶心，安装完百度云自动帮你在我的电脑添加一个“百度云管家”的盘符快捷方式，真心逼死强迫症。  
打开百度云，设置 - 基本 - 在我的电脑中显示百度云管家，默认是勾选状态，去除勾选 - 应用 - 确定。
如果成功，下面的可以无视。

1. **Win + R** 键入 **regedit** 进入注册表编辑
2. 依次展开 **HKEY_LOCAL_MACHINE** \ **SOFTWARE** \ **Microsoft** \ **Windows** \ **CurrentVersion** \ **Explorer** \ **MyComputer** \ **NameSpace**，删除 **NameSpace** 下面的 **{679F137C-3162-45da-BE3C-2F9C3D093F64}** 项 若无，跳至第4步。
3. 在 **NameSpace** 项上点右键 - 权限，依次操作 - 高级 - Administrators - 编辑 - 创建子项 - 拒绝
4. 依次展开 **HKEY_CURRENT_USER** \ **Software** \ **Microsoft** \ **Windows** \ **CurrentVersion** \ **Explorer** \ **MyComputer** \ **NameSpace** ，删除 **{679F137C-3162-45da-BE3C-2F9C3D093F64}** 项
5. 退出刷新。



