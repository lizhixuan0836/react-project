import React from 'react';
import store from '../store'
class ReduxPage extends React.Component {
    add = () => {
        store.dispatch({ type: "ADD", payload: 1 })
    }
    asyncAdd = () => {
        store.dispatch((dispatch, getState) => {
            setTimeout(() => {
                // console.log("now ", getState()); //sy-log
                dispatch({ type: "ADD", payload: 10 });
            }, 1000);
        });
    }
    promiseAdd = () => {
        store.dispatch(Promise.resolve({ type: "ADD", payload: 100 }));
    }
    componentDidMount() {
        store.subscribe(() => {
            this.forceUpdate()
        })
    }

    render() {
        return (
            <div>
                <p>Hello ReduxPage</p>
                {/* <div>{store.getState()}</div> */}
                {/* 获取某一个 */}
                <div>{store.getState().count}</div>
                <button onClick={this.add}>add 1</button>
                <button onClick={this.asyncAdd}>asyncAdd 10</button>
                <button onClick={this.promiseAdd}>promiseAdd 100</button>
            </div>
        );
    }
}

export default ReduxPage;