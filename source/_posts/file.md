---
title: file对象什么的
date: 2017-07-24 21:38:44
categories:
    - html
tags:
    - file
---
## fileList对象和file对象

**html5** 中的 **input[type='file']** 的标签有 **multiple** 属性，允许用户选择多个文件，**fileList** 对象则是保存了这些文件的列表，列表每一项都是一个 **file** 对象  
### 属性
* **name** ：文件名
* **type** ：文件类型。图片类型可通过image/开头关键字限制只允许上传图片
* **size** ：文件大小</li>
* **lastModified** ：文件最后修改时间

**input:file** 对象中还存在一个 **accept** 属性，可以用来规定能够通过文件上传进行提交的文件类型。
 **accept="image/*"** 可以用来限制只允许上传图像格式。但是在 **Webkit** 浏览器下却出现了响应滞慢的问题，要等上好几秒才弹出文件选择框。
解决方法就是将 '*' 通配符改为指定的 **MIME** 类型。
### 应用

#### 多文件FileList
链接请戳  **[多文件fileList](/statics/file/file1.html)**

```html
<input type="file" id="files" accept="image/gif,image/jpeg,image/jpg,image/png" multiple>
<script>
    var elem = document.getElementById('files');
    elem.onchange = function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            // 文件类型为 image 并且文件大小小于 200kb
            if(files[i].type.indexOf('image/') > -1 && files[i].size < 204800){
                console.log(files[i].name + files[i].type);
            }
        }
    }
</script>
```

{% asset_img file1.png %} 

#### 文件预览
链接请戳 **[文件预览](/statics/file/file2.html)**
```

<input type="file" id="files" accept="image/jpeg,image/jpg,image/png">
<img src="blank.gif" id="preview">
<script>
    var elem = document.getElementById('files'),
        img = document.getElementById('preview');
    elem.onchange = function () {
        var files = elem.files,
            reader = new FileReader();
        if(files && files[0]){
            reader.onload = function (ev) {
                img.src = ev.target.result;
            }
            reader.readAsDataURL(files[0]);
        }
    }
</script>

```

{% asset_img file1.png %} 

## Blob对象

表示一个不可变，原始数据的类似文件对象。区别于 **mysql** 的 **blob** 类型（二进制容器），**html5** 中的 **blob** 对象除了可以存储二进制数据之外，还可设置数据的 **mime** 类型，从某种程度讲，实现了文件的存储。  
而 **html5** 中的 **file** 对象则是基于 **blob** 对象继承扩展而来。
### 构造函数
```
Blob(blobparts[,options])
```
所以需要关键字 **new** 来声明，旧式的 **BlobBuilder** 方法已经过时，不在讨论。
```html
<script>
var blob = new Blob(["Hello World!"],{type:"text/plain"});
console.log(blob)
</script>
```
### 属性
* **isClosed：bool** 是否为关闭状态，关闭状态的 **blob** 对象不可读
* **size**：数据大小
* **type**：字符串，表明对象包含数据的数据类型

<!--more-->

### 方法
**close()**  
关闭 **blob** 对象，释放底层资源

**slice([start[, end[, contentType]]])**  
返回一个新的包含源 **blob** 对象指定数据的 **blob** 对象

### 用法

#### 适用类型数组和blob创建一个url
```javascript
var typeArray = GetTheTypedArraySomehow();
//mime
var blob = new Blob([typeArray], {type:'application/octet-binary'});
// 会产生一个类似blob:d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
// 你可以像使用一个普通URL那样使用它，比如用在img.src上。
var url = URL.createObjectURL(blob);
```
事实上我并没得到这样的字符串，我觉得我可能被骗了。。
#### Blob中提取数据
```javascript
唯一方法是使用FileReader
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   // reader.result contains the contents of blob as a typed array
});
reader.readAsArrayBuffer(blob);
```
使用 FileReader 以外的方法读取到的内容可能会是字符串或是数据 URL。
```html
<canvas id="canvas" width="300" height="300"></canvas>
<script type="text/javascript">
    var canvas = document.getElementById('canvas');
    var blob = new Blob(['C:/Users/Administrator/Desktop/DC93J54VYAEKSLs.jpg'], {type:'image/png'})
    canvas.toBlob(function(blob){
        console.log(blob)

    })
</script>
```

#### 通过url下载文件
window.URL对象可以为BLob对象生成一个网络地址，结合a标签的download属性可以实现url下载文件。
```javascript
createDownload("download.txt","download file")
function createDownload(fileName, content){
    var blob = new Blob([content]);
    var link = document.createElement("a");
    link.innerHTML = fileName;
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    document.getElementsByTagName("body")[0].appendChild(link);
}
```
我们知道，img的src属性及background的url属性，都可以通过接收图片的网络地址或base64来显示图片，同样的，我们也可以把图片转化为Blob对象，生成URL（URL.createObjectURL(blob)），来显示图片。

Ps：就先写到这，剩下几个demo再说，感觉这个东西没这么简单。2017年7月24日22点27分
