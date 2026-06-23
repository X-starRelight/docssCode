# 鸣谢

SenRi FFI 项目的成功离不开开源社区的支持。

---

## 项目信息

- **项目名称**: SenRi FFI（千里 FFI / せんり FFI）
- **npm 包名**: `@tt23xrstudio/senri_ffi`
- **许可证**: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **GitHub**: [github.com/KossJS/senri_ffi](https://github.com/KossJS/senri_ffi)

---

## 项目团队

### 核心开发

**TT23XR Studio**

| 角色 | 成员 |
|------|------|
| 项目创始工作室 | TT23XR Studio |
| 项目负责人 / 作者 | Sxxyrry ([@sxxyrry](https://github.com/sxxyrry)) |

---

## 核心依赖

SenRi FFI 自身**零原生依赖**，在 Node.js 上依赖以下可选包：

### Node.js 后端

- **[koffi v3](https://github.com/nicola-orlandos/koffi)** — Node.js 的 FFI 库（v3 使用字符串类型名）
  - 通过 peerDependencies 声明为可选依赖

## 支持的运行时

SenRi FFI 支持以下 JavaScript 运行时：

| 运行时 | 说明 |
|--------|------|
| [KossJS](https://github.com/KossJS) | 嵌入式 JavaScript 运行时，内置 FFI 支持（同步 + 异步） |
| [Bun](https://bun.sh/) | 快速的全能 JavaScript 运行时（`Bun.FFI`，v1.3+），内置 FFI 支持 |
| [Deno](https://deno.com/) | 安全的 JavaScript/TypeScript 运行时（`Deno.dlopen`），原生异步 FFI |
| [Node.js](https://nodejs.org/) | 广泛使用的 JavaScript 运行时，通过 koffi 提供 FFI 支持 |

---

## 许可证

本项目采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 协议开源发布。

---

**感谢所有使用和支持 SenRi FFI 的开发者！**
