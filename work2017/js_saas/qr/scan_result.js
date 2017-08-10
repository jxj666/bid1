/**
 * @author fu
 * @file 码包管理
 * @createTime 8/7/2017
 */
var st = $.getSingleParam('st'); // 扫码次数
var res = unescape($.getSingleParam('res').replace(/\\u/g, '%u')); // 扫码结果
var vt = $.getSingleParam('pdn'); // 验真次数
var pin = $.getSingleParam('pin'); // 验真码
var pdi = $.getSingleParam('pdi'); // 产品id
var pdn = decodeURI($.getSingleParam('pdn')); // 产品名称
var pdt = parseInt($.getSingleParam('pdt')); // 产品规格

var pdg = $.getSingleParam('pdg'); // 产品图
var code = $.getSingleParam('code'); // code码值
(function scanCode() {

    if (code == 11001) { // 11001: 码未激活
        $('.scan').text('本码还未激活。如有异常。请及时联系<br/>客服反馈！');
    }
    else if (code == 11002 || code == 11006) { // 11002,11006: 码不存在
        $('.scan').text('该码不存在。如有异常。请及时联系<br/>客服反馈！');
    }
    else if (code == 11005) { // 11005: 码已失效
        $('.scan').text('该码已失效。如有异常。请及时联系<br/>客服反馈！');
    }
    else if (code == 16001) { // 16001: 产品不存在
        // $('.product-info').addClass('invisible');
        // $('.scan').addClass('margin-top');
        $('.scan').text('产品不存在。如有异常。请及时联系<br/>客服反馈！');
    }
	else {
        $('.product-info').removeClass('invisible');
        $('.scan').removeClass('margin-top');
        $('.pro-img').attr('src', pdg);
        $('.pro-introduce .title').text(pdn);
        // $('.info-detail').text(pdt);
        switch (pdt) {
            case 1: // 烟规格 盒
                pdt = '盒';
                break;
            case 0: // 条
                pdt = '条';
                break;
        }
        // $('.product-info').removeClass('invisible');
        var scanHTML = '扫码产品类型：售卖品，' + pdt + '<br>此次为本品第<span class="time">' + st + '</span>次扫码，验真为正品';
        $('.scan').html(scanHTML);
    }
})();


// 获取默认的礼品列表
defaultGift();
function defaultGift() {
    $.get('/act/plan/SAASMOBILE', {
        isSub: true,
        withDetail: true
    }).done(function (data) {
        ajaxResHandle(data, function () {
            $('#coupons-list').html(tmpl('template_coupons', data.context));
        });
    });
}

// 领取礼品接口
// $('.coupon-list').on('click', 'li', function () {
//     var product_id = $(this).data('pid');
//     var quantity = $(this).data('quantity');
//     $.post('/sku/getgift/'+'JS0001DS001', {
//         product_id: product_id,
//         quantity: '1000000000'
//     }).done(function (data) {

//     });
// });





