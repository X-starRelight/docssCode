# KossJS TypeScript 接口封装使用文档

> [!TIP]
> 本文档介绍 KossJS 的 TypeScript 接口封装 ***kossjs_interface.ts***。

## 0. 安装说明

### 0.1 系统要求

1. Node.js 18 及以上版本
2. KossJS 动态库文件：
   - Windows 平台：***kossjs.dll***
   - macOS 平台：***libkossjs.dylib***
   - Linux 平台：***libkossjs.so***
3. koffi（Node.js FFI 库）

### 0.2 安装步骤

1. 将动态库文件放置在项目目录中
2. 将 ***kossjs_interface.ts*** 复制到项目目录
3. 安装 koffi：
pm install koffi

---

## 1. 模块概述

- **核心类**：***KossJS***
- **依赖**：***koffi***（Node.js FFI 库）
- **功能**：
  - 创建 JS 实例（支持模块加载、能力位控制、稳定模式）
  - 执行 JavaScript 代码
  - 全局变量注入
  - 注册原生函数
  - Fetch API 调用
  - 沙箱安全（审核掩码、审核回调、调试模式、JS 层审核回调）

---

## 2. ***KossJS*** 类

### 2.1 初始化

`	ypescript
const koss = new KossJS(
    libPath?: string,       // 动态库路径，默认自动检测
    withModules?: boolean,  // 是否启用模块加载，默认 false
    rootDir?: string,       // 模块解析根目录，默认当前目录
    capabilities?: number,  // 能力位掩码，默认 KOSS_CAP_SANDBOX
    stable?: boolean        // 稳定模式，默认 true
);
`

**示例**：

`	ypescript
import { KossJS } from './kossjs_interface';

// 默认创建（stable=true，纯计算沙箱）
const koss = new KossJS();

// 完全启用
const full = new KossJS(undefined, false, undefined, KossJS.KOSS_CAP_ALL);

// 开发模式（启用 FFI）
const dev = new KossJS(undefined, false, undefined, KossJS.KOSS_CAP_ALL, false);
`

### 2.2 实例属性

#### ***isStable(): boolean***

查询实例是否处于稳定模式。

`	ypescript
const koss = new KossJS();
console.log(koss.isStable());  // true
`

#### ***getCapabilities(): number***

查询当前实例的能力位掩码。

`	ypescript
const koss = new KossJS();
const caps = koss.getCapabilities();
console.log(Capabilities: 0x);
`

### 2.3 执行代码

#### ***eval(code: string): any***

执行 JavaScript 代码并返回结果。

`	ypescript
const result = koss.eval("1 + 2");
console.log(result);  // 输出: 3
`

#### ***runAsync(code: string, timeoutMs?: number): string***

执行异步代码并驱动事件循环直到 Promise 完成。

`	ypescript
const result = koss.runAsync(
(async () => {
    const r = await fetch("https://api.github.com/users/github");
    const d = await r.json();
    return d.login;
})();
, 30000);
`

#### ***tick(): boolean***

运行事件循环单次迭代。

#### ***runFile(path: string): string***

执行 JavaScript 文件。

#### ***runModule(path: string): string***

以 ES Module 方式执行 JavaScript 文件。

#### ***runString(code: string): string***

执行 JavaScript 代码字符串。

#### ***runModuleString(code: string): string***

以 ES Module 方式执行代码字符串。

### 2.4 全局变量

#### ***setGlobal(name: string, value: any): void***

设置全局变量。

`	ypescript
koss.setGlobal("myVar", "Hello");
koss.setGlobal("count", 100);
koss.setGlobal("isReady", true);
koss.setGlobal("config", { debug: true, port: 8080 });
`

### 2.5 原生函数 / 类注册

#### ***registerFunction(name: string, func: Function): void***

注册可从 JS 调用的原生函数。

`	ypescript
koss.registerFunction("add", (a: string, b: string) => {
    return String(Number(a) + Number(b));
});
const result = koss.eval("add(10, 20)");
console.log(result);  // 输出: 30
`

#### ***registerClass(className: string, methods: Record<string, Function>): void***

注册支持 
ew 关键字的 JS 类。

### 2.6 沙箱安全

#### ***setAuditMask(mask: number): void***

设置审核掩码。

`	ypescript
koss.setAuditMask(KossJS.FS_READ | KossJS.NET_FETCH);
`

#### ***getAuditMask(): number***

获取当前审核掩码。

#### ***checkSandbox(callback: Function | null): void***

注册或清除审核回调。

`	ypescript
koss.checkSandbox((target: string, args: string[], pwd: string | null) => {
    if (target === 'fs.readFile') {
        return args[0].startsWith('/tmp/sandbox/');
    }
    return true;
});

// 清除回调
koss.checkSandbox(null);
`

#### ***enableAuditDebug(enable: boolean): void***

启用/禁用审核调试模式。

`	ypescript
koss.enableAuditDebug(true);   // 开启
koss.enableAuditDebug(false);  // 关闭
`

### 2.7 JS 层审核回调

#### ***clearJsAudit(): string***

清除 JS 层审核回调（由 JS 侧 `KossJS.set_audit_callback` 注册）。清除后，掩码覆盖的操作由宿主审核回调单独决策。

`	ypescript
// JS 侧注册审核回调（拒绝所有 fs 操作）
koss.eval(`KossJS.set_audit_callback(function(t, a, p) { return false; })`);

// 宿主清除 JS 层审核回调
koss.clearJsAudit();
`

> [!NOTE]
> Worker 线程池相关方法（`createWorkerPool`、`workerExecute` 等）自 **v0.1.0-dev.10** 起已从 TypeScript 接口移除。

### 2.8 资源管理

#### ***destroy(): void***

