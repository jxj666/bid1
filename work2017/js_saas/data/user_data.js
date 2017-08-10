/**
 * @file 数据概览
 */
$(function () {
    var params = location.search;
    var activityIdReg = /(\\?|\\&)activity_id=([^&?]*)/ig;
    var activity_id = params.match(activityIdReg) ? params.match(activityIdReg).join("").replace("activity_id=", "") : '';
    //var activity_id = 'WBQqrP5y40Hbqh1iowOxs69RcO';
    var systemTime = new Date().getTime();
    var now = moment(systemTime).format('YYYY-MM-DD');
    var perNow = moment(systemTime).subtract(1, 'days').format('YYYY-MM-DD');
    $('.time').html(now);

    $('#type_prize').attr('href', '/html/data/prize-data.html?activity_id=' + activity_id);
    $('#type_scan').attr('href', '/html/data/scan-data.html?activity_id=' + activity_id);

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

    var retain = {
        "activity_id": activity_id,
        "beginTime": perNow + " 00:00:00",
        "endTime": perNow + " 23:59:59"
    };

    var userData = {
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
    function handleUser(val) {
        if (val) {
            var myChart3 = echarts.init(document.getElementById('user_trend'), theme);
            myChart3.setOption(userData);
        } else {
            $('.chart_box').html('暂无数据');
        }
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
            var myChart1 = echarts.init(document.getElementById('uv_chart'), theme);
            myChart1.setOption(uvData);
        } else {
            $('#uv_chart').html('暂无数据');
        }
    };

    var newUserRate = {
        tooltip: {
            trigger: 'item'
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [{
            name: '数量',
            type: 'pie',
            hoverAnimation: false,
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    function userRate(val) {
        if (val) {
            var myChart = echarts.init(document.getElementById('user_rate'), theme);
            myChart.setOption(newUserRate);
        } else {
            $('#user_rate').html('暂无数据');
        }
    };

    var deviceRate = {
        tooltip: {
            trigger: 'item'
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [{
            name: '数量',
            type: 'pie',
            hoverAnimation: false,
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    function handleDevice(val) {
        if (val) {
            var myChart8 = echarts.init(document.getElementById('device_chart'), theme);
            myChart8.setOption(deviceRate);
        } else {
            $('#device_chart').html('暂无数据');
        }
    };

    var barHeight = 50;
    var topTime = {
        angleAxis: {
            type: 'category',
            data: []
        },
        radiusAxis: {},
        polar: {},
        series: [{
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '',
            stack: ''
        }, {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '均值',
            stack: '均值',
            barGap: '-100%',
            z: 10
        }],
        legend: {
            show: true,
            data: ['A', 'B', 'C']
        }
    };
    function handleTopTime(val) {
        if (val) {
            var myChart2 = echarts.init(document.getElementById('topTime_chart'), theme);
            myChart2.setOption(topTime);
        } else {
            $('#topTime_chart').html('暂无数据');
        }
    };

    var deepData = {
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
    function handleDeep(val) {
        if (val) {
            var myChart4 = echarts.init(document.getElementById('deep_chart'), theme);
            myChart4.setOption(deepData);
        } else {
            $('#deep_chart').html('暂无数据');
        }
    };

    var retainedData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势']
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
        }]
    };
    function handleRetained(val) {
        if (val) {
            var myChart5 = echarts.init(document.getElementById('retained_chart'), theme);
            myChart5.setOption(retainedData);
        } else {
            $('#retained_chart').html('暂无数据');
        }
    };

    var jumpData = {
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
    function handleJump(val) {
        if (val) {
            var myChart6 = echarts.init(document.getElementById('jump_chart'), theme);
            myChart6.setOption(jumpData);
        } else {
            $('#jump_chart').html('暂无数据');
        }
    };

    var stayData = {
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
    function handleStay(val) {
        if (val) {
            var myChart7 = echarts.init(document.getElementById('stay_chart'), theme);
            myChart7.setOption(stayData);
        } else {
            $('#stay_chart').html('暂无数据');
        }
    };

    var shareData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['分享量', '分享率']
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
    function handleShare(val) {
        if (val) {
            var myChart9 = echarts.init(document.getElementById('share_chart'), theme);
            myChart9.setOption(shareData);
        } else {
            $('#share_chart').html('暂无数据');
        }
    };

    var spreadData = {
        angleAxis: {
            type: 'category',
            data: []
        },
        radiusAxis: {},
        polar: {},
        series: [{
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '',
            stack: ''
        }, {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '均值',
            stack: '均值',
            barGap: '-100%',
            z: 10
        }],
        legend: {
            show: true,
            data: ['A', 'B', 'C']
        }
    };
    function handleSpread(val) {
        if (val) {
            var myChart10 = echarts.init(document.getElementById('spread_chart'), theme);
            myChart10.setOption(spreadData);
        } else {
            $('#spread_chart').html('暂无数据');
        }
    };

    var cityTopData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(106,186,232,.1)'
                }
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
    function handleCityTop(val) {
        if (val) {
            var myChart11 = echarts.init(document.getElementById('city_chart'), theme);
            myChart11.setOption(cityTopData);
        } else {
            $('#city_chart').html('暂无数据');
        }
    };

    function getDate() {

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetPV',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, getPv);
            }
        });

        function getPv(res) {
            if (res.code == 1) {
                $('#total_uv').html(res.context.yUV);
                $('#total_pv').html(res.context.yPV);
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

                if (res.context.yHBUV.length > 0) {
                    $('#uv .data_item').show();
                    $('#uv .total span').html(res.context.yHBUV[0]);
                    $('#uv .hb').html(res.context.yHBUV[1] + '%');
                } else {
                    $('#uv .data_item').show();
                    $('#uv .total span').html(res.context.yTotalUV);
                    $('#uv .hb').html('');
                }

                if (res.context.x.length > 0) {
                    handleUv(true);
                } else {
                    handleUv(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetUserTrend',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetUserTrend);
            }
        });

        function GetUserTrend(res) {
            if (res.code == 1) {

                userData.xAxis[0].data = res.context.x;
                userData.series[0].data = res.context.yNewusers;
                userData.series[1].data = res.context.yPerNewusers;

                deepData.xAxis[0].data = res.context.x;
                deepData.series[0].data = res.context.yDeep;
                deepData.series[1].data = res.context.yPerDeep;

                jumpData.xAxis[0].data = res.context.x;
                jumpData.series[0].data = res.context.yJump;
                jumpData.series[1].data = res.context.yPerJump;

                stayData.xAxis[0].data = res.context.x;
                stayData.series[0].data = res.context.yPersist;
                stayData.series[1].data = res.context.yPerPersist;

                shareData.xAxis[0].data = res.context.x;
                shareData.series[0].data = res.context.yShare;
                shareData.series[1].data = res.context.yShareRate;

                if (res.context.yHBNewusers.length > 0) {
                    $('#user .data_item').show();
                    $('#user .total span').html(res.context.yHBNewusers[0]);
                    $('#user .hb').html(res.context.yHBNewusers[1] + '%');
                }

                if (res.context.yHBJump.length > 0) {
                    $('#jump .data_item').show();
                    $('#jump .total span').html(res.context.yHBJump[0]);
                    $('#jump .hb').html(res.context.yHBJump[1] + '%');
                }

                if (res.context.yHBDeep.length > 0) {
                    $('#deep .data_item').show();
                    $('#deep .total span').html(res.context.yHBDeep[0]);
                    $('#deep .hb').html(res.context.yHBDeep[1] + '%');
                }

                if (res.context.yHBPersist.length > 0) {
                    $('#stay .data_item').show();
                    $('#stay .total span').html(res.context.yHBPersist[0]);
                    $('#stay .hb').html(res.context.yHBPersist[1] + '%');
                }

                if (res.context.x.length > 0) {
                    handleUser(true);
                    handleDeep(true);
                    handleJump(true);
                    handleStay(true);
                    handleShare(true);
                } else {
                    handleUser(false);
                    handleDeep(false);
                    handleJump(false);
                    handleStay(false);
                    handleShare(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetNewUserRate',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetNewUserRate);
            }
        });

        function GetNewUserRate(res) {
            if (res.code == 1) {

                newUserRate.series[0].data = [];
                for (var i = 0; i < res.context.yNewer.length; i++) {
                    newUserRate.series[0].data.push({
                        name: res.context.yNewer[i].label,
                        value: res.context.yNewer[i].amount
                    });
                }

                if (res.context.yNewer.length > 0) {
                    userRate(true);
                } else {
                    userRate(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetPVPeakHour',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetPVPeakHour);
            }
        });

        function GetPVPeakHour(res) {
            if (res.code == 1) {
                var list = res.context.yPV;
                topTime.angleAxis.data = res.context.x;
                topTime.series[0].data = list.map(function (d) {
                    return d[0];
                });

                topTime.series[1].data = list.map(function (d) {
                    return barHeight * 2;
                });

                if (res.context.yPV.length > 0) {
                    handleTopTime(true);
                } else {
                    handleTopTime(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetTransLevel',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetTransLevel);
            }
        });

        function GetTransLevel(res) {
            if (res.code == 1) {
                var list = res.context.yPV;
                spreadData.angleAxis.data = res.context.x;
                spreadData.series[0].data = list.map(function (d) {
                    return d[0];
                });

                spreadData.series[1].data = list.map(function (d) {
                    return barHeight * 2;
                });

                if (res.context.yPV.length > 0) {
                    handleSpread(true);
                } else {
                    handleSpread(false);
                }
            } else {
                alert(res.msg);
            }
        }
    }

    function getTop() {
        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetUserRegion',
            data: {
                "activity_id": "WBQqrP5y40Hbqh1iowOxs69RcO",
                "beginTime": perNow + " 00:00:00",
                "endTime": perNow + " 23:59:59",
                "topn": 10
            },
            success: function success(res) {
                ajaxResHandle(res, GetUserRegion);
            }
        });

        function GetUserRegion(res) {
            if (res.code == 1) {
                cityTopData.yAxis.data = res.context.x;
                cityTopData.series[0].data = res.context.yPV;

                if (res.context.x.length > 0) {
                    handleCityTop(true);
                } else {
                    handleCityTop(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetOsRate',
            data: {
                "activity_id": "WBQqrP5y40Hbqh1iowOxs69RcO",
                "beginTime": now + " 00:00:00",
                "endTime": now + " 23:59:59",
                "topn": 10
            },
            success: function success(res) {
                ajaxResHandle(res, GetOsRate);
            }
        });

        function GetOsRate(res) {
            if (res.code == 1) {

                deviceRate.series[0].data = [];
                for (var i = 0; i < res.context.yUV.length; i++) {
                    deviceRate.series[0].data.push({
                        name: res.context.yUV[i].label,
                        value: res.context.yUV[i].amount
                    });
                }
                if (res.context.yUV.length > 0) {
                    handleDevice(true);
                } else {
                    handleDevice(false);
                }
            } else {
                alert(res.msg);
            }
        }
    }

    function getRetain() {
        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetRetainTrend',
            data: retain,
            success: function success(res) {
                ajaxResHandle(res, GetRetainTrend);
            }
        });

        function GetRetainTrend(res) {
            if (res.code == 1) {

                retainedData.xAxis[0].data = res.context.x;
                retainedData.series[0].data = res.context.yDateRate;

                if (res.context.x.length > 0) {
                    handleRetained(true);
                } else {
                    handleRetained(false);
                }
            } else {
                alert(res.msg);
            }
        }
    }

    getDate();
    getRetain();
    getTop();

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
            $('.time_item').html($(e.target).attr('tag')+'天');
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

            retain = {
                "activity_id": activity_id,
                "beginTime": beginTime,
                "endTime": endTime
            };

            getDate();
            getRetain();
            getTop();
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
        maxDate: new Date(),
        onClose: function onClose(selectedDates, dateStr, instance) {
            console.log(selectedDates);
            var beginTime = calendar.formatDate(calendar.selectedDates[0], 'Y-m-d H:i:S');
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

            retain = {
                "activity_id": activity_id,
                "beginTime": beginTime,
                "endTime": endTime
            };

            getDate();
            getRetain();
            getTop();
        }
    });
});