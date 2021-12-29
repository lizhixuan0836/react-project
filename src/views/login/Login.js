import {
  useState
  // useEffect
} from 'react'
import { Form, Input, Button } from 'antd'

import IconFont from 'components/IconFont'
// 引入styled样式库
import './Login.scss'
// import { UserOutlined } from '@ant-design/icons'
// import { apiCaptcha } from 'request/api'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [
    { required: true, message: '请输入邮箱', validateTrigger: 'onBlur' },
    { pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: '请输入正确的邮箱格式', validateTrigger: 'onInput' }
  ],
  image: [{ required: true, message: '请输入姓名' }]
}

const onFinish = (values) => {
  console.log(values)
}

function Login() {
  const [imageUrl, setimageUrl] = useState('/api/captcha')
  // useEffect(() => {
  //   apiCaptcha().then((res) => {
  //     console.log('发送接口的的值')
  //     setimageUrl(res)
  //   })
  //   return () => {
  //     console.log('return的值')
  //     setimageUrl('')
  //   }
  // }, [])
  const handleImage = () => {
    setimageUrl(`/api/captcha?_t=${new Date().getTime()}`)
  }
  return (
    <Form {...layout} onFinish={onFinish}>
      <Form.Item
        name='name'
        label={<IconFont iconName={'icon-yonghu'}>姓名</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.name}
      >
        {/* <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' /> */}
        <Input placeholder='Username' />
      </Form.Item>
      <Form.Item
        name='email'
        label={<IconFont iconName={'icon-youxiang'}>Email</IconFont>}
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.email}
        validateTrigger={['onBlur', 'onInput']}
      >
        <Input placeholder='Email' />
      </Form.Item>
      <Form.Item
        name='image'
        label='image'
        wrapperCol={{ ...layout.labelCol }}
        rules={rules.image}
        validateTrigger='onBlur'
      >
        <img src={imageUrl} alt='captcha' onClick={handleImage} className='img'></img>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
