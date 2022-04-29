/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'smoothscroll-polyfill'{
  import smoothscroll from 'smoothscroll-polyfill';
  export function polyfill() {
    throw new Error('Function not implemented.');
  }
}
