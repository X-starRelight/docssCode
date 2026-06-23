import { withMermaid } from 'vitepress-plugin-mermaid'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  mermaid: {
    maxTextSize: 90000,
    flowchart: {
      htmlLabels: true,
      padding: 20,
    },
  },
  title: "TTP 格式规范文档",
  description: 'Tuple-based Transfer Protocol / TT Pack 格式规范文档',
  base: '/TTP/',
  lang: 'zh-CN',
  lastUpdated: true,
  ignoreDeadLinks: true,
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.message?.includes('#__PURE__')) return
          warn(warning)
        }
      }
    },
    server: {
      allowedHosts: ['p.ceroxe.fun']
    }
  },
  themeConfig: {
    logo: 'https://images-sxxyrry.pages.dev/TTP_Bigger.png',
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
      pattern: 'https://github.com/sxxyrry/docssCode/edit/main/TTP/:path',
      text: '在 Github 上编辑此页'
    },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '回到文档汇总', link: '/back/' },
    ],
    sidebar: [
      {
        text: '概览',
        items: [
          { text: '文档目录', link: '/zh/index' },
          { text: '变更记录', link: '/zh/changelog' },
        ],
      },
      {
        text: '格式规范',
        collapsed: false,
        items: [
          { text: '头部格式', link: '/zh/specification/header' },
          { text: '原始载荷格式', link: '/zh/specification/payload' },
          { text: '压缩算法', link: '/zh/specification/compression' },
          { text: 'S-Box 置换', link: '/zh/specification/obfuscation' },
          { text: '分卷规则', link: '/zh/specification/volumes' },
        ],
      },
      {
        text: '实现指南',
        collapsed: false,
        items: [
          { text: '打包流程', link: '/zh/implementation/pack-flow' },
          { text: '解包流程', link: '/zh/implementation/unpack-flow' },
          { text: '边界情况', link: '/zh/implementation/edge-cases' },
          { text: '自定义数据段', link: '/zh/implementation/custom-data' },
        ],
      },
      {
        text: 'API 参考',
        collapsed: false,
        items: [
          { text: 'Python', link: '/zh/api/python' },
          { text: 'JavaScript', link: '/zh/api/javascript' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TTHSDownloader/TTHSDNext' }
    ]
  }
  ,
  head: [
    ['style', {}, `.mermaid svg { max-width: 100%; height: auto; }
      .mermaid .label { font-size: 14px; }
      .mermaid .cluster-label span { font-size: 14px; }`],
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
}))