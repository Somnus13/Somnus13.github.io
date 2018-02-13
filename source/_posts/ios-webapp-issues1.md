---
title: IOS webapp 踩屎记（一）
date: 2017-05-22 19:34:49
categories:
    - webapp
tags:
    - iOS
---

>底部 fixed 元素与输入控件的碰撞..

## 移动端fixed元素
### 背景
过长的移动端网页需要底部固定一个按钮来方便引导用户操作
### 场景
fixed 属性在 IOS 5版本开始支持，但是不如安卓表现良好。  
页面中同时存在输入控件（**input、textarea**）和 **fixed** 元素时，输入控件获取焦点呼出键盘，**fixed** 元素会错位。
* 安卓表现良好，输入控件聚焦，滚动页面fixed元素固定输入法顶部
* **IOS**（仅以 **safari**、谷歌、**UC** 浏览器、微信 **webview** 作参考）
    * **safari**、谷歌、微信，聚焦时 **fixed** 元素 **fixed** 属性失效，归于文档流底部
    * **UC** 浏览器聚焦，滚动页面 **fixed** 元素异位

<!--more-->

1. 输入框为失焦状态  

    ![error1](http://oh1bdpr59.bkt.clouddn.com/2017-5-22%20/fixed-e1.png)
2. 输入框聚焦  

    ![error2](http://oh1bdpr59.bkt.clouddn.com/2017-5-22%20/fixed-e2.png)
3. 滚动页面  

    ![error3](http://oh1bdpr59.bkt.clouddn.com/2017-5-22%20/fixed-e3.png)

### 解决
输入控件聚焦，设置 **fixed** 元素 **position** 为 **relative**，回归文档流置于页面内容底部。  
失去焦点，**reset** 为 **fixed** 元素。
{% codeblock lang:javascript %}
...
<body>
    <h2>IOS fixed</h2>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p class="mt mb"><input type="text" id="input_test" placeholder="input here"></p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <p>这是一个占位的段落.</p>
    <div id="footer">fixed div</div>
</body>
<script>
    var o_input = document.getElementById('input_test'),
        o_footer = document.getElementById('footer');

    o_input.onfocus = function(){
        o_footer.style.position = 'relative';
    }
    o_input.onblur = function(){
        o_footer.style.position = 'fixed';
    }
</script>
{% endcodeblock %}
解决后表现:

1. 输入框为聚焦状态  

    ![relative1](http://oh1bdpr59.bkt.clouddn.com/2017-5-22%20/fixed-s1.png)
2. 输入框聚焦  

    ![fixed2](http://oh1bdpr59.bkt.clouddn.com/2017-5-22%20/fixed-s2.png)

至此，下一篇搞定底部输入框遮挡问题，[轻点](http://www.google.com)。
