/**
 * @author fu
 * @file 码包管理
 * begin
 */

let provinceKey = ''; // 省份的邮编
let provinceHtml = ''; // 省份的html片段
let provinceName = ''; // 省份的名称
let provinceObj = {
    provinces: {}
}; // 盛放省份城市的数组
let cityKey = ''; // 城市的邮编
let cityHtml = ''; // 城市的html片段
let cityName = ''; // 城市名称
let provinceCode = ''; // 通过城市反推省份邮编号

let batchParamsObj = {
    pids: {}
};
// 渲染省份
for (let key in locationObj) {
    provinceHtml += `<li data-cj="getCityList" data-province="${key}">${locationObj[key].short_name}</li>`;
}
$('#provinceList').html(provinceHtml);
// 点击省份获取城市
$('[data-cj="getCityList"]').click(function(e) {
    e.stopPropagation();
    if (!$(this).hasClass('active')) {
        $('.launch-pop').scrollTop(0);
        $(this).addClass('active').siblings().removeClass('active');

        // 操作数据
        if (!provinceObj.provinces[$(this).data('province')]) {
            provinceObj.provinces[$(this).data('province')] = {
                status: 0, // 状态为0代表非全选
                short_name: $(this).text(),
                cities: {}
            };
        }
        // console.log(provinceObj);
        rendering();

        cityHtml = '';
        let province = $(this).data('province');
        for (let key in locationObj[province].cities) {
            cityHtml += `<li class="batch-item" data-city="${key}">${locationObj[province].cities[key].name}</li>`;
        }
        cityHtml = '<li class="batch-item" data-city="all">全选</li>' + cityHtml;
        $('#cityList').html(cityHtml).on('click', '[data-city]', function(e) {
            e.stopPropagation();
            if ($(this).data('city') === 'all') {
                if (!$(this).hasClass('checked')) {
                    $('[data-city]').addClass('checked');
                    provinceObj.provinces[$('[data-cj=getCityList].active').data('province')].status = 1; // pid全选status为1
                    provinceObj.provinces[$('[data-cj=getCityList].active').data('province')].cities = {}; // 全选后把城市清空
                    // console.log(provinceObj);
                    // 渲染到页面
                    rendering();
                }
            } else {
                if (!$(this).hasClass('checked')) {
                    $(this).addClass('checked');
                    provinceObj.provinces[$('[data-cj=getCityList].active').data('province')].status = 0; // pid非全选status为0
                    provinceObj.provinces[$('[data-cj=getCityList].active').data('province')].cities[$(this).data('city')] = $(this).text();
                    // console.log(provinceObj);
                    // 渲染到页面
                    rendering();
                }
            }
        });
    }
});

// 省份点击删除
$('.show-region').on('click', '[data-province]', function() {
    provinceObj.provinces[$(this).data('province')].status = 0; // 0代表不是全选
    rendering();
    // console.log(provinceObj);
});
// 城市点击删除
$('.show-region').on('click', '[data-city]', function() {
    delete provinceObj.provinces[$(this).data('provincecode')].cities[$(this).data('city')];
    rendering();
    console.log(provinceObj);
});

// 点击编辑接口获取省份val城市val


