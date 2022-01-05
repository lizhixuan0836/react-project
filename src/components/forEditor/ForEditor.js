import React, { Component } from 'react'
import './editor.scss'
import Editor from 'for-editor'

// 1、当开始第三方的 tinyMce, wangEditor
// 2、开源的定制 slate.js
// 3、有专门的编辑器的开发团队，自己定制，大厂少少数
class ForEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      timer: null
    }
    this.editorRef = React.createRef()
  }

  handleChange(value) {
    const that = this
    that.setState({
      value
    })
    // 延迟
    clearTimeout(that.timer)
    that.timer = setTimeout(() => {
      that.props.getEditor(value)
    }, 350)
  }
  addImg($file) {
    this.editorRef.current.$img2Url($file.name, 'file_url')
    console.log(this.editorRef, $file)
  }
  componentDidMount() {
    // 文件拖拽
    this.editorRef.current.$vm.current.addEventListener('drop', (e) => {
      e.preventDefault()
      console.log(e.dataTransfer.files, 2222)
    })
  }
  render() {
    const { value } = this.state
    return (
      <div className={'editor-wrap'}>
        <Editor
          ref={this.editorRef}
          height='100%'
          value={value}
          onChange={(value) => this.handleChange(value)}
          addImg={($file) => this.addImg($file)}
        />
      </div>
    )
  }
}

export default ForEditor
