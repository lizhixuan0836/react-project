import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

@connect(
  // 第一个参数：mapStateToProps, mapStateToProps(state, [ownProps]): stateProps ] (Function)
  // 该回调函数必须返回⼀个纯对象，这个对象会与组件的 props 合并如果定义该参数，组件将会监听 Redux store 的变化，否则 不监听。
  // ownProps 是当前组件⾃身的props，如果指定了，那么只要组件接收到新的
  // props， mapStateToProps 就会被调⽤，mapStateToProps 都会被重新计
  // 算， mapDispatchToProps 也会被调⽤。注意性能！

  // (state) => ({ count: state.count })
  // 简写
  // ({ count }) => ({ count })
  // 重命名
  ({ count }) => ({ c: count }),

  // 第二个参数：mapDispatchToProps (object | function)
  // mapDispatchToProps(dispatch, [ownProps]): dispatchProps ] (Object or Function):
  // 如果你省略这个 mapDispatchToProps 参数，默认情况下， dispatch 会注⼊到你的组件 props
  // 中。
  // 如果传递的是⼀个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所
  // 定义的⽅法名将作为属性名；每个⽅法将返回⼀个新的函数，函数中 dispatch ⽅法会将action
  // creator的返回值作为参数执⾏。这些属性会被合并到组件的 props 中。
  // 如果传递的是⼀个函数，该函数将接收⼀个 dispatch 函数，然后由你来决定如何返回⼀个对
  // 象。
  // ownProps 是当前组件⾃身的props，如果指定了，那么只要组件接收到新的
  // props， mapDispatchToProps 就会被调⽤。注意性能！

  // object
  // {
  //     add:()=>({
  //         type:'ADD',payload:1
  //     })
  // }

  // function
  (dispatch) => {
    // const add = () => dispatch({ type: 'ADD', payload: 10 })
    // const minus = () => dispatch({ type: 'MINUS', payload: 10 })
    // return {
    //     dispatch, add, minus
    // }
    let creators = {
      add: () => ({ type: 'ADD', payload: 10 }),
      minus: () => ({ type: 'MINUS', payload: 10 })
    }
    creators = bindActionCreators(creators, dispatch)
    return {
      dispatch,
      ...creators
    }
  },

  // 第三个参数：mergeProps
  // mergeProps(stateProps, dispatchProps, ownProps): props ] (Function)
  // 如果指定了这个参数， mapStateToProps() 与 mapDispatchToProps() 的执⾏结果和组件⾃
  // 身的 props 将传⼊到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件
  // 中。你也许可以⽤这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中
  // 的某个特定变量与 action creator 绑定在⼀起。如果你省略这个参数，默认情况下返回
  // Object.assign({}, ownProps, stateProps, dispatchProps) 的结果。
  (stateProps, dispatchProps, ownProps) => {
    return { ...stateProps, ...dispatchProps, ...ownProps, lzx: 'lzx' }
  }
)
class ReactReduxPage extends React.Component {
  // // connect第二个参数为object时候有add的话dispatch就没了，connect第二个参数为function时候可以添加add和dispatch，先注释
  dispatchAdd = () => {
    const { dispatch } = this.props
    dispatch({ type: 'ADD', payload: 100 })
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <p>Hello ReactReduxPage</p>
        {/* <div>{this.props.count}</div> */}
        <div>{this.props.c}</div>
        <button onClick={this.dispatchAdd}>dispatch add</button>
        <button onClick={this.props.add}>dispatch add</button>
        <button onClick={this.props.minus}>dispatch minus</button>
      </div>
    )
  }
}

export default ReactReduxPage
