# Python API 参考

## packer

### `pack_ttp(input_dir, output_file, ...)`

```python
def pack_ttp(
    input_dir: str,
    output_file: str,
    flat: bool = False,
    compression: str = "lzma",
    volume_size: int = 0,
    ext_info: bool | None = None,
    custom_data: bytes | None = None,
) -> None
```

**参数**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `input_dir` | `str` | — | 源目录路径 |
| `output_file` | `str` | — | 输出 `.ttp` 文件路径 |
| `flat` | `bool` | `False` | 强制扁平模式（无子目录时自动启用） |
| `compression` | `str` | `"lzma"` | 压缩算法：`"lzma"` / `"brotli"` / `"deflate"` |
| `volume_size` | `int` | `0` | 分卷大小（字节），`0` 表示不分卷 |
| `ext_info` | `bool\|None` | `None` | 扩展扁平模式；`None` 表示自动检测 |
| `custom_data` | `bytes\|None` | `None` | 自定义数据段内容 |

**异常**

- `NotADirectoryError` — `input_dir` 不是目录
- `ValueError` — 扁平模式下有子目录，或未知压缩算法
- `RuntimeError` — Brotli/LZMA 未安装但被选用

**入口**

```bash
python packer.py <input_dir> <output_file> [options]
```

```python
from packer import pack_ttp
pack_ttp("./myapp", "output.ttp", compression="brotli")
```

## unpacker

### `unpack_ttp(buffer)`

```python
def unpack_ttp(
    buffer: bytes,
) -> tuple[dict[str, Any], dict[str, bytes], bytes | None]
```

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `buffer` | `bytes` | 完整的 `.ttp` 文件内容（含头部） |

**返回值**

返回 `(manifest, asset_map, custom_data)` 三元组：

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `manifest` | `dict` | manifest 对象（JSON 解析结果） |
| `asset_map` | `dict[str, bytes]` | 文件路径 → 文件内容字节 |
| `custom_data` | `bytes\|None` | 自定义数据段内容，无则为 `None` |

**异常**

- `ValueError` — 魔数/版本/格式错误
- `RuntimeError` — 解压失败或不支持的压缩方法

**入口**

```bash
python unpacker.py <input.ttp> [output_dir]
```

```python
from unpacker import unpack_ttp
manifest, assets, custom = unpack_ttp(open("output.ttp", "rb").read())
```
