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
    {% codeblock lang:javascript %}
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
    {% endcodeblock %}

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
    {% codeblock lang:javascript %}
    var str = 'Today is Sun.!';
    var result = str.search(/(sun\.)/i); //返回匹配结果的索引值

    result // 9
    {% endcodeblock %}

#### *split()*
* 描述  
    字符串对象分割成字符串数组，字符串分割成子串。
* 语法
    ```
    str.split(separator[, limit])
    ```
* 参数
    * **separator** 字符串或正则对象，指定字符串分割的位置
    * **limit** 指定返回数组的最大长度。如果设定了 **limit** 值，返回数组的最大长度不超过 **limit**，否则不计长度，全部返回。

* 返回值
    一个字符串数组，但不包括 **separator** 本身。  
    如果 **separator** 为包含子表达式的正则对象，那么返回数组中包括子表达式匹配的字符串，但不包含与整个正则表达式匹配的字符串。
* 注：
    函数功能同Array.join()相反。
    如果 **separator** 指定为 "",则每个字符都会被分割。
* 示例  
    {% codeblock lang:javascript %}
    var str = "hello world! let's rock it.";
    str.split(/(!|\.)\s/) //分割两句话，且包括子表达式匹配结果

    //["hello world", "!", "let's rock it."]
    {% endcodeblock %}

    ![正则对象带子表达式返回](http://oh1bdpr59.bkt.clouddn.com/2017-5-16%20/split.png)

#### *replace()*
* 描述
    字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
* 语法
    ```
    str.replace(exp|substr, replacement)
    ```
* 参数
    * **exp|substr**
        子字符串或要替换的正则对象。如果为字符串，则优先按照字符串匹配。
    * **replacement**
        字符串值。指定替换文本或者生成替换文本的函数
* 返回值
    一个新的匹配替换完成的字符串。
* 注：
    **replace()** 实现的是查找并替换。如果正则对象指定了 **g**（全局标志），则会依次查找替换所有匹配项，否则只会查找替换第一个匹配项。  
    此外 **replacement** 参数中还有一个特殊的 $ 的特定用法(见文章结尾)。

* 示例

    {% codeblock lang:javascript %}
    //颠倒字符串
    var myName = 'yao, somnus';
    myName.replace(/(\w+)\s*, \s*(\w+)/, "$2 $1") //$1 $2 匹配两个捕获的子表达式

    // 'somnus, yao'

    //引号的替换
    var testStr = '"Tom" and "jerry"';
    testStr.replace(/"([^"]*)"/g, "'$1'") //依次匹配并替换

    //'Tom' and 'jerry'

    //首字母大写转换
    var myName = 'yao, somnus';
    myName.replace(/\b(\w+)\b/g, function(name){
        return name.substring(0,1).toUpperCase()+name.substring(1); //通过生成替换文本函数完成文本替换
    })

    //Yao, Somnus
    {% endcodeblock %}

    ![replace](http://oh1bdpr59.bkt.clouddn.com/2017-5-16%20/replace.png)

附：replace() 中 $ 的使用

| 语法 | 说明 |
| --- | --- |
| $1、$2、...、$99 | 与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。 |
| $& | 与 regexp 相匹配的子串。 |
| $\` | 位于匹配子串左侧的文本。 |
| $' | 位于匹配子串右侧的文本。 |
| $$ | 直接量符号。 |

正则表达式暂时就这么多了，笔记做完，心累，慢慢去撸demo了..
