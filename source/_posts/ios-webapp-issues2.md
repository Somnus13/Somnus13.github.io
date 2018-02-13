---
title: IOS webapp 踩屎记（二）
date: 2017-05-23 21:20:56
categories:
    - 移动端
tags:
    - iOS
---
# ios底部输入框遮挡
> 接上节，因为fixed元素的变现不友好，底部固定元素多采用了absolute定位。但底部固定元素内包含输入控件时，聚焦会发生输入框被键盘遮挡。

## 背景
* 场景  
    为了实现类 **IM** 即时通讯页面，输入框聚焦并紧贴键盘顶部浮起。
* 表现  
    某些浏览器会发生输入框遮挡被键盘遮挡。  
    qq内置以及微信内置浏览器估计对此作了些处理，基本没发现这种情况。
    而别的浏览器，或多或少会复现这个问题（第一次触发）
<!--more-->
    **理论上的表现为**：  
    ![normal](http://oh1bdpr59.bkt.clouddn.com/2017-5-23/normal.png)

    **实际表现为**：  
    ![error](http://oh1bdpr59.bkt.clouddn.com/2017-5-23/error.png)

## 分析
输入框聚焦后，**ios** 和安卓对此作了不同的处理。  
安卓会对页面进行压缩，页面的 **innerHeight** 会发生变化，而ios会直接把页面向上推键盘的高度，页面的 **innerHeight** 并没发生变化（除了 **UC** 浏览器，真心不知道为什么这么另类）。  
查阅一些资料，发现了 **Element** 对象两个兼容性有待考量的方法 **scrollIntoView()** 和 **scrollIntoViewIfNeeded()**。
* **scrollIntoView()** 让当前的元素滚动到浏览器窗口的可视区域内
    * 语法
    ```
    element.scrollIntoView(); // 等同于element.scrollIntoView(true)
    element.scrollIntoView(alignToTop); // Boolean型参数
    element.scrollIntoView(scrollIntoViewOptions); // Object型参数
    ```
    * 参数
        * **alignToTop** 一个 **Boolean** 值：  
            如果为 **true**，元素的顶端将和其所在滚动区的可视区域的顶端对齐。  
            如果为 **false**，元素的底端将和其所在滚动区的可视区域的底端对齐。
        * **scrollIntoViewOptions**   一个 **boolean** 或一个带有选项的 **object**：  
            ```
            {
                behavior: "auto"  | "instant" | "smooth",
                block:    "start" | "end",
            }
            ```

            如果是一个 **boolean**, **true** 相当于 **{block: "start"}**，**false** 相当于 **{block: "end"}**
    * 兼容  
        详情点击 [here.](http://docs.w3cub.com/browser_support_tables/scrollintoview/)

* **scrollIntoViewIfNeeded()** 让当前的元素滚动到浏览器窗口的可视区域内
    * 语法
    ```
    scrollIntoViewIfNeeded(); // 等同于element.scrollIntoView(true)
    element.scrollIntoView(alignToTop); // Boolean型参数
    ```
    * 参数
    * **alignToTop** 一个 **Boolean** 值：  
        如果为 **true**，元素的顶端将和其所在滚动区的可视区域的顶端对齐。  
        如果为 **false**，元素的底端将和其所在滚动区的可视区域的底端对齐。
    * 兼容  
        详情点击 [here.](http://docs.w3cub.com/browser_support_tables/scrollintoviewifneeded/)

然后，开始动刀，测试。

## 解决
输入框聚焦，添加键盘呼起延迟，并对呼出键盘后的页面做输入框位置调整。

```
var container = document.getElementById("wrapper"); //最外部滚动容器
var ele = document.getElementById("input_test");
var eleDIv = document.getElementById("footer");

var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isUc = u.indexOf("UCBro") > -1;

if(isiOS && ele && eleDIv){
    ele.onfocus = function(){
		setTimeout(function(){
            scrollDiv();
        },isUc ? 350 : 200);
    }  
}

function scrollDiv(){
    var isChrome = u.indexOf("CriOS") > -1;
    if(isChrome){
        document.body.scrollTop = container.clientHeight; //chrome 特殊处理
    }else if(Element.prototype.scrollIntoViewIfNeeded){
    	eleDIv.scrollIntoViewIfNeeded(false);
    	container.scrollTop = 1000; //切换输入法，首次等特殊情况补救
    }else if(Element.prototype.scrollIntoView){
        eleDIv.scrollIntoView(false);  
    }else{
        document.body.scrollTop = container.clientHeight; //防止漏网之鱼
    }
}
```
## 吐槽：
1. **UC** 两个方法都生效，不过呼出处理时间需要更久一点
2. **chrome** 也成功沦落到一个另类的表现，虽然自己公司 **webapp** 和谷歌表现一致
3. **ios** 原生 **safari** 浏览器的 **UA** 简直没法区分

Ps：这个方法可能不是最完美的解决方案，仅供参考，毕竟只是做个笔记。完整代码[请点击](http://oh1bdpr59.bkt.clouddn.com/2017-5-23/demo.html)。