/** 获取码包列表 */
function getPlanByActivity(res, me) {
    var html = '';
    var context_arr = res.context || [];
    var context_num = context_arr.length;
    var start_new = code_bag_data.data.start + context_num;
    const codes = res.context;

    code_bag_data.data.start = start_new;

    if (context_num > 0) {
        let locFun = function(arr) {
            let str = '';
            arr = arr || [];
            if (arr.length > 0) {
                for (let i = 0, len = arr.length; i < len; i++) {
                    str += locationObj[arr[i]] ? locationObj[arr[i]].short_name + ' ' : '';
                }
            }
            return str;
        };
        let batchFun = function(arr) {
            let str = '';
            if (arr.length > 0) {
                for (let i = 0, len = arr.length; i < len; i++) {
                    str += arr[i].name + ' ';
                }
            }
            return str;
        };
        for (let i = 0, len = context_arr.length; i < len; i++) {
            html += `<div class="card clearfix">
            <div class="card-left">
                <p class="plan">投放计划：<span class="paln-name">${codes[i].name}</span></p>
                <p class="l-p">投放区域：<span class="region-name">${locFun(codes[i].details[0].provinces)}</span></p>
                <p class="l-p">投放时间：<span class="interval">${codes[i].details[0].time.begin}-${codes[i].details[0].time.end}</span></p>
                <p class="l-p">关联码包：<span class="batch-num">${batchFun(codes[i].batches)}</span></p>
                <p class="l-p">关联活动：<span class="activity-name">${codes[i].activityId}</span></p>
            </div>
            <div class="card-right">
                ${codes[i].status === 1 ? '<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/underway.png" class="underway-img">' : ''}
                <ul class="operate-list">
                    <li><a href="#modal-codepackage" data-cj="modal" class="operate-item" data-click="launch" data-planid="${codes[i].id}">编辑</a></li>
                    <li>
                    <a href="#modal-codepackage" data-cj="modal" class="operate-item" data-click="rules" data-planid="${codes[i].id}" data-limitperday="${codes[i].limitPerDay}" data-rewardspercode="${codes[i].rewardsPerCode}">扫码规则</a>
                    </li>
                    <li><a href="#modal-codepackage" data-cj="modal" class="operate-item" data-click="offline" data-planid="${codes[i].id}">下线</a></li>
                    <!--<li><a href="#modal-codepackage" data-cj="modal" class="operate-item log" data-click="log" data-batchno="${codes[i].id}">日志</a></li>-->
                </ul>
            </div>
        </div>`;
        }
    } else {
        // 锁定
        me.lock();
        // 无数据
        me.noData();
        console.log('锁定');
    }


    $('#codePackage .card-list').append(html);

    me.resetload();

    if (code_bag_data.data.start === 0) {
        $('.dropload-down ').hide();
        // 如果start仍为0，说明没有一条数据
        $('#codePackage .card-list').html(`<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/nodata.png" alt="" class="nodata-img">
<div class="nodata-info">暂无数据</div>`);
    }
}

