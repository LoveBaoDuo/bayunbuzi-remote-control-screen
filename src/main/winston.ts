// 配置 winston 日志记录器
import * as winston from "winston";
import {app} from "electron";
import path from "path";
const logFilePath = path.join(app.getPath('userData'), 'app.log');
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(), // 添加时间戳
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`; // 自定义输出格式
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath })
  ]
});
