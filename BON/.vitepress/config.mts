import { defineConfig } from 'vitepress'
import bonGrammar from './theme/bon/bon.tmLanguage.json'

export default defineConfig({
  markdown: {
    shikiSetup(shiki) {
      shiki.loadLanguage({
        name: 'bon',
        scopeName: 'source.bon',
        grammar: bonGrammar,
      })
    }
  },
  title: 'BON',
  description: 'JSON 的超集，配置界的编译器',
  base: '/BON/',
  lang: 'zh-CN',
  lastUpdated: true,
  ignoreDeadLinks: true,
  vite: {
    server: {
      allowedHosts: ['p.ceroxe.fun']
    }
  },
  themeConfig: {
    logo: 'https://images-sxxyrry.pages.dev/BON_Bigger.png',
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
      pattern: 'https://github.com/sxxyrry/docssCode/edit/main/BON/:path',
      text: '在 Github 上编辑此页'
    },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '什么是 BON', link: '/zh/guide/what-is-bon' },
      { text: '快速开始', link: '/zh/guide/getting-started' },
      { text: '语言规范', link: '/zh/reference/syntax-overview' },
      { text: '标准库', link: '/zh/reference/stdlib-overview' },
      { text: 'API 文档', link: '/zh/how-to-use/py' },
      { text: '鸣谢', link: '/zh/acknowledgments/acknowledgments' },
      { text: '回到文档汇总', link: '/back/' },
    ],
    sidebar: {
      '/zh/': [
        {
          text: '指南',
          collapsed: false,
          items: [
            { text: '什么是 BON', link: '/zh/guide/what-is-bon' },
            { text: '快速开始', link: '/zh/guide/getting-started' }
          ]
        },
        {
          text: '语言规范概览',
          collapsed: false,
          items: [
            { text: '语言规范概览', link: '/zh/reference/syntax-overview' },
            { text: '注释', link: '/zh/reference/syntax/comments' },
            { text: '数据类型', link: '/zh/reference/syntax/data-types' },
            { text: '标识符', link: '/zh/reference/syntax/identifiers' },
            { text: '运算符', link: '/zh/reference/syntax/operators' },
            { text: '模板系统', link: '/zh/reference/syntax/templates' },
            { text: '类', link: '/zh/reference/syntax/classes' },
            { text: '继承', link: '/zh/reference/syntax/inheritance' },
            { text: '导入系统', link: '/zh/reference/syntax/imports' }
          ]
        },
        {
          text: '编译与错误',
          collapsed: false,
          items: [
            { text: '编译阶段', link: '/zh/reference/compilation-phases' },
            { text: '错误处理', link: '/zh/reference/error-handling' }
          ]
        },
        {
          text: '标准库',
          collapsed: false,
          items: [
            { text: '标准库概览', link: '/zh/reference/stdlib-overview' },
            { text: '完整示例', link: '/zh/reference/example-basic' }
          ]
        },
        {
          text: '标准库 - 字符串',
          collapsed: false,
          items: [
            { text: 'std.upper', link: '/zh/reference/stdlib/upper' },
            { text: 'std.lower', link: '/zh/reference/stdlib/lower' },
            { text: 'std.trim', link: '/zh/reference/stdlib/trim' },
            { text: 'std.split', link: '/zh/reference/stdlib/split' },
            { text: 'std.replace', link: '/zh/reference/stdlib/replace' },
          ]
        },
        {
          text: '标准库 - 数组',
          collapsed: false,
          items: [
            { text: 'std.at', link: '/zh/reference/stdlib/at' },
            { text: 'std.first', link: '/zh/reference/stdlib/first' },
            { text: 'std.last', link: '/zh/reference/stdlib/last' },
            { text: 'std.map', link: '/zh/reference/stdlib/map' },
            { text: 'std.filter', link: '/zh/reference/stdlib/filter' },
            { text: 'std.reduce', link: '/zh/reference/stdlib/reduce' },
            { text: 'std.concat', link: '/zh/reference/stdlib/concat' },
          ]
        },
        {
          text: '标准库 - 对象',
          collapsed: false,
          items: [
            { text: 'std.merge', link: '/zh/reference/stdlib/merge' },
            { text: 'std.keys', link: '/zh/reference/stdlib/keys' },
            { text: 'std.values', link: '/zh/reference/stdlib/values' },
          ]
        },
        {
          text: '标准库 - 类型与长度',
          collapsed: false,
          items: [
            { text: 'std.to_string', link: '/zh/reference/stdlib/to-string' },
            { text: 'std.to_number', link: '/zh/reference/stdlib/to-number' },
            { text: 'std.type_of', link: '/zh/reference/stdlib/type-of' },
            { text: 'std.len', link: '/zh/reference/stdlib/len' },
          ]
        },
        {
          text: '如何使用',
          collapsed: false,
          items: [
            { text: 'Python 库 API', link: '/zh/how-to-use/py' },
            { text: 'TypeScript 库 API', link: '/zh/how-to-use/ts' },
            { text: 'Python CLI', link: '/zh/how-to-use/pycli' },
            { text: 'TypeScript CLI', link: '/zh/how-to-use/tscli' }
          ]
        },
        {
          text: '其他',
          collapsed: false,
          items: [
            { text: '鸣谢', link: '/zh/acknowledgments/acknowledgments' },
            // { text: '贡献指南', link: '/zh/guide/contributing' },
            { text: '回到文档汇总', link: '/back/' },
          ],
        },
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TT23XR-Studio/BON' }
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
      `]
      ,
    ['script', { src: `https://footerjs-sxxyrry.pages.dev/footer.js?autorun=false` }, ],
  ],
})
