---
title: ES5新增数组方法
date: 2017-05-06 14:47:09
tags:
  - javascript
---
ES5新增数组方法
=========================
>ES5新增数组方法学习笔记。

## Foreach
接收一个函数作为参数，对数组进行循环遍历，而并不改变数组。
### 语法
{% codeblock lang:javascript %}
array.forEach(callback(currentValue, index, array){

},this)

array.forEach(callback[, thisArg])
{% endcodeblock %}
### 参数
forEach方法会对数组的有效值的每一项执行callback函数，已经删除或者未初始化的项会被跳过。而callback函数会被传入三个参数：
* 数组当前项值
* 当前项的索引
* 数组对象本身

<!-- more -->
{% codeblock lang:javascript %}
var arr = ['a','b','c','d'];
arr.forEach(console.log);

//循环遍历功能等同于
for(var i = 0; len = arr.length,i < len; i++){
  console.log(arr[i]);
}

//期望输出
a 0 ["a", "b", "c", "d"]
b 1 ["a", "b", "c", "d"]
c 2 ["a", "b", "c", "d"]
d 3 ["a", "b", "c", "d"]
a
b
c
d
{% endcodeblock %}
区别就在于forEach回调返回了三个参数，如图

![chrome console](http://oh1bdpr59.bkt.clouddn.com/blog/forEach.png)

而array.forEach(callback[, thisArg])方法中thisArg参数是可选的，如果指定则在执行回调时用作this的值，否则默认传入undefine。
### 兼容polyfill
作为ES5新增方法，难免有些浏览器不支持，所以当我们使用时需要添加一段代码来帮助它兼容旧环境（polyfill）,代码来自MDN。
{% codeblock lang:javascript %}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback,thisArg) {
    var T, k;

    if(this == null){
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callback !== 'function') {
      throw new TypeError(callback + 'is not a function');
    }

    if (arguments.length > 1) {
      T = thisArg;
    }

    k = 0;

    while (k < len) {
      var kValue;

      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }

      k++;
    }
  }
}
{% endcodeblock %}
### 注意
forEach无法在所有有效元素传递给回调函数之前终止（而for循环有break方法），如需提前终止，需要把forEach置于try语句块中，并抛出异常。
## Map
用法同forEach基本相同，区别在于map方法返回一个新数组
### 语法
{% codeblock lang:javascript %}
const new_array = arr.map(callback[, thisArg])
{% endcodeblock %}
### 参数
略.
### 实例
略.
### 兼容polyfill
区别于forEach():
{% codeblock lang:javascript %}
//创建新数组
var A = new Array(len);

...

//保存callback返回值
mappedValue = callback.call(T, kValue, k, O);

// 返回值添加到新数组A中.
A[ k ] = mappedValue;

...   

//返回新数组A
return A;      
{% endcodeblock %}

## Every
every()接收一个返回值布尔类型的函数。
### 语法
{% codeblock lang:javascript %}
arr.every(callback[, thisArg])
{% endcodeblock %}
### 参数
every方法为数组的每一项执行callback函数，不会改变原数组。如果所有项callback函数返回为true，则方法返回true，如果遇到一个返回值为false，则直接终止并返回false。
同样，callback方法只对那些有效值的项进行操作。
callback被调用传入三个函数：
* 元素值
* 元素索引
* 数组对象本身

### 实例
检测是否为奇数
{% codeblock lang:javascript %}
function isOdd(ele, index, arr){
  return (ele % 2 == 1);
}

var arr1 = [1,5,6,9,12].every(isOdd);
//false
var arr2 = [1,3,5,7,9,11].every(isOdd);
//true
{% endcodeblock %}
### 兼容polyfill
{% codeblock lang:javascript %}
if (!Array.prototype.every)
{
    Array.prototype.every = function(callback, thisArg){
      if(this == null){
        throw new TypeError('this is null or not defined');
      }

      var T = Object(this);

      var len = t.length >>> 0;

      if (typeof callback !== 'function') {
        throw new TypeError(callback + 'is not a function');
      }

      var thisArg = arguments.length > 1 ? thisArg : null;

      for (var i = 0; i < len; i++)
      {
        if (i in t && !fun.call(thisArg, t[i], i, t))
          return false;
      }

      return true;
    };
}
{% endcodeblock %}

