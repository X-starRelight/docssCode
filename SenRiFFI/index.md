---
layout: home

hero:
  name: "SenRi FFI"
  text: "千里 FFI / せんり FFI"
  tagline: "统一 FFI 库 — KossJS、Node.js、Bun、Deno 一套 API 调用原生 C 库"
  actions:
    - theme: brand
      text: "快速开始"
      link: "/zh/guide/getting-started"
    - theme: alt
      text: "什么是 SenRi FFI"
      link: "/zh/guide/what-is-senri-ffi"
    - theme: alt
      text: "API 文档"
      link: "/zh/api/API-overview"

features:
  - title: "一次编写，到处运行"
    details: "同一套 FFI 代码可在 KossJS、Node.js、Bun 和 Deno 上运行，自动检测并选择正确的原生 FFI 后端"
  - title: "零原生依赖"
    details: "在 KossJS、Bun 和 Deno 上使用内置 FFI；Node.js 上可选安装 koffi，无需编译任何 C 扩展"
  - title: "完整类型系统"
    details: "统一的 C 类型名称 (int32、float64、cstring 等)，各运行时自动映射，支持指针、数组、结构体"
  - title: "结构体支持"
    details: "定义 C 结构体，自动处理布局、对齐和紧凑排列，支持嵌套结构体和 fromPointer 反序列化"
  - title: "指针 API"
    details: "从原始内存中读写基本类型、指针和 C 字符串，支持偏移读写和指针算术"
  - title: "回调函数"
    details: "将 JavaScript 函数封装为 C 函数指针，通过 FinalizationRegistry 自动垃圾回收"
---
