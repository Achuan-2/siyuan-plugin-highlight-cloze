# 高亮挖空


## 🤔背景

在学习过程中，我们经常会遇到一些需要填空的题目、需要记忆的知识点，为了方便记忆，我们可以使用高亮挖空的方式来标记这些知识点和题目，确认是否自己真的记住了这些内容。


## ✨功能

* ✨点击顶部的插件按钮，即可隐藏/显示高亮文字。

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空展示-2024-11-29.gif)
* ✨高亮挖空模式下，鼠标悬浮挖空文字可显示高亮文字。
  
  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空悬浮显示-2024-11-29.gif)
* ✨高亮挖空模式下，导出pdf能保持高亮挖空样式，这样就能打印挖空的文档来制作题目用于复习和测试。

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_16-54-30-2024-11-29.png)
* ✨支持设置快捷键，默认为空

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_21-08-49-2024-11-29.png)


## 🎨自定义css

支持自定义高亮挖空的样式

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_15-44-28-2024-11-29.png)

举例：如果你想要高亮挖空的样式是黑色下划线，可以把设置里的css改为下面的内容

```css
/* 高亮挖空的样式 */
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
    background: none !important;
    border-bottom: 2px solid var(--b3-theme-on-background) !important;
}
/* 悬浮高亮挖空显示文字的样式 */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}
```

如果你只是希望导出pdf的挖空样式是黑色下划线，在思源里还是原来的高亮样式，可以单独对`#preview .protyle-wysiwyg span[data-type~='mark']`设置样式

```css
/* 高亮挖空的样式 */
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
}
#preview .protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    border-bottom: 2px solid var(--b3-theme-on-background);
}
/* 悬浮高亮挖空显示文字的样式 */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}
  
```


## ❤️用爱发电

穷苦研究生在读ing，如果喜欢我的插件，欢迎给GitHub仓库点star和捐赠，这会激励我继续完善此插件和开发新插件。

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/20241128221208-2024-11-28.png)