## Some
用法同every()基本相同，区别在于只要有一项callback函数返回值为true则方法返回true，否则为false。
### 语法
{% codeblock lang:javascript %}
arr.some(callback[, thisArg])
{% endcodeblock %}
### 参数
略.
### 实例
略.
### 兼容polyfill
略.区别只在于return值取反
## reduce
接受一个回调函数作为累加器，数组中每个值开始缩减，最终为一个值，是ES5中新增的一个数组逐项处理方法。
reduce直译是缩减减少，函数定义以及实现个人感觉更像是递归。
### 语法
{% codeblock lang:javascript %}
arr.reduce(callback[, initialValue])
{% endcodeblock %}
### 参数
reduce方法接收一个函数类型的回调函数和一个可选初始值参数
* callback 数组每一项的回调函数，接受4个参数
  * accumulator 上一次调用的返回值或者初始值
  * currentValue 正在处理的数组元素
  * currentindex 正在处理的数组元素索引
  * array 数组元素本身
* initialValue 可选初始值参数，第一次调用传给accumulator

回调函数第一次执行时，有两种情况，如果initialValue指定，则accumulator取值为initialValue，currentValue取值数组第一项，如果没有指定initialValue，
accumulator取值数组第一项，而currentValue取值数组第二项。

如果数组为空且没有提供initialValue，会抛出TypeError错误，如果仅有一个元素且没提供initialValue或者提供了initialValue数组为空，则直接返回，不会调用callback。
### 实例
数组求和，数组扁平化，计算数组中值出现次数
{% codeblock lang:javascript %}
//求和
var arr = [1, 2, 3, 4];

arr.reduce(function (pre, cur) {
  return pre + cur;
},10);

//20

//扁平化
var newArr = [[1, 2], [3, 4], [5, 6]].reduce(function(pre, cur){
  return pre.concat(cur);
},[]);

//[1, 2, 3, 4, 5, 6]

//计算重复值次数
var arr = ['Alice', 'Bob', 'Ciel', 'Dianel', 'Alice', 'Ciel', 'Alice'];

arr.reduce(function(newObj ,key){
  if(key in newObj){
    newObj[key]++;
  }else{
    newObj[key] = 1;
  }
  return newObj;
},{});

//{Alice: 3, Bob: 1, Ciel: 2, Dianel: 1}
{% endcodeblock %}
![reduce](http://oh1bdpr59.bkt.clouddn.com/blog/reduce.png)
### 兼容polyfill
一如既往地代码来自MDN
{% codeblock lang:javascript %}
if (!Array.prototype.reduce)
{
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';

    if (this === null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var t = Object(this), len = t.length >>> 0, k = 0, value;

    if (arguments.length >= 2) {
      value = arguments[1];
    } else {

      while (k < len && !(k in t)) {
        k++;
      }

      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }

      value = t[k++];
    }

    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }

    return value;
  };
}
{% endcodeblock %}

## Filter
同every()方法类似，回调函数参数相同，返回值为回调参数结果为true的所有项集合的数组。
### 语法
{% codeblock lang:javascript %}
arr.filter(callback[, thisArg])
{% endcodeblock %}
### 参数
filter为数组中每一个**有效值**项调用callback函数，返回一个**新数组**，数组内容是callback返回值为true的元素的集合。
### 实例
筛选奇数
{% codeblock lang:javascript %}
function isOdd(ele){
  return ele % 2 == 1;
}
[1, 54, 23, 44, 13].filter(isOdd);

//[1, 23, 13]
{% endcodeblock %}
### 兼容polyfill
{% codeblock lang:javascript %}
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}
{% endcodeblock %}
