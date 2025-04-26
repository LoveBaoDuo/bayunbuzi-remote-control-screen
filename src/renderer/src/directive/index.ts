import { App } from 'vue'

const imgUrl = new URL('../assets/image/59934930_p0.jpg', import.meta.url).href

function directived(app: App) {
  app.directive('highlight', {
    beforeMount(el: HTMLElement) {
      console.log(el)
    }
  })
}

function lazyImage(app: App) {
  app.directive('lazy-image', {
    mounted(el: HTMLImageElement, binding) {
      const oi = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          el.src = binding.value
          oi.unobserve(el)
        }
      })
      oi.observe(el)
      el.onerror = function (e: any) {
        e.target.src = imgUrl
      }
    }
  })
}

export default {
  install(app: App) {
    directived(app)
    lazyImage(app)
  }
}
