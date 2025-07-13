import { Plugin, IModel } from "siyuan";
import { setBlockAttrs, getBlockAttrs } from './api'
import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "config";
const STATE_FILE = "cloze-state.json";
export default class MarkHide extends Plugin {
    private isActive: boolean = false;
    private settingUtils: SettingUtils;
    private styleElement: HTMLStyleElement;
    private blockStyleElement: HTMLStyleElement;
    private topBarElement;
    private readonly HIDE_STYLES = `/* 高亮挖空的样式 */
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

/* ------------------ 自定义属性 ----------------------- */

.protyle-wysiwyg [data-node-id][custom-hide="true"]{
    border: 2px dashed  rgba(92, 135, 138, 0.322) !important;
    background-color: rgba(92, 135, 138, 0.222);
    background-image: -webkit-gradient(linear,
    0 0, 100% 100%,
    color-stop(.25, rgba(255, 255, 255, .2)),
    color-stop(.25, transparent),
    color-stop(.5, transparent),
    color-stop(.5, rgba(255, 255, 255, .2)),
    color-stop(.75, rgba(255, 255, 255, .2)),
    color-stop(.75, transparent),
    to(transparent));
    background-size: 10px 10px;
    border-radius: 0.5em;
    transform: perspective(1000px) rotateX(180deg);
    transform-style: preserve-3d;
    transition: transform 0.6s ease-in-out, background-color 0.6s ease-in-out, border-color 0.6s ease-in-out, background-image 0.6s ease-in-out;
    cursor: pointer;
    position: relative;
}

.protyle-wysiwyg [data-node-id][custom-hide="true"] *{
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
}

.protyle-wysiwyg [data-node-id][custom-hide="true"].cloze-revealed{
    transform: perspective(1000px) rotateX(0deg);
    background-color: transparent;
    background-image: none;
    border-color: var(--b3-theme-on-background);
    cursor: default;
}

.protyle-wysiwyg [data-node-id][custom-hide="true"].cloze-revealed * {
    opacity: 1;
}

.protyle-wysiwyg .protyle-wysiwyg__embed [data-node-id][custom-hide="true"].cloze-revealed{
    transform: perspective(1000px) rotateX(0deg);
    background-color: transparent;
    background-image: none;
    border-color: var(--b3-theme-on-background);
}

.protyle-wysiwyg .protyle-wysiwyg__embed [data-node-id][custom-hide="true"].cloze-revealed * {
    opacity: 1;
}

/* 隐藏按钮样式 */
.cloze-hide-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background-color: var(--b3-theme-error);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0.8;
    transition: opacity 0.2s ease;
}

.cloze-hide-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.cloze-hide-btn::before {
    content: "×";
    font-weight: bold;
}
    `;

    private readonly BLOCK_BORDER_ONLY_STYLES = `/* 块挖空只有虚线描边的样式 */
.protyle-wysiwyg [data-node-id][custom-hide="true"]{
    border: 2px dashed rgba(92, 135, 138, 0.7) !important;
    border-radius: 0.5em;
}
    `;
    private getDefaultSettings() {
        return {
            css: this.HIDE_STYLES,
        };
    }

    customTab: () => IModel;

    updateCSS(css: string) {
        if (this.isActive) {
            this.styleElement.textContent = css;
        }
        this.updateBlockStyles();
    }

    private updateBlockStyles() {
        if (this.isActive) {
            // 如果激活状态，使用完整的块挖空样式（从CSS中提取块相关部分）
            const blockStyles = this.extractBlockStyles(this.settingUtils.get('css') || this.HIDE_STYLES);
            this.blockStyleElement.textContent = blockStyles;
        } else {
            // 如果未激活，只显示虚线描边
            this.blockStyleElement.textContent = this.BLOCK_BORDER_ONLY_STYLES;
        }
    }

