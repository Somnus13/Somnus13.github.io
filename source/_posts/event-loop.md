---
title: JavaScript 事件循环笔记
date: 2019-01-24 14:23:06
categories:
    - js
tags:
    - event loop
---

Javascript 的单线程保证所有的任务都按照一定的规则顺序排队执行，这个规则就是 Event Loop 事件环。

{% asset_img E0FB63E15116C0F2360ADEF559043ECB.jpg [事件循环] %} 

* 主线程运行时，JavaScript 会产生堆和栈（执行栈）
* 主线程调用 webApi 产生的异步操作只要产生结果就塞入“任务队列”等待执行
* 主线程同步任务执行完毕，读取“任务队列”中任务放入执行栈执行
* 执行栈执行过程中会产生新的异步操作，产生新的循环

<!-- more -->

```js
console.log(1)
console.log(2)

setTimeout(function(){
  console.log(3)
  
  setTimeout(function(){
    console.log(4)
  }, 0)
  
}, 0)

setTimeout(function(){
  console.log(5)
  
  setTimeout(function(){
    console.log(6)
  }, 0)
  
}, 0)

console.log(7)

// 1 2 7 3 5 4 6
```

数字代表任务，同步先执行，任务 3，5 依次进入“任务队列”，后3，5 执行完后，4，6进入“任务队列”，故输出：

1，2，7，3，5，4，6

浏览器环境下
------

{% asset_img 43AB938C187A468855CB117E2ED6197C.png [浏览器环境下] %} 

```js
console.log(1)

setTimeout(function(){
  console.log(2)
  Promise.resolve(1).then(function(){
    console.log('promise')
  })
}, 0)

setTimeout(function(){
  console.log(3)
}, 0)

// 1 2 promise 3
```



Node 环境下
--------

{% asset_img DC7D572496B98DE6A516EC96DFC0A903.jpg [Node 环境下] %} 


区别于浏览器的事件循环：

* timer：此阶段执行 setTImeout 和 setInterval 预订的 callback
* I/O callback：除了 close 事件的 callbacks，timer 设定的 callbacks, setImmediate 设定的 callbacks 之外的 callback
* idle, prepare：node 内部
* poll：获取新的 I/O 事件，适当条件下 node 阻塞于此
* check：setImmediate() 设定的 callbacks
* close callback：例如：socke.on(‘close’, callback) 会在此执行

每一个阶段都有一个装有 callbacks 的 FIFO 队列，Event Loop 运行到指定阶段，node 会执行此段的 FIFO 队列。执行完成或执行数量超过上限，转入下阶段

### Process.nextTick

此方法不在上面的事件中，可以理解为微任务

执行时机为“当前执行栈”的尾部，下一次 Even tLoop（主线程读取“任务队列”）之前——触发回调函数，即它指定的任务发生在所有异步之前

区别于它的 setImmediate 方法则是在当前“任务队列”的尾部添加事件，也就是它指定的任务总会在下一次 Event Loop 时执行

```js
process.nextTick(function(){
  console.log('1');
  process.nextTick(function(){ console.log('2')})
});

setTimeout(function(){
  console.log('timeout');
}, 0)

// 1 2 timeout
// 注：多个 process.nextTick（不管是否嵌套）将全部在当前“执行栈”执行
```

### setTImeout 和 setImmediate

相似，取决于何时被调用。

* setImmediate 设计在 poll 阶段完成时执行，即 check 阶段
* setTImeout 设计在 poll 阶段空闲时，且设定时间到达后执行，在 timer 阶段

调用顺序取决于当前的 event loop 上下文，如果在异步 I/O callback 之外执行顺序不定

```js
var fs = require('fs')

fs.readFile(file, () => {
  setTimeout(() => { console.log('timeout') }, 0)
  setImmediate(() => { console.log('immediate') }, 0)
});

// immediate
// timeout
```

fs.readFile callback 执行完成后，程序设定了 timer 和 Immediate ，所以 poll 阶段不会被阻塞进入 check，后进入 timer。