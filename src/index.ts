import { Plugin, IModel } from "siyuan";
import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "config";

export default class MarkHide extends Plugin {
    private isActive: boolean = false;
    private settingUtils: SettingUtils;
    private styleElement: HTMLStyleElement;
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
    }

    async onload() {
        // Create style element
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'snippetCSS-Markhide';
        document.head.appendChild(this.styleElement);

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
<path d="M134,100v34H26v-34h-12v46h132v-46h-12Z" style="fill: #212121;"/>
<path d="M62,89h36l8,21h14L87,30h-14l-33,80h14s8-21,8-21ZM80,43l14,36h-28l14-36Z" style="fill: #212121;"/>
</symbol>`);

        // Modify top bar callback
        const topBarElement = this.addTopBar({
            icon: "iconMarkHide",
            title: this.i18n.hide,
            position: "right",
            callback:  async () => {
                // Initialize settings
                await this.settingUtils.load();
                if (!this.isActive) {
                    topBarElement.style.backgroundColor = "var(--b3-toolbar-hover)";
                    this.isActive = true;
                    this.styleElement.textContent = this.settingUtils.get('css');
                    topBarElement.setAttribute('aria-label', this.i18n.show);
                } else {
                    topBarElement.style.backgroundColor = 'transparent';
                    this.isActive = false;
                    this.styleElement.textContent = '';
                    topBarElement.setAttribute('aria-label', this.i18n.hide);
                }
            }
        });
    }

    onunload() {
        // Clean up style element when plugin is unloaded
        this.styleElement?.remove();
    }
}
