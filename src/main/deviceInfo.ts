import si from 'systeminformation'

/**
 * 获取设备uuid
 */
export const getDeviceUUID = () => {
  return si.uuid()
}
