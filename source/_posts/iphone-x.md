---
title: iPhone X 适配
date: 2018-02-13 22:06:28
categories:
    - 移动端
tags:
    - iOS
---

> 这篇文章迟到了很久，暂且记录一下自己遇到的坑

## html5网页
因为目前就职公司采用的H5响应式驱动的主体项目，app 都是基于的 webview 开发，当 iPhone X 上市后，适配促成了新的兼容任务。
### 新属性 
为了更好的适配 iPhone X，iOS 11 新增了几个特性用于处理那诡异的刘海屏。苹果公司还对 iPhone X 的屏幕内容作了安全距离限定，美其名曰为了更好的用户体验，其实就是为了填自己的坑。。
#### viewport-fit
iOS11 新增特性，为了适应 iPhone X 对现有的 viewport meta 标签的一个扩展，定义网页在可视窗口的布局方式。safari 浏览器中开发模式可勾选支持调试。
属性：  
* contain：可视窗口包含网页内容，即内容会在安全区域显示
* cover：网页内容覆盖可视窗口
* auto： 默认值，同contain表现是一致的

详情见[文档](https://www.w3.org/TR/css-round-display-1/#viewport-fit-descriptor)
#### constant
iOS11 新增特性，webkit 的 css 函数，用于设定安全区域与边界的距离，有四个预定义变量。
* safe-area-inset-left：安全区域距离左边边界距离
* safe-area-inset-right：安全区域距离右边边界距离
* safe-area-inset-top：安全区域距离顶部边界距离
* safe-area-inset-bottom：安全区域距离底部边界距离

我们需要关注的就是 safe-area-inset-bottom，对应也就是底部小黑条的处理  
同时需要注意的就是，**viewport-fit 为 contain 时，constant 函数是不起作用的，需要配合 cover 使用**，不支持 constant 的浏览器会被忽略此属性  

<!-- more -->
其实有些人会有些疑惑，很明显设计稿下面空出的距离就是 68 像素（2倍设计稿），但是网页适配你要兼容旋转屏幕，所以乖乖用人家的不要闹。

#### env（iOS 11.2后支持，兼容处理）
这是当初比较坑的一点，同事的突然一波更新，整个人陷入绝望，窝草！说好的适配呢，都不生效了！！  
后来又查了查，哦，11.2 以后支持这个属性了，constant 废除了。。  
可定义的值并无任何变化，只是函数名变了，略。
### 适配方案
官方给的建议就是，列表或者内容建议通底显示，黑条压了就压了，反正可以滑动内容，至于底部有悬浮固定操作的交互时候，建议做兼容处理。  
1. 设置网页窗口的布局方式
    viewport meta 标签添加 viewport-fit=cover属性
    ```
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    ```
2. 页面内容主体限定安全区域  

    1. 为了避免列表尾项或者主体内容受到小黑条遮挡，我们需要对 body 做一些处理  

        ```
        body {
            /* iOS 11.0 */
            padding-bottom: constant(safe-area-inset-bottom);
            /* 11.2+ */
            padding-bottom: env(safe-area-inset-bottom);
        }
        ```
    2. 底部悬浮交互按钮
        一般大多数需要做兼容处理的就是这种，web应用的底部导航菜单。 
        我们需要对吸底按钮做内边距处理，增加扩展高度，注意吸底元素最好设置个背景色，不然会镂空网站主体背景色  

        ```
        {
            /* iOS 11.0 */
            padding-bottom: constant(safe-area-inset-bottom);
            /* 11.2+ */
            padding-bottom: env(safe-area-inset-bottom);
        }
        ```
        或者通过 css 的计算函数 calc 来增加高度   

        ```
        {
          height: calc(50px(预设值) + constant(safe-area-inset-bottom));
          height: calc(50px(预设值) + env(safe-area-inset-bottom));
        }
        ```
        除此之外，有些悬浮按钮也需要处理，例如返回顶部之类，同样的通过计算函数增加定位元素的 bottom 值  
        ```
        {
          bottom: calc(50px(预设值) + constant(safe-area-inset-bottom));
          bottom: calc(50px(预设值) + env(safe-area-inset-bottom));
        }
        ```
        需要注意的是：**calc 属性计算中间的空格不可忽略，代码压缩会有点坑此处**
    
3. 属性兼容处理 support
    我们只希望 iPhoneX 才需要新增适配样式，我们可以配合 @supports 实现：  

    ```
    @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
      fixedDiv {
        margin-bottom: constant(safe-area-inset-bottom);
        margin-bottom: env(safe-area-inset-bottom);
      }
    }
    ```
    
## 小程序
小程序的处理相对就比较无脑，通过或许手机信息接口拿到是否为 iPhone X,然后做相应的样式处理  
```
// 获取手机信息
wx.getSystemInfo({
  success: function (res) {
    let model = res.model.substring(0, res.model.indexOf("X")) + "X";
    if (model == 'iPhone X') {
      that.globalData.isIpx = true  
    }
  }
})
```
**注意：小程序 webview 中的适配采用h5的网页适配属性不生效，需要通过参数传递然后动态添加 class 做样式处理**

## app
如果业务逻辑是由 app 驱动，直接甩好 webview 距离就好，如果是 web 驱动，建议移交 web 来做底部兼容

## 后话
大过年的在家懒了好几天终于开始用笔记本干正事系列。。(碎碎念，讲道理浏览量这么少的东西，我就没必要定性自己写的是技术博客了)

