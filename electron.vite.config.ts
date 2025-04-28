import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
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
        dts: 'src/renderer/src/auto-imports.d.ts', // 生成 `auto-imports.d.ts` 类型声明文件
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/renderer/src/assets/icons')],
        // 执行 symbolId 格式
        symbolId: 'icon-[name]'
      })
    ],
    server: {
      host: '0.0.0.0', // 服务器地址
      port: 5173, // 服务器端口号
      hmr: true, // 启用热更新
      proxy: {
        '/api/gen': {
          //单体架构下特殊处理代码生成模块代理
          target: 'http://159.75.188.129:9999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // '/api/ns': {
        //   target: 'http://127.0.0.1:8099', // 目标服务器地址
        //   ws: true, // 是否启用 WebSocket
        //   changeOrigin: true, // 是否修改请求头中的 Origin 字段
        //   rewrite: (path) => path.replace(/^\/api\/ns/, '')
        // },
        '/api': {
          target: 'http://159.75.188.129:9999', // 目标服务器地址
          ws: true, // 是否启用 WebSocket
          changeOrigin: true, // 是否修改请求头中的 Origin 字段
          rewrite: (path) => path.replace(/^\/api/, '')
        },

        '^/ws/info/.*': {
          target: 'http://159.75.188.129:9999', // 目标服务器地址
          ws: true, // 是否启用 WebSocket
          changeOrigin: true
        }
      }
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      }
    }
  }
})