销毁 JS 实例并释放内存。

`	ypescript
koss.destroy();
`

### 2.9 其他方法

#### ***version(): string***

获取 KossJS 版本。

`	ypescript
console.log(koss.version());  // 输出: 0.1.0-dev.10
`

---

## 3. 使用示例

### 3.1 基本用法

`	ypescript
import { KossJS } from './kossjs_interface';

const koss = new KossJS();

// 基本计算
const result = koss.eval("1 + 2 * 3");
console.log(result);  // 输出: 7

// 对象操作
const name = koss.eval(
    const person = { name: "John", age: 30 };
    person.name;
);
console.log(name);  // 输出: John

koss.destroy();
`

### 3.2 使用沙箱能力位

`	ypescript
import { KossJS } from './kossjs_interface';

// 沙箱模式
const sandbox = new KossJS(undefined, false, undefined, KossJS.KOSS_CAP_SANDBOX);
const result = sandbox.eval("1 + 1");
console.log(result);  // 正常工作
sandbox.destroy();
`

### 3.3 使用审核回调

`	ypescript
import { KossJS, JsError } from './kossjs_interface';

const koss = new KossJS(undefined, false, undefined, KossJS.KOSS_CAP_ALL_FS);
koss.setAuditMask(KossJS.FS_READ);

koss.checkSandbox((target: string, args: string[]) => {
    if (target === 'fs.readFile') {
        return args[0].startsWith('/tmp/sandbox/');
    }
    return true;
});

try {
    koss.eval("require('fs').readFileSync('/etc/passwd')");
} catch (e) {
    if (e instanceof JsError) {
        console.log(Blocked: );
    }
}

koss.destroy();
`

---

## 4. 能力常量参考

`	ypescript
// 文件系统（6 个）
KossJS.FS_READ         = 1 << 0;
KossJS.FS_WRITE        = 1 << 1;
KossJS.FS_DELETE       = 1 << 2;
KossJS.FS_MKDIR        = 1 << 3;
KossJS.FS_RENAME       = 1 << 4;
KossJS.FS_CHMOD        = 1 << 5;

// 网络（5 个）
KossJS.NET_TCP_CLIENT  = 1 << 6;
KossJS.NET_TCP_SERVER  = 1 << 7;
KossJS.NET_UDP         = 1 << 8;
KossJS.NET_DNS         = 1 << 9;
KossJS.NET_FETCH       = 1 << 10;

// 加密（4 个）
KossJS.CRYPTO_HASH     = 1 << 11;
KossJS.CRYPTO_HMAC     = 1 << 12;
KossJS.CRYPTO_RANDOM   = 1 << 13;
KossJS.CRYPTO_PBKDF2   = 1 << 14;

// 内置 FFI（5 个）
KossJS.FFI_OPEN        = 1 << 15;
KossJS.FFI_CALL        = 1 << 16;
KossJS.FFI_ALLOC       = 1 << 17;
KossJS.FFI_CALLBACK    = 1 << 18;
KossJS.FFI_STRUCT      = 1 << 19;

// 其他模块（8 个）
KossJS.NATIVE_ADDON    = 1 << 20;
KossJS.WASM            = 1 << 21;
KossJS.SHARED_MEMORY   = 1 << 22;
KossJS.HIGHRES_TIME    = 1 << 23;
KossJS.SYSINFO         = 1 << 24;
KossJS.MODULE_LOAD     = 1 << 25;
KossJS.DYNAMIC_CODE    = 1 << 26;
KossJS.DEBUG_CAP       = 1 << 27;

// 组合常量
KossJS.KOSS_CAP_SANDBOX    = 0;
KossJS.KOSS_CAP_ALL_FS     = KossJS.FS_READ | KossJS.FS_WRITE | KossJS.FS_DELETE | KossJS.FS_MKDIR | KossJS.FS_RENAME | KossJS.FS_CHMOD;
KossJS.KOSS_CAP_ALL_NET    = KossJS.NET_TCP_CLIENT | KossJS.NET_TCP_SERVER | KossJS.NET_UDP | KossJS.NET_DNS | KossJS.NET_FETCH;
KossJS.KOSS_CAP_ALL_CRYPTO = KossJS.CRYPTO_HASH | KossJS.CRYPTO_HMAC | KossJS.CRYPTO_RANDOM | KossJS.CRYPTO_PBKDF2;
KossJS.KOSS_CAP_ALL_FFI    = KossJS.FFI_OPEN | KossJS.FFI_CALL | KossJS.FFI_ALLOC | KossJS.FFI_CALLBACK | KossJS.FFI_STRUCT;
KossJS.KOSS_CAP_ALL        = 0xFFFFFFFF;

// 兼容别名
KossJS.KOSS_CAP_FS              = KossJS.KOSS_CAP_ALL_FS;
KossJS.KOSS_CAP_NET             = KossJS.KOSS_CAP_ALL_NET;
KossJS.KOSS_CAP_CRYPTO          = KossJS.KOSS_CAP_ALL_CRYPTO;
KossJS.KOSS_CAP_EXTERNAL_LOADER = KossJS.MODULE_LOAD;
`

---

## 5. 注意事项

1. **koffi 依赖**：TypeScript 接口依赖 koffi 库，需要先安装
2. **动态库路径**：若自动检测失败，需显式传入正确路径
3. **异常处理**：JavaScript 错误会抛出 ***JsError*** 异常
4. **稳定模式**：生产环境使用默认 ***stable=true***，开发/调试使用 ***stable=false***
5. **默认能力**：默认构造器为 `KOSS_CAP_SANDBOX`（纯计算沙箱），需要系统能力时显式传 `KOSS_CAP_ALL`

---

如有问题，请提交 issue。
