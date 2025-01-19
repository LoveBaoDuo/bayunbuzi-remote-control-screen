import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

const pathResolve = (dir: string) => {
  return resolve(__dirname, '.', dir)
}
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {},
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '/@': pathResolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      vueSetupExtend(), // setup语法糖增强插件
      AutoImport({
        imports: ['vue', 'vue-router'], // 自动导入的依赖库数组
        dts: 'src/renderer/src/auto-imports.d.ts' // 生成 `auto-imports.d.ts` 类型声明文件
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/renderer/src/assets/icons')],
        // 执行 symbolId 格式
        symbolId: 'icon-[name]'
      })
    ],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      }
    }
  }
})
