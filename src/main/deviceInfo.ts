import si from 'systeminformation'

/**
 * 获取设备uuid
 */
export const getDeviceHostName = async () => {
 const systemInfo = await si.osInfo()
  return systemInfo.hostname
}
