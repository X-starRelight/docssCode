# 变更记录

## v1 — 初始定义

- 魔数 `TTP\x01`，固定 26 字节头部
- 三种载荷模式：目录树、扁平标准、扁平扩展
- 三种压缩算法：LZMA、Brotli、Deflate
- S-Box 固定置换混淆（种子 `0x5A7B3C9D`）
- 分卷支持（`.ttp.001`, `.ttp.002`, …）
- 自定义数据段（可选，HasCustom 标志位）
- Manifest 透传