    private extractBlockStyles(fullCSS: string): string {
        // 提取块相关的样式
        const lines = fullCSS.split('\n');
        let inBlockSection = false;
        let blockStyles = '';

        for (const line of lines) {
            if (line.includes('自定义属性') || line.includes('custom-hide')) {
                inBlockSection = true;
            }
            if (inBlockSection) {
                blockStyles += line + '\n';
            }
        }

        return blockStyles || `
.protyle-wysiwyg [data-node-id][custom-hide="true"]{
    border: 2px dashed  rgba(92, 135, 138, 0.322);
    background-color: rgba(92, 135, 138, 0.322);
    background-image: -webkit-gradient(linear,
    0 0, 100% 100%,
    color-stop(.25, rgba(255, 255, 255, .2)),
    color-stop(.25, transparent),
    color-stop(.5, transparent),
    color-stop(.5, rgba(255, 255, 255, .2)),
    color-stop(.75, rgba(255, 255, 255, .2)),
    color-stop(.75, transparent),
    to(transparent));
    background-size: 10px 10px;
    border-radius: 0.5em;
    transform: perspective(1000px) rotateX(180deg);
    transform-style: preserve-3d;
    transition: transform 0.6s ease-in-out, background-color 0.6s ease-in-out, border-color 0.6s ease-in-out, background-image 0.6s ease-in-out;
    cursor: pointer;
    position: relative;
}

.protyle-wysiwyg [data-node-id][custom-hide="true"] *{
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
}

.protyle-wysiwyg [data-node-id][custom-hide="true"].cloze-revealed{
    transform: perspective(1000px) rotateX(0deg);
    background-color: transparent;
    background-image: none;
    border-color: var(--b3-theme-on-background);
    cursor: default;
}

.protyle-wysiwyg [data-node-id][custom-hide="true"].cloze-revealed * {
    opacity: 1;
}

.protyle-wysiwyg .protyle-wysiwyg__embed [data-node-id][custom-hide="true"].cloze-revealed{
    transform: perspective(1000px) rotateX(0deg);
    background-color: transparent;
    background-image: none;
    border-color: var(--b3-theme-on-background);
}

.protyle-wysiwyg .protyle-wysiwyg__embed [data-node-id][custom-hide="true"].cloze-revealed * {
    opacity: 1;
}

/* 隐藏按钮样式 */
.cloze-hide-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background-color: var(--b3-theme-error);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0.8;
    transition: opacity 0.2s ease;
}

.cloze-hide-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.cloze-hide-btn::before {
    content: "×";
    font-weight: bold;
}
        `;
    }


    async onLayoutReady() {
        // Create style element
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'snippetCSS-Markhide';
        document.head.appendChild(this.styleElement);

        // Create block style element
        this.blockStyleElement = document.createElement('style');
        this.blockStyleElement.id = 'snippetCSS-BlockHide';
        document.head.appendChild(this.blockStyleElement);
        // 默认显示虚线描边样式
        this.blockStyleElement.textContent = this.BLOCK_BORDER_ONLY_STYLES;

        // 初始化设置
        this.settingUtils = new SettingUtils({
            plugin: this,
            name: STORAGE_NAME,
        });
        this.settingUtils.addItem({
            key: "css",
            value: this.HIDE_STYLES,
            type: "textarea",
            title: this.i18n.settings.css.title,
            description: this.i18n.settings.css.description,
            action: {
                callback: () => {
                    const newCSS = this.settingUtils.take('css');
                    if (newCSS) {
                        this.updateCSS(newCSS);
                    }
                }
            }
        });

        // Reset Settings Button
        this.settingUtils.addItem({
            key: "resetConfig",
            value: "",
            type: "button",
            title: this.i18n.settings.reset?.title || "Reset Settings",
            description: this.i18n.settings.reset?.description || "Reset all settings to default values",
            button: {
                label: this.i18n.settings.reset?.label || "Reset",
                callback: async () => {
                    // if (confirm(this.i18n.settings.reset.confirm)) {
                    const defaultSettings = this.getDefaultSettings();
                    // Update each setting item's value and UI element  只是UI改了，json的值没有改，所以不点击保存可以反悔
                    for (const [key, value] of Object.entries(defaultSettings)) {
                        await this.settingUtils.set(key, '');
                        // 等0.2秒，有一个刷新效果
                        await new Promise((resolve) => setTimeout(resolve, 200));
                        await this.settingUtils.set(key, value);
                    }

                }
            }
        });


        // 添加icon
        this.addIcons(`<symbol id="iconMarkHide"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
<path d="M134,100v34H26v-34h-12v46h132v-46h-12Z" style="fill: var(--b3-theme-on-backgound);"/>
<path d="M62,89h36l8,21h14L87,30h-14l-33,80h14s8-21,8-21ZM80,43l14,36h-28l14-36Z" style="fill: var(--b3-theme-on-backgound);"/>
</symbol>`);

        // Modify top bar callback
        this.topBarElement = this.addTopBar({
            icon: "iconMarkHide",
            title: this.i18n.hide,
            position: "right",
            callback: () => this.toggleCloze()
        });

        // 加载保存的状态
        await this.loadClozeState();

        // 注册快捷键
        this.addCommand({
            langKey: this.i18n.toggle, // 用于区分不同快捷键的 key
            langText: this.i18n.toggle, // 命令面板显示的文字
            hotkey: "",
            callback: () => this.toggleCloze(),
        });

        // 添加块菜单
        this.eventBus.on("click-blockicon", this.blockIconEventHandler.bind(this));

        // 添加点击事件监听器
        this.addClickListener();
    }
    private async loadClozeState() {
        try {
            const stateData = await this.loadData(STATE_FILE);
            if (stateData && stateData.isActive !== undefined) {
                this.isActive = stateData.isActive;

                // 根据加载的状态初始化UI和样式
                if (this.isActive) {
                    // 确保settingUtils已加载
                    await this.settingUtils.load();
                    this.topBarElement.style.backgroundColor = "var(--b3-toolbar-hover)";
                    this.styleElement.textContent = this.settingUtils.get('css') || this.HIDE_STYLES;
                    this.topBarElement.setAttribute('aria-label', this.i18n.show);
                } else {
                    this.topBarElement.style.backgroundColor = 'transparent';
                    this.styleElement.textContent = '';
                    this.topBarElement.setAttribute('aria-label', this.i18n.hide);
                }

                // 更新块样式
                this.updateBlockStyles();
            }
        } catch (error) {
            console.log('Failed to load cloze state:', error);
            // 如果加载失败，使用默认状态（false）
            this.isActive = false;
        }
    }
    private async saveClozeState() {
        try {
            await this.saveData(STATE_FILE, {
                isActive: this.isActive
            });
        } catch (error) {
            console.error('Failed to save cloze state:', error);
        }
    }
    private addClickListener() {
        document.addEventListener('click', this.handleClozeClick.bind(this));
    }

