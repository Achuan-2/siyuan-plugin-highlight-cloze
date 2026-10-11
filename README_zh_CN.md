# 挖空复习插件

## 🤔 背景

在学习过程中，我们经常需要处理填空题目和记忆知识点。为了有效检验学习效果，可以使用高亮挖空的方式来标记这些内容，通过隐藏关键信息来测试自己是否真正掌握了相关知识。

## ✨ 功能特性

### 高亮挖空功能
* **一键切换显示模式**：
  对文本进行高亮（使用思源里的“标记”功能）之后

  点击顶部插件按钮，即可隐藏/显示所有高亮文字
  
  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空展示-2024-11-29.gif)

* **悬浮预览**：高亮挖空模式下，鼠标悬浮在挖空文字上可临时显示内容
  
  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空悬浮显示-2024-11-29.gif)



### 块挖空功能
支持对整个内容块进行挖空处理，操作方式：

- **挖空操作**：通过块菜单设置或取消块挖空
- **状态切换**：点击顶部插件按钮统一切换所有挖空状态  
- **交互显示**：挖空后点击块可显示内容，点击右上角❌重新隐藏

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2025-07-13_16-09-36-2025-07-13.png)

### 可导出挖空的pdf

设置中的“PDF 导出样式”提供三种策略：默认“跟随挖空开关”，开启时保持高亮挖空和块挖空，关闭时显示内容；“保留高亮样式”始终显示答案并保留主题高亮；“高亮变为正常文字”始终显示答案并去掉高亮。后两种策略同时取消导出内容的块挖空，不改变编辑器中的挖空状态。修改设置或开关后，已打开的 PDF 导出预览需关闭后重新导出。

选择“跟随挖空开关”后，会显示“不挖空时清除高亮样式”选项，默认关闭。开启该选项后，关闭挖空时导出的 PDF 会将高亮文字显示为正常文字；开启挖空时仍使用挖空样式。
  
![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_16-54-30-2024-11-29.png)

### 快捷键支持
* **自定义快捷键**：支持设置个人习惯的快捷键组合（默认为空）

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_21-08-49-2024-11-29.png)

## 🎨 自定义样式


插件设置可直接选择“高亮”“下划线”“括号”挖空方式，高亮挖空背景、下划线和括号均使用“挖空颜色”，默认跟随主题文字颜色 `var(--b3-theme-on-background)`，也可选择自定义颜色。括号支持 `()`、`[]`、`【】`、`（）`、`{}`、`〈〉`，也可选择“自定义左右符号”并填写任意左右符号。挖空保留原文字占用的宽度，悬浮仍可显示答案。修改设置会即时预览；点击保存后保留，未保存直接关闭或取消则恢复原设置和样式。

选择“自定义 CSS”后，可继续通过 CSS 自定义高亮挖空的视觉效果；已有自定义 CSS 的用户会自动沿用该方式。块挖空样式仍由 CSS 控制。

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

/* 悬浮高亮挖空显示文字的样式 */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}

/* 导出pdf时高亮挖空的样式 */
#preview .protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    border-bottom: 2px solid var(--b3-theme-on-background);
}
```

## ❤️ 支持开发

如果这个插件对您有帮助，欢迎通过以下方式支持：
- 为GitHub仓库点星⭐
- 赞助支持持续开发

这将激励我继续完善此插件并开发更多实用工具。

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/20241128221208-2024-11-28.png)
