/**
 * class类组件的contextType传值
 * */
import React from 'react'
import PropTypes from 'prop-types'
import { AppContext } from '@/context/AppContext'

class ClassComponent extends React.Component {
  render() {
    let value = this.context
    return (
      <div>
        <h2>类组件的contextType传值</h2>
        <p>从app传来的值：{value}</p>
      </div>
    )
  }
}

ClassComponent.propTypes = {
  className: PropTypes.string
}

ClassComponent.defaultProps = {
  className: null
}
ClassComponent.contextType = AppContext
export default ClassComponent
