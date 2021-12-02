/**
 * 函数组件的useContext传值
 * */ 
import React, { useState,useContext } from 'react';
import {AppContext} from '../context/AppContext'
function HomeFunction() {
    const [title, setTitle] = useState('这是一个title')
    const context = useContext(AppContext)
    return (
        <div className='home-function'>
            <h2>函数组件的useContext传值</h2>
            <p>从app传来的值：{title}</p>
            <button onClick={() => setTitle(context)}>设置title为空</button>
        </div>
    );
}

export default HomeFunction