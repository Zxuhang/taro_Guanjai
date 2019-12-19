import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './Index.scss'

import { AtTabs, AtTabsPane, AtList, AtListItem } from "taro-ui"
import SelectHouse from '../../components/SelectHouse/SelectHouse'


class Index extends Component {
    constructor (props: {} | undefined) {
        super(props)
        
    }
    state = {
      currenthouseid:'',
      current: 0,
      status:'',
      address:'',
      housing_source_number:'',
      contract_number:'',
      cooperation_mode:'',
      owner_dividing:'',
      time:'',
      imgsrc:'',
      billList:[],//账单列表
    }
  getBill(){
    let that = this
    Taro.request({//获取house列表
      url: Taro.baseUrl + '/api/monthly_bill',
        data: {
            user_id: Taro.getStorageSync('user_id'),
            house_id:that.state.currenthouseid,
        },
        method:'GET',
        mode:'no-cors', 
        header: {
          'content-type': 'application/json'
        }
    })
    .then(res=>{
      that.setState({
        billList:res.data
      })
      console.log(res);
    })
    .catch(err=>{
      console.log(err)
    })
  }
  handleClick (value: any) {
    if(value == 1){
      Taro.showToast({
        title: '开发中...',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    
    console.log(value)
    
    if(value == 2){
      this.getBill()
    }
    this.setState({
      current: value
    })
    
  }
  toLink = (link)=>{
    Taro.navigateTo({
      url:link
    })
  }
  getHouseData(house){//获取房屋信息
    this.setState({
      currenthouseid:house.id,
      status:house.status == 1 ? '上架' : '下架',
      address:house.address,
      housing_source_number:house.housing_source_number,
      contract_number:house.contract_number,
      cooperation_mode:house.cooperation_mode,
      owner_dividing:'您占房费收益' + house.owner_dividing + '%',
      time:house.agreement_start.substr(0,10) + '至' + house.agreement_end.substr(0,10),
      imgsrc:house.img
    },()=>{
      this.getBill()
    })
  }
  componentWillMount () {
    
    console.log(this.state)
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    const tabList = [{ title: '房屋' }, { title: '经营日志' }, { title: '账单列表' }]
    const { billList } = this.state
    const billListView = billList.map((item) =>{
      let billMonth = item.list.map((items)=>{
        return  <View className='bill-item' onClick={this.toLink.bind(this,'../bill_details/bill_details?month='+items.month+'&house_id='+this.state.currenthouseid)}>
                  <View className='b-i-top'>
                    <Text className='b-i-t'>{item.years}年{items.month}月账单</Text>          
                    <Text className='b-i-c2 public-color'>+{items.money}</Text>        
                  </View>
                  <View className='b-i-bottom'>
                    账单{items.status}
                  </View>
                </View>
      })
      return  <View className='bill-list'>
                  <h3>{item.years}年</h3>
                  {billMonth}                  
              </View>
    });
    console.log(this)
    return (
      <View className='Index'>
            <View className='top'>
                <View className='title'>我的房屋</View>
                <SelectHouse houseHandle={this.getHouseData.bind(this)} />
            </View>
            <AtTabs className='tabs' current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                <AtTabsPane className='tab' current={this.state.current} index={0} >
                
                  <Image
                    style='width: 100%;margin-top:2Px;height: 250Px;background: #fff;display:block;'
                    src={this.state.imgsrc}
                  />
                  <View className='desc'>
                   <View className='des'> <Text className='d-title'>房屋状态</Text><Text className='d-cont'>{this.state.status}</Text> </View>
                   <View className='des'> <Text className='d-title'>房屋地址</Text><Text className='d-cont' style="max-width:250Px;">{this.state.address}</Text> </View>
                   <View className='des'> <Text className='d-title'>房源编号</Text><Text className='d-cont'>{this.state.housing_source_number}</Text> </View>
                   <View className='des'> <Text className='d-title'>合同编号</Text><Text className='d-cont'>{this.state.contract_number}</Text> </View>
                   <View className='des'> <Text className='d-title'>合作分成</Text><Text className='d-cont'>{this.state.cooperation_mode}</Text> </View>
                   <View className='des'> <Text className='d-title'>分成模式</Text><Text className='d-cont'>{this.state.owner_dividing}</Text> </View>
                   <View className='des'> <Text className='d-title'>协议时间</Text><Text className='d-cont'>{this.state.time}</Text> </View>
                  </View>
                  <View className='list'>
                    <AtList>
                      <AtListItem title='查看房态日历' onClick={this.toLink.bind(this,'../calendar/calendar?houseid='+this.state.currenthouseid)} arrow='right' />
                      {/* <AtListItem title='门锁开锁记录' arrow='right' />
                      <AtListItem title='查看房屋合同' arrow='right' /> */}
                    </AtList>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={2}>
                    {billListView}
                </AtTabsPane>
            </AtTabs>
      </View>      
    )
  }
}

export default Index;