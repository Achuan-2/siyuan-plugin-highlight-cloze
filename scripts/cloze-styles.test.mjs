import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/cloze-styles.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
}).outputText;
const { buildClozeCSS, buildPDFCSS, CLOZE_DEFAULTS, cssString, getClozeColor } =
    await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const settings = { css: '', ...CLOZE_DEFAULTS };

test('自定义符号不能截断 CSS 字符串或导出的 style 元素', () => {
    const escaped = cssString('"\\\n</style><script>alert(1)</script>');
    assert.ok(!escaped.includes('</style>'));
    assert.ok(!escaped.includes('\n'));
    assert.ok(escaped.includes('\\22 '));
    assert.ok(escaped.includes('\\5c '));
    assert.equal(cssString('【'), '"【"');
    assert.equal(getClozeColor('#A1B2C3'), '#A1B2C3');
    assert.equal(CLOZE_DEFAULTS.clozeColor, 'var(--b3-theme-on-background)');
    assert.equal(getClozeColor(CLOZE_DEFAULTS.clozeColor), CLOZE_DEFAULTS.clozeColor);
    assert.equal(getClozeColor('--b3-theme-primary'), 'var(--b3-theme-primary)');
    assert.equal(getClozeColor('var(--b3-theme-primary)'), 'var(--b3-theme-primary)');
    assert.equal(getClozeColor('var(--color); color: red'), CLOZE_DEFAULTS.clozeColor);
    assert.equal(getClozeColor('red; color: black'), CLOZE_DEFAULTS.clozeColor);
});

test('PDF 策略只作用于导出页面，支持开关两种状态', () => {
    for (const pdfStyle of ['follow', 'highlight', 'normal']) {
        for (const isActive of [false, true]) {
            const css = buildPDFCSS({ ...settings, pdfStyle }, isActive);
            // 所有规则都限定于思源 PDF 的预览内容。
            for (const selector of css.matchAll(/([^{}]+)\{/g)) {
                assert.ok(selector[1].trim().startsWith('body[data-export-pdf] #preview '));
            }
            if (pdfStyle === 'follow') {
                assert.equal(css.includes('color: transparent !important'), isActive);
            } else {
                assert.ok(css.includes('opacity: 1 !important'));
                assert.ok(css.includes('content: none !important'));
                assert.ok(!css.includes('color: transparent !important'));
            }
        }
    }
});

test('跟随模式下仅在关闭挖空时按新选项清除高亮，默认保留', () => {
    assert.equal(CLOZE_DEFAULTS.pdfClearHighlight, false);
    const enabled = { ...settings, pdfClearHighlight: true };
    const cleared = buildPDFCSS(enabled, false);
    assert.ok(cleared.includes('background: transparent !important'));
    assert.ok(cleared.includes('color: inherit !important'));
    assert.ok(!cleared.includes('opacity: 1 !important'));
    assert.equal(buildPDFCSS(enabled, true), buildPDFCSS(settings, true));
    assert.ok(!buildPDFCSS(settings, false).includes('background: transparent !important'));
    assert.equal(buildPDFCSS({ ...settings, pdfClearHighlight: undefined }, false),
        buildPDFCSS(settings, false));
    for (const pdfStyle of ['highlight', 'normal']) {
        for (const isActive of [false, true]) {
            assert.equal(buildPDFCSS({ ...enabled, pdfStyle }, isActive),
                buildPDFCSS({ ...settings, pdfStyle }, isActive));
        }
    }
});

test('高级 CSS 沿用用户样式，PDF 仍禁止悬浮显示答案', () => {
    const custom = { ...settings, clozeStyle: 'custom' };
    assert.equal(buildClozeCSS(custom), '');
    assert.ok(buildPDFCSS(custom, true).includes(':hover *'));
});

test('中英文设置键与默认设置一致', () => {
    const languages = ['zh_CN', 'en_US'].map(language => JSON.parse(
        readFileSync(new URL(`../public/i18n/${language}.json`, import.meta.url), 'utf8'),
    ));
    for (const language of languages) {
        for (const key of Object.keys(settings)) {
            assert.ok(language.settings[key].title);
            assert.ok(language.settings[key].description);
        }
    }
    for (const key of ['clozeStyle', 'bracketStyle', 'pdfStyle']) {
        assert.deepEqual(Object.keys(languages[0].settings[key].options),
            Object.keys(languages[1].settings[key].options));
    }
});
