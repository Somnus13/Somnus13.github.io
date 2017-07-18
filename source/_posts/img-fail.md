---
title: img fail那点事
date: 2017-07-18 21:56:10
categories:
    - html
tags:
    - 图片
---
# img fail
前言：据说，一个公司的网速决定着一个程序员的心情与产出，而网速决定着一篇文章裂图的程度。
## 告别裂图
**html** 中的 **img** 标签预设了几个关于自身加载的事件：
* **onError**  
    图片加载出现错误，多数的处理是将图片路径指向默认图片
* **onLoad**  
    图片加载完成之后触发事件
* **onAbort**  
    图片加载过程中，用户手动停止加载（浏览器停止按钮）触发事件

前面也讲过，图片加载缓慢乃至加载失败并不全因为是网速问题，还有可能是图片服务器延迟，或者图片过期请求失效等。
然后就会出现所谓的“裂图”,而这时 **img** 标签的 **alt** 属性就会发挥作用，提示用户当前加载失败图像的信息。
如图：

![fail-img1](http://oh1bdpr59.bkt.clouddn.com/fail_img/img-fail1.png)  

然后从运行下面代码可以在控制台看到图片加载几个事件相应的输出。

<!--more-->

```html
<script>
function loadSuccess() {
  console.log('image load success!');
}

function loadError() {
  console.log('image load error!');
}

function loadAbort() {
  console.log('image abort!');
}
</script>
<div class="img-container">
    <img src="http://1234.com/1.jpg" onload="loadSuccess()" onerror="loadError()" onabort="loadAbort()" alt="this is a fail img" />
</div>
```


显然这样的表现形式，在用户看来是非常不优雅的。身为一个程序员，如果所有异常分支没有做相应处理，就相当于一辆急速行驶的汽车，保不齐啥时候刹车会失灵一下下。
## 动手吧
利用加载失败时的标签和伪类 **:before :after** 来做点事  
我们可以通过 **:before :after** 来定义加载失败的提示信息，例如在图片上方提示加载失败提示，下方提示图片的源地址。
```html
<img src="http://oi2fsv5ls.bkt.clouddn.com/twitter/Cwc6jkVUcAExIOI.jpg-orgi" alt="gakki-twitter" class="img_load img_load1">
```
```css
.img_load{
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    font-family: 'Helvetica';
    font-weight: 300;
    line-height: 1.5;
    text-align: center;
}
.img_load1:before{
    display: block;
    margin-bottom: 10px;
    content: "image load error !";
}

.img_load1:after {
    display: block;
    width: 100%;
    font-size: 12px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
    content: "[url: " attr(src) "]";
}
```
然后图片加载失败就会显示成如下：  
![fail-img2](http://oh1bdpr59.bkt.clouddn.com/fail_img/img-fail2.png)
## 优化一下(算是)
虽然上例已经展示了比较优雅的错误提示，和相应的图片源地址，保证用户能接受且能通过源地址来进行更加合理的访问。  
但是，裂图依旧在！来让我们弄点东西遮起来吧。  
本例采用了 **font-awesome** 库来实现小图标展示,所以需要先引进css库
```html
<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<img src="http://oi2fsv5ls.bkt.clouddn.com/twitter/CwvqJsEUkAAyeiG.jpg-orgi" alt="gakki-twitter" class="img_load img_load2">

```
```css
.img_load2:after{
    position: absolute;
    z-index: 2;
    top: -1px;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 16px;
    font-family: FontAwesome;
    background-color: #fff;
    color: rgb(100, 100, 100);
    content: "\f1c5" " " attr(alt);
}
```
图示如下：  
![fail-img3](http://oh1bdpr59.bkt.clouddn.com/fail_img/img-fail3.png)

## 总结
基本网站开发框架都会集成默认图片，而且过大的图片对于网站加载速度不友好，所以这个的应用场景大概也就是寄存图床之类图片过期的博客或者论坛了。

ps:实例中加载失败的后两张图片只需要在链接后面添加一个字母 **n** 就可以访问了，送一波图，顺便安利一下这是我老婆！
