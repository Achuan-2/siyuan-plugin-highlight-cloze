import {
    Plugin,
    IModel,
} from "siyuan";
import "@/index.scss";

export default class DoctreeAutosort extends Plugin {

    customTab: () => IModel;

    async onload() {
        // 添加icon
        this.addIcons(`<symbol id="iconMarkHide"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
<path d="M134,100v34H26v-34h-12v46h132v-46h-12Z" style="fill: #212121;"/>
<path d="M62,89h36l8,21h14L87,30h-14l-33,80h14s8-21,8-21ZM80,43l14,36h-28l14-36Z" style="fill: #212121;"/>
</symbol>`);
        // 添加顶部栏按钮
        const topBarElement = this.addTopBar({
            icon: "iconMarkHide",
            title: this.i18n.hide,
            position: "right",
            callback: () => {
                if (topBarElement.style.backgroundColor === 'transparent' || !topBarElement.style.backgroundColor) {
                    topBarElement.style.backgroundColor = "var(--b3-toolbar-hover)";
                    document.body.classList.add('custom-highlight-hidden');
                    topBarElement.setAttribute('aria-label', this.i18n.show);
                } else {
                    topBarElement.style.backgroundColor = 'transparent';
                    document.body.classList.remove('custom-highlight-hidden');
                    topBarElement.setAttribute('aria-label', this.i18n.hide);
                }
            }
        });
    }
}
