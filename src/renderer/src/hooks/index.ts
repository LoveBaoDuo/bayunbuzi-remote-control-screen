import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

const emitter = new IpcEmitter()
/**
 * 获取当前用户id
 */
export const userUserInfo =async () => {
  return await emitter.invoke("store_get","userInfo")
}
export function useClickOutside(elementRef, callback) {
  const handler = (event) => {
    if (elementRef.value && !elementRef.value.contains(event.target)) {
      callback(event);
    }
  };

  onMounted(() => {
    document.addEventListener('click', handler);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handler);
  });
}
