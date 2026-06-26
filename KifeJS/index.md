---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "KifeJS"
  text: "在 Minecraft 中运行 JavaScript"
  tagline: Fabric 脚本模组 — 基于 KossJS_API，无需编译即可扩展游戏行为
  actions:
    - theme: brand
      text: 快速开始
      link: /02-getting-started/01-first-script
    - theme: alt
      text: 安装指南
      link: /01-installation/01-requirements
    - theme: alt
      text: API 参考
      link: /04-api-reference/01-KifeJS-log

features:
  - title: 🚀 即写即用
    details: 将 .js 文件放入 scripts/ 目录，执行 /kifejs reload 即可加载，无需编译或重启。
  - title: 🧩 灵活脚本模型
    details: 支持单文件脚本和包脚本（文件夹 + index.js），可附带 config.js 配置。
  - title: 🔗 跨脚本通信
    details: 所有脚本共享同一全局作用域，支持直接 API 调用、事件总线、数据仓库多种通信模式。
  - title: ⚡ 运行时重载
    details: /kifejs reload 命令可热重载所有脚本，快速迭代开发。
  - title: 🛡️ 沙箱安全
    details: 30 秒执行超时保护，默认禁用文件系统访问，单脚本错误不影响其他脚本。
  - title: 🎯 轻量无侵入
    details: 不添加任何物品/方块/实体，纯脚本框架，对原版游戏零影响。
---

## 快速链接

| 资源 | 链接 |
|------|------|
| 脚本目录 | `.minecraft/KifeJS/scripts/` |
| 全局配置 | `.minecraft/KifeJS/config.js` |
| 重载命令 | `/kifejs reload` |
| 版本查看 | `/kifejs version` |
| 日志前缀 | `[KifeJS]` / `[script]` |

## 目录

- **安装指南**: [环境要求](/01-installation/01-requirements) · [安装步骤](/01-installation/02-install-steps) · [验证安装](/01-installation/03-verification)
- **快速入门**: [第一个脚本](/02-getting-started/01-first-script) · [目录结构](/02-getting-started/02-directory-structure) · [命令参考](/02-getting-started/03-commands)
- **脚本基础**: [脚本类型](/03-script-fundamentals/01-script-types) · [配置文件](/03-script-fundamentals/02-script-config) · [执行模型](/03-script-fundamentals/03-execution-model) · [错误处理](/03-script-fundamentals/04-error-handling)
- **API 参考**: [log](/04-api-reference/01-KifeJS-log) · [broadcast](/04-api-reference/02-KifeJS-broadcast) · [KifeJSConfig](/04-api-reference/03-KifeJSConfig) · [KifeEvent](/04-api-reference/04-KifeEvent) · [内置变量](/04-api-reference/05-script-variables) · [组合使用](/04-api-reference/06-combined-usage)
- **事件系统**: [概念](/05-event-system/01-concepts) · [构建总线](/05-event-system/02-building-event-bus) · [生命周期](/05-event-system/03-event-lifecycle) · [取消机制](/05-event-system/04-cancellation-deep) · [高级模式](/05-event-system/05-advanced-patterns)
- **跨脚本通信**: [全局作用域](/06-cross-script/01-global-scope) · [直接调用](/06-cross-script/02-direct-api) · [事件驱动](/06-cross-script/03-event-driven) · [数据仓库](/06-cross-script/04-data-repository) · [命名空间](/06-cross-script/05-namespace-conventions) · [状态管理](/06-cross-script/06-state-lifecycle)
- **进阶模式**: [定时任务](/07-advanced-patterns/01-timers) · [模块化](/07-advanced-patterns/02-module-organization) · [生命周期钩子](/07-advanced-patterns/03-lifecycle-hooks) · [持久化](/07-advanced-patterns/04-persistence) · [性能](/07-advanced-patterns/05-performance)
- **沙箱安全**: [超时](/08-sandbox/01-timeout) · [文件系统](/08-sandbox/02-filesystem) · [安全编码](/08-sandbox/03-secure-coding)
- **故障排除**: [原生库](/10-troubleshooting/01-library-not-found) · [脚本错误](/10-troubleshooting/02-script-errors) · [超时](/10-troubleshooting/03-timeout) · [重载](/10-troubleshooting/04-reload-issues) · [调试](/10-troubleshooting/05-logs-and-debug)
