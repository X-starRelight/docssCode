# JavaScript API 参考

## packer (Node.js)

### `packTTP(inputDir, outputFile, options)`

```javascript
function packTTP(
  inputDir: string,
  outputFile: string,
  options?: {
    flat?: boolean,
    compression?: 'lzma' | 'brotli' | 'deflate',
    volumeSize?: number,
    extInfo?: boolean | null,
    customData?: Buffer | Uint8Array | string | object | null,
  }
): void
```

**参数**

| 参数 | 默认 | 说明 |
|------|------|------|
| `flat` | `false` | 强制扁平模式 |
| `compression` | `'lzma'` | 压缩算法 |
| `volumeSize` | `0` | 分卷大小，`0` 不分卷 |
| `extInfo` | `null` | `null` 自动检测，`true`/`false` 强制 |
| `customData` | `null` | 自动转换为 Buffer（支持 string/object JSON 序列化） |

**入口**

```bash
node packer.js <inputDir> <outputFile> [options]
```

```javascript
const { packTTP } = require('./packer.js');
packTTP('./myapp', 'output.ttp', { compression: 'brotli' });
```

## unpacker (Node.js + 浏览器)

### `unpackTTP(buffer)`

在 Node.js 和浏览器中 API 签名一致，但返回的 `assetMap` 值类型不同。

```javascript
async function unpackTTP(
  buffer: Uint8Array | ArrayBuffer
): Promise<{
  manifest: object,
  assetMap: Map<string, Buffer | string>,
  customData: Uint8Array | null
}>
```

**参数**

| 参数 | 说明 |
|------|------|
| `buffer` | 支持 `Uint8Array` 或 `ArrayBuffer` |

**返回值**

| 字段 | Node.js | 浏览器 |
|------|---------|--------|
| `manifest` | `object` | `object` |
| `assetMap` | `Map<string, Buffer>` | `Map<string, Blob URL>` |
| `customData` | `Buffer` / `null` | `Uint8Array` / `null` |

浏览器中文件内容以 `URL.createObjectURL(new Blob([content]))` 形式提供，可直接用于 `<img>`、`<a>` 等元素。

**入口**

```bash
node unpacker.js <input.ttp> [outputDir]
```

**Node.js：**
```javascript
const fs = require('fs');
const { unpackTTP } = require('./unpacker.js');
const buf = fs.readFileSync('output.ttp');
const { manifest, assetMap, customData } = await unpackTTP(buf);
```

**浏览器：**
```html
<script src="src/javascript/unpacker.js"></script>
<script>
  fetch('output.ttp')
    .then(r => r.arrayBuffer())
    .then(buf => window.unpackTTP(new Uint8Array(buf)))
    .then(({ manifest, assetMap, customData }) => {
      // assetMap: Map<string, Blob URL>
    });
</script>
```

## LZMA Worker 路径配置（浏览器）

浏览器模式需要加载 LZMA 脚本。通过 `window.TTP_LZMA_PATH` 和 `window.TTP_LZMA_WORKER_PATH` 自定义路径：

```html
<script>
  window.TTP_LZMA_PATH = './assets/lzma-min.js';
  window.TTP_LZMA_WORKER_PATH = './assets/lzma_worker-min.js';
</script>
<script src="src/javascript/unpacker.js"></script>
```

默认路径为 `./LZMAJS/src/lzma-min.js` 和 `./LZMAJS/src/lzma_worker-min.js`（相对于页面 URL）。
