# Highlight Cloze

## 🤔Background

While learning, we often encounter fill-in-the-blank questions and key points that need memorization. To aid in memorization, we can use the highlight cloze method to mark these key points and questions, ensuring we have truly remembered them.

## ✨Features

* ✨Click the plugin button at the top to toggle the visibility of highlighted text.

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空展示-2024-11-29.gif)
* ✨In highlight cloze mode, hovering over the cloze text reveals the highlighted content.
  
  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空悬浮显示-2024-11-29.gif)
* ✨When exporting to PDF in highlight cloze mode, the style is preserved, allowing you to print the document for review and testing.

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_16-54-30-2024-11-29.png)
* ✨Support setting shortcut keys, default is empty

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_21-08-49-2024-11-29.png)

## 🎨Custom CSS

Custom highlight cloze styles are supported.

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_15-44-28-2024-11-29.png)


Example: 

If you want the text with a hollow highlight style to have a black underline, you can modify the CSS in the settings as follows:

```css
/* Style for text with  cloze */
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
    background: none !important;
    border-bottom: 2px solid var(--b3-theme-on-background) !important;
}
/* Style for text when hovering over cloze */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}
```

If you want the exported PDF to have the hollow style with a black underline, while keeping the original highlight style in the Siyuan application, you can set the style specifically for `#preview .protyle-wysiwyg span[data-type~='mark']`

```css
/* Style for text with cloze*/
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
}

/* Style for text when hovering over cloze */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}

/* Style for cloze in exported PDF */
#preview .protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    border-bottom: 2px solid var(--b3-theme-on-background);
}
```



## ❤️Powered by Love

If you like my plugin, please consider starring the GitHub repository and donating if possible. This will motivate me to continue improving this plugin and developing new ones.

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/20241128221208-2024-11-28.png)
