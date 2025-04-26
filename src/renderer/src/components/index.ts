import { App } from 'vue'
import Icon from '/@/components/Icon.vue'
import Empty from '/@/components/Empty/index.vue'
import ByEmojiPicker from './ByEmojiPicker.vue'
import Avatar from './Avatar/index.vue'
import IntersectionLoader from './IntersectionLoader/index.vue'

export const setupApp = (app: App) => {
  app.component('Icon', Icon)
  app.component('Empty', Empty)
  app.component('ByEmojiPicker', ByEmojiPicker)
  app.component('Avatar', Avatar)
  app.component('IntersectionLoader', IntersectionLoader)
}
