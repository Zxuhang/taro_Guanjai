import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './bill_details.scss'

import { AtNavBar } from "taro-ui"


class BillDetails extends Component {
    constructor (props: {} | undefined) {
        super(props)
        
    }
    state = {
        daysBill:{},
        title:''
    }
  componentWillMount () {
    let that = this
      Taro.request({//获取house列表
          url: Taro.baseUrl + '/api/monthly_bill/0',
          data: {
              user_id: Taro.getStorageSync('user_id'),
              house_id:that.$router.params.house_id,
              monthly:that.$router.params.month
          },
          method:'GET',
          mode:'no-cors', 
          header: {
            'content-type': 'application/json'
          }
      })
      .then(res=>{
        that.setState({
            daysBill:res.data,
            title:res.data.years+'年'+res.data.monthly+'月账单'
        })
        console.log(res);
      })
      .catch(err=>{
        console.log(err)
      })
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  backHandle(){//返回上一页
    Taro.navigateBack({ delta: 1 })
  }

  daysBillList(){
    let content = this.state.daysBill.content?this.state.daysBill.content:[];

    let dayBillList = content.map((item,index)=>{
        return <View className='list-l'>
                    <View className='font-bold'>{item.yue}月{item.ri}日</View>
                    <View className='list-c font-size1'>
                        <Text>房屋收入</Text>
                        <Text className='color4'>+￥{item.money}</Text>
                    </View>
                    {/* <View className='color1 font-size1'>入离店日期：2019.09.09-2019.09.10</View> */}
                    <View className='list-c font-size1'>
                        <Text>代理服务费</Text>
                        <Text className='color3'>-￥{item.shouxufei}</Text>
                    </View>
                </View>
    })
    return dayBillList
  }
  render () {
    return (
      <View className='bill-details'>
        <AtNavBar
            leftIconType='chevron-left'
            onClickLeftIcon={this.backHandle}
            color='#000'
            title={this.state.title}
            />
        <View style='background:#fff;'>
        {/* <View style='font-weight:bold;font-size:20Px;text-align:center;'>账单周期</View>
        <View style='font-weight:bold;font-size:16Px;text-align:center;'>2019-09-01至2019-09-30</View> */}
        <View style='font-size:12Px;color:#aaa;text-align:center;padding:10Px;'>业主收入=房费收入+非房费收入-服务费-其他费用</View>
        </View>
        <View className='bill-total'>
            <View className='color1 font-size1'>本期已出账单</View>
            <View className='color2 font-bold' style="font-size:30Px;">￥{(this.state.daysBill.money_yuan-this.state.daysBill.shouxifei)?(this.state.daysBill.money_yuan-this.state.daysBill.shouxifei):0}</View>
            <View className='color1 font-size1'>未出账单</View>
            <View className='font-bold'>￥{this.state.daysBill.weichu}</View>
            <View className='color1 font-size1 total-des'>离店日在账期内房单会纳入本期账单,离店日不在账期内房单,会在离店当期账单统计</View>
            <View className='bill-tnum'>
                <View className='bill-tnum-des'>
                    <View className='font-size1 font-bold'>总收入</View>
                    <View>
                        <View className='color1 font-size1'>房屋收入</View>
                        <View className='color4'>￥{this.state.daysBill.money_yuan}</View>
                    </View>
                    <View>
                        <View className='color1 font-size1'>非房屋收入</View>
                        <View className='color4'>￥0</View>
                    </View>
                </View>
                <View className='bill-tnum-des'>
                    <View className='font-size1 font-bold'>总支出</View>
                    <View>
                        <View className='color1 font-size1'>代理服务费</View>
                        <View className='color3'>￥{this.state.daysBill.shouxifei}</View>
                    </View>
                    <View>
                        <View className='color1 font-size1'>其他费用</View>
                        <View className='color3'>￥0</View>
                    </View>
                </View>
            </View>
        </View>
        <View className='bill-list'>
            <View className='bill-list-title'>
                <View className='font-bold font-size2'>本期账单明细</View>
                <View className='title-des font-size1 color1'>
                    <View>日期/费用类型</View>
                    <View>收入/支出</View>
                </View>
            </View>
            <View style="background:#fff;">
                {this.daysBillList()}
                <View className='font-bold bottom-total'>
                    <Text>合计收入</Text>
                    <Text>￥{this.state.daysBill.money_yuan-this.state.daysBill.shouxifei}</Text>
                </View>
            </View>
            <View style='width:90%;margin:20Px auto;'>
                <View className='font-bold font-size1'><Text className='color4'>*</Text>温馨提示</View>
                <View className='color1 font-size1'>1、当月账单,会在次月7号之后发送给您;</View>
                <View className='color1 font-size1'>2、合同模式为"分成",离店日期在当月的订单所有房费收入计入本月账单,离店日期不在当月的订单所有房费收入计入离店月账单;</View>
                <View className='color1 font-size1'>3、收到账单后请及时与掌柜核对账单,确认无误后,请确认账单,已确认的账单将在每月10号汇到您业主中心的结算账户,请及时维护您的结算账户,以免收款失败;</View>
            </View>
        </View>
      </View>      
    )
  }
}

export default BillDetails;