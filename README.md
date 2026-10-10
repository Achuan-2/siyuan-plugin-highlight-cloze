# Highlight Cloze

## 🤔Background

While learning, we often encounter fill-in-the-blank questions and key points that need memorization. To aid in memorization, we can use the highlight cloze method to mark these key points and questions, ensuring we have truly remembered them.

## ✨Features

### Highlight Cloze Function
* **One-click toggle display mode**: 
  After highlighting text


  Click the plugin button at the top to hide/show all highlighted text

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空展示-2024-11-29.gif)

* **Hover preview**: In highlight cloze mode, hovering over the cloze text temporarily reveals the content
  
  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/高亮挖空悬浮显示-2024-11-29.gif)

### Block Cloze Function
Support for cloze processing of entire content blocks with the following operations:

- **Cloze operation**: Set or cancel block cloze through the block menu
- **Status toggle**: Click the top plugin button to uniformly toggle all cloze states
- **Interactive display**: After cloze, click the block to show content, click the ❌ in the top right corner to hide again

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2025-07-13_16-09-36-2025-07-13.png)

### Exportable Cloze PDF

When cloze mode is enabled, exporting to PDF preserves the highlight cloze and block cloze styles, making it convenient to print review and test materials

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_16-54-30-2024-11-29.png)

### Shortcut Key Support
* **Custom shortcut keys**: Support setting personalized shortcut key combinations (default is empty)

  ![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_21-08-49-2024-11-29.png)

## 🎨Custom CSS

The plugin supports customizing the visual effects of highlight cloze through CSS:

![](https://fastly.jsdelivr.net/gh/Achuan-2/PicBed/assets/PixPin_2024-11-29_15-44-28-2024-11-29.png)

Example: If you want the highlight cloze style to be a black underline, you can change the CSS in the settings to the following:

```css
/* Style for highlight cloze */
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
    background: none !important;
    border-bottom: 2px solid var(--b3-theme-on-background) !important;
}
/* Style for text when hovering over highlight cloze */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}
```

If you only want the exported PDF cloze style to be a black underline while keeping the original highlight style in SiYuan, you can set the style specifically for `#preview .protyle-wysiwyg span[data-type~='mark']`

```css
/* Style for highlight cloze */
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
}

/* Style for text when hovering over highlight cloze */
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}

/* Style for highlight cloze in exported PDF */
#preview .protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    border-bottom: 2px solid var(--b3-theme-on-background);
}
```

## ❤️ Tips Are Welcome

If you find this plugin useful, you're welcome to leave a tip or give the repository a star on GitHub. Your support helps me maintain and improve this plugin and develop new ones. Thank you for your support!

[Leave a tip](https://pancake.waffo.ai/store/achuan-2-fdbho4ye/product/PROD_3F7Aa7c2NQlz9KmxcgxjQ7?type=onetime&currency=USD)