$('#modal-codepackage').on('shown.cj.modal', function(e) {
    let relatedTarget = e.relatedTarget;
    if (!relatedTarget) {
        alert('触发元素不正确');
    }
    $('html').addClass('html-unscrollable');
    let $modal = $(this);
    $(this).find('input,[data-cj=relevance]').click(function() {
        let $target = $modal.find('input,[data-cj=relevance]').not(this);
        $target.find('.dropdown-list').addClass('invisible');
        $target.find('.dropdown-icon').removeClass('rotate');
    });

    let $relatedTarget = $(relatedTarget);
    let planId = $relatedTarget.data('planid') || null;

    let planBeginCalendar; // 活动开始时间
    let planEndCalendar; // 活动结束时间

    // 新增
    if ($relatedTarget.hasClass('add-code-btn')) {
        // 活动时间

        $('.launch-pop').on('focus', '.flatpickr-mobile', function () {
            $(this).removeClass('before-content')
                .siblings().removeClass('before-content');
            
        });
        $('.launch-pop').on('blur', '.flatpickr-mobile', function () {
                $(this).addClass('before-content')
                    .siblings().addClass('before-content');
                // if ($.trim($(this).val()) == '') {
                //     alert('请选择投放时间！');

                // }
        });
        planBeginCalendar = flatpickr('#planBeginTime', {
            mode: 'single',
            enableTime: true,
            time_24hr: true, // AM/PM time picker is used by default
            // initial values for time. don't use these to preload a date
            defaultHour: 24,
            defaultMinute: 0,
            locale: 'zh',
            dateFormat: 'Y-m-d H:i',
            // minDate: activity.beginTime,
            defaultDate: '',
            disableMobile: false,
            plugins: [new confirmDatePlugin({
                // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                confirmText: '确认 ',
                showAlways: true,
                theme: 'light' // or "dark"
            })],
            onChange(selectedDates, dateStr, instance) {
                // console.log(selectedDates, dateStr, instance);
                planEndCalendar.set('minDate', selectedDates[0]);
            }
        });
        planEndCalendar = flatpickr('#planEndTime', {
            mode: 'single',
            enableTime: true,
            time_24hr: true, // AM/PM time picker is used by default
            // initial values for time. don't use these to preload a date
            defaultHour: 24,
            defaultMinute: 60,
            locale: 'zh',
            dateFormat: 'Y-m-d H:i',
            // minDate: activity.beginTime,
            defaultDate: '',
            disableMobile: false,
            plugins: [new confirmDatePlugin({
                // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                confirmText: '确认 ',
                showAlways: true,
                theme: 'light' // or "dark"
            })],
            onChange(selectedDates, dateStr, instance) {
                // console.log(selectedDates, dateStr, instance);
                planBeginCalendar.set('maxDate', selectedDates[0]);
            }
        });
        $('.launch-pop').removeClass('invisible');
    }
    else {
        // 先请求到计划信息
        $.get('/api/v1/qr/GetPlan', {
            plan_id: planId
        }).done(res => {
            ajaxResHandle(res, () => {
                let target = `.${$relatedTarget.data('click')}-pop`;
                $(target).removeClass('invisible');

                // 编辑
                if ($relatedTarget.data('click') === 'launch') {
                    $('#planName').val(res.context.name);
                    planBeginCalendar = flatpickr('#planBeginTime', {
                        mode: 'single',
                        enableTime: true,
                        time_24hr: true, // AM/PM time picker is used by default
                        // initial values for time. don't use these to preload a date
                        defaultHour: 24,
                        defaultMinute: 0,
                        locale: 'zh',
                        dateFormat: 'Y-m-d H:i',
                        // minDate: activity.beginTime,
                        defaultDate: res.context.details[0].time.begin,
                        disableMobile: false,
                        plugins: [new confirmDatePlugin({
                            // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                            confirmText: '确认 ',
                            showAlways: true,
                            theme: 'light' // or "dark"
                        })],
                        onChange(selectedDates, dateStr, instance) {
                            // console.log(selectedDates[0]);
                            // console.log(selectedDates, dateStr, instance);
                            planEndCalendar.set('minDate', selectedDates[0]);
                        }

                    });
                    planEndCalendar = flatpickr('#planEndTime', {
                        mode: 'single',
                        enableTime: true,
                        time_24hr: true, // AM/PM time picker is used by default
                        // initial values for time. don't use these to preload a date
                        defaultHour: 24,
                        defaultMinute: 0,
                        locale: 'zh',
                        dateFormat: 'Y-m-d H:i',
                        // minDate: 'today',
                        defaultDate: res.context.details[0].time.end,
                        disableMobile: false,
                        plugins: [new confirmDatePlugin({
                            // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                            confirmText: '确认 ',
                            showAlways: true,
                            theme: 'light' // or "dark"
                        })],
                        onChange(selectedDates, dateStr, instance) {
                            // console.log(selectedDates[0]);
                            planBeginCalendar.set('maxDate', selectedDates[0]);
                        }
                    });

                    let provinces = res.context.details[0].provinces || [];
                    let cities = res.context.details[0].cities || [];
                    // 遍历省份放到数组中
                    if (provinces.length > 0) {
                        for (let i = 0, len = provinces.length; i < len; i++) {
                            if (locationObj[provinces[i]]) {
                                provinceObj.provinces[provinces[i]] = {
                                    cities: {},
                                    status: 1, // 1代表全选
                                    short_name: locationObj[provinces[i]].short_name
                                };
                            }
                        }
                    }
                    console.log(provinceObj);
                    // 遍历城市放到数组中
                    if (cities.length > 0) {
                        for (let i = 0, len = cities.length; i < len; i++) {
                            provinceCode = cities[i].substring(0, 2) + '0000';
                            if (!provinceObj.provinces[provinceCode]) {
                                provinceObj.provinces[provinceCode] = {
                                    cities: {},
                                    status: 0, // 0代表不是全选
                                    short_name: locationObj[provinceCode].short_name
                                };
                            }
                            provinceObj.provinces[provinceCode].cities[cities[i]] = locationObj[provinceCode].cities[cities[i]].name;
                        }
                    }
                    console.log(provinceObj);
                    rendering();

                    // 码包
                    const batches = res.context.batches || [];
                    if (batches.length > 0) {
                        batchParamsObj.pids.temp = {
                            batches: {}
                        };
                        for (let i = 0, len = batches.length; i < len; i++) {
                            batchParamsObj.pids.temp.batches[batches[i].batchNo] = batches[i].name;
                        }
                        console.log(batchParamsObj);
                        batchRender();
                    }
                }
                // 下线计划
                $(this).find('[data-cj="offLine"]').off().click(function() {
                    $.post('/api/v1/qr/OfflinePlan', {
                        plan_id: planId
                    }).done(data => {
                        ajaxResHandle(data, () => {
                            $('#codePackage .card-list').html('');
                            dropLoadInit();
                            $('[data-dismiss=modal]').trigger('click');
                        });
                    });
                });

                // 扫码规则
                if ($relatedTarget.data('click') === 'rules') {
                    $('[name="limit_per_day"]').val(res.context.limitPerDay);
                    $('[name="rewards_per_code"]').val(res.context.rewardsPerCode);

                    $('.rules-pop [data-click="compile-btn"]').off().click(() => {
                        // 验证
                        let testReg = {
                            number: /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,
                            integer: /^-?\d+$/
                        };
                        let value = $('[name="limit_per_day"]').val();
                        if (value && !testReg.integer.test(value)) {
                            $('[name="limit_per_day"]').focus();
                            $(this).find('.validate-error').html('只能输入数字！');
                            return;
                        }
                        if (value && value < 0) {
                            $('[name="limit_per_day"]').focus();
                            $(this).find('.validate-error').html('概率不能小于0！');
                            return;
                        }
                        value = $('[name="rewards_per_code"]').val();
                        if (value && !testReg.integer.test(value)) {
                            $('[name="rewards_per_code"]').focus();
                            $(this).find('.validate-error').html('只能输入数字！');
                            return;
                        }
                        if (value && value < 0) {
                            $('[name="rewards_per_code"]').focus();
                            $(this).find('.validate-error').html('概率不能小于0！');
                            return;
                        }
                        $.post('/api/v1/qr/UpdatePlanParam', {
                            plan_id: planId,
                            limit_per_day: $('[name="limit_per_day"]').val(),
                            rewards_per_code: $('[name="rewards_per_code"]').val()
                        }).done(data => {
                            ajaxResHandle(data, () => {
                                $('#codePackage .card-list').html('');
                                dropLoadInit();
                                $('[data-dismiss=modal]').trigger('click');
                            });
                        });
                    });
                }

            });

        });
    }
    
    /** 新增|编辑按钮 */
    $('.launch-pop [data-click="compile-btn"]').click(function() {

        
        if ($(this).hasClass('disabled')) {
            return;
        }
        let params = {
            pids: [],
            batches: [],
            cities: [],
            provinces: []
        };
        if ($.trim($('#planName').val()).length <= 0) {
            $('#planName').focus();
            $modal.find('.validate-error').html('计划名称不能为空');
            return;
        }

        if ($.trim($('#planBeginTime').val())== '' || $.trim($('#planEndTime').val())== '') {
            $modal.find('.validate-error').html('选择一个日期范围');
            return;
        }

        params.name = $('#planName').val();
        params.beginTime = planBeginCalendar.formatDate(planBeginCalendar.selectedDates[0], 'Y-m-d H:i:00');
        params.endTime = planEndCalendar.formatDate(planEndCalendar.selectedDates[0], 'Y-m-d H:i:00');
        console.log('开始'+ params.beginTime + '结束' + params.endTime);
        // 省份城市对象
        if (!$.isEmptyObject(provinceObj.provinces)) {
            for (let key in provinceObj.provinces) {
                if (provinceObj.provinces[key].status === 1) {
                    params.provinces.push(key);
                }
                if (!$.isEmptyObject(provinceObj.provinces[key].cities)) {
                    for (let index in provinceObj.provinces[key].cities) {
                        params.cities.push(index);
                    }
                }
            }
        }
        // 码包对象
        if (batchParamsObj.pids && !$.isEmptyObject(batchParamsObj.pids)) {
            for (let key in batchParamsObj.pids) {
                batchParamsObj.pids[key].status == 1 && params.pids.push(key);
                if (batchParamsObj.pids[key].batches && !$.isEmptyObject(batchParamsObj.pids[key].batches)) {
                    for (let index in batchParamsObj.pids[key].batches) {
                        params.batches.push(index);
                    }
                }
            }
        }
        console.log(params);
        let updatePlanData = {
            activity_id: activityId,
            plan: JSON.stringify(params)
        };
        planId && (updatePlanData.plan_id = planId); // 没有planid是新增，有是编辑

        // 防止重复点击
        $(this).addClass('disabled');
        setTimeout(() => {
            $(this).removeClass('disabled');
        }, 3000);

        $.post('/api/v1/qr/UpdatePlan', updatePlanData).done(data => {
            ajaxResHandle(data, function() {
                $('#codePackage .card-list').html('');
                dropLoadInit();
                $('[data-dismiss=modal]').trigger('click');
            });
        });

    });

    /** 关联批次列表 */
    // 删除操作
    $('.show-batch').on('click', '[data-pid]', function() {
        batchParamsObj.pids[$(this).data('pid')].status = 0;
        batchParamsObj.pids[$(this).data('pid')].batches = {};
        // 渲染到页面
        console.log(batchParamsObj);
        $('#pidList').find('[data-pid="' + $(this).data('pid') + '"]').removeClass('active');
        $('#batchNoList').html('');

        batchRender();
    }).on('click', '[data-batchno]', function() {
        delete batchParamsObj.pids[$(this).data('productid')].batches[$(this).data('batchno')];
        // 渲染到页面
        console.log(batchParamsObj);
        $('#batchNoList').find('[data-batchno="' + $(this).data('batchno') + '"]').removeClass('checked');
        batchRender();
    });
    // 产品列表
    $.get('/api/v1/product/GetProductList', {
        start: 0,
        size: 300
    }).done(data => {
        ajaxResHandle(data, () => {
            $('#pidList').html('');
            $('#batchNoList').html('');
            const productList = data.context.productList || [];
            if (productList.length > 0) {
                for (let i = 0, len = productList.length; i < len; i++) {
                    $('#pidList').append(`<li data-cj="getBatchList" data-pid="${productList[i].productId}">${productList[i].name}</li>`);
                }
                $('#pidList').append('<li data-cj="getBatchList" data-pid="1">芙蓉王</li><li data-cj="getBatchList" data-pid="1">硬玉溪</li>');
                // 产品列表被点击时
                $('#pidList').on('click', '[data-cj="getBatchList"]', function(e) {
                    e.stopPropagation();
                    if ($(this).hasClass('active')) {
                        return;
                    }
                    $(this).addClass('active').siblings().removeClass('active');
                    if (!batchParamsObj.pids[$(this).data('pid')]) {
                        batchParamsObj.pids[$(this).data('pid')] = {
                            status: 0, // 状态为0代表非全选
                            name: $(this).text(),
                            batches: {}
                        };
                    }
                    console.log(batchParamsObj);
                    $('#batchNoList').html('');
                    $.get('/func/qr/list/batch', {
                        productId: $(this).data('pid'),
                        page: 1,
                        size: 200
                    }).done(data => {
                        ajaxResHandle(data, () => {
                            const batchList = data.data || [];
                            if (batchList.length > 0) {
                                for (let i = 0, len = batchList.length; i < len; i++) {
                                    $('#batchNoList').append(`<li class="batch-item" data-batchno="${batchList[i].batch.batchNo}">${batchList[i].batch.name}</li>`);
                                }
                                // 码包列表被点击时
                                $('#batchNoList').prepend('<li data-batchno="all">全选</li>')
                                    .on('click', '[data-batchno]', function(e) {
                                        e.stopPropagation();
                                        if ($(this).data('batchno') === 'all') {
                                            // 全选
                                            /*if ($(this).hasClass('checked')) {
                                             $(this).removeClass('checked').html('全选');
                                             $('[data-batchno]').removeClass('checked');
                                             batchParamsObj.pids[$('#pidList [data-cj="getBatchList"].active').data('pid')].status = 0; // pid非全选status为0                                        }
                                             batchParamsObj.pids[$('#pidList [data-cj="getBatchList"].active').data('pid')].batches = {}; // 清空batches
                                             console.log(batchParamsObj);
                                             }
                                             else {
                                             $(this).addClass('checked').html('全不选');*/
                                            if (!$(this).hasClass('checked')) {
                                                $('[data-batchno]').addClass('checked');

                                                batchParamsObj.pids[$('#pidList [data-cj=getBatchList].active').data('pid')].status = 1; // pid全选status为1
                                                batchParamsObj.pids[$('#pidList [data-cj=getBatchList].active').data('pid')].batches = {}; // 全选后把码包清空
                                                console.log(batchParamsObj);
                                                // 渲染到页面
                                                batchRender();
                                            }
                                        } else {
                                            /*if ($(this).hasClass('checked')) {
                                             $(this).removeClass('checked');
                                             delete batchParamsObj.pids[$('#pidList [data-cj="getBatchList"].active').data('pid')].batches[$(this).data('batchno')];
                                             console.log(batchParamsObj);
                                             }
                                             else {*/
                                            if (!$(this).hasClass('checked')) {

                                                $(this).addClass('checked');
                                                batchParamsObj.pids[$('#pidList [data-cj="getBatchList"].active').data('pid')].status = 0; // pid非全选status为0
                                                batchParamsObj.pids[$('#pidList [data-cj="getBatchList"].active').data('pid')].batches[$(this).data('batchno')] = $(this).text();
                                                console.log(batchParamsObj);
                                                // 渲染到页面
                                                batchRender();
                                            }
                                        }
                                    });
                            } else {
                                $('#batchNoList').html('还没添加批次');
                            }
                        });
                    });
                });
            }
        });
    });

}).on('hidden.cj.modal', function() {
    $('html').removeClass('html-unscrollable');
    provinceObj = {
        provinces: {}
    };
    batchParamsObj = {
        pids: {}
    };
    cityHtml = '';
    $('.show-region').html('');
    $('.show-batch').html('');
    $(this).find('input').val('');
    $(this).find('select').val('-1');
    $(this).find('.validate-error').html('');
    $('#modal-codepackage>div').addClass('invisible');
}).on('click', '[data-cj="relevance"]', function() {
    // 关联批次
    let $dropdown = $(this).find('.dropdown-list');
    if ($dropdown.hasClass('invisible')) {
        $dropdown.removeClass('invisible').prev().children('.dropdown-icon').addClass('rotate');
        let e = $.Event('open.cj.dropdown');
        $dropdown.trigger(e);
    } else {
        $dropdown.addClass('invisible').prev().children('.dropdown-icon').removeClass('rotate');
        let e = $.Event('close.cj.dropdown');
        $dropdown.trigger(e);
    }

});

