import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './login.scss'

import { AtInput, AtForm } from "taro-ui"


class Login extends Component {
    constructor (props: {} | undefined) {
        super(props)
        
    }
    state = {
    }
  componentWillMount () {
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    return (
      <View className='Login'>
        <AtInput
            name='value2'
            title='数字'
            type='number'
            placeholder='请输入数字'
            value={this.state.value2}
            onChange={this.handleChange.bind(this)}
        />
        <AtInput
            name='value3'
            title='密码'
            type='password'
            placeholder='密码不能少于10位数'
            value={this.state.value3}
            onChange={this.handleChange.bind(this)}
        />
      </View>      
    )
  }
}

export default Login;