import Schema, { Rules } from 'async-validator'

export async function commentCheck(data: any, rule: Rules): Promise<{ errors: any; fields: any }> {
  const validator = new Schema(rule)
  return validator
    .validate(data)
    .then(() => {
      return {
        errors: null,
        fields: null
      }
    })
    .catch(({ errors, fields }) => {
      return {
        errors,
        fields
      }
    })
}

// 表单校验规则
const descriptor: any = {
  username: [
    {
      type: 'string',
      required: true,
      // 用户名只能是数字和字母
      validator: (_, value: string) => {
        const flag = new RegExp(/\S+/, 'g').test(value)
        const errors: string[] = []
        if (!flag) {
          errors.push('用户名不能为空')
        }
        return errors
      }
    },
    {
      validator: (_, value: string) => {
        const flag = new RegExp(/^[a-zA-Z0-9]+$/, 'g').test(value)
        const errors: string[] = []
        if (!flag) {
          errors.push('用户名只能是数字和字母')
        }
        return errors
      }
    }
  ],
  password: {
    type: 'string',
    required: true,
    validator: (_, value: string) => {
      const flag = new RegExp(/\S+/, 'g').test(value)
      const errors: string[] = []
      if (!flag) {
        errors.push('密码不能为空')
      }
      return errors
    }
  },
  phone: [
    {
      type: 'number',
      required: true,
      validator: (_, value: string) => {
        const flag = new RegExp(/\S+/, 'g').test(value)
        const errors: string[] = []
        if (!flag) {
          errors.push('手机号不能为空')
        }
        return errors
      }
    },
    {
      validator: (_, value: string) => {
        let isPhone = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
        const flag = new RegExp(isPhone, 'g').test(value)
        const errors: string[] = []
        if (!flag) {
          errors.push('请输入正确的手机号')
        }
        return errors
      }
    }
  ],
  again: {
    type: 'string',
    required: true,
    validator: (_, value: string) => {
      const flag = new RegExp(/\S+/, 'g').test(value)
      const errors: string[] = []
      if (!flag) {
        errors.push('再次输入不能为空')
      }
      return errors
    }
  },
  email: {
    type: 'email',
    required: true,
    validator: (_, value: string) => {
      const flag = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, 'g').test(value)
      console.log(flag)

      const errors: string[] = []
      if (!flag) {
        errors.push('邮箱不能为空且必须是有效邮箱 ')
      }
      return errors
    }
  },
  code: {
    type: 'string',
    required: true,
    validator: (_, value: string) => {
      const flag = new RegExp(/\S+/, 'g').test(value)
      const errors: string[] = []
      if (!flag) {
        errors.push('验证码不能为空')
      }
      return errors
    }
  }
}

/**
 * 表单校验方法
 * @param data 需要校验的数据
 * @returns
 */
export const checkAll = async (data: any) => {
  // 获取 所有需要校验的数据对象的键名
  const objKeys = Object.keys(data)
  // 保存当前校验后的结果
  const checkResult: any = {}
  // 保存当前校验数据所使用的校验规则
  const checkData: any = {}
  // 把需要的校验规则从 descriptor 中 取出来
  objKeys.map((k) => {
    checkData[k] = descriptor[k]
  })
  // 调用封装好的 async-validator api
  const result = await commentCheck(data, checkData as Rules)
  // 处理校验完的结果
  objKeys.map(async (k) => {
    // 判断当前校验是否失败 失败就有失败message
    // 如果校验通过 就不执行 以下代码
    if (result.fields && result.fields[k]) {
      checkResult[k] = result.fields[k][0].message
    }
  })
  // 返回校验结果
  return checkResult
}
