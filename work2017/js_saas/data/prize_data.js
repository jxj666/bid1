/**
 * @file 数据概览
 */
$(function () {
    var params = location.search;
    var activityIdReg = /(\\?|\\&)activity_id=([^&?]*)/ig;
    var activity_id = params.match(activityIdReg) ? params.match(activityIdReg).join("").replace("activity_id=", "") : '';
    //var activity_id = 'JS0001DS001'

    $('#type_scan').attr('href', '/html/data/scan-data.html?activity_id=' + activity_id);
    $('#type_user').attr('href', '/html/data/user-data.html?activity_id=' + activity_id);

    var systemTime = new Date().getTime();
    var now = moment(systemTime).format('YYYY-MM-DD');
    var perNow = moment(systemTime).subtract(1, 'days').format('YYYY-MM-DD');

    data = {
        "activity_id": activity_id,
        "beginTime": new Date(perNow + ' 00:00:00').getTime(),
        "endTime": new Date(perNow + ' 23:59:59').getTime(),
        "topn": 10,
        "type": 1
    };

    topn = {
        "activity_id": activity_id,
        "beginTime": new Date(perNow + ' 00:00:00').getTime(),
        "endTime": new Date(perNow + ' 23:59:59').getTime(),
        "topn": 10,
        "type": 2
    };

    prizeList = {
        "activity_id": activity_id,
        "beginTime": new Date(perNow + ' 00:00:00').getTime(),
        "endTime": new Date(perNow + ' 23:59:59').getTime(),
        "topn": 10
    };

    $('.time').html(now);

    var typeBarData = {
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

    function handleType(val) {
        if (val) {
            var myChart1 = echarts.init(document.getElementById('type_rank'), theme);
            myChart1.setOption(cityBarData);
        } else {
            $('#type_rank').html('暂无数据');
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
            var myChart2 = echarts.init(document.getElementById('city_rank'), theme);
            myChart2.setOption(cityBarData);
        } else {
            $('#city_rank').html('暂无数据');
        }
    };

    function getDate() {
        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetActivity',
            data: {
                "activity_id": activity_id
            },
            success: function success(res) {
                ajaxResHandle(res, GetActivity);
            }
        });

        function GetActivity(res) {
            if (res.code == 1) {
                $('#draw_total').html(res.context.yDraw);
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetAwardRank',
            data: data,
            success: function success(res) {
                ajaxResHandle(res, GetAwardRank);
            }
        });

        function GetAwardRank(res) {
            if (res.code == 1) {

                typeBarData.yAxis.data = res.context.x;
                typeBarData.series[0].data = res.context.yCnt;

                if (res.context.x.length > 0) {
                    handleType(true);
                } else {
                    handleType(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetAwardRank',
            data: topn,
            success: function success(res) {
                ajaxResHandle(res, GetAwardRank1);
            }
        });

        function GetAwardRank1(res) {
            if (res.code == 1) {
                cityBarData.yAxis.data = res.context.x;
                cityBarData.series[0].data = res.context.yCnt;

                if (res.context.x.length > 0) {
                    handleCity(true);
                } else {
                    handleCity(false);
                }
            } else {
                alert(res.msg);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/v1/data/GetAwardList',
            data: prizeList,
            success: function success(res) {
                ajaxResHandle(res, GetAwardList);
            }
        });

        function GetAwardList(res) {
            var list = res.context.yAward;
            var html = '';
            for (var i = 0; i < list.length; i++) {
                html += '<tr><td>' + list[i].productName + '</td><td>' + list[i].cnt + '</td><td data-productid="' + list[i].productId + '"></td><td>' + list[i].totalcnt + '</td></tr>';
            }

            $('.prize-table tbody').html(html);
            $.ajax({
                type: 'GET',
                url: ' /api/v1/order/GetActivityPlan',
                data: {activity_id: activity_id},
                success: function success(res) {
                    ajaxResHandle(res, function () {
                        var list_item = res.context.items;
                        for (var j = 0, len = list_item.length; j < len; j++) {
                            $('.prize-table tbody').find(`[data-productid="${list_item[j].productId}"]`).html(list_item[j].quantity);
                        }
                    });
                }
            });
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
                case '1':
                    // 前14天
                    beginTime = moment(systemTime).subtract(1, 'days').startOf('day').format('l');
                    endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                    perBegin = moment(systemTime).subtract(28, 'days').startOf('day').format('l');
                    perEnd = moment(systemTime).subtract(15, 'days').endOf('day').format('l');
                    $('.time').html(moment(systemTime).subtract(1, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));

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
                "beginTime": new Date(beginTime).getTime(),
                "endTime": new Date(endTime).getTime(),
                "topn": 10,
                "type": 1
            };

            topn = {
                "activity_id": activity_id,
                "beginTime": new Date(beginTime).getTime(),
                "endTime": new Date(endTime).getTime(),
                "topn": 10,
                "type": 2
            };

            prizeList = {
                "activity_id": activity_id,
                "beginTime": new Date(beginTime).getTime(),
                "endTime": new Date(endTime).getTime(),
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
                "beginTime": new Date(beginTime).getTime(),
                "endTime": new Date(endTime).getTime(),
                "topn": 10,
                "type": 1
            };

            topn = {
                "activity_id": activity_id,
                "beginTime": new Date(beginTime).getTime(),
                "endTime": new Date(endTime).getTime(),
                "topn": 10,
                "type": 2
            };

            prizeList = {
                "activity_id": activity_id,
                "beginTime": new Date(beginTime).getTime(),
                "endTime": new Date(endTime).getTime(),
                "topn": 10
            };

            getDate();
        }
    });

    function formatDate(val) {
        if (!val || val.indexOf('to') === -1) {
            return;
        }
        return val.split(/\s*to\s*/);
    }
});