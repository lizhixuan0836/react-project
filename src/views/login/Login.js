import { Form, Input, Button } from 'antd'
import IconFont from 'components/IconFont'
// import { UserOutlined } from '@ant-design/icons'
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
  ]
}

const onFinish = (values) => {
  console.log(values)
}

function Login() {
  return (
    <Form {...layout} name='nest-messages' onFinish={onFinish}>
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
        <Input />
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
