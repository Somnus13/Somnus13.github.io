---
title: 响应式图片处理
date: 2017-06-14 19:27:49
categories:
    - html
tags:
    - 响应式
---
# 响应式图片处理
> just note

## 固定宽度图像
浏览器会根据设备像素比来选择加载图片
### 参数
* **srcset**   
	**srcset** 属性会罗列出当前可加载的备选图片，用逗号分隔。  
	不识别此属性的浏览器会直接加载 **src** 属性声明的图像。
* **x**   
	**x** 表示图像的设备像素比。

### 场景
网站 **logo** 等宽度固定，大小不随着 **viewport** 的变化而变化
### 示例
```html
<div class="img-box1">
	<img srcset="images/gakki-540.jpg 1.5x,images/gakki-720.jpg 2x,images/gakki-1080.jpg 3x"
		 src="images/gakki-360.jpg" alt="Responsive Images">
</div>
```
<!-- more -->

图片固定宽度为 **300**，浏览器通过识别设备像素比来筛选并加载图片。如上像素设备比为 **2**（例如：iphone6）的时候加载 **gakki-720** 的图片，**3**（iphone6 plus等）的时候会加载实际尺寸为 **1080** 的备选图。如果不支持，则默认加载 **gakki-360**。

[点此](http://oh1bdpr59.bkt.clouddn.com/Responsive-Images/Responsive1.html) 查看示例(建议新版本谷歌浏览)

## 可变宽度的图像

浏览器会根据设备视窗大小( **viewport** )来选择加载图片
### 参数
* **srcset**
	备选图片列表，逗号分隔  
* **sizes**
	包含两个值且用逗号分隔的图片展示规则列表，非必须。  
	如果 **srcset** 中使用了 **w** 描述符，则必须设置  **sizes** 属性。  
	第一个值为媒体查询条件，第二个为图片尺寸值，用 **vw** 来描述，不可使用百分比。  
	注：**vw** 兼容性不及 **srcset**


### 场景
内容响应式图片处理
### 示例
```
<div class="img-box2 ">
	<img srcset="images/gakki-360.jpg 360w,
	             images/gakki-540.jpg 540w,
	             images/gakki-720.jpg 720w,
	             images/gakki-1080.jpg 1080w"
	     sizes="(max-width: 400px) 100vw,
	            (max-width: 960px) 75vw,
	            1080px" src="images/gakki-1080.jpg" alt="Responsive Images">
</div>
```
浏览器会根据 **sizes** 定义的媒体查询条件来选择加载图片。例如网页宽度 **600px** 时，按照查询条件小于 **960px**,所以会按照 **75%** 加载，而 **600*0.75 = 450** ,取最接近即 **gakki-540** 的图片。

[点此](http://oh1bdpr59.bkt.clouddn.com/Responsive-Images/Responsive2.html) 查看示例(建议新版本谷歌浏览)  

## 不同的图像

前两者都是通过 **srcset** 属性来实现同一图像不同质量的展示，而不支持此属性的浏览器会识别为普通的图像并加载 **src** 属性。

如果需要在不同的场景显示稍微不同的图片呢？例如大屏下显示全图，而小屏 or 移动端则仅需要展示细节，这样的场景需求则需要借用 **picture** 元素。
### 参数
* **source**
	定义媒体查询条件和备选图片地址

### 场景
不同场景展示不同图片(全局细节之类的)
### 示例
```html
<picture>
	<source media="(min-width: 960px)" srcset="images/gakki-large-1080.jpg">
	<source media="(min-width: 575px)" srcset="images/gakki-mid-630.jpg">
	<img src="images/gakki-small-360.jpg" class="picture-img" alt="Responsive Images">
</picture>
```

[点此](http://oh1bdpr59.bkt.clouddn.com/Responsive-Images/Responsive2.html) 查看示例(建议新版本谷歌浏览)
浏览器窗口的变化可见，图片在小屏下显示裁剪版的细节图。

## 不同类型的图像
针对不同浏览器支持类型，渲染相应的格式的图片。新格式的图像在图片质量以及图片大小方面表现良好，但是目前来讲，兼容性待考验。
### 参数
* **source**
	指定每个图像的MIME类型，浏览器会选择第一个含有其支持的MIME类型的源  
	源的顺序是至关重要的，如果浏览器无法识别所有的图象类型，它会回退至原来的 **img** 元素。

### 场景
不同格式的图片在文件大小和图片质量表现不一 ，不少新格式表现良好。
**chrome** 和 **opera** 浏览器支持 **webp** 格式图像，而 **jpeg-xr** 格式则是微软专有格式，仅 **ie** 支持。

### 示例
```html
<picture>
    <source type="image/vnd.ms-photo" src="images/gakki-875.jxr">
    <source type="image/jp2" src="images/gakki-875.jp2">
    <source type="image/webp" src="images/gakki-875.webp">
    <img src="images/gakki-875.jpg" class="picture-img" alt="Responsive Images">
</picture>
```

[点此](http://oh1bdpr59.bkt.clouddn.com/Responsive-Images/Responsive2.html) 查看示例(建议新版本谷歌浏览)
ps：亲测，并没看到预料的结果，感觉被骗了..

本文参考自 [Using Responsive Images (Now)](https://alistapart.com/article/using-responsive-images-now).
