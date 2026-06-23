# TTP 格式规范 v1 — 文档目录

TTP（TT Pack）是 TT23XR Studio 专用的二进制包格式，前身为 VHP。它使用压缩与 S-Box 置换混淆生成不可读的纯二进制文件，支持分卷存储和可选的自定义数据段。

## 文档结构

| 路径 | 内容 |
|------|------|
| [specification/header.md](specification/header.md) | 26 字节头部字段表与配置字节位域 |
| [specification/payload.md](specification/payload.md) | 原始载荷三种模式：目录树 / 扁平标准 / 扁平扩展 |
| [specification/compression.md](specification/compression.md) | 支持的压缩算法参数 |
| [specification/obfuscation.md](specification/obfuscation.md) | S-Box 置换盒种子与生成算法 |
| [specification/volumes.md](specification/volumes.md) | 单卷 / 分卷命名与拼接规则 |
| [implementation/pack-flow.md](implementation/pack-flow.md) | 打包完整流程 |
| [implementation/unpack-flow.md](implementation/unpack-flow.md) | 解包完整流程 |
| [implementation/edge-cases.md](implementation/edge-cases.md) | 边界情况处理 |
| [implementation/custom-data.md](implementation/custom-data.md) | 自定义数据段规则与用途 |
| [api/python.md](api/python.md) | Python API 参考 |
| [api/javascript.md](api/javascript.md) | JavaScript API 参考 |
| [changelog.md](changelog.md) | 版本变更记录 |

## 数据体生命周期

```
原始文件/目录
    │
    ▼
┌─────────────────────┐
│  构建原始载荷        │  pack-flow.md
│  (三种模式之一)      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  压缩                │  compression.md
│  LZMA / Brotli /    │
│  Deflate             │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  S-Box 置换混淆      │  obfuscation.md
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  分卷 (可选)         │  volumes.md
└────────┬────────────┘
         │
         ▼
     .ttp 文件
```

解包为上述流程的逆向。