    private handleClozeClick(event: Event) {
        const target = event.target as HTMLElement;

        // 如果点击的是隐藏按钮，不处理
        if (target.classList.contains('cloze-hide-btn')) {
            return;
        }

        const clozeBlock = target.closest('[data-node-id][custom-hide="true"]') as HTMLElement;

        if (clozeBlock && this.isActive) {
            // 只处理显示，不处理隐藏
            if (!clozeBlock.classList.contains('cloze-revealed')) {
                event.preventDefault();
                event.stopPropagation();

                clozeBlock.classList.add('cloze-revealed');
                this.addHideButton(clozeBlock);
            }
        }
    }

    private addHideButton(clozeBlock: HTMLElement) {
        // 避免重复添加按钮
        if (clozeBlock.querySelector('.cloze-hide-btn')) {
            return;
        }

        const hideBtn = document.createElement('button');
        hideBtn.className = 'cloze-hide-btn';
        hideBtn.title = '隐藏挖空';

        hideBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            clozeBlock.classList.remove('cloze-revealed');
            hideBtn.remove();
        });

        clozeBlock.appendChild(hideBtn);
    }

    private async blockIconEventHandler({ detail }) {
        const blockElements = detail.blockElements;
        if (!blockElements || blockElements.length === 0) return;

        // 检查所有选中块的挖空状态
        let hiddenCount = 0;
        let totalCount = blockElements.length;

        for (const blockElement of blockElements) {
            const isHidden = blockElement.getAttribute('custom-hide') === 'true';
            if (isHidden) {
                hiddenCount++;
            }
        }

        // 根据状态决定菜单文本和操作
        let menuLabel: string;
        let shouldHide: boolean;

        if (hiddenCount === 0) {
            // 全部未挖空，显示"挖空"
            menuLabel = this.i18n.blockCloze;
            shouldHide = true;
        } else if (hiddenCount === totalCount) {
            // 全部已挖空，显示"取消挖空"
            menuLabel = this.i18n.blockShow;
            shouldHide = false;
        } else {
            // 部分挖空，显示"挖空"（统一设为挖空状态）
            menuLabel = this.i18n.blockCloze;
            shouldHide = true;
        }

        // 添加块挖空菜单项
        detail.menu.addItem({
            icon: "iconMarkHide",
            label: menuLabel,
            click: () => this.toggleMultipleBlocksCloze(blockElements, shouldHide)
        });
    }

    private async toggleMultipleBlocksCloze(blockElements: Element[], shouldHide: boolean) {
        try {
            for (const blockElement of blockElements) {
                const blockId = blockElement.getAttribute('data-node-id');
                if (!blockId) continue;

                if (shouldHide) {
                    // 添加挖空
                    await setBlockAttrs(blockId, { 'custom-hide': 'true' });
                } else {
                    // 取消挖空
                    await setBlockAttrs(blockId, { 'custom-hide': '' });
                }
            }
        } catch (error) {
            console.error('Toggle multiple blocks cloze failed:', error);
        }
    }

    async toggleCloze() {
        await this.settingUtils.load();
        if (!this.isActive) {
            this.topBarElement.style.backgroundColor = "var(--b3-toolbar-hover)";
            this.isActive = true;
            this.styleElement.textContent = this.settingUtils.get('css');
            this.topBarElement.setAttribute('aria-label', this.i18n.show);
        } else {
            this.topBarElement.style.backgroundColor = 'transparent';
            this.isActive = false;
            this.styleElement.textContent = '';
            this.topBarElement.setAttribute('aria-label', this.i18n.hide);
        }
        // 更新块样式
        this.updateBlockStyles();

        // 保存当前状态
        await this.saveClozeState();
    }

    onunload() {
        // Clean up style elements when plugin is unloaded
        this.styleElement?.remove();
        this.blockStyleElement?.remove();
        // 移除点击事件监听器
        document.removeEventListener('click', this.handleClozeClick.bind(this));
    }

    uninstall() {
        // Clean up style elements when plugin is uninstall
        this.styleElement?.remove();
        this.blockStyleElement?.remove();
        // 移除点击事件监听器
        document.removeEventListener('click', this.handleClozeClick.bind(this));
    }
}
