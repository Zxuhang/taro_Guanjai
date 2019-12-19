import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可

// Taro.baseUrl = 'http://tujia.diandouba.com'//公共api接口
Taro.baseUrl = ''//dev 要设置为空

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [      
      'pages/index/index',
      'pages/calendar/calendar',
      'pages/bill_details/bill_details'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  getRequest() {   //获取url传的参数
    var url = window.location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
       var str = url.substr(1);   
       var strs = str.split("&");   
       for(var i = 0; i < strs.length; i ++) {   
           //就是这句的问题
          theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
          //之前用了unescape()会出现乱码  
       }   
    }   
    return theRequest;   
 }

  componentDidMount () {
    let urlData = this.getRequest()
    if( urlData.user_id){
      Taro.setStorageSync('user_id', urlData.user_id)
    }else{
      Taro.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    }
    console.log(window.location)
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
