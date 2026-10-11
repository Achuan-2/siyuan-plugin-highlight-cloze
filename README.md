# Highlight Cloze: Turn Your SiYuan into Fill-in-the-Blank Exercises for Active Recall

<img alt="preview-en" src="https://fastly.jsdelivr.net/gh/Achuan-2/PicBed@pic/assets/preview-en-20261011153910-1ybipl2.png" />

Github: [https://github.com/Achuan-2/siyuan-plugin-highlight-cloze](https://github.com/Achuan-2/siyuan-plugin-highlight-cloze/tree/main)

## 🤔 Background

While learning, we often encounter fill-in-the-blank questions and key points that need memorization. To aid in memorization, we can use the highlight cloze method to mark these key points and questions, ensuring we have truly remembered them.

## ✨ Features

### Highlight Cloze Function

- **One-click toggle display mode**:  
  After highlighting text, click the plugin button at the top to hide/show all highlighted text

  <img alt="PixPin_2026-10-11_15-44-27" src="https://fastly.jsdelivr.net/gh/Achuan-2/PicBed@pic/assets/PixPin_2026-10-11_15-44-27-20261011154438-3wzyhav.gif" />
- **Hover preview**: In highlight cloze mode, hovering over the cloze text temporarily reveals the content

  <img alt="PixPin_2026-10-11_15-45-08" src="https://fastly.jsdelivr.net/gh/Achuan-2/PicBed@pic/assets/PixPin_2026-10-11_15-45-08-20261011154514-xcrha3w.gif" />

### Block Cloze Function

Support for cloze processing of entire content blocks with the following operations:

- **Cloze operation**: Set or cancel block cloze through the block menu
- **Status toggle**: Click the top plugin button to uniformly toggle all cloze states
- **Interactive display**: After cloze, click the block to show content, click the ❌ in the top right corner to hide again

<img alt="PixPin_2026-10-11_15-51-30" src="https://fastly.jsdelivr.net/gh/Achuan-2/PicBed@pic/assets/PixPin_2026-10-11_15-51-30-20261011155134-e72c076.gif" />

### Exportable Cloze PDF

PDF export has three policies: **Follow cloze toggle** (default) hides answers when enabled and shows them when disabled; **Keep highlights** always shows answers with theme highlights; **Convert highlights to normal text** always shows answers without highlights. The last two policies also reveal hidden blocks in the PDF and leave the editor state unchanged. Close and reopen an existing PDF export preview after changing settings or toggling cloze mode.

Selecting **Follow cloze toggle** shows **Clear highlights when cloze is off**, disabled by default. Enable it to export highlighted text as normal text when cloze is off. Cloze styles still apply when cloze is on.

<img alt="PixPin_2026-10-11_15-48-24" src="https://fastly.jsdelivr.net/gh/Achuan-2/PicBed@pic/assets/PixPin_2026-10-11_15-48-24-20261011154829-v1gjsu5.png" />

### Shortcut Key Support

**Custom shortcut keys**: Support setting personalized shortcut key combinations (default is empty)

<img alt="PixPin_2026-10-11_15-52-25" src="https://fastly.jsdelivr.net/gh/Achuan-2/PicBed@pic/assets/PixPin_2026-10-11_15-52-25-20261011155232-5gqwog2.png" />

## 🎨 Custom Style

Choose **Highlight**, **Underline**, or **Brackets** directly in settings. Highlight cloze backgrounds, underlines and brackets use **Cloze color**, defaulting to the theme text color, ​`var(--b3-theme-on-background)`​. You can also select a custom color. Brackets include ​`()`​, ​`[]`​, ​`【】`​, ​`（）`​, ​`{}`​, and ​`〈〉`, plus custom left/right symbols. Blanks retain the original text width and reveal answers on hover. Changes preview immediately. Save to keep them; closing or cancelling without saving restores the previous settings and styles.

Choose **Custom CSS** to customize highlight clozes through CSS. Existing users with modified CSS automatically retain this mode. Block cloze styles remain controlled by CSS.

## ❤️ Buy me a coffee

If you find this plugin useful, you're welcome to buy me a coffee. Your support helps me maintain and improve this plugin and develop new ones.

[Buy me a coffee](https://pancake.waffo.ai/store/achuan-2-fdbho4ye/product/PROD_3F7Aa7c2NQlz9KmxcgxjQ7?type=onetime&currency=USD)
