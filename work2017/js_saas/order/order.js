/**
 * @author 靳小健
 * @file 订单列表
 */
//自动收起弹框
$(document).on("click", function(e) {
    if ($(e.target).parents(".search-content").length == 0) {
        $(".select_box").slideUp();
        $('.search-content .dropdown-icon').removeClass('active2_icon');
    }
    if ($(e.target).parents(".step-list").length == 0) {
        $(".dropdown-menu").addClass('invisible');
        $('.step-item').removeClass('active_icon');
    }
});
// 跳转的扫码页面
var scanCodeUrl = 'https://act.yucent.com/a/p/saas-qr-scan.html';
var theRequest = $.getParamObj();
//全局变量
var List_data = [
    [{
        main_key: 'status'
    }, {
        text: '待支付',
        key: '0'
    }, {
        text: '已完成',
        key: '3'
    }, {
        text: '配送中',
        key: '2'
    }, {
        text: '全部',
        key: '110'
    }],
    [{
        main_key: 'payStatus'
    }, {
        text: '已支付',
        key: '1'
    }, {
        text: '未支付',
        key: '0'
    }, {
        text: '全部',
        key: '110'
    }],
    [{
        main_key: 'createTime'
    }, {
        text: '本周',
        key: '1'
    }, {
        text: '本月',
        key: '2'
    }, {
        text: '上月',
        key: '3'
    }, {
        text: '本季度',
        key: '4'
    }, {
        text: '全部',
        key: '110'
    }],
    [{
        main_key: 'orderType'
    }, {
        text: '电商',
        key: '1'
    }, {
        text: '红包',
        key: '2'
    }, {
        text: '实物奖品',
        key: '3'
    }, {
        text: '积分订单',
        key: '4'
    }, {
        text: '虚拟奖品',
        key: '5'
    }, {
        text: '全部',
        key: '110'
    }]
];
var DroploadObj = {
    start: 0, // 从index开始
    size: 50, // 每页搜索
    starTime: '', // 开始时间
    endTime: '', // 结束时间
    payStatus: '', // 支付状态
    status: '', // 订单状态
    orderType: '' // 奖品类型
};
var Main_data = {
    url: '/api/v1/order/GetOrdersByOrg',
    method: 'GET',
    data: {
        // uid: "uid-1",
        start: DroploadObj.start,
        size: DroploadObj.size
    }
};

// 筛选列表被点击
$('.step-list').on('click', '.step-item', function() {
    $('.dropload-noData').text(' ');
    $('.dropload-down').hide();
    $(this).closest('.step-item').toggleClass('active_icon');
    $(this).find('.dropdown-menu').toggleClass('invisible');
    $(this).siblings('.step-item').children('.dropdown-menu').addClass('invisible');
    $('.class_background').removeClass('invisible');
});

$(".pop ").on('click', '[data-click=return]', function() {
    $('.log-pop').html(' ');
    $('.pop').addClass('invisible');
    $('.log-pop').addClass('invisible');

});

document.addEventListener('click', function(e) {
    e = e || window.event;
    var $box = $('.step-item');
    if (!$box.is(e.target) && $box.has(e.target).length === 0) {
        // $box.children('.dropdown-menu').css('display', 'none');
        $('.class_background').addClass('invisible');
    }
    e.stopPropagation();
    // e.preventDefault();
});
$('.search_mobile_id input').on('keyup', function() {
    var $input = $('.search_mobile_id input');
    if ($input.val()) {
        $('.btn_back_search').addClass('search');
        $('.btn_back_search').removeClass('back');
        $('.btn_back_search').text('搜索');
    } else {
        $('.btn_back_search').addClass('back');
        $('.btn_back_search').removeClass('search');
        $('.btn_back_search').text('取消');
    }
});
$('.clear_text').on('click', function() {
    $('.search_mobile_id input').val('');
    $('.btn_back_search').addClass('back');
    $('.btn_back_search').removeClass('search');
    $('.btn_back_search').text('取消');
});
$('.search_mobile_id .back').on('click', function() {
    location.href = location.origin + location.pathname + '?num=' + Math.random();
});
$('.search_mobile_id .search').on('click', function() {
    var val = $('.search_mobile_id input').val().replace(/(^\s+)|(\s+$)/g, "");
    if (val.length == 11) {
        Main_data = {
            url: '/api/v1/order/GetOrdersByMobile',
            method: 'GET',
            data: {
                "mobile": val,
                "role": 1
            }
        }
        $('.show-content .show-list').html('');
        dropLoadInit();

        console.log(Main_data);

        return false; // 阻止冒泡
    } else if (val.length < 11) {
        $('.show-count').hide();
        $('.show-content .show-list').html('<p style="text-align:center"><br>请输入正确号码!</p>');
    } else {
        $.ajax({
            url: '/api/v1/order/GetOrder',
            method: 'GET',
            data: {
                "orderid": val
            }
        }).done(function(result) {
            ajaxResHandle(result, id_show);
        });
    }
    list_show();
});

