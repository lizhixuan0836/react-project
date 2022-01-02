import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Row, Col, message } from 'antd'

import IconFont from 'components/IconFont'
// 引入styled样式库
import './Login.scss'
import { validatenull } from 'utils/util'
import { userRegister } from 'request/api'
import md5 from 'md5'
const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

function Regist() {
  let navigate = useNavigate()
  // 验证码地址
  const [imageUrl, setimageUrl] = useState('')
  const [form] = Form.useForm()
  const inputRef = useRef(null)
  const [captchaState, setCaptchaState] = useState()

  const rules = {
    email: [
      { required: true, message: '请输入邮箱', validateTrigger: 'onBlur' },
      { pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: '请输入正确的邮箱格式', validateTrigger: 'onInput' }
    ],
    captcha: [{ required: true, message: '请输入验证码' }],
    name: [{ required: true, message: '请输入姓名' }],
    password: [
      { required: true, message: '请输入密码' },
      {
        pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
        message: '密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
        validateTrigger: 'onInput'
      }
    ],
    repassword: [
      {
        validator: () => {
          const password = form.getFieldValue('password')
          const repassword = form.getFieldValue('repassword')
          if (validatenull(password)) {
            return Promise.resolve()
          } else {
            return repassword === password ? Promise.resolve() : Promise.reject(new Error('请输入相同的密码'))
          }
        }
      },
      { required: true, message: '请输入确认密码' },
      {
        pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
        message: '密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
        validateTrigger: 'onInput'
      }
    ]
  }

  // 表单提交回调
  const onFinish = async () => {
    const params = {
      email: form.getFieldValue('email'),
      captcha: form.getFieldValue('captcha'),
      name: form.getFieldValue('name'),
      password: md5(form.getFieldValue('password'))
    }
    console.log(params)
    const res = await userRegister(params)
    if (res.code === 0) {
      message.success('注册成功')
      navigate('/')
    } else {
      message.error(res.message)
    }
  }
  useEffect(() => {
    handleImage()
    // 设置验证码高度
    setCaptchaState(inputRef.current.input.offsetHeight)
    console.log(form, 'form有哪些方法')
    form.setFieldsValue({
      name: '李志轩',
      email: '1031760551@qq.com',
      password: 'Xvange@1995',
      repassword: 'Xvange@1995'
    })
    return () => {}
  }, [form])

  const handleImage = () => {
    setimageUrl(`/api/captcha?_t=${new Date().getTime()}`)
  }
  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item
        name='email'
        label={<IconFont iconName={'icon-youxiang'}>Email</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.email}
        validateTrigger={['onBlur', 'onInput']}
      >
        <Input placeholder='请输入Email' />
      </Form.Item>
      <Form.Item
        name='captcha'
        label='验证码'
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.captcha}
        validateTrigger='onBlur'
      >
        <Row gutter={[16, 0]} justify='space-between'>
          <Col flex={'auto'}>
            <Input placeholder='请输入验证码' ref={inputRef} />
          </Col>
          <Col>
            {/* <Image src={imageUrl} height='auto' preview={false}></Image> */}
            <img src={imageUrl} alt='captcha' onClick={handleImage} className='img' height={captchaState}></img>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        name='name'
        label={<IconFont iconName={'icon-yonghu'}>姓名</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.name}
        validateTrigger={'onBlur'}
      >
        <Input placeholder='请输入姓名' />
      </Form.Item>
      <Form.Item
        name='password'
        label={<IconFont iconName={'icon-mima'}>密码</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.password}
        validateTrigger={'onBlur'}
      >
        <Input.Password placeholder='请输入密码' />
      </Form.Item>
      <Form.Item
        name='repassword'
        label={<IconFont iconName={'icon-mima'}>确认密码</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.repassword}
        validateTrigger={'onBlur'}
      >
        <Input.Password placeholder='请再次输入密码' />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type='primary' htmlType='submit'>
          注册
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Regist
