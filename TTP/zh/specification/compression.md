# 压缩

压缩在原始载荷构建之后、S-Box 置换混淆之前执行。

## 压缩算法标识

配置字节 0 的 bits 1–2 指定算法：

| 编码 | 算法 | 默认 |
|------|------|------|
| `00` | LZMA | 默认 |
| `01` | Brotli | |
| `10` | Deflate | |
| `11` | 保留 | 实现应回退为 LZMA |

## 算法参数

### LZMA

- 格式：`lzma:FORMAT_ALONE`（独立的 LZMA 流，无容器头）
- 压缩等级：9（最大压缩）
- 字典大小：`1 << 25`（32 MiB）
- LZMA 属性：lc=3, lp=0, pb=2

### Brotli

- 压缩质量：11（Brötli 最大级别）
- 使用默认窗口大小

### Deflate

- 模式：raw deflate（`wbits = -15`，无 zlib/gzip 头）
- 压缩等级：9
