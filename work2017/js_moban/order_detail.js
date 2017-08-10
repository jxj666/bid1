//*********
// _________组件
//order_detail 简写 od
var od = new common('order_detail');

//*********
// _________变量
od.noun = {
    i: 0,
    author: 'jxj'
};
//*********
// _________函数
od.fun = {
    search_address: function() {
        var deliverytype = $('.info-item4 p').find('span').attr('data-deliverytype');
        var deliveryorderid = $('.info-item4 p').find('span').attr('data-deliveryorderid');
        if (deliverytype == 1) {
            location.href = `http://www.sf-express.com/mobile/cn/sc/dynamic_function/waybill/waybill_query_info.html?billno=${deliveryorderid}`;
        } else if (deliverytype == 3) {
            location.href = `http://m.deppon.com/mow/client/index.html#/goodsTrack/${deliveryorderid}`;
        } else {
            location.href = `http://m.kuaidi100.com/result.jsp?nu=${deliveryorderid}`;
        }
    },
    address_fix: function(bol) {
        if (bol == 1) {
            sessionStorage.address_has = 1;
        } else {
            sessionStorage.address_has = 2;
        }
        location.href = '/a/p/common-user-address-v1.html';
    },
    main: function(activityId) {
        localStorage.author = od.noun.author;
        od.fun.get_orderid();
        sessionStorage.activityId = activityId;
        sessionStorage.orderid = od.noun.orderid;
        od.ajax.order(od.noun.orderid, activityId);
    },
    get_orderid: function() {
        od.noun.orderid = od.able.getQueryString('orderid');
    },
    order_show: function(res, port) {
        od.able.console_data(res, port);
        $('.order-img-content img').attr('src', res.context.details[0].productImage);
        $('.order-title').text(res.context.details[0].productName);
        $('.order-p').text(res.context.details[0].createTime);
        var payStatus = res.context.order.payStatus;
        var status = res.context.order.status;
        if (res.context.delivery) {
            $('.juti em').text(res.context.delivery.username);
            $('.juti span').text(res.context.delivery.mobile);
            $('.juti p').text(res.context.delivery.address);
        }
        //收货信息
        if (status >= 2) {
            $('.receipt-info3').removeClass('invisible');
        } else {
            if (res.context.delivery || res.context.delivery != null || res.context.delivery != undefined) {
                $('.receipt-info2').removeClass('invisible');
            } else {
                $('.receipt-info1').removeClass('invisible');
            }
        }
        //订单信息
        if (payStatus == 1) {
            $('.info-item1').removeClass('invisible');
            $('.info-item2').removeClass('invisible').find('.info-time').text(res.context.order.payTime);
            if (status == 1) {
                // 配送
                $('.info-item3').removeClass('invisible').addClass('active');
                $('.info-item3').find('a').addClass('active-anchor');
            } else if (status == 2) {
                //发货
                $('.info-item4').removeClass('invisible').addClass('active').find('.info-time').text(res.context.delivery.deliveryTime);
                $('.info-item4').find('a').addClass('active-anchor');
                $('.info-item4 p').html(`物流查询:<span data-deliveryType='${res.context.delivery.deliveryType}' data-deliveryOrderid='${res.context.delivery.deliveryOrderid}'> ${res.context.delivery.deliveryName} ${res.context.delivery.deliveryOrderid}</span>`);
            } else {
                //支付
                $('.info-item2').addClass('active');
                $('.info-item2').find('a').addClass('active-anchor');
            }
        } else {
            //创建
            $('.info-item1').removeClass('invisible').addClass('active').find('.info-time').text(res.context.order.createTime);
            $('.info-item1').find('a').addClass('active-anchor');
        }
    }
};
//*********
// _________异步
od.ajax = {
    order: function(orderid, activityId) {
        var url_text = '/award/order';
        var port = '获取订单详情';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {
                orderid: orderid,
                activityId: activityId
            }
        }).done(function(res) {
            od.fun.order_show(res, port);
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    }
};


//*********
// _________通用函数
function common(name) {
    this.name = name;
    this.able = {};
    this.able.console_data = function(res, name) {
        if (res.code != '1') {
            console.log(name + '数据错误! ->' + res.msg);
        } else {
            od.noun.i += 1;
            console.log('运行排序:' + od.noun.i, '接口:' + name, res);
        }
    };
    this.able.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(?:&|$)", 'i');
        var str_arr = window.location.search.substr(1).match(reg);
        return str_arr != null ? str_arr[2] : null;
    };

}

//*********
// _________绑定
$('.receipt-info1 .receipt-content').on('click', function() {
    od.fun.address_fix(1);
});
$('.receipt-info2 .bianji').on('click', function() {
    od.fun.address_fix(2);
});
$('.info-item4 p').on('click', function() {
    od.fun.search_address();
});

//*********
// _________运行
od.fun.main('JS0001DS001');