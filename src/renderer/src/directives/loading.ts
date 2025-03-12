import { type Directive, type DirectiveBinding } from 'vue'

interface LoadingOptions {
  text?: string
}
interface HtmlLoadingElement extends HTMLElement {
  loadingElement?: HTMLDivElement
}
// 创建loading元素
const createLoadingElement = (text: string = '加载中...') => {
  const div = document.createElement('div')
  div.className = 'absolute inset-0 flex items-center justify-center bg-white/80 z-[999999]'
  div.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin "></div>
      <span class="mt-2 text-sm text-gray-500">${text}</span>
    </div>
  `
  return div
}

// 获取loading配置
const resolveBinding = (binding: DirectiveBinding): { show: boolean; text: string } => {
  if (typeof binding.value === 'boolean') {
    return { show: binding.value, text: '加载中...' }
  }

  if (Array.isArray(binding.value)) {
    const [show, options = {}] = binding.value
    return {
      show,
      text: (options as LoadingOptions).text || '加载中...'
    }
  }

  return { show: false, text: '加载中...' }
}

export const vLoading: Directive = {
  mounted(el: HtmlLoadingElement, binding) {
    // 确保元素是relative定位
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }

    const { show, text } = resolveBinding(binding)
    const loadingElement = createLoadingElement(text)
    el.loadingElement = loadingElement

    if (show) {
      el.appendChild(loadingElement)
    }
  },

  updated(el: HtmlLoadingElement, binding) {
    const { show, text } = resolveBinding(binding)
    const { show: oldShow } = resolveBinding({ ...binding, value: binding.oldValue })

    if (show !== oldShow) {
      if (show) {
        // 如果文本变化，需要重新创建元素
        el.loadingElement?.remove()
        el.loadingElement = createLoadingElement(text)
        el.appendChild(el.loadingElement)
      } else {
        el.loadingElement?.remove()
      }
    } else if (show) {
      // 如果只是文本变化，也需要更新
      el.loadingElement?.remove()
      el.loadingElement = createLoadingElement(text)
      el.appendChild(el.loadingElement)
    }
  },

  unmounted(el: HtmlLoadingElement) {
    el.loadingElement?.remove()
  }
}
