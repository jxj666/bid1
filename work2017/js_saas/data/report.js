$(function(){

  $.ajax({
    type: 'POST',
    url: '/api/v1/data/GetSysTime',
    success: function (res) {
      ajaxResHandle(res, getSystemTime);
    }
  })

  function getSystemTime(res) {
    if(res.code === 1) {
      init(res.context.currenttime);
    } else {
      alert('初始化失败【SystemTime Get Error!】');
    }
  }

  function init(systemTime){
    calendarInit(systemTime)
  }

  function calendarInit(systemTime) {
    var today = moment(new Date(systemTime).getTime()).format('YYYY-MM-DD');
    var yesterday = moment(new Date(today).getTime()).startOf('day').subtract(1, 'days').format('l');
    var yesterdayEnd = moment(new Date(yesterday).getTime()).endOf('day').format('l');
    // 日历
    var calendar = flatpickr('.flatpickr-input', {
      dateFormat: 'Y-m-d H:i:ss',
      disableMobile: true,
      disable: [
        {
          from: today,
          to: "9999"
        }
      ],
      defaultDate: [yesterday, yesterday],
      onClose: function (selectedDates, dateStr, instance) {
        //var timeArr = formatDate($('.flatpickr-input').val());
        //var beginTime = moment(timeArr[0]).startOf('day').format('l');
        //var endTime = moment(timeArr[0]).endOf('day').format('l');
        var beginTime = moment(selectedDates[0]).startOf('day').format('l');
        var endTime = moment(selectedDates[0]).endOf('day').format('l');

        //$('.flatpickr-input').val(calendar.formatDate(calendar.selectedDates[0], 'Y-m-d H:i') + ' ~ ' + moment(calendar.selectedDates[1].getTime()).endOf('day').format('YYYY-MM-DD HH:mm'));
        $('.flatpickr-input').val(beginTime + ' ~ ' +  endTime);

        var begin = new Date(beginTime.replace(/-/g, "/")).getTime();
        var end = new Date(endTime.replace(/-/g, "/")).getTime();
        getReportData('ReportActivity', {beginTime: begin, endTime: end});
        //getReportData('ReportActivityTrend', {beginTime: begin, endTime: end});
        getReportData('ReportAward', {beginTime: begin, endTime: end});
        getReportData('ReportAwardTotal', {beginTime: begin, endTime: end});
        getReportData('ReportCityScan', {beginTime: begin, endTime: end, province: '江西'});
        getReportData('ReportProvinceScan', {beginTime: begin, endTime: end});
        getReportData('ReportProvinceScanTotal', {beginTime: begin, endTime: end});
      },
      onReady: function (selectedDates, dateStr, instance) {
        var beginTime = moment(selectedDates[0]).startOf('day').format('l');
        var endTime = moment(selectedDates[0]).endOf('day').format('l');

        $('.flatpickr-input').val(beginTime + ' ~ ' +  endTime);
        
        var begin = new Date(beginTime.replace(/-/g, "/")).getTime();
        var end = new Date(endTime.replace(/-/g, "/")).getTime();
        getReportData('ReportActivity', {beginTime: begin, endTime: end});
        getReportData('ReportActivityTrend', {beginTime: (begin - 14 * 24 * 60 * 60 * 1000), endTime: end});
        getReportData('ReportAward', {beginTime: begin, endTime: end});
        getReportData('ReportAwardTotal', {beginTime: begin, endTime: end});
        getReportData('ReportCityScan', {beginTime: begin, endTime: end, province: '江西'});
        getReportData('ReportProvinceScan', {beginTime: begin, endTime: end});
        getReportData('ReportProvinceScanTotal', {beginTime: begin, endTime: end});
      }
    });
  }
  function formatDate(val) {
    if (!val || val.indexOf('to') === -1) {
      return;
    }
    return val.split(/\s*to\s*/);
  }

  var typeMap = {
    ReportActivity: {
      url: '/api/v1/data/GetReportActivity',
      method: getReportActivity
    },
    ReportActivityTrend: {
      url: '/api/v1/data/GetReportActivityTrend',
      method: getReportActivityTrend
    },
    ReportAward: {
      url: '/api/v1/data/GetReportAward',
      method: getReportAward
    },
    ReportAwardTotal: {
      url: '/api/v1/data/GetReportAwardTotal',
      method: getReportAwardTotal
    },
    ReportCityScan: {
      url: '/api/v1/data/GetReportCityScan',
      method: getReportCityScan
    },
    ReportProvinceScan: {
      url: '/api/v1/data/GetReportProvinceScan',
      method: getReportProvinceScan
    },
    ReportProvinceScanTotal: {
      url: '/api/v1/data/GetReportProvinceScanTotal',
      method: getReportProvinceScanTotal
    },
  }
  function getReportData(type, data) {
    $.ajax({
      type: 'POST',
      url: typeMap[type].url,
      data: data,
      success: function (res) {
        ajaxResHandle(res, typeMap[type].method);
      }
    })
  }

  // 活动趋势关键指标
  function getReportActivity(res) {
    var dataItems = res.context.result;
    var tHtml = '';
    for(var i = 0; i < dataItems.length; i++) {
      var dataItem = dataItems[i];
      tHtml += '<tr>';
      tHtml += '<td>' + dataItem.name + '</td>';
      tHtml += '<td>' + dataItem.cnt + '</td>';
      tHtml += '<td>' + dataItem.hb + '%</td>';
      tHtml += '<td>' + dataItem.tb + '%</td>';
      tHtml += '</tr>';
    }
    $('#reportActivity').html(tHtml);
  }

  // 单日走势
  function getReportActivityTrend(res){
    var option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: res.context.x
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: true,
            itemWidth: 5,
            padding: 3,
            data:['扫码次数','扫码包数','抽奖次数','首验包数','新用户','扫码用户']
        },
        yAxis: {
            type: 'value'
        },
        grid: {
          left: '2%',
          right: '6%',
          top: '15%',
          bottom: '2%',
          witdh: '92%',
          height: '80%',
          containLabel: true
        },
        series: [
            {
                name:'扫码次数',
                type:'line',
                data: res.context.yScan
            },
            {
                name:'扫码包数',
                type:'line',
                data: res.context.yCode
            },
            {
                name:'抽奖次数',
                type:'line',
                data: res.context.yDraw
            },
            {
                name:'首验包数',
                type:'line',
                data: res.context.yVerify
            },
            {
                name:'扫码用户',
                type:'line',
                data: res.context.yScanuser
            },
            {
                name:'新用户',
                type:'line',
                data: res.context.yUser
            },
        ]
    };
    var echart = echarts.init(document.getElementById('activitytrend'));
    echart.setOption(option);
  }

  // 获取奖品单日数据
  function getReportAward(res) {
    var dataItems = res.context.result;
    var tHtml = '';
    for(var i = 0; i < dataItems.length; i++) {
      var dataItem = dataItems[i];
      tHtml += '<tr>';
      if(dataItem.productName === '红包合计' || dataItem.productName === '全部礼品合计') {
        tHtml += '<tr style="color: #333;font-weight: bold;">';
        tHtml += '<td style="font-weight: bold;">' + dataItem.productName+ '</td>';
        tHtml += '<td style="color: #ff4545;">' + dataItem.cnt + '</td>';
        tHtml += '<td style="color: #ff4545;">' + dataItem.money + '</td>';
        tHtml += '</tr>';
      } else {
        tHtml += '<tr>';
        tHtml += '<td style="font-weight: 200;">' + dataItem.productName+ '</td>';
        tHtml += '<td>' + dataItem.cnt + '</td>';
        tHtml += '<td>' + dataItem.money + '</td>';
        tHtml += '</tr>';
      }
    }
    $('#reportAward').html(tHtml);
  }

  // 获取奖品累计数据
  function getReportAwardTotal(res){
    var dataItems = res.context.result;
    var tHtml = '';
    for(var i = 0; i < dataItems.length; i++) {
      var dataItem = dataItems[i];
      if(dataItem.productName === '红包合计' || dataItem.productName === '全部礼品合计') {
        tHtml += '<tr style="color: #333;font-weight: bold;">';
        tHtml += '<td style="font-weight: bold;">' + dataItem.productName+ '</td>';
        tHtml += '<td style="color: #ff4545;">' + dataItem.cnt + '</td>';
        tHtml += '<td style="color: #ff4545;">' + dataItem.money + '</td>';
        tHtml += '</tr>';
      } else {
        tHtml += '<tr>';
        tHtml += '<td style="font-weight: 200;">' + dataItem.productName+ '</td>';
        tHtml += '<td>' + dataItem.cnt + '</td>';
        tHtml += '<td>' + dataItem.money + '</td>';
        tHtml += '</tr>';
      }
    }
    $('#reportAwardTotal').html(tHtml);
  }

  // 获取城市扫码数据
  function getReportCityScan(res){
    var dataItems = res.context.result;
    var tHtml = '';
    for(var i = 0; i < dataItems.length; i++) {
      var dataItem = dataItems[i];
      tHtml += '<tr>';
      tHtml += '<td style="font-size: .26rem;">' + dataItem.region + '</td>';
      // 扫码次数
      tHtml += '<td>' + dataItem.scan + '</td>';
      // 扫码包数
      tHtml += '<td>' + dataItem.code + '</td>';
      // 扫码人数
      tHtml += '<td>' + dataItem.scanUser + '</td>';
      // 首验包数
      tHtml += '<td>' + dataItem.verify + '</td>';
      // 抽奖次数
      tHtml += '<td>' + dataItem.draw + '</td>';
      tHtml += '</tr>';
    }
    $('#reportCityScan').html(tHtml);
  }

  // 获取省份扫码数据
  function getReportProvinceScan(res) {
    var dataItems = res.context.result;
    var tHtml = '';
    for(var i = 0; i < dataItems.length; i++) {
      var dataItem = dataItems[i];
      tHtml += '<tr>';
      tHtml += '<td style="font-size: .26rem;">' + dataItem.region + '</td>';
      // 扫码次数
      tHtml += '<td>' + dataItem.scan + '</td>';
      // 扫码包数
      tHtml += '<td>' + dataItem.code + '</td>';
      // 扫码人数
      tHtml += '<td>' + dataItem.scanUser + '</td>';
      // 首验包数
      tHtml += '<td>' + dataItem.verify + '</td>';
      // 抽奖次数
      tHtml += '<td>' + dataItem.draw + '</td>';
      tHtml += '</tr>';
    }
    $('#reportProvinceScan').html(tHtml);
  }
  
  // 获取省份扫码累计数据
  function getReportProvinceScanTotal(res) {
    var dataItems = res.context.result;
    var tHtml = '';
    for(var i = 0; i < dataItems.length; i++) {
      var dataItem = dataItems[i];
      tHtml += '<tr>';
      tHtml += '<td style="font-size: .26rem;">' + dataItem.region + '</td>';
      // 扫码次数
      tHtml += '<td>' + dataItem.scan + '</td>';
      // 扫码包数
      tHtml += '<td>' + dataItem.code + '</td>';
      // 扫码人数
      tHtml += '<td>' + dataItem.scanUser + '</td>';
      // 首验包数
      tHtml += '<td>' + dataItem.verify + '</td>';
      // 抽奖次数
      tHtml += '<td>' + dataItem.draw + '</td>';
      tHtml += '</tr>';
    }
    $('#reportProvinceScanTotal').html(tHtml);
  }
})
