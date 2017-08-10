

/**
 * @file 数据概览
 */
$(function () {
    var params = location.search;
    var activityIdReg = /(\\?|\\&)activity_id=([^&?]*)/ig;
    var activity_id = params.match(activityIdReg) ? params.match(activityIdReg).join("").replace("activity_id=", "") : '';

    var systemTime = new Date().getTime();
    var now = moment(systemTime).format('YYYY-MM-DD');
    var perNow = moment(systemTime).subtract(1, 'days').format('YYYY-MM-DD');

    $('#type_prize').attr('href', '/html/data/prize-data.html?activity_id=' + activity_id);
    $('#type_scan').attr('href', '/html/data/user-data.html?activity_id=' + activity_id);

    var data = {
        "activity_id": activity_id,
        "beginTime": now + " 00:00:00",
        "endTime": now + " 23:59:59",
        "perBeginTime": perNow + " 00:00:00",
        "perEndTime": perNow + " 23:59:59"
    };

    var topn = {
        "activity_id": activity_id,
        "beginTime": now + " 00:00:00",
        "endTime": now + " 23:59:59",
        "topn": 10
    };

    $('.time').html(now);

    var scanData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势', '与上周期的趋势对比']
        },
        tooltip: {
            trigger: 'axis'
        },

        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '本周期数据趋势',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 2
        }, {
            name: '与上周期的趋势对比',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 1
        }]
    };
    function handleScan(val) {
        if (val) {
            var myChart1 = echarts.init(document.getElementById('scan_trend'), theme);
            myChart1.setOption(scanData);
        } else {
            $('#scan_trend').html('暂无数据');
        }
    };

    var firstData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势', '与上周期的趋势对比']
        },
        tooltip: {
            trigger: 'axis'
        },

        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '本周期数据趋势',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 2
        }, {
            name: '与上周期的趋势对比',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 1
        }]
    };
    function handleFirst(val) {
        if (val) {
            var myChart2 = echarts.init(document.getElementById('first_trend'), theme);
            myChart2.setOption(firstData);
        } else {
            $('#first_trend').html('暂无数据');
        }
    };

    var option = {
        title: {
            text: '未来一周气温变化',
            subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最高气温', '最低气温']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [{
            name: '最高气温',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
                data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
            },
            markLine: {
                data: [{ type: 'average', name: '平均值' }]
            }
        }, {
            name: '最低气温',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
                data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
            },
            markLine: {
                data: [{ type: 'average', name: '平均值' }, [{
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                }, {
                    symbol: 'circle',
                    label: {
                        normal: {
                            position: 'start',
                            formatter: '最大值'
                        }
                    },
                    type: 'max',
                    name: '最高点'
                }]]
            }
        }]
    };

    var uvData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势', '与上周期的趋势对比']
        },
        tooltip: {
            trigger: 'axis'
        },

        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '本周期数据趋势',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            markPoint: {
                symbolSize: 60,
                data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
            },
            z: 2
        }, {
            name: '与上周期的趋势对比',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 1
        }]
    };
    function handleUv(val) {
        if (val) {
            var myChart3 = echarts.init(document.getElementById('uv_trend'), theme);
            myChart3.setOption(uvData);
        } else {
            $('#uv_trend').html('暂无数据');
        }
    };

    var pvData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势', '与上周期的趋势对比']
        },
        tooltip: {
            trigger: 'axis'
        },

        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '本周期数据趋势',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 2
        }, {
            name: '与上周期的趋势对比',
            type: 'line',
            smooth: true,
            areaStyle: { normal: {} },
            data: [],
            z: 1
        }]
    };
    function handlePv(val) {
        if (val) {
            var myChart4 = echarts.init(document.getElementById('pv_trend'), theme);
            myChart4.setOption(pvData);
        } else {
            $('#pv_trend').html('暂无数据');
        }
    };

    var cityBarData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [{
            name: '访问用户省市分布前10名',
            type: 'bar',
            data: []
        }]
    };

    function handleCity(val) {
        if (val) {
            var myChart5 = echarts.init(document.getElementById('regional_trend'), theme);
            myChart5.setOption(cityBarData);
        } else {
            $('#regional_trend').html('暂无数据');
        }
    };

    function getDate() {
        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetScanData',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetScanData);
            }
        });

        function GetScanData(res) {
            if (res.code == 1) {
                $('#scan_total').html(res.context.yPV);
                $('#first_scan').html(res.context.yVERIFY);
                $('#scan_code_num').html(res.context.yCODE);
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetScanTrend',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetScanTrend);
            }
        });

        function GetScanTrend(res) {
            if (res.code == 1) {
                scanData.xAxis[0].data = res.context.x;
                scanData.series[0].data = res.context.yPV;
                scanData.series[1].data = res.context.yPerPV;

                firstData.xAxis[0].data = res.context.x;
                firstData.series[0].data = res.context.yVERIFY;
                firstData.series[1].data = res.context.yPerVERIFY;

                if (res.context.yHBPV.length > 0) {
                    $('#scan .data_item').show();
                    $('#scan .total span').html(res.context.yHBPV[0]);
                    $('#scan .hb').html(res.context.yHBPV[1] + '%');
                } else {
                    $('#scan .data_item').hide();
                }

                if (res.context.yHBVERIFY.length > 0) {
                    $('#first .data_item').show();
                    $('#first .total span').html(res.context.yHBVERIFY[0]);
                    $('#first .hb').html(res.context.yHBVERIFY[1] + '%');
                } else {
                    $('#first .data_item').hide();
                }

                if (res.context.x.length > 0) {
                    handleScan(true);
                    handleFirst(true);
                } else {
                    handleScan(false);
                    handleFirst(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetPVTrend',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetPVTrend);
            }
        });

        function GetPVTrend(res) {
            if (res.code == 1) {

                uvData.xAxis[0].data = res.context.x;
                uvData.series[0].data = res.context.yUV;
                uvData.series[1].data = res.context.yPerUV;

                pvData.xAxis[0].data = res.context.x;
                pvData.series[0].data = res.context.yPV;
                pvData.series[1].data = res.context.yPerPV;

                if (res.context.yHBUV.length > 0) {
                    $('#uv .data_item').show();
                    $('#uv .total span').html(res.context.yHBUV[0]);
                    $('#uv .hb').html(res.context.yHBUV[1] + '%');
                } else {
                    $('#uv .data_item').hide();
                }

                if (res.context.yHBPV.length > 0) {
                    $('#pv .data_item').show();
                    $('#pv .total span').html(res.context.yHBPV[0]);
                    $('#pv .hb').html(res.context.yHBPV[1] + '%');
                } else {
                    $('#pv .data_item').hide();
                }

                if (res.context.x.length > 0) {
                    handleUv(true);
                    handlePv(true);
                } else {
                    handleUv(false);
                    handlePv(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetScanRegion',
            data: topn,
            success: function success(res) {
                ajaxResHandle(res, GetScanRegion);
            }
        });

        function GetScanRegion(res) {
            if (res.code == 1) {
                cityBarData.yAxis.data = res.context.x;
                cityBarData.series[0].data = res.context.yPV;

                if (res.context.x.length > 0) {
                    handleCity(true);
                } else {
                    handleCity(false);
                }
            } else {
                alert(res.msg);
            }
        }
    }

    getDate();

    $('.time_btn_box').on('click', function () {
        $('.time_box ul').show();
    });

    //切换时间
    $('.time_box ul').on('click', function (e) {
        if ($(e.target).hasClass('.active')) {
            return;
        } else {
            $('.time_box ul li').removeClass('active');
            $(e.target).addClass('active');
            $('.time_box ul').hide();
            $('.time_item').html($(e.target).attr('tag') + '天');
            var beginTime = null;
            var endTime = null;
            var perBegin = null;
            var perEnd = null;
            switch ($(e.target).attr('tag')) {
                case '7':
                    // 前7天
                    beginTime = moment(systemTime).subtract(7, 'days').startOf('day').format('l');
                    endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                    perBegin = moment(systemTime).subtract(14, 'days').startOf('day').format('l');
                    perEnd = moment(systemTime).subtract(8, 'days').endOf('day').format('l');

                    $('.time').html(moment(systemTime).subtract(7, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));
                    break;
                case '14':
                    // 前14天
                    beginTime = moment(systemTime).subtract(14, 'days').startOf('day').format('l');
                    endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                    perBegin = moment(systemTime).subtract(28, 'days').startOf('day').format('l');
                    perEnd = moment(systemTime).subtract(15, 'days').endOf('day').format('l');
                    $('.time').html(moment(systemTime).subtract(14, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));

                    break;
                case '28':
                    // 前28天
                    beginTime = moment(systemTime).subtract(28, 'days').startOf('day').format('l');
                    endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                    perBegin = moment(systemTime).subtract(56, 'days').startOf('day').format('l');
                    perEnd = moment(systemTime).subtract(29, 'days').endOf('day').format('l');
                    $('.time').html(moment(systemTime).subtract(28, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));
                    break;
                case 'all':
                    // 活动周期
                    $('.time_item').html('全部');
                    beginTime = project_b_time + ' 00:00:00';
                    endTime = moment(systemTime).endOf('day').format('l');
                    perBegin = '';
                    perEnd = '';
                    $('.muted').html(project_b_time + '-' + now);
                    break;
            }

            data = {
                "activity_id": activity_id,
                "beginTime": beginTime,
                "endTime": endTime,
                "perBeginTime": perBegin,
                "perEndTime": perEnd
            };

            topn = {
                "activity_id": activity_id,
                "beginTime": beginTime,
                "endTime": endTime,
                "topn": 10
            };
            getDate();
        }
    });

    function DateDiff(sDate1, sDate2) {
        //sDate1和sDate2是2006-12-18格式
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2006格式
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
        return iDays;
    }

    var calendar = flatpickr('.flatpickr-input', {
        mode: "range",
        locale: 'zh',
        dateFormat: "Y-m-d H:i",
        onClose: function onClose(selectedDates, dateStr, instance) {
            console.log(selectedDates);
            var beginTime = calendar.formatDate(calendar.selectedDates[0], 'Y-m-d H:i:ss');
            var endTime = moment(calendar.selectedDates[1].getTime()).endOf('day').format('l');

            var s1 = calendar.formatDate(calendar.selectedDates[0], 'Y-m-d');
            var s2 = calendar.formatDate(calendar.selectedDates[0], 'Y-m-d');

            $('.flatpickr-input').val(calendar.formatDate(calendar.selectedDates[0], 'Y-m-d H:i') + ' 至 ' + moment(calendar.selectedDates[1].getTime()).endOf('day').format('YYYY-MM-DD HH:mm'));

            var num = DateDiff(s1, s2);
            if (num > 0) {
                $('.time').html(s1 + ' - ' + s2);
            } else {
                $('.time').html(s1);
            }

            var per_start = moment(beginTime).subtract(num + 1, 'days').format('YYYY-MM-DD HH:mm:ss');
            var per_end = moment(endTime).subtract(num + 1, 'days').format('YYYY-MM-DD HH:mm:ss');

            var per_start = moment(beginTime).subtract(num + 1, 'days').format('YYYY-MM-DD HH:mm:ss');
            var per_end = moment(endTime).subtract(num + 1, 'days').format('YYYY-MM-DD HH:mm:ss');

            data = {
                "activity_id": activity_id,
                "beginTime": beginTime,
                "endTime": endTime,
                "perBeginTime": per_start,
                "perEndTime": per_end
            };

            topn = {
                "activity_id": activity_id,
                "beginTime": beginTime,
                "endTime": endTime,
                "topn": 10
            };
            getDate();
        }
    });
});