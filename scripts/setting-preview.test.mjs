import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const moduleURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const mockSiyuan = moduleURL(`export class Setting {
    items = [];
    constructor(options) { this.options = options; }
    addItem(item) { this.items.push(item); }
}`);
const source = readFileSync(new URL('../src/libs/setting-utils.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
}).outputText.replace(/from ['"]siyuan['"]/, `from '${mockSiyuan}'`);
const { SettingUtils } = await import(moduleURL(compiled));

class Control extends EventTarget {
    constructor(value) {
        super();
        this.value = value;
    }
}

async function fixture() {
    const initial = { style: 'highlight', color: '#112233', css: 'original CSS' };
    const writes = [];
    let previewCount = 0;
    let displayed = { ...initial };
    const plugin = {
        data: {},
        loadData: async () => ({ ...initial }),
        saveData: async (file, data) => writes.push({ file, data: { ...data } }),
    };
    const utils = new SettingUtils({
        plugin,
        name: 'config',
        previewCallback: data => { displayed = data; previewCount++; },
        callback: data => { displayed = data; },
        closeCallback: () => { displayed = utils.dump(); },
    });
    for (const [key, value] of Object.entries(initial)) {
        utils.addItem({
            key, value, type: 'custom', title: key, description: '',
            createElement: current => new Control(current),
            getEleVal: element => element.value,
            setEleVal: (element, current) => { if (element) element.value = current; },
        });
    }
    await utils.load();
    const open = () => plugin.setting.items.forEach(item => item.createActionElement());
    const edit = (key, value, event = 'input') => {
        const element = utils.getElement(key);
        element.value = value;
        element.dispatchEvent(new Event(event));
    };
    return { initial, writes, plugin, utils, open, edit,
        displayed: () => displayed, previewCount: () => previewCount };
}

test('输入及下拉更改即时预览，未保存关闭时恢复且不写入配置', async () => {
    const f = await fixture();
    f.open();
    f.edit('style', 'brackets', 'change');
    f.edit('color', '#abcdef');
    f.edit('css', 'draft CSS');
    assert.equal(f.previewCount(), 3);
    assert.deepEqual(f.displayed(), { style: 'brackets', color: '#abcdef', css: 'draft CSS' });
    assert.deepEqual(f.utils.dump(), f.initial);
    assert.deepEqual(f.plugin.data.config, f.initial);
    assert.equal(f.writes.length, 0);

    f.plugin.setting.options.destroyCallback();
    assert.deepEqual(f.displayed(), f.initial);
    for (const [key, value] of Object.entries(f.initial)) assert.equal(f.utils.getElement(key).value, value);
    assert.equal(f.writes.length, 0);
});

test('保存并关闭保留新设置，再次编辑后取消恢复到最近保存值', async () => {
    const f = await fixture();
    f.open();
    f.edit('color', '#abcdef');
    f.plugin.setting.options.confirmCallback();
    f.plugin.setting.options.destroyCallback();
    const saved = { ...f.initial, color: '#abcdef' };
    assert.deepEqual(f.displayed(), saved);
    assert.deepEqual(f.plugin.data.config, saved);
    assert.deepEqual(f.writes, [{ file: 'config.json', data: saved }]);

    f.open();
    f.edit('color', '#fedcba');
    assert.equal(f.previewCount(), 2);
    f.plugin.setting.options.destroyCallback();
    assert.deepEqual(f.displayed(), saved);
    assert.deepEqual(f.utils.dump(), saved);
    assert.equal(f.writes.length, 1);
});

test('程序重置表单可预览并撤回，尚未创建的控件沿用原设置', async () => {
    const f = await fixture();
    f.plugin.setting.items[0].createActionElement();
    f.utils.getElement('style').value = 'underline';
    f.utils.preview();
    assert.deepEqual(f.displayed(), { ...f.initial, style: 'underline' });
    assert.deepEqual(f.utils.dump(), f.initial);
    // 真正关闭前所有设置行都会已创建；补齐控件以模拟宿主对话框。
    f.open();
    f.utils.getElement('style').value = 'underline';
    f.utils.preview();
    f.plugin.setting.options.destroyCallback();
    assert.deepEqual(f.displayed(), f.initial);
    assert.equal(f.writes.length, 0);
});
