import React, { useState } from 'react'
import { Row, Col, Button } from 'antd'
import ForEditor from 'components/forEditor/ForEditor'
import ForEditorDetail from 'components/forEditor/ForEditorDetail'
import { articleCreate } from 'request/api'

function MarkDown() {
  const [content, setContent] = useState('111')
  // 更新content值
  const handleGetEditor = (value) => {
    setContent(value)
  }
  // 提交
  const handleSumbit = () => {
    console.log(content)
    articleCreate({
      content
    })
  }
  return (
    <div className='home-function'>
      {/* <h1>{title}</h1> */}
      <Button type='primary' onClick={handleSumbit}>
        提交
      </Button>
      <Row>
        <Col span={12}>
          <ForEditor getEditor={handleGetEditor}></ForEditor>
        </Col>
        <Col span={12}>
          <ForEditorDetail content={content}></ForEditorDetail>
        </Col>
      </Row>
    </div>
  )
}

export default MarkDown
