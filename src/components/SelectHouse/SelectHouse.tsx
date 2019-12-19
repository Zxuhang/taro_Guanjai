import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import './SelectHouse.scss'

import { AtIcon } from "taro-ui"


class SelectHouse extends Component {
    constructor (props: {} | undefined) {
        super(props)
        
    }
    state = {
      current: 0,
      houseList: [],
      houseName:'',
      selectorChecked: 0,//当前选中的房屋
    }
  onChange = e => {
    console.log(e.detail.value)
    this.setState({
        houseName:this.state.houseList[e.detail.value].name,
        selectorChecked: e.detail.value
    },()=>{
        this.props.houseHandle(this.state.houseList[this.state.selectorChecked])
    })
    
  }
  componentWillMount () {
      console.log(this.$router.params)
    let that = this
    Taro.request({//获取house列表
        url: Taro.baseUrl + '/api/house',
        data: {
            user_id: Taro.getStorageSync('user_id')
        },
        method:'GET',
        mode:'no-cors', 
        header: {
          'content-type': 'application/json'
        }
    })
    .then(res=>{
        let selChecked = 0
        if(that.$router.params.houseid){
            res.data.map((item,index)=>{
                if(item.id == that.$router.params.houseid){
                    selChecked = index
                }
            })
        }
        that.setState({ //获取房屋列表       
            houseList : res.data,
            houseName:res.data[selChecked].name,
            selectorChecked:selChecked
        },()=>{        
            console.log(res.data)    
            that.props.houseHandle(that.state.houseList[selChecked])
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
      
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
      const {houseList, selectorChecked, houseName} = this.state
    return (      
        <View className='select-wrap'>
            <View className='selector'>
                <Picker mode='selector' range={houseList} value={selectorChecked} rangeKey='name' onChange={this.onChange}>
                    <View className='picker'>
                        {houseName}<AtIcon className="at-icon" value='chevron-down' ></AtIcon>
                    </View>
                </Picker>
            </View>
        </View>
    )
  }
}
export default SelectHouse;