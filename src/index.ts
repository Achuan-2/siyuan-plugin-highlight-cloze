import { Plugin, IModel } from "siyuan";
import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "config";

export default class MarkHide extends Plugin {
    private settingUtils: SettingUtils;
    private styleElement: HTMLStyleElement;
    private readonly HIDE_STYLES = `
.b3-typography mark,
.b3-typography span[data-type~=mark],
.protyle-wysiwyg mark,
.protyle-wysiwyg span[data-type~='mark'] {
    color: transparent !important;
    transition: color 0.5s ease-in-out;
}
.b3-typography mark:hover,
.b3-typography span[data-type~=mark]:hover,
.protyle-wysiwyg mark:hover,
.protyle-wysiwyg span[data-type~='mark']:hover {
    color: var(--b3-protyle-inline-mark-color) !important;
    transition: color 0.5s ease-in-out;
}
    `;
    customTab: () => IModel;


    async onload() {
        // Create style element
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'snippetCSS-Markhide';
        document.head.appendChild(this.styleElement);

        this.settingUtils = new SettingUtils({
            plugin: this, name: STORAGE_NAME
        });
        this.settingUtils.addItem({
            key: "css",
            value: this.HIDE_STYLES,
            type: "textarea",
            title: this.i18n.settings.css.title,
            description: this.i18n.settings.css.description,
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
                if (topBarElement.style.backgroundColor === 'transparent' || !topBarElement.style.backgroundColor) {
                    topBarElement.style.backgroundColor = "var(--b3-toolbar-hover)";
                    
                    this.styleElement.textContent = this.settingUtils.get('css');
                    topBarElement.setAttribute('aria-label', this.i18n.show);
                } else {
                    topBarElement.style.backgroundColor = 'transparent';
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
