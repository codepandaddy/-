/**
 * A vite plugin for import ui library component style automatic.
 * https://github.com/onebay/vite-plugin-imp
 */
import vitePluginImp from 'vite-plugin-imp';
import type { PluginOption } from 'vite';

export function configVitePluginImp() {
  return vitePluginImp({
    libList: [
      {
        libName: 'vant',
        style(name) {
          if (/CompWithoutStyleFile/i.test(name)) {
            // This will not import any style file
            return false;
          }
          return `vant/es/${name}/index.css`;
        }
      }
    ]
  }) as PluginOption;
}
