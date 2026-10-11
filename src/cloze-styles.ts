export type ClozeStyle = 'highlight' | 'underline' | 'brackets' | 'custom';
export type PDFStyle = 'follow' | 'highlight' | 'normal';
export const THEME_HIGHLIGHT_COLOR = 'var(--b3-protyle-inline-mark-background)';

export interface ClozeSettings {
    css: string;
    clozeStyle: ClozeStyle;
    clozeColor: string;
    bracketStyle: string;
    customLeftBracket: string;
    customRightBracket: string;
    pdfStyle: PDFStyle;
    pdfClearHighlight: boolean;
}

export const CLOZE_DEFAULTS = {
    clozeStyle: 'highlight' as ClozeStyle,
    clozeColor: 'var(--b3-theme-on-background)',
    bracketStyle: '()',
    customLeftBracket: '【',
    customRightBracket: '】',
    pdfStyle: 'follow' as PDFStyle,
    pdfClearHighlight: false,
};

const ROOTS = ['.b3-typography', '.protyle-wysiwyg'];
const MARKS = ['mark', 'span[data-type~="mark"]'];

function markSelectors(scope: string, suffix = ''): string {
    return ROOTS.flatMap(root => MARKS.map(mark => `${scope}${root} ${mark}${suffix}`)).join(',\n');
}

// 用户输入只作为 CSS 字符串使用，转义引号、换行及 HTML 结束标签，确保导出安全。
export function cssString(value: string): string {
    return `"${Array.from(value).map(char => {
        const code = char.codePointAt(0)!;
        return code < 32 || char === '"' || char === '\\' || char === '<'
            ? `\\${code.toString(16)} ` : char;
    }).join('')}"`;
}

export function getClozeColor(value: string): string {
    const color = typeof value === 'string' ? value.trim() : '';
    if (/^#[\da-f]{6}$/i.test(color) || /^var\(--[a-zA-Z_][\w-]*\)$/.test(color)) return color;
    if (/^--[a-zA-Z_][\w-]*$/.test(color)) return `var(${color})`;
    return CLOZE_DEFAULTS.clozeColor;
}

function brackets(settings: ClozeSettings): [string, string] {
    const pairs: Record<string, [string, string]> = {
        '()': ['(', ')'], '[]': ['[', ']'], '【】': ['【', '】'],
        '（）': ['（', '）'], '{}': ['{', '}'], '〈〉': ['〈', '〉'],
    };
    return settings.bracketStyle === 'custom'
        ? [settings.customLeftBracket, settings.customRightBracket]
        : pairs[settings.bracketStyle] || pairs['()'];
}

/** 仅生成展示样式，保留原文字、排版宽度及文档数据。 */
export function buildClozeCSS(settings: ClozeSettings, scope = '', revealOnHover = true): string {
    if (settings.clozeStyle === 'custom') return '';
    const color = getClozeColor(settings.clozeColor);
    const selector = markSelectors(scope);
    const hover = markSelectors(scope, ':hover');
    let css = `${selector} {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
    text-decoration: none !important;
    transition: color 0.2s ease;
}
${markSelectors(scope, ' *')} {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
    text-decoration: none !important;
}`;

    if (settings.clozeStyle === 'highlight') {
        css += `\n${selector} {
    background-color: ${color} !important;
    border-bottom: none !important;
}`;
    } else {
        css += `\n${selector} {
    background: transparent !important;
    border-bottom: ${settings.clozeStyle === 'underline' ? `2px solid ${color}` : 'none'} !important;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
}`;
    }

    if (settings.clozeStyle === 'brackets') {
        const [left, right] = brackets(settings);
        css += `\n${markSelectors(scope, '::before')} { content: ${cssString(left)} !important; }
${markSelectors(scope, '::after')} { content: ${cssString(right)} !important; }
${markSelectors(scope, '::before')},
${markSelectors(scope, '::after')} {
    color: ${color} !important;
    -webkit-text-fill-color: ${color} !important;
    text-shadow: none !important;
}`;
    } else {
        css += `\n${markSelectors(scope, '::before')},
${markSelectors(scope, '::after')} { content: none !important; }`;
    }

    if (revealOnHover) {
        const revealColor = settings.clozeStyle === 'highlight'
            ? 'var(--b3-protyle-inline-mark-color)' : 'var(--b3-theme-on-background)';
        css += `\n${hover},
${markSelectors(scope, ':hover *')} {
    color: ${revealColor} !important;
    -webkit-text-fill-color: ${revealColor} !important;
}`;
    }
    return css;
}

/** 思源把 snippetCSS 样式复制到 PDF 预览页，此处只作用于该页面。 */
export function buildPDFCSS(settings: ClozeSettings, isActive: boolean): string {
    const scope = 'body[data-export-pdf] #preview ';
    const selector = markSelectors(scope);
    let css = '';
    const clearHighlight = settings.pdfStyle === 'follow' && !isActive && settings.pdfClearHighlight;
    if (settings.pdfStyle === 'follow' && !clearHighlight) {
        if (isActive) {
            css += buildClozeCSS(settings, scope, false);
            // 即使使用高级 CSS，也避免导出预览时悬浮泄露答案。
            css += `\n${selector},\n${markSelectors(scope, ':hover')},
${markSelectors(scope, ' *')},\n${markSelectors(scope, ':hover *')} {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
    text-decoration: none !important;
}`;
        }
    } else {
        const highlight = settings.pdfStyle === 'highlight';
        css += `${selector},\n${markSelectors(scope, ':hover')} {
    color: ${highlight ? 'var(--b3-protyle-inline-mark-color)' : 'inherit'} !important;
    -webkit-text-fill-color: currentColor !important;
    background: ${highlight ? 'var(--b3-protyle-inline-mark-background)' : 'transparent'} !important;
    border: none !important;
    text-shadow: none !important;
}
${markSelectors(scope, ' *')},\n${markSelectors(scope, ':hover *')} {
    color: inherit !important;
    -webkit-text-fill-color: currentColor !important;
}
${markSelectors(scope, '::before')},\n${markSelectors(scope, '::after')} {
    content: none !important;
}`;
        // 两种始终显示答案的策略也取消块挖空；跟随模式仅清除高亮。
        if (settings.pdfStyle !== 'follow') css += `\n${scope}[data-node-id][custom-hide="true"] {
    transform: none !important;
    background: transparent !important;
    border: none !important;
}
${scope}[data-node-id][custom-hide="true"] * { opacity: 1 !important; }`;
    }
    return `${css}\n${scope}.cloze-hide-btn { display: none !important; }`;
}
