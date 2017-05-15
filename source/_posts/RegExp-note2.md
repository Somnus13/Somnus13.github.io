---
title: 正则表达式笔记二(未完成)
date: 2017-05-15 22:07:04
tags:
    - 正则表达式
---
>抽风的电脑，字怎么变成繁体了。主要为正则对象函数的应用。

## 正则对象创建
### 创建RegExp对象实例  
1. 显示构造: **new RegExp("pattern"[, "flags"])** 或 **new RegExp(/pattern/[, "flags"])**
2. 隐示构造: **/pattern/[flags]**

### 参数
* **pattern** 正则表达式
* **flags**
    标志匹配规则。例如 "g" 全局匹配，"i" 不区分大小写，"m" 多行匹配等，常用的为 "g" 和 "i"。

<!--more-->

## 正则函数应用
### RegExp对象
#### *test()*
* 描述  
    检索字符串的指定值
* 语法
    ```
    exp.test(str)
    ```
* 参数
    * **exp** 正则对象
    * **str** 要检索的字符串

* 返回值
    返回值为布尔类型，成功匹配则为 **true** ，反之 **false** 。
* 示例
    ```
    //检索字符串内是否存在"abc"
    var exp = /abc/;
    'abcda'.test(exp); //true
    ```

#### *exec()*
* 描述  
    检索字符串的指定值
* 语法
    ```
    exp.exec(str)
    ```
* 参数
    * **exp** 正则对象
    * **str** 要检索的字符串
* 返回值
    返回值为匹配到的值。若无匹配，返回 **null** 。
    注：如果指定标志 **g**，可多次执行 **exec()** 查找成功匹配，查找位置从上一次查找的 **lasetIndex** 开始。
* 示例
    ```
    //多次执行exec()
    var patt1=new RegExp("o","g");
    do
    {
    result=patt1.exec("Hello world!");
    console.log(result);
    }
    while (result!=null)

    // ["o", index: 4, input: "Hello world!"]
    // ["o", index: 7, input: "Hello world!"]
    // null
    ```

#### *compile()*
将来的版本会被移除 **web** 标准，不再赘述。

### String对象
#### *match()*
* 描述  
    当一个字符串与一个正则表达式匹配时，**match()** 方法检索匹配项。
* 语法
    ```
    str.match(exp)
    ```
* 参数
    * **exp** 正则对象  
        如果 **exp** 传入的值为非正则对象，则会隐示调用 **new RegExp(exp)** 方法转换成正则对象。  
        如果 **exp** 传入的值为空，则返回结果为 **['']**。
    * **str** 要检索的字符串
* 返回值
    **array**。 包括匹配结果以及子表达式捕获结果的数组。如果未匹配，返回 **null**。  

    如果正则对象未指定 **"g"** ,返回结果同 **RegExp.exec()** ，且返回结果中拥有两个属性：
    **index**: 搜索结果索引值，**input**: 匹配的原始字符串。

    如果指定了 **"g"** ,返回结果为所有匹配结果字符串的数组对象，而不是RegExp对象，且捕获结果不可获得。
* 示例

    ![match](http://oh1bdpr59.bkt.clouddn.com/2017-5-15%20/match.png)

#### *search()*
* 描述
    **search()** 方法执行正则表达式和 **String** 对象之间的一个搜索匹配。
* 语法
    ```
    str.search(exp)
    ```
* 参数
    * **exp** 正则对象
    * **str** 要检索的字符串

* 返回值
    匹配成功返回首次匹配结果的索引，否则返回 -1 .
* 示例
    ```
    var str = 'Today is Sun.!';
    var result = str.search(/(sun\.)/i); //返回匹配结果的索引值
    result // 9
    ```

#### *split()*
* 描述
* 语法
* 参数
* 返回值
* 示例

#### *replace()*
* 描述
* 语法
* 参数
* 返回值
* 示例
