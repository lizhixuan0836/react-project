/**
 * class类组件的Consumer传值
 * */ 
import {AppContext} from '../context/AppContext'
const {Consumer} = AppContext

function HomeClassConsumer() {
    return (
        <Consumer>{
            (context) => {
                return (
                    <>
                        <h2>类组件的Consumer传值</h2>
                        <div>app传来的值：{context}</div>
                    </>
                )
            }
        }</Consumer>
    );
}

export default HomeClassConsumer