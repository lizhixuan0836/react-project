import { useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Row, Col, message } from 'antd'

import IconFont from 'components/IconFont'
// 引入styled样式库
import './Login.scss'
import { userLogin } from 'request/api'
import md5 from 'md5'
const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

function Login() {
  // 验证码地址
  const [imageUrl, setimageUrl] = useState('/api/captcha')
  const [form] = Form.useForm()
  const inputRef = useRef(null)
  const [captchaState, setCaptchaState] = useState()

  const rules = {
    email: [
      { required: true, message: '请输入邮箱', validateTrigger: 'onBlur' },
      { pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: '请输入正确的邮箱格式', validateTrigger: 'onInput' }
    ],
    captcha: [{ required: true, message: '请输入验证码' }],
    password: [
      { required: true, message: '请输入密码' },
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
      password: md5(form.getFieldValue('password'))
    }
    console.log(params)
    const res = await userLogin(params)
    console.log(res, '登录信息')
    if (res.code === 0) {
      message.success('登录成功')
    } else {
      message.error(res.message)
    }
  }
  useEffect(() => {
    // 设置验证码高度
    setCaptchaState(inputRef.current.input.offsetHeight)
    form.setFieldsValue({
      email: '1031760551@qq.com',
      password: 'Xvange@1995'
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
        name='password'
        label={<IconFont iconName={'icon-mima'}>密码</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.password}
        validateTrigger={'onBlur'}
      >
        <Input.Password placeholder='请输入密码' />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type='primary' htmlType='submit'>
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
