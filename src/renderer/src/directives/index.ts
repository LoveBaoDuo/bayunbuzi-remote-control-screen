import { App } from 'vue'
import { vLoading } from './loading'

export default function setupDirectives(app: App) {
  app.directive('loading', vLoading)
}