$('.search-content').show();
$('.search_mobile_id').hide();
$('.search-content .search_btn').on('click', function() {
    $('.search-content').hide();
    $('.search_mobile_id').show();
});

$('.show-list').on('click', '[data-click="revise"]', function(ev) {
    ev.stopPropagation();
    var ev = ev || window.event;
    let target = ev.target || ev.srcElement;
    var $t = $(target);
    var orderid = $t.attr('data-orderid');
    var username = $t.attr('data-username');
    var mobile = $t.attr('data-mobile');
    var address = $t.attr('data-address');
    var status_text = $t.attr('data-status_text');
    var post_id = $t.attr('data-post_id');
    var provinceCode = $t.attr('data-province') || '';
    var cityCode = $t.attr('data-city') || '-1';
    var districtCode = $t.attr('data-district') || '-1';
    var name_provinceCode = $t.attr('data-name_province') || '';
    var name_cityCode = $t.attr('data-name_city') || '-1';
    var name_districtCode = $t.attr('data-name_district') || '';

    var order_text = `
                <h3>修改订单地址</h3> 
                <div class="order_boxs">
                    <div class="order_box">
                        <span>收货人</span>
                        <input class='input1' type="text" value="${username}">
                    </div>
                    <div class="order_box">
                        <span>联系电话</span>
                        <input class='input2' type="text" value="${mobile}">
                    </div>
                    <div class="order_box" >
                        <em>收货地址</em>
                        <div class="address_box select-addr">
        <select name="province" id="province" >
            <option>省</option>
        </select>
                            <div class="line"></div>
        <select name="city" id="city"  disabled>
            <option>市</option>
        </select>
                        </div>
                    </div>
                    <div class="order_box">
                        <input class='input3' type="text" value="${address}">
                    </div>
                    <div class="order_box">
                        <span>订单状态</span>
                        <p>${status_text}</p>
                    </div>
                    <div class="order_box" style='border:0;display:none'>
                        <span>运单号</span>
                        <input class='input4' type="text" value="${post_id}" disabled="disabled">
                    </div>
                </div>
                <div class="order_btn clearfix">
                    <button class="yes">确定修改</button>
                    <button class="no">取消</button>
                </div>

    <script type="text/html" id="template_area">
        {{ for(var i=0;i< district_list.length;i++){ }}
        <option value="{{= district_list[i].code }}">{{= district_list[i].name }}</option>
        {{ } }}
    </script>`;

    var $order_html = $(order_text);
    $('.order-pop').append($order_html);
    address_select();
    $('.pop').removeClass('invisible');
    $('.order-pop').removeClass('invisible');
    $('.yes').on('click', function() {
        var username = $('.input1').val();
        var mobile = $('.input2').val();
        var address = $('.input3').val();

        var province_codem = undefined,
            province = undefined,
            city_code = undefined,
            city = undefined;

        var province_code = ($('#province').val() == '-1' || $('#province').val() == ' ') ? undefined : $('#province').val();
        if (province_code) {
            var province_val = '[value="' + province_code + '"]';
            var province = $(province_val).text();
            var city_code = ($('#city').val() == '市' || $('#city').val() == '-1' || $('#city').val() == ' ') ? undefined : $('#city').val();
            if (city_code) {
                var city_val = '[value="' + city_code + '"]';
                var city = $(city_val).text();
            }
        }




        //console.log(username, mobile, address, orderid)
        $.ajax({
            url: '/api/v1/order/UpdateAddress',
            method: 'post',
            data: {
                "orderid": orderid,
                "province": province,
                "city": city,
                "provinceCode": province_code,
                "cityCode": city_code,
                "recipient": username,
                "acc": 1,
                "lat": 38.429659,
                "lng": 112.719977,
                "mobile": mobile,
                "address": address
            }
        }).done(function(result) {
            ajaxResHandle(result, reload_list);

        });

        function reload_list() {
            var $card = $t.closest('.card');
            console.log($card, $t)
            $card.find('.receiving-name').html('<p class="receiving-name">' + username + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="plone"></span></p>')
            $card.find('.plone').text(mobile);
            $card.find('.receiving-address').text(address);
            $card.find('.receiving-delivery').remove();
        }

        clear_list();

    });


    $('.no').on('click', function() {
        clear_list();
    });

    function clear_list() {
        $('.order-pop').html('')
        $('.pop').addClass('invisible');
        $('.order-pop').addClass('invisible');
    }
});


// 扫运单
$('.show-list').on('click', '[data-click="waybill"]', function(e) {
    var $t = $(e.target);
    var orderid = $t.attr('data-orderid');
    location.href = scanCodeUrl + '?ru=' + decodeURIComponent(location.href) + '?orderid=' + orderid;
});

$('.show-list').on('click', '[data-click="log"]', function(ev) {
    ev.stopPropagation();
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    var $t = $(target);
    var orderid = $t.attr('data-orderid');
    //console.log(orderid)
    $.ajax({
        url: '/api/v1/order/GetOrderAuditLog',
        method: 'GET',
        data: {
            "orderid": orderid
        }
    }).done(function(result) {
        ajaxResHandle(result, log_show);
    });

    function log_show(result_obj) {
        var context_arr = result_obj.context || [];
        var log_list_text = '';
        var createTime = '';
        var action = '';
        var appid = '';
        var createTime_arr = [];
        for (var i = 0; i < context_arr.length; i++) {
            //console.log(context_arr)
            createTime_arr = context_arr[i].createTime ? (context_arr[i].createTime.split(" ")) : [' ', ' '];
            action = context_arr[i].action || ' ';
            appid = context_arr[i].appid || ' ';
            // log_list_text += `
            //         <div class="log_box clearfix">
            //             <p class="log_left">${action}<br /><span>${appid}</span></p>
            //             <p class="log_right">${createTime_arr[0]}<br /><span>${createTime_arr[1]}&nbsp;</span></p>
            //         </div>
            // `;
            log_list_text = `
                <li class="log-item clearfix">
                    <p class="log-operat">${action}<br><span class="operat-name">${appid}</span></p>

                    <p class="log-time">${createTime_arr[0]}<br /><span>${createTime_arr[1]}&nbsp;</span></p>
                </li>
            `;
        }
        // var log_text =
        //     `<h3 class="text-center">查看日志信息</h3>
        //         <div class="log_boxs">
        //         ${log_list_text}
        //         </div>
        //         <div class="log_btn">
        //             <button data-click='return'>返回</button>
        //         </div>`;
        var log_text = `
            <h3 class="log-title">修改日志信息操作</h3>
            <ul class="log-list" id="log-list">
                ${log_list_text}
            </ul>
            <a href="javascript:;" data-click="return" class="return text-center">返回</a>
        `;
        var $log_html = $(log_text);
        $('.log-pop').append($log_html);
        $('.pop').removeClass('invisible');
        $('.log-pop').removeClass('invisible');
    }

});

function dropLoadInit() {
    Main_data.data.start = 0;
    DroploadObj.start = 0;
    Main_data.data.size = 50;
    $('.dropload-down').show();
    dropLoad.noData(false);
    dropLoad.unlock();
    dropLoad.resetload();
}

// 状态改变
$('.dropdown-menu').on('click', 'li', function(ev) {
    var $t = $(this);
    var key_num = $t.attr('data-key');
    var main_key = $t.attr('data-main-key');
    //console.log(main_key, key_num);
    $t.closest('.dropdown-menu').addClass('invisible').find('li.active_li').removeClass('active_li');
    $(this).closest('.step-item').removeClass('active_icon');
    $('.class_background').addClass('invisible');
    $t.addClass('active_li');
    $t.closest('.step-item ').addClass('active').find('.title').text($t.text());

    Main_data.url = '/api/v1/order/GetOrdersByOrg';
    Main_data.method = 'GET';
    // Main_data.data.uid = "uid-1";
    Main_data.data.mobile = undefined;
    Main_data.data.role = undefined;

    if (main_key == 'status') {
        Main_data.data.status = (key_num == 110) ? undefined : key_num;
        if (key_num == 110) {
            $t.closest('.step-item ').removeClass('active').children('.title').text('订单状态');
        }
        sessionStorage.switch_list = 'status';
    } else if (main_key == 'payStatus') {
        Main_data.data.pay_status = (key_num == 110) ? undefined : key_num;
        if (key_num == 110) {
            $t.closest('.step-item ').removeClass('active').children('.title').text('支付状态');
        }
        sessionStorage.switch_list = 'payStatus';
    } else if (main_key == 'orderType') {
        Main_data.data.order_type = (key_num == 110) ? undefined : key_num;
        if (key_num == 110) {
            $t.closest('.step-item ').removeClass('active').children('.title').text('奖品类型');
        }
    } else {
        //console.log('时间接口');
        var starTimeStr = '',
            endTimeStr = '';
        var now = moment().valueOf();
        switch (key_num) {
            case '1': //本周
                starTimeStr = moment().startOf('week').valueOf();
                endTimeStr = now;
                break;
            case '2': //本月
                starTimeStr = moment().startOf('month').valueOf();
                endTimeStr = now;
                break;

            case '3': //上月
                starTimeStr = moment().subtract(1, 'month').startOf('month').valueOf();
                endTimeStr = moment().startOf('month').valueOf();
                break;
            case '4': //本季度
                starTimeStr = moment().startOf('quarter').valueOf();
                endTimeStr = now;
                break;
            case '110': //本季度
                starTimeStr = undefined;
                endTimeStr = undefined;
                break;
            default:
                alert('数据错误请刷新!');
        }
        Main_data.data.start_time = starTimeStr;
        Main_data.data.end_time = endTimeStr;
        if (key_num == 110) {
            $t.closest('.step-item ').removeClass('active').children('.title').text('创建时间');
        }
    }

    // console.log(Main_data.data)
    $('.show-content .show-list').html('');
    dropLoadInit();

    console.log(Main_data);

    return false; // 阻止冒泡
});

// 下拉加载
var dropLoad = $('.show-content').dropload({
    scrollArea: window,
    autoLoad: true,
    distance: 10, // 拉动距离
    loadDownFn: function(me) {
        ajax_GetOrdersCount();
        $.ajax(Main_data).done(function(result) {
            ajaxResHandle(result, main_show, [me]);
        }).fail(function(jqXHR, textStatus) {
            // 锁定
            me.lock();
            // 无数据
            me.noData();
            // 即使加载出错，也得重置
            me.resetload();
            $('.dropload-noData').html('<div class="dropload-error">加载出错<br>点我重试</div>');
            $('.dropload-error').off().click(() => {
                dropLoad.noData(false);
                dropLoad.unlock();
                dropLoad.resetload();
            });
        });
    }
});

// 渲染订单列表
function main_show(result_obj, me) {
    //主列表渲染
    console.log(arguments);
    // $('.show-count').show();
    // $('.show-count .total').text(result_obj.context.totalOrders);
    // $('.show-count .paid-count').text(result_obj.context.totalPay);
    var list_array = result_obj.context || [];
    var list_num = list_array.length;

    DroploadObj.start += list_num;
    Main_data.data.start = DroploadObj.start;

    var card_html = '';
    if (list_num > 0) {
        var orderid = '',
            productName = '',
            totalFee = '',
            username = '',
            mobile = '',
            address = '',
            status = '',
            status_text = '',
            city = '',
            district = '',
            province = '',
            status_class = '';
        for (let i = 0; i < list_num; i++) {
            orderid = list_array[i].order ? (list_array[i].order.orderid || '') : '';
            productName = list_array[i].details[0] ? (list_array[i].details[0].productName || '') : '';
            totalFee = list_array[i].fee ? ('￥' + list_array[i].fee.totalFee || '') : '';
            username = list_array[i].delivery ? (list_array[i].delivery.username || '') : '';
            mobile = list_array[i].delivery ? (list_array[i].delivery.mobile || '') : '';
            address = list_array[i].delivery ? (list_array[i].delivery.address || '') : '';
            status = list_array[i].order ? (list_array[i].order.status || '') : '';
            payStatus = list_array[i].order ? (list_array[i].order.payStatus || '') : '';
            city = list_array[i].delivery ? (list_array[i].delivery.city || '') : '';
            district = list_array[i].delivery ? (list_array[i].delivery.district || '') : '';
            province = list_array[i].delivery ? (list_array[i].delivery.province || '') : '';
            cityCode = list_array[i].delivery ? (list_array[i].delivery.cityCode || '') : '';
            districtCode = list_array[i].delivery ? (list_array[i].delivery.districtCode || '') : '';
            provinceCode = list_array[i].delivery ? (list_array[i].delivery.provinceCode || '') : '';
            if (address.length > 15) {
                var min_address = address.slice(0, 13) + '...';
            } else {
                var min_address = address;
            }
            status_class = 'paid';
            if (sessionStorage.switch_list == 'payStatus') {
                if (payStatus == 0) {
                    status_text = '未支付';
                } else if (payStatus == 1) {
                    status_text = '已支付';
                } else { status_text = '其他'; }
            } else {
                if (status == 1) {
                    status_text = '已支付';
                } else if (status == 2) {
                    status_text = '配送中';
                    status_class = 'send';
                } else if (status == 3) {
                    status_text = '已完成';
                } else if (status == 4) {
                    status_text = '已取消';
                } else {
                    status_text = '待支付';
                }
            }
            card_html += `<div class="card clearfix">
                <div class="left">
                    <div class="left-top clearfix">
                        <p class="orders">订单号：<strong class="order-num">${orderid}</strong></p>
                        <p class="goods">商品：<span class="goods-name">${productName}</span></p>
                        <p class="pay">支付金额： <span class="pay-money">${totalFee}</span></p>
                    </div>
                    <div class="left-bottom">
                        <p class="receiving-name">${username}&nbsp;&nbsp;&nbsp;&nbsp;<span class="plone">${mobile}</span></p>
                        <p class="receiving-delivery ${(province || city || district)? '' : 'invisible'}">${province} ${city} ${district}</p>
                        <p class="receiving-address">${min_address}</p>
                    </div>
                </div>
                <ul class="right">
                    <li class="${status_class}">${status_text}</li>
                    <li class="modification" data-click='revise' data-orderid='${orderid}' data-username='${username}' data-mobile='${mobile}' data-address='${address}' data-status_text='${status_text}' data-post_id='${orderid}' data-province='${provinceCode}' data-city='${cityCode}' data-district='${districtCode}' data-name_province='${province}' data-name_city='${city}' data-name_district='${district}' >修改</li>
                    <li class="scan-waybill" data-click='waybill' data-orderid='${orderid}'>扫运单</li>
                    <li class="log" data-click='log' data-orderid='${orderid}'>日志</li>
                </ul>
            </div>`;
        }
    } else {
        // 锁定
        me.lock();
        // 无数据
        me.noData();
        console.log('锁定');
    }


    $('.show-content .show-list').append(card_html);
    // 每次数据插入，必须重置
    me.resetload();
    if (DroploadObj.start == 0) {
        $('.dropload-down').hide();
        // 如果start仍为0，说明没有一条数据
        $('.show-list').html(`<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/order/nodata.png" alt="" class="showlist-img_nodata">
<div class="showlist-info_nodata">暂无数据</div>`);
    }

}

//订单搜索渲染
function id_show(result_obj) {
    //console.log(result_obj);
    $('.show-count').hide();
    var list_array_1 = result_obj.context ? (result_obj.context.order || '') : '';
    var card_html = '',
        orderid = '',
        productName = '',
        totalFee = '',
        username = '',
        mobile = '',
        address = '',
        status = '',
        status_text = '',
        status_class = '';

    orderid = list_array_1.order ? (list_array_1.order.orderid || '') : '';
    productName = list_array_1.details[0] ? (list_array_1.details[0].productName || '') : '';
    totalFee = list_array_1.fee ? ('￥' + list_array_1.fee.totalFee || '') : '';
    username = list_array_1.delivery ? (list_array_1.delivery.username || '') : '';
    mobile = list_array_1.delivery ? (list_array_1.delivery.mobile || '') : '';
    address = list_array_1.delivery ? (list_array_1.delivery.address || '') : '';
    status = list_array_1.order ? (list_array_1.order.status || '') : '';
    status_class = 'paid';
    if (status == 1) {
        status_text = '已支付';
    } else if (status == 2) {
        status_text = '配送中';
        status_class = 'send';
    } else if (status == 3) {
        status_text = '已完成';
    } else if (status == 4) {
        status_text = '已取消';
    } else {
        status_text = '未支付';
    }

    card_html += `
<div class="card clearfix">
                <div class="left">
                    <div class="left-top clearfix">
                        <p class="orders">订单号：<strong class="order-num">${orderid}</strong></p>
                        <p class="goods">商品：<span class="goods-name">${productName}</span></p>
                        <p class="pay">支付金额： <span class="pay-money">${totalFee}</span></p>
                    </div>
                    <div class="left-bottom">
                        <p class="receiving-name">${username}&nbsp;&nbsp;&nbsp;&nbsp;<span class="plone">${mobile}</span></p>
                        <p class="receiving-address">${address}</p>
                    </div>
                </div>
                <ul class="right">
                    <li class="${status_class}">${status_text}</li>
                    <li class="modification" data-click='revise' data-orderid='${orderid}' data-username='${username}' data-mobile='${mobile}' data-address='${address}' data-status_text='${status_text}' data-post_id='${orderid}'>修改</li>
                    <li class="scan-waybill" data-click='waybill'>扫运单</li>
                    <li class="log" data-click='log' data-orderid='${orderid}'>日志</li>
                </ul>
            </div>`;
    $('.show-content .show-list').html(card_html);
}

//下拉菜单渲染
function list_show() {
    var list_num = '';
    for (var i = 0; i < List_data.length; i++) {
        list_num = '.dropdown_list' + (i + 1);
        var list_html = '';
        var list_text = '';
        var list_key = '';
        var list_main_key = '';
        for (var j = 1; j < List_data[i].length; j++) {
            list_text = List_data[i][j].text;
            list_key = List_data[i][j].key;
            list_main_key = List_data[i][0].main_key;
            list_html += `<li data-key='${list_key}' data-main-key='${list_main_key}'>${list_text}</li>`;
        }
        $('.step-item').removeClass('active')
        $(list_num).html(list_html);
    }
}
list_show();

function address_select() {
    var city = {};
    $(".select-menu select").change(function() {
        $(this).parent().prev("span").text($(this).find("option:selected").text());
    });
    // console.log(data);
    data.district_list = data.province_list;
    // console.log(data.district_list);

    data.district_list.map(function(item) {
        city[item.code] = item.district_list;
    });
    // console.log(city);

    $("#province").html("<option value='-1'>省</option>" + tmpl("template_area", data)).change(function() {
        console.log($("#province").find("option:selected").val())
        $("#city").parent().prev("span").text("市");
        $("#district").prop("disabled", true).html("<option value='-1'>区</option>").parent().prev("span").text("区");
        if ($("#province").val() == -1) {
            $("#city").prop("disabled", true).html("<option value='-1'>市</option>");
        } else {
            console.log($("#province").val())
            $("#city").prop("disabled", false).html("<option value='-1'>市</option>" + tmpl("template_area", { district_list: city[$("#province").val()] })).change(
                function() {
                    $("#district").parent().prev("span").text("区");
                    if ($("#city").val() == -1) {
                        $("#district").prop("disabled", true).html("<option value='-1'>区</option>");
                    } else {
                        var country = {};
                        city[$("#province").val()].map(function(item) {
                            country[item.code] = item.district_list;
                        });
                        $("#district").prop("disabled", false).html("<option value='-1'>区</option>" + tmpl("template_area", { district_list: country[$("#city").val()] }))
                    }
                })
        }
    })
}

$.ajax({
    url: '/api/v1/acms/GetActivities',
    method: 'GET',
    data: {
        start: 0,
        size: 10000,
        actstatus: 1
    },
}).done(function(result) {
    ajaxResHandle(result, select);
});

function select(result) {
    var option = '';
    var k = 1;
    var name = '';
    var activity_id = '';
    option += `<div class='select_option' data-name='全部' data-type='undefined'>全部活动</div>  `;
    for (var i = 0; i < result.context.activities.length; i++) {

        name = result.context.activities[i].activity.name;
        activity_id = result.context.activities[i].activity.activityId;
        name || (name = '无名活动' + k++);
        option += `<div class='select_option' data-name='${name}' data-type='${activity_id}'>${name}</div>  `;
    }
    var select_html = `<div class='select_box'>${option}</div>`;

    $('.search-content').append(select_html);
}

// $('input.search').on('keyup', function() {
//     $('.dropload-noData').text(' ');
//     $('.dropload-down').hide();

//     var input_val = $('input.search').val();
//     var data_option = `[data-name*="${input_val}"]`;
//     $('[data-name]').hide();
//     $(data_option).show();
//     if (!input_val) {
//         $('[data-name]').show();
//         $('.select_box').hide();
//         Main_data.url = '/api/v1/order/GetOrdersByOrg';
//         Main_data.method = 'GET';
//         Main_data.data.activity_id = undefined;
//         // Main_data.data.uid = "uid-1";
//         Main_data.data.mobile = undefined;
//         Main_data.data.role = undefined;
//         $('.show-content .show-list').html('');
//         dropLoadInit();
//     } else {
//         $('.select_box').show();
//         return;
//     }
// });
// $('input.search').on('change', function() {
//     $('.dropload-noData').text(' ');
//     $('.dropload-down').hide();

//     var input_val = $('input.search').val();
//     var data_option = `[data-name*="${input_val}"]`;
//     $('[data-name]').hide();
//     $(data_option).show();
//     if (!input_val) {
//         $('[data-name]').show();
//         $('.select_box').hide();
//         Main_data.url = '/api/v1/order/GetOrdersByOrg';
//         Main_data.method = 'GET';
//         Main_data.data.activity_id = undefined;
//         // Main_data.data.uid = "uid-1";
//         Main_data.data.mobile = undefined;
//         Main_data.data.role = undefined;
//         $('.show-content .show-list').html('');
//         dropLoadInit();
//     } else {
//         $('.select_box').show();
//         return;
//     }
// });
// $('input.search').on('keydown', function() {
//     $('.dropload-noData').text(' ');
//     $('.dropload-down').hide();

//     var input_val = $('input.search').val();
//     var data_option = `[data-name*="${input_val}"]`;
//     $('[data-name]').hide();
//     $(data_option).show();
//     if (!input_val) {
//         $('[data-name]').show();
//         $('.select_box').hide();
//         Main_data.url = '/api/v1/order/GetOrdersByOrg';
//         Main_data.method = 'GET';
//         Main_data.data.activity_id = undefined;
//         // Main_data.data.uid = "uid-1";
//         Main_data.data.mobile = undefined;
//         Main_data.data.role = undefined;
//         $('.show-content .show-list').html('');
//         dropLoadInit();
//     } else {
//         $('.select_box').show();
//         return;
//     }
// });
$('input.search').on('focus', function() {
    $(this).blur();
    $(this).attr('placeholder', ($(this).val() ? $(this).val() : $(this).attr('placeholder')));
    $(this).val('');
    $('.select_box').show();
    $('.dropload-noData').text(' ');
    $('.dropload-down').hide();
    var input_val = $('input.search').val();
    if (input_val) {

        var data_option = `[data-name*="${input_val}"]`;
        $('[data-name]').hide();
        $(data_option).show()
    }
    $('.search-content .dropdown-icon').addClass('active2_icon');
});

$('.search-content').on('click', '[data-type]', function(e) {
    $('.search-content .dropdown-icon').removeClass('active2_icon');
    var $t = $(e.target)
    if ($t.attr('data-type') == 'undefined') {
        var val_select = undefined;
    } else {
        var val_select = $t.attr('data-type');
    }

    var val_name = $t.attr('data-name');
    $('[data-type]').removeClass('active');
    $t.addClass('active');
    $('input.search').val(val_name);
    $('.select_box').hide();

    Main_data.url = '/api/v1/order/GetOrdersByOrg';
    Main_data.method = 'GET';
    Main_data.data.activity_id = val_select;
    // Main_data.data.uid = "uid-1";
    Main_data.data.mobile = undefined;
    Main_data.data.role = undefined;
    $('.show-content .show-list').html('');
    dropLoadInit();
});

function ajax_GetOrdersCount() {
    var idata = {}
    idata.activity_id = Main_data.data.activity_id;
    idata.product_id = Main_data.data.product_id;
    idata.status = Main_data.data.status;
    idata.pay_status = Main_data.data.pay_status;
    idata.start_time = Main_data.data.start_time;
    idata.end_time = Main_data.data.end_time;
    idata.order_type = Main_data.data.order_type;
    $.ajax({
        url: '/api/v1/order/GetOrdersCount',
        method: 'GET',
        data: idata,
    }).done(function(result) {
        ajaxResHandle(result, count_order);
    });

}

function count_order(result) {
    $('.show-count').show();
    $('.show-count .total').text(result.context.total);
    $('.show-count .paid-count').text(result.context.totalPay);
}