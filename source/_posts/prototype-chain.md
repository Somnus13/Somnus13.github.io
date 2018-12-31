---
title: 原型、原型链笔记
date: 2018-12-31 17:09:46
categories:
    - js
tags:
    - 原型
---

**解释：**为了共享多个对象间的一些共有特征（属性或方法）

JavaScript 中的对象，都存在一个内置属性` [[prototype]] `也做 `__proto__`，指向这个对象的原型对象


js 中查找一个属性或方法，如果当前对象无定义会继续查找当前对象的原型对象，如果仍未找到，会继续查找原型对象的原型。如此直至最顶层的原型对象，如果仍未找到返回 undefined


最顶层的原型对象 为 `Object.prototype`, 里面保存了最常用的 toString、valueOf、hasOwnProperty 等方法，故任何对象都可以开箱即用。

创建对象的三种方式
---------

### 1\. 字面量方式

字面量方式创建对象，它的原型就是 Object.prototype

```js
var obj = {};
obj.__proto__ === Object.prototype // true
```

### 2\. 函数构造调用

Js 在定义一个函数时，同时为这个函数定义了一个默认的 `prototype` 属性, 所有的共享的属性或方法都被放到这个属性指向的对象中。

由此看出，通过一个函数的构造调用创建的对象，它的原型就是这个函数的 prototype 属性指向的对象

```js
// 创建构造函数
function Person(name) {
  this.name = name;
}

// 每个构造函数，js 都会为之自动添加一个 prototype 属性，称之为原型，是一个对象
// 每个构造函数创建的对象都会共享 prototype 上面的属性与方法
console.log(typeof Person.prototype); // 'object'

// 为 Person 添加 sayName 方法
Person.prototype.sayName = function() {
  console.log(this.name);
}

// 创建实例
var person1 = new Person('a');
var person2 = new Person('b');

person1.sayName(); // 'a'
person2.sayName(); // 'b'
person1.sayName === person2.sayName // true

```
<!--more-->
整理一下：

* 构造函数默认有个 prototype 属性指向它的原型
* 构造函数原型有个 constructor 属性指向构造函数本身
  ```javascript
  Person.prototype.constructor === Person
  ```
* 每个 new 出来的实例都有个隐式的 __proto__ 属性，指向它的构造函数的原型
  ```javascript
  person1.__proto__ === Person.prototype
  person1.__proto__.constructor === Person
  ```
* Object 本身也是一个构造函数，他也是一个对象
  ```javascript
  Object.__proto__ === Function.prototype
  ```
* 此外，Function 的原型属性与 Function 的原型指向同一个对象
  ```javascript
  Function.__proto__ === Function.prototype
  Object.prototype.__proto__ === null
  typeof Function.prototype === 'function'
  ```


### 3\. Object.create()

Object.create() 创建的对象会以传入的对象作为原型。

```javascript
var obj = {};
var obj2 = Object.create(obj);
obj2.__proto__ === obj // true
```

利用此方法可以模拟对象的“继承”

```js
function Foo(name) {
  this.name = name;
}

Foo.prototype.myName = function() { return this.name; }

function Bar(name, label) {
  Foo.call(this, name);
  this.label = label;
}

// temp 原型为 Foo.prototype
vat temp = Object.create(Foo.prototype);

// new Bar 创建的对象原型为 temp，temp原型为 Foo.prototype,从而 Bar.prototype 和 Foo.prototype 有了继承关系
Bar.prototype = temp;

Bar.prototype.myLabel = function() { return this.label; }

var o1 = new Bar('o1','baro1');
o1.myName(); // 'o1'
o1.myLabel(); // 'baro1'
o1.__proto__.__proto__ === Foo.prototype // true
```

proto 和 prototype
-----------------

proto 指向 当前对象的原型，而 prototype 为函数才有的属性

默认情况下，new 一个函数创建的对象，其原型都指向构造函数的 prototype 属性指向的对象

特殊情况
----

1. js 的内置对象，如 String，Array，Number，Object，Function等，因为为 native 代码实现，所以原型打印出来都是 f(){[native code]}
2. 内置对象本质也是函数，所以可以通过他们创建对象，创建出的对象的原型指向内置函数的 prototype 属性，最顶层的原型对象指向 Object.prototype
3. Object.create(null) 创建的对象不存在原型

constructor、proto 与 prototype
-----------------------------

Js 中每创建一个对象，该对象就会获得一个 __proto__ 属性（为一个对象）指向创建该对象的构造函数的原型属性，同时 __proto__ 对象中又有一个 constructor 属性指向该构造函数

> 只有函数才有 prototype， 每个对象（函数也是对象）都有 __proto__, Object 本身就是构造函数

进一步探讨
-----

js 为单继承;

Object.prototype 为原型链的顶端，所有对象从它继承了包括 toString 等方法；

Object 为构造函数，它继承了 Function.prototype;

Function 为对象，继承了 Object.prototype ;

```JavaScript
Object instanceof Function // true
Function instanceof Object // true
?????!!!!!!
```
官方给的解释：
Function 本身为函数。Function.__proto__ 是标准的内置对象 Function.Prototype,Function.prototype.__proto__ 是标准的内置对象 Object.prototype

{% asset_img 8B8557B39F5CC2241DAEABF53C804642.jpg %}

**总结：**

**先有 Object.prototype (原型链顶端)**

**Function.prototype 继承自 Object.prototype 产生**

**最后 Function 、Object 和其他的构造函数继承 Function.prototype 产生**

```js
function Person(name) { this.name = name; }
var person = new Person('a');

person.__proto__ === Person.prototype
person.__proto__.__proto__ === Object.prototype
person.__proto__ === Function.prototype
```
