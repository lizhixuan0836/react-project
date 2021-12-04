import React from 'react';
import store from '../store'
class ReduxPage extends React.Component {
    add = () => {
        store.dispatch({ type: "ADD", payload: 100 })
    }
    asyncAdd = () => {
        store.dispatch((dispatch, getState) => {
            setTimeout(() => {
                console.log("now ", getState()); //sy-log
                dispatch({ type: "ADD", payload: 1 });
            }, 1000);
        });
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
                <div>{store.getState()}</div>
                <button onClick={this.add}>add</button>
                <button onClick={this.asyncAdd}>一秒后add</button>
            </div>
        );
    }
}

export default ReduxPage;