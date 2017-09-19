---
title: BFC(Block Formatting Content)
date: 2017-09-19 23:24:04
categories:
    - html
tags:
    - DOM
---
### What is BFC?
> BFC 是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。  

当涉及到可视化布局的时候，BFC 为我们提供了一个环境，这个环境规定着其布局的规则，而不同环境之间的布局不会相互影响。  
想要更好的理解这个概念，需要先理解 Box 和 Formatting Context 的概念。网页的布局核心就是盒子的组成排列，这些盒子就是 Box。盒子的类型和 display 属性决定着这个 Box 的类型。  
不同类型的 Box，会参与不同的 Formatting Context（决定如何渲染文档的格式结构），然后其内元素就会以不同方式渲染。例如：
* block-level box ：display 属性为 block, list-item, table 的元素，会生成 block-level box，
    并参与 block formatting context;
* inline-level box：display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box，
    并参与 inline formatting context

而 Formatting Context 是一块渲染区域，它决定着其子元素如何定位，以及与其他元素的位置关系。  
通过上面一些概念，建议把 BFC 简单理解为一种属性，在具有此属性的容器中，元素按照 BFC 的规则实现布局。比如浮动元素会形成 BFC，这就是为什么我们看到浮动元素布局跟普通文档流的布局有所差别的原因。
<!-- more -->
### 规则是什么呢
简单以下几条规则，理解起来不太难。  
* 内部的 box 元素会在垂直方向依次放置，也就是文档流的从上而下
* 垂直方向距离由 margin（外边距）决定
* 其内每个元素的 margin box 的左边和包含块 border box 的左边相接触（由右向左的格式化则相反），浮动也如此
* BFC 的区域不会与其内浮动元素发成重叠
* BFC 就是页面一个隔离的独立容器，内联元素不会对外面元素产生影响，反之亦成立
* 计算 BFC 高度的时候，浮动元素也参与计算

### 哪些元素会生成 BFC
* 根元素
* 浮动元素，float 属性不为 none
* 绝对定位元素，position 属性为 absolute 或 fixed（absolute的子类）
* display 属性为 inline-block，table-cell，table-caption，flex，inline-flex
* overflow 属性不为 visible 以外值的 css3 中，BFC 叫做 Floe Root，并增加了一些触发条件

### BFC 在布局中的作用
* 解决两元素 margin 重叠问题。
    要想两个相邻元素不发生垂直方向的 margin 重叠，需要将他们定义在不同的 BFC 中。解决方法即在其中一个元素外包裹一层元素
    ，再对包裹元素进行 BFC 触发（声明以上触发 css 属性）。
* 解决由于浮动造成的重叠问题。
    一般情况下，浮动元素会脱离文档流，即不占用位置。它的性地元素会与它在左上角重叠，但如果两个相邻元素都设置了浮动，那么意味着它们都会以 BFC 的规则渲染，据以上第四条规则，BFC 区域不会相互重叠，所以为什么浮动元素独占空间便能理解了
* 解决容器由于拥有浮动元素造成的高度塌陷
    普通容器中，如果里面有浮动元素，且不设置高度的情况下，容器的高度是无法被撑起的。这时可通过设置 overflow 属性为 hidden 将之声明为 BFC，那么就可以包含浮动元素了
