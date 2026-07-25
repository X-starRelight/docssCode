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
            name: 'SenRi FFI',
            description: '统一 FFI 库 — SenRi FFI 是一个统一的、跨运行时的高性能原生接口库，为 JavaScript 环境和 Python 环境提供一套一致的 API 来调用原生 C 库。它专门为开发者消除不同 JavaScript 运行时和 Python FFI 后端的 FFI 差异，让您能够轻松地在任意支持的平台上调用本地动态库中的函数。采用 Apache 2.0 协议开源。',
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
