import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './calendar.scss'
import { AtIcon, AtButton, AtNavBar  } from "taro-ui"
import SelectHouse from '../../components/SelectHouse/SelectHouse'

class calendar extends Component {
  
  constructor(props) {
      super(props);  
        this.initCalendar = this.initCalendar.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.preMonth = this.preMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this)
  }
  state = {
      house:{},
      currentDay: '',
      currentMonth: '', 
      currentYear: '', 
      weekList: [
          {name: '周一', className: ''},
          {name: '周二', className: ''},
          {name: '周三', className: ''},
          {name: '周四', className: ''},
          {name: '周五', className: ''},
          {name: '周六', className: ''},
          {name: '周日', className: ''}
      ],
      dayList: [],
      lockList:[],//开锁的日期 例如：'2019-10-21','2019-11-01','2019-11-04','2019-11-06','2019-11-11'
      info:[]
  }

  backHandle(){//返回上一页
    Taro.navigateBack({ delta: 1 })
  }

  getHouseData(house){
    this.setState({
        house:house
    })
    this.getHouseState(house.id)
  }

  getHouseState(houseid){//获取某月房态信息
    let that = this
    Taro.request({//获取house列表
        url: Taro.baseUrl + '/api/rili/'+houseid,
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
        if(res.data.length == 0){
            Taro.showToast({
                title: '没有数据',
                icon: 'none',
                duration: 2000
              })
        }
        that.setState({
            info:res.data
        },()=>{
            that.initCalendar()
        })
        console.log(res.data)
    })
    .catch(err=>{
        console.log(err)
    })
  }

  componentWillMount() {}

  componentWillUnmount() {}

  componentDidMount() {
      
  }

  // 获取当前date的当月第一天的字符串形式
  getMonthFirstDate(date) {
      let nowYear = date.getFullYear(); // 获取年份
      let nowMonth = date.getMonth()+1; // 获取月份
      return  `${nowYear}-${nowMonth}-01`
  }

  // 获取当前date的字符串形式
  getDateString(date) {
      let nowYear = date.getFullYear(); // 获取年份
      let nowMonth = date.getMonth()+1; // 获取月份
      let day = date.getDate();
      nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth;
      day = day < 10 ? '0' + day : day;
      return  `${nowYear}-${nowMonth}-${day}`
  }

  // 上个月
  preMonth() {
      let date = new Date(`${this.state.currentYear}-${this.state.currentMonth}-${this.state.currentDay}`.replace(/\-/g, '/'))
      let preMonthFirstDate = new Date(this.getMonthFirstDate(new Date(date.setDate(0))).replace(/\-/g, '/')); // 0 是上个月最后一天
      
      this.initCalendar(preMonthFirstDate)
  }

  // 下个月
  nextMonth() {
      let date = new Date(`${this.state.currentYear}-${this.state.currentMonth}-${this.state.currentDay}`.replace(/\-/g, '/'))
      let nextMonthFirstDate = new Date(this.getMonthFirstDate(new Date(date.setDate(33))).replace(/\-/g, '/'));
      this.initCalendar(nextMonthFirstDate)
  }


  // 初始化日历
  initCalendar(currentDate) {
      
      let nowDate = currentDate ? currentDate : new Date();
      let nowMonthFirstDate = this.getMonthFirstDate(nowDate) // 获取当月1号日期
      let nowWeek = new Date(nowMonthFirstDate.replace(/\-/g, '/')).getDay() ? new Date(nowMonthFirstDate.replace(/\-/g, '/')).getDay() : 7; // 获取星期
      let newDateList = []; // 创建日期数组
      let startDay =  2 - nowWeek; // 开始日期的下标  以为 setDate(0)是上个月最后一天  所以是2-nowWeek
      
      let showDayLength = nowWeek < 6 ? 35 : 42;  // 如果5行能显示下一个月 就只显示5行
      
      let past = 'past'//-------------------过去日子的样式
      
      // 循环处理 获取日历上应该显示的日期
      for (let i = startDay; i < startDay + showDayLength; i++) {
          let date = new Date(new Date(nowMonthFirstDate.replace(/\-/g, '/')).setDate(i)); // 获取时间对象
          let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 小于9的数字前面加0
          //-----------
          let lock = false
          let info = ''
          let className = ''
          
          if(this.state.lockList.includes(this.getDateString(date))){//---------判断是否开锁
              lock = true
          }
          this.state.info.forEach(item=>{
              if(item.date == this.getDateString(date)){//--------判断是否有钱
                info = item.text
                className = 'info '
              }
          })
          let dayObject = {}
        //   console.log(nowDate.getMonth(),'====',date.getMonth())
          if(nowDate.getMonth() - date.getMonth() == 0){   //去除上个月和下个月天的数字         
            dayObject = {
                date: this.getDateString(date),
                day,
                lock,
                info,
                className,
            }
          }else{
            dayObject= {
                date: '',
                day:'',
                lock:false,
                info:'',
                className:'',
            }  
          }
        //   console.log(date.toDateString())
          dayObject.className += past
          if (date.toDateString() === new Date().toDateString()) {
            //   dayObject.className += ' today'//今天的样式
              past = ''
          }
          newDateList.push(dayObject)
      }

      this.setState((pre) => {
          return {
              dayList: newDateList,
              currentDay: nowDate.getDate(),
              currentMonth: nowDate.getMonth() + 1 >= 10 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1),
              currentYear: nowDate.getFullYear(),
          }
      })

  }

  renderHeader() {
      const { currentYear, currentMonth} = this.state
      return(
          <View className = 'calendar-header'>
              <View className = 'calendar-header-left'>
                  <AtButton type='primary' onClick = {this.preMonth} size='small'>上个月</AtButton>
              </View>
              <View className = ''>
                  {currentYear}年{currentMonth}月
              </View>
              <View className = 'calendar-header-right'>
                  <AtButton type='primary' onClick = {this.nextMonth} size='small'>下个月</AtButton>
              </View>
          </View>
      )
  }

  renderBody() {
      return(
          <View className = 'calendar-body'>
              <View className = 'week-container'>
                  {this.state.weekList.map(week => {
                      return <View key = {week.name} className = {`week ${week.className}`}>{week.name}</View>
                  })}
              </View>
              <View className = 'day-container'>
                  {this.state.dayList.map( (dayObject, index) => {
                      let lockB = null
                          lockB = <View style="height:16Px;"></View>
                      let infoB = null
                          infoB = <Text></Text>
                      if(dayObject.lock){
                        lockB = <View ><AtIcon value='lock' size="16" color='#888'></AtIcon></View>
                      }
                      if(dayObject.info){
                        infoB = <View className='public-color' style="margin:5Px 0;font-weight:bold;word-break:break-word;line-height:normal;">{'+'+dayObject.info}</View>
                      }
                      return <View key = {index} className = {`day ${dayObject.className}`}>
                            {dayObject.day}
                            {infoB}
                            {lockB}
                            </View>
                  })}
              </View>
          </View>
      )
  }

  render() {
      return(
          <View className = 'calendar'>
              <AtNavBar
                leftIconType='chevron-left'
                onClickLeftIcon={this.backHandle}
                color='#000'
                title='房态日历'
                />
                <SelectHouse houseHandle={this.getHouseData.bind(this)} />
              {this.renderHeader()}
              {this.renderBody()}
          </View>
      )
  }

}

export default calendar;