$('.form-group .code-check').click(function() {
    $(this).addClass('checked')
        .siblings('.code-check').removeClass('checked');
});

// 渲染码包列表
function batchRender() {
    $('.show-batch').html(tmpl('template_showbatch', { batchParamsObj: batchParamsObj }));
}

// 遍历procinceObj渲染到页面上
function rendering() {
    $('.show-region').html(tmpl('template_showregion', { provinceObj: provinceObj }));
}

/**
 * @author fu
 * @file 码包管理
 * end
 */



//下拉加载绑定: jxj

var code_bag_data = {
    url: '/api/v1/qr/GetPlanByActivity',
    method: 'GET',
    data: {
        activity_id: activityId,
        start: 0,
        size: 10,
        status: 1, // 1 在线 2 下线
    }

};
var dropLoad_code = undefined;
var dropLoad_bol = false;
//为公告配置添加下拉加载
$('[data-target="#codePackage"]').on('click', function() {
    if (dropLoad_bol) { return; }
    dropLoad_bol = true;
    $('#codePackage .dropload-down').remove();
    code_bag_data.data.start = 0;

    // if (dropLoad_code != undefined) {       
    //     dropLoadInit();
    // }

    dropLoad_code = $('#codePackage').dropload({
        scrollArea: window,
        autoLoad: true,
        distance: 10, // 拉动距离
        loadDownFn: function(me) {
            $.ajax(code_bag_data).done(function(result) {
                ajaxResHandle(result, getPlanByActivity, [me]);
            }).fail(function(jqXHR, textStatus) {
                // 锁定
                me.lock();
                // 无数据
                me.noData();
                // 即使加载出错，也得重置
                me.resetload();
                $('#notice ').html('<div class="dropload-error">加载出错<br>点我重试</div>');
                $('.dropload-error').off().click(() => {
                    dropLoad_code.noData(false);
                    dropLoad_code.unlock();
                    dropLoad_code.resetload();
                });
            });
        }
    });
    $('#codePackage .card-list').html('');
    // //重置下拉加载
    // function dropLoadInit() {

    //     code_bag_data.data.start = 0;

    //     $('.dropload-down').show();
    //     dropLoad_code.noData(false);
    //     dropLoad_code.unlock();
    //     dropLoad_code.resetload();
    // }


});

//重置下拉加载    
function dropLoadInit() {

    code_bag_data.data.start = 0;

    $('.dropload-down').show();
    dropLoad_code.noData(false);
    dropLoad_code.unlock();
    dropLoad_code.resetload();
}
