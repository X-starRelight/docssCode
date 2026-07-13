// https://vitepress.dev/guide/custom-theme
import { h, onMounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { translate2 } from './tools.ts'


export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  setup() {
    onMounted(() => {
      let onDo1 = false;
      let onDo2 = false;

      function tranText2CN(){
        try {
          const spans1 = document.querySelectorAll('span.text');
          for (const span1 of spans1) {
            // span1.textContent = await translate2(span1.textContent, 'zh');
            if (span1.textContent === 'Search') {
              span1.textContent = '搜索';
            }
          }
        } catch(e) {
          console.error(e);
        }
        setTimeout( () => {
          tranText2CN();
        }, 1000)
      };
      if (window.location.pathname.startsWith('/TTHSD/zh/')) {
        tranText2CN();
      };
    });
  },
  enhanceApp({ app, router, siteData }) {
    setTimeout(() => {
      // 先声明变量，提升作用域
      let footerInstance: any = null;

      const initFooter = () => {
        if (typeof window !== 'undefined' && window.Footer) {
          footerInstance = new window.Footer({
            name: 'KossJS',
            description: 'KossJS 核心（KossJS Core）是一个高性能、跨平台、多语言可调用的 JavaScript 引擎内核。它专门为外部项目提供强大的 JavaScript 执行支持能力，让开发者能够轻松集成专业级的 JavaScript 功能到自己的应用程序中。采用 [GNU AGPL v3.0](https://gnu.ac.cn/licenses/agpl-3.0.html) 协议并附带 TT23XR Studio 第 7 节附加权限《独立模块闭源组合例外》开源。',
            quicks: []
          }, 'https://footerjs-sxxyrry.pages.dev/');
        } else {
          // 在浏览器环境中且 Footer 不存在时重试
          if (typeof window !== 'undefined') {
            setTimeout(initFooter, 200)
          }
        }
      }

      initFooter();

      const setFooter = () => {
          if (typeof document === 'undefined') return;
          const footerE = document.querySelector('.sxxyrry-footer');
          // console.log('footerEl', footerEl);
          if (footerE) {
            footerInstance.getAndSetFooterPosition(footerE);
          } else {
            setTimeout(setFooter, 200)
          }
      }

      const setMode = () => {
        if (typeof document === 'undefined') return;
        var btn = document.querySelector('button.VPSwitch.VPSwitchAppearance');
        if (btn && btn.title && btn.click && typeof btn.title === 'string' && btn.click instanceof Function) {
          if (btn.title.includes('dark')) {
            btn.click();
          }
          // btn.ariaChecked = 'true';
        }
      }

      router.onAfterPageLoad = (to: string) => {
        setTimeout(() => {
          setFooter();
          setMode();
        }, 200);
      };
    }, 1000);
  }
} satisfies Theme
