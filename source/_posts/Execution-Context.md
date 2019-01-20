---
title: 执行上下文和执行栈
date: 2018-12-08 16:12:53
categories:
    - javascript
tags:
	- 基础
---


> 又来过基础

## 执行上下文
### 什么是执行上下文
Execution Context（执行上下文）就是定义变量或函数有权访问的其他数据，并决定了他们的行为。
根据所在环境的不同一共有三种类型：
* 全局执行上下文
	默认、最基础的执行上下文，且一个程序只能存在一个全局上下文
* 函数执行上下文
	每次 **调用** 都会创建一个新的执行上下文
* Eval 函数执行上下文
	运行在 eval 函数内的代码有着自己的执行上下文

## 执行栈
先进后出的结构，用于存储代码执行期间创建的所有执行上下文
JavaScript 引擎开始读取脚本时，先默认创建一个全局执行上下文并将其推入栈底，每发生一个函数调用，引擎就会为该函数创建一个新的执行上下文并压入栈。引擎会运行处于执行栈栈顶的函数，运行完后，其对应的上下文从栈中弹出，交还控制权给当前执行上下文的下一个执行上下文
```javascript

function foo(y) {
  var sum = foo1(y) + 1
  console.log(sum)
}
function foo1(x) {
  return x+1
}

foo(5)

```
执行栈简图如下：
{% asset_img QQ20181208-174019@2x.png %} 
注：每次函数调用都会创建新的 执行上下文，哪怕是递归调用

## 执行上下文的创建
执行上下文分两个阶段创建： 1）创建阶段 2）执行阶段
### 创建阶段（函数被调用，代码未执行）
	1. 初始化作用域链
	2. 创建变量对象
	3. 创建参数对象，检查参数上下文，初始化其名称和值并创建一个引用拷贝
	4. 扫描函数声明，对于未发现的函数在变量对象中创建一个同名属性，如果已经存在的发生**覆盖**
	5. 扫描变量声明，未被发现的在变量对象中创建一个同名属性并初始化为 undefined，如果已存在，**跳过**
	6. 确定上下文中的 this

注：如果 let 以及 const 声明创建阶段会跳过初始化

### 执行阶段 
赋值、寻找函数引用以及解释/执行代码

所以执行上下文类似结构为：
```javascript
executionContextObj = {
    'scopeChain': { /* 变量对象 + 所有父级执行上下文的变量对象*/ }，
    'variableObject': { /* 函数参数、 参数，内部变量以及函数声明 */ }，
    'this': {}
}
```

## 变量对象（VO）和活动对象（AO）
当当前上下文执行时，变量对象变成活动对象，所以区别只是同一对象在执行上下文的不同阶段而已

```javascript
funtion foo(i) {
    var a = 'hello'
    var b = function foo2() {}
    function c() {}
}
foo(10)

函数调用的创建阶段：

fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    this: { ... }
}

执行阶段：

fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```
## 提升
变量以及函数声明的提升，原理就在于解析器创建变量对象的过程，不啰嗦。

## 结语
知其然，知其所以然，想必是极好的