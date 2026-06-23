import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "SenRi FFI",
  description: "统一 FFI 库 — KossJS、Node.js、Bun、Deno 一套 API 调用原生 C 库",
  base: '/SenRiFFI/',
  lang: 'zh-CN',
  lastUpdated: true,
  ignoreDeadLinks: true,
  vite: {
    server: {
      allowedHosts: ['p.ceroxe.fun']
    }
  },
  themeConfig: {
    logo: 'https://images-sxxyrry.pages.dev/KossJS_Bigger.png',
    outline: {
      label: '在本页面'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    externalLinkIcon: true,
    editLink: {
      pattern: 'https://github.com/KossJS/SenRiFFI/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '什么是 SenRi FFI', link: '/zh/guide/what-is-senri-ffi' },
      { text: '快速开始', link: '/zh/guide/getting-started' },
      { text: 'API 文档', link: '/zh/api/API-overview' },
    ],

    sidebar: [
      {
        text: '指南',
        collapsed: false,
        items: [
          { text: '什么是 SenRi FFI', link: '/zh/guide/what-is-senri-ffi' },
          { text: '快速开始', link: '/zh/guide/getting-started' },
          { text: '运行时检测', link: '/zh/guide/runtime-detection' },
        ]
      },
      {
        text: 'API 文档',
        collapsed: false,
        items: [
          { text: 'API 概览', link: '/zh/api/API-overview' },
          {
            text: 'Library',
            collapsed: true,
            items: [
              { text: 'Library.load()', link: '/zh/api/library' },
              { text: 'func() — 同步绑定', link: '/zh/api/func' },
              { text: 'funcAsync() — 异步绑定', link: '/zh/api/funcAsync' },
              { text: 'close() — 同步关闭', link: '/zh/api/close' },
              { text: 'closeAsync() — 异步关闭', link: '/zh/api/closeAsync' },
            ]
          },
          {
            text: '类型系统',
            collapsed: true,
            items: [
              { text: 'types / pointer / array', link: '/zh/api/types' },
            ]
          },
          {
            text: 'Pointer',
            collapsed: true,
            items: [
              { text: 'Pointer', link: '/zh/api/pointer' },
            ]
          },
          {
            text: '结构体',
            collapsed: true,
            items: [
              { text: 'struct', link: '/zh/api/struct' },
            ]
          },
          {
            text: '回调',
            collapsed: true,
            items: [
              { text: 'callback', link: '/zh/api/callback' },
            ]
          },
          {
            text: '内存管理',
            collapsed: true,
            items: [
              { text: 'alloc / free / addressOf / errno / strerror', link: '/zh/api/memory' },
            ]
          },
          {
            text: '错误处理',
            collapsed: true,
            items: [
              { text: 'FFIError / FFITypeError', link: '/zh/api/errors' },
            ]
          },
        ]
      },
      {
        text: '示例',
        collapsed: true,
        items: [
          { text: '基础用法', link: '/zh/examples/basic-usage' },
          { text: '结构体用法', link: '/zh/examples/struct-usage' },
          { text: '回调用法', link: '/zh/examples/callback-usage' },
        ]
      },
      {
        text: '其他',
        collapsed: false,
        items: [
          { text: '鸣谢', link: '/zh/acknowledgments/acknowledgments' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KossJS/' }
    ]
  },
  head: [
    ['script', {}, `
      var func = () => {setTimeout(() => {
        try{
          var links = document.querySelectorAll('a');
          for(var i=0;i<links.length;i++){
            var el = links[i];
            if(el.href && el.href.includes('/back')){
              el.href = location.origin + el.href.substring(window.location.origin.length + ('/' + window.location.pathname.split('/').slice(1)[0]).length + 5);
              el.target = '_self';
            }
          }
        }catch(e){};
        setTimeout(func, 100);
      }, 1000);}
      
      document.addEventListener('DOMContentLoaded', func)
      setTimeout(func, 1000)
      `],
    ['script', { src: `https://footerjs-sxxyrry.pages.dev/footer.js?autorun=false` }, ],
  ],
})
