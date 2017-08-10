/**
 * @author fu
 * @file 码包管理
 */

var withPinPasswd = true; // 是否包含数字验证码
var productId = ''; // 初始化产品
var status = ''; // 初始化状态
var batchno = '';
var obj = {
    page: 1, // 页码数
    size: 20, // 每页返回记录数
    productId: '', // 产品id
    status: '', // 产品状态
    batchNo: '', // 批次编号
    numTxt: '', // 批次号
    nameTxt: '', // 码包名称
    relevance: '', // 关联码包
    packageType: '', // 产品规格
    rulesTxt: '',
    countTxt: '', // 二维码数量
    timeTxt: '', // 创建时间
    personTxt: '', // 操作者
    withPinPasswd: '', // 是否包含数字验证码
    remarksTxt: '', // 码包备注
    beginTime: '', // 起始时间
    endTime: '', // 结束时间
    domain: '', // 成码域名
    orgId: ''
};

var str = ''; // 盛放activityId的字符串

var mainData = {
    // url: '/api/v1/qr/ListQrBatch',
    url: '/func/qr/list/batch',
    method: 'GET',
    data: {
        productId: obj.productId,
        page: obj.page,
        size: obj.size,
        status: obj.status,
        beginTime: obj.beginTime,
        endTime: obj.endTime
    }
};
// 成码域名
(function () {
    $.get('/api/v1/es/GetOrgInfo', function (data) {
        ajaxResHandle(data, function () {
            if (data.code === 1) {
                obj.orgId = data.context.orgId;
                if (data.context.params['qr.domain']) {
                    var value = data.context.params['qr.domain'].value;
                    value = value.split(',')[0];
                    $('.tip-url').text(value);
                    $('.tip').removeClass('invisible');
                    obj.domain = value;
                }
                else {
                    $('.tip').addClass('invisible');
                    return;
                }
            }
            else {
                alert(data.msg);
            }
        });
    });
})();


// 将状态置为全选
$('.nav-item .list').each(function () {
    $(this).children('li:last-child').addClass('active');
});

$('[data-click="seek"]').click(function () {
    $(this).parent().hide();
});

function dropLoadInit() {
    obj.page = 1;
    mainData.data.page = 1;
    $('.dropload-down').show();
    dropLoad.noData(false);
    dropLoad.unlock();
    dropLoad.resetload();
}

// 新增弹窗入口 将input内容清空
$('[data-click="add-enter"]').click(function () {
    $('.add-title').text('新增码包');
    $('input[name="count"]').attr('disabled', false); // 二维码数量设置成可点击状态

    $('.add-code input').val('');
    $('.code-check1 input').val(4);
    $('.code-check2 input').val(6);
    $('.add-code .relevance-name').text('关联产品');
    $('#relevance-product li').removeClass('active');
    $('.add-code .rules-text').text('产品规格');
    $('textarea[name="remarks"]').val(''); // 码包备注

    withPinPasswd = true; // 是否包含数字验证码
    $('.menu_c').removeClass('disabled');
    $('.menu_c div').removeClass('j_active');
    $('.yes_c').addClass('j_active');
    $('.relevance-name').removeClass('c-6');
    $('.rules-text').removeClass('c-6');
    $('.code-check').removeClass('checked disabled')
        .children('.check').attr('checked', false);
    $('.code-checkes').removeClass('invisibles');

    $('.add-code .code-check1').addClass('checked').children().attr('checked', true);

    $('.add-code .code-check2').removeClass('checked').children().attr('checked', false);

    $('.pop').removeClass('invisible')
        .children('.add-code').removeClass('invisible')
        .siblings().addClass('invisible');
    let e = $.Event('shown.cj.modal', {relatedTarget: this});
    $('.pop').trigger(e);
    $('.compile-btn').addClass('invisible')
        .siblings('.add-btn').removeClass('invisible');

    isScrollable();
});

// 新增按钮
$('[data-click="add-btn"]').click(function () {

    var nameVal = $('input[name="name"]').val(); // 码包名称
    if ($.trim(nameVal) === '') {
        alert('请输入码包名称！');
        return;
    }

    var size = $('input[name="count"]').val(); // 二维码数量
    var reg = /^[0-9]*$/;
    if ($.trim(size) === '') {
        alert('请输入二维码数量！');
        return;
    }
    if (parseInt(size) < 1 || parseInt(size) > 3000000) {
        alert('二维码数量必须在1-3000000之间');
        return;
    }
    if (!reg.test($.trim(size))) {
        alert('二维码数量必须为数字！');
        return;
    }

    var productId = $('.import').children('.relevance-id').text();// 关联产品
    if (productId === '') {
        alert('请选择关联产品！');
        return;
    }

    var rulesVal = $('.rules-text').text() === '盒' ? 1 : 0; // 产品规格

    var remarksVal = $('textarea[name="remarks"]').val(); // 码包备注

    var pinPasswdLength = $('input[name="code"]:checked').val() || 0; // 验证码位数
    console.log($('input[name="code"]:checked').val());
    var domain = $('.tip-url').text();
    console.log(nameVal + ',' + size + ',' + productId + ',' + rulesVal+',' + remarksVal + ',' + withPinPasswd + ',' + pinPasswdLength);

    // 创建二维码批次
    $.post('/api/v1/qr/CreateQrBatch', {
        productId: productId,
        size: size,
        withPinPasswd: withPinPasswd,
        name: nameVal,
        orgId: obj.orgId,
        pinPasswdLength: pinPasswdLength,
        memo: remarksVal,
        domain: domain,
        needGenerate: true
    }).done(function (data) {
        ajaxResHandle(data, function () {
            alert('新增成功！二维码生成需要一定的时间');
            $('#code-list').html('');
            dropLoadInit();
        });
    });

    $('.pop').addClass('invisible')
        .children('.void-code').addClass('invisible');
    isScrollable();
});

// 下载弹窗入口
$('#code-list').on('click', '[data-click="download-enter"]', function () {
    batchno = $(this).closest('.btn-list').data('batchno');
    var codeName = $(this).parents('.code-item').data('name');
    // 转成unicode编码
    codeName = escape(codeName).toLocaleLowerCase().replace(/%u/gi, '\\u');
    // console.log(codeName);
    codeName = codeName.replace(/\\/g, '/');
    // console.log(codeName);
    $.get('/api/v1/qr/GetQrBatch', {
        batchNo: batchno
        // qrcode: ''
    }).done(function (data) {
        ajaxResHandle(data, function () {
            var fileSecret = data.context.fileSecret;
            if (fileSecret) {
                var text = location.origin + '/html/qr/download.html?batchNo=' + batchno + '&codeName=' + codeName + '&orgId=' + obj.orgId;
                $('.copy-text').html(`<p class="linkurl">${text}</p>
                        <p class="pdk linkurl">查看文件密钥:<span class="secret"></span>${fileSecret}</p> `)
                    .removeClass('text-center');
                $('[data-cj=shareBtn]').show();
            }
            else {
                $('.copy-text').html('此文件暂不支持下载').addClass('text-center');
                $('[data-cj=shareBtn]').hide();
            }
        });
    });
    
    $('.pop').removeClass('invisible')
        .children('.download').removeClass('invisible')
        .siblings().addClass('invisible');
    $('.backspace').removeClass('invisible');
    isScrollable();
});

// 下载弹窗返回按钮
$('[data-click="backspace"]').click(function () {
    $(this).addClass('invisible')
           .siblings().addClass('invisible')
           .parent('.pop').addClass('invisible');
    isScrollable();
});


// 复制到剪切板
$('[data-cj=shareBtn]').click(function () {
    $('#shareBtn').trigger('click');
});
var clipboard = new Clipboard('#shareBtn');

clipboard.on('success', function (e) {
    $('.pop').addClass('invisible');
    isScrollable();
    e.clearSelection();
    alert('复制成功！');
});

clipboard.on('error', function (e) {
   alert('复制失败，请重试');
});

// 编辑弹窗入口
$('#code-list').on('click', '[data-click="compile-enter"]', function () {
    if ($(this).data('status') > 3) {
        alert('已激活码包不可修改');
        return;
    }
    $('.add-title').text('编辑');

    obj.batchNo = $(this).closest('.btn-list').data('batchno');

    obj.productId = $(this).data('pid'); // 产品id

    // 得到当前的商品内容
    var parentCon = $(this).parents('.code-top').children().children();

    obj.numTxt = parentCon.children('.num').text(); // 批次号

    obj.nameTxt = $(this).parents('.code-item').data('name');// 码包名称

    obj.relevance = parentCon.children('.name').text(); // 关联码包
    $('#relevance-product li').removeClass('active');

    $('#relevance-product li').each(function () {
        var relevanceText = $.trim($(this).text());
        var relevance = $.trim(obj.relevance);

        if (relevanceText == relevance) {
            $(this).addClass('active');
        }
    });

    obj.rulesTxt = parentCon.children('.rules').text(); // 产品规格

    if (obj.rulesTxt === '条') {
        obj.packageType = 0;
    }
    else {
        obj.packageType = 1;
    }
    obj.status = $(this).parent('.right').data('status'); // 码包状态

    obj.countTxt = parentCon.children('.count').text(); // 二维码数量

    obj.timeTxt = parentCon.children('.time').text(); // 创建时间

    obj.personTxt = parentCon.children('.person').text(); // 操作者

    obj.withPinPasswd = parentCon.children('.captcha').text(); // 是否包含数字验证

    obj.pinPasswdLength = $(this).parents('.code-top').children().children('.pin').data('pin'); // 验证码位数

    obj.remarksTxt = parentCon.children('.remarks').text() == '无' ? '' : parentCon.children('.remarks').text(); // 码包备注

    obj.domain = $(this).parents('.code-item').data('domain'); // 成码域名
    // 将得到的内容放到弹窗里
    compile(obj);
});

function compile(obj) {
    $('input[name="name"]').val(obj.nameTxt); // 码包名称

    $('input[name="count"]').val(obj.countTxt); // 二维码数量

    $('input[name="count"]').attr('disabled', true); // 二维码数量设置不可点击状态
    $('.relevance-name').addClass('c-6');
    $('.rules-text').addClass('c-6');

    $('.relevance-name').text(obj.relevance); // 关联产品
    $('.relevance-id').text(obj.productId); // 产品id
    $('.rules-text').text(obj.rulesTxt); // 码包规则

    $('[data-click="form-down"]').click(function () {
        return false;
    });

    $('textarea[name="remarks"]').val(obj.remarksTxt); // 码包备注

    // 将验证码位数显示在编辑窗口中
    if (obj.withPinPasswd === '否') { // 不包含数字验证码
        $('.code-checkes').addClass('invisible');
        $('.menu_c div').removeClass('j_active');
        $('.no_c').addClass('j_active');
        $('.menu_c').addClass('disabled'); // 将是否包含数字验证码置为不可点击状态
        $('.code-check').removeClass('checked').addClass('disabled')
            .children('.check').attr('checked', false);
    }
    else {
        $('.code-checkes').removeClass('invisible');
        $('.menu_c div').removeClass('j_active');
        $('.yes_c').addClass('j_active');
        $('.menu_c').addClass('disabled'); // 将是否包含数字验证码置为不可点击状态
        if ($('.code-check1').children('.check').val() == obj.pinPasswdLength) {
            $('.check').attr('checked', false)
                .parent('.code-check').removeClass('checked disabled');
            $('.code-check1').addClass('checked disabled')
                .children('.check').attr('checked', true);
            $('.code-check2').addClass('disabled');
        }
        else if ($('.code-check2').children('.check').val() == obj.pinPasswdLength) {
            $('.check').attr('checked', false)
                .parent('.code-check').removeClass('checked disabled');
            $('.code-check2').addClass('checked disabled')
                .children('.check').attr('checked', true);
            $('.code-check1').addClass('disabled');
        }
        else {
            alert('aa');
        }
    }

    $('.tip-url').html(obj.domain); // 成码域名

    $('.pop').removeClass('invisible')
        .children('.add-code').removeClass('invisible')
        .siblings().addClass('invisible');

    $('.add-btn').addClass('invisible')
        .siblings('.compile-btn').removeClass('invisible');
    isScrollable();
}

document.addEventListener('click', function (e) {
    e = e || window.event;
    var $box = $('.listener');
    if (!$box.is(e.target) && $box.has(e.target).length === 0) {
        $box.children('.dropdown-list').css('display', 'none');
    }
    e.stopPropagation();
    // e.preventDefault();
});

// 阻止弹窗冒泡

$('.add-code,.download').click(e => {
    e.stopPropagation();
});

// 更新数据
$('.add-btns').on('click', '[data-click="compile-btn"]', function () {
    obj.nameText = $('input[name="name"]').val(); // 批次名称

    obj.packageType = $('.rules-text').text() === '盒' ? 1 : 0; // 产品规格

    obj.remarksTxt = $('textarea[name="remarks"]').val(); // 码包备注

    obj.productId = $('.relevance-id').text();

    // console.log(obj.nameText + ',' + obj.packageType + ',' + obj.remarksTxt + ',' + obj.productId);
    // var domain = $('.tip-url').text();

    $.post('/api/v1/qr/UpdateQrBatch', {
        batchNo: obj.batchNo,
        productId: obj.productId,
        status: obj.status,
        name: obj.nameText,
        orgId: obj.orgId,
        packageType: obj.packageType,
        memo: obj.remarksTxt,
        domain: obj.domain

    }).done(function (data) {
        ajaxResHandle(data, function () {
            $('#code-list').html('');
            dropLoadInit();
        });
    });
    $('.add-code').addClass('invisible')
        .parents('.pop').addClass('invisible');
    isScrollable();
});

// 日志弹窗入口
$('#code-list').on('click', '[data-clicl="log-enter"]', function () {
    var batchno = $(this).closest('.btn-list').data('batchno');
    $.get('/api/v1/qr/GetQrBatchProcess', {
        batchNo: batchno,
        qrcode: ''
    }).done(function (data) {
        ajaxResHandle(data, function () {
            $('#log-list').html(tmpl('template_loglist', data.context));
        });
    });

    $('.pop').removeClass('invisible')
        .children('.log-pop').removeClass('invisible')
        .siblings().addClass('invisible');
    isScrollable();
});

// 日志弹窗返回按钮
$('[data-click="return"]').click(function () {
    $('.log-pop').addClass('invisible')
        .parents('.pop').addClass('invisible');
    isScrollable();
});

// 是否包含数字验证码样式切换
$('.menu_c div').on('click', function (ev) {
    var target = ev.target;
    var $t = $(target);

    if ($t.parent('.menu_c').hasClass('disabled')) {
        return;
    }
    if ($t.hasClass('j_active')) {
        return;
    }
    else {
        if ($t.attr('class') === 'no_c') {
            withPinPasswd = false;
            isNecessary(withPinPasswd);
        }
        else if ($t.attr('class') === 'yes_c') {
            withPinPasswd = true;
            isNecessary(withPinPasswd);
        }
        $t.addClass('j_active');
        $t.siblings().removeClass('j_active');
        // console.log(withPinPasswd);
    }
});

function isNecessary(para) {
    if (!para) {
        $('.code-check').removeClass('checked').addClass('disabled')
            .children('.check').attr('checked', false);
        $('.code-checkes').addClass('invisible');
    }
    else {
        $('.code-check').removeClass('checked').removeClass('disabled')
            .children('.check').attr('checked', false);
        $('.code-check2').addClass('checked')
            .children('.check').attr('checked', true);
        $('.code-checkes').removeClass('invisible');
    }
}

// 关联产品
$('[data-click="relevance"]').click(function () {
    $(this).children('.dropdown-list').toggle();
});
$('[data-click="relevance"]').on('click', 'li', function () {
    $(this).addClass('active')
        .siblings().removeClass('active');
    if (!$('.relevance-name').hasClass('c-6')) {
        $('.relevance-name').addClass('c-6');
        $('.rules-text').addClass('c-6');
    }
    $('.rules-text').text($(this).data('type'));
    $(this).parents('.import').children('.relevance-name').text($(this).text());
    $(this).parents('.import').children('.relevance-id').text($(this).data('productid'));
});

// 取消按钮
$('[data-click="cancel-btn"]').click(function () {
    $('.pop').addClass('invisible')
        .children('.void-code').addClass('invisible');
    isScrollable();

});

// 点击验证码位数
$('.form-group .code-check').click(function () {
    if ($(this).hasClass('disabled')) {
        return;
    }
    else {
        $('.code-check').removeClass('checked')
            .children('.check').attr('checked', false);
        $(this).addClass('checked')
            .children('.check').attr('checked', true);
    }
});

//  产品规格
$('[data-click="product-qr-batch"]').click(function () {
    $(this).siblings('.nav-item').children('.dropdown-list').css('display', 'none');
    $(this).children('.dropdown-list').toggle();
});

// 获取产品规格列表
getproductList();

function getproductList() {
    $.get('/api/v1/product/GetProductList', function (data) {
        ajaxResHandle(data, function () {
            $('#relevance-product').html(tmpl('template_relevance', data.context));
            $('#productid-list').prepend(tmpl('template_productlist', data.context));
        });
    });
}

$('.nav-item').on('click', 'li[data-click="product"]', function () {
    $(this).addClass('active')
        .siblings().removeClass('active');
    productId = $(this).data('pid');
    obj.productId = productId;
    // console.log($(this).text());
    // console.log(productId);
    if (productId == '') {
        console.log($(this).closest('.dropdown-list').siblings('.text'));
        $(this).closest('.dropdown-list').siblings('.text').text('按产品');
    }
    else {
        $(this).closest('.dropdown-list').siblings('.text').text($(this).text());
    }
    mainData.data.productId = productId;
    $('#code-list').html('');
    dropLoadInit();
});

// 按时间获取列表
$('[data-click="time-qr-batch"]').click(function () {
    $(this).siblings('.nav-item').children('.dropdown-list').css('display', 'none');
    $(this).children('.dropdown-list').toggle();
});
$('[data-click="time-qr-batch"]').on('click', 'li', function () {
    $(this).addClass('active')
        .siblings().removeClass('active');
    var now = moment().valueOf().toString();
    var beginTime = '';
    var endTime = '';
    var index = $(this).index();
    switch (index) {
        case 0: // 本周
            beginTime = moment().startOf('week').valueOf().toString();
            endTime = now;
            $(this).closest('.dropdown-list').siblings('.text').text($(this).text());
            break;
        case 1: // 本月
            beginTime = moment().startOf('month').valueOf().toString();
            endTime = now;
            $(this).closest('.dropdown-list').siblings('.text').text($(this).text());
            break;
        case 2: // 上月
            beginTime = moment().subtract(1, 'month').startOf('month').valueOf().toString();
            endTime = moment().startOf('month').valueOf().toString();
            $(this).closest('.dropdown-list').siblings('.text').text($(this).text());
            break;
        case 3: // 本季度
            beginTime = moment().startOf('quarter').valueOf().toString();
            endTime = now;
            $(this).closest('.dropdown-list').siblings('.text').text($(this).text());
            break;
        case 4: // 全部
            beginTime = '';
            endTime = '';
            $(this).closest('.dropdown-list').siblings('.text').text('按时间');
            break;
        default:
            alert('数据错误请刷新!');
            break;
    }
    obj.beginTime = beginTime;
    obj.endTime = endTime;
    mainData.data.beginTime = beginTime;
    mainData.data.endTime = endTime;
    $('#code-list').html('');
    dropLoadInit();
});

// 按状态获取列表
$('[data-click="status-qr-batch"]').click(function () {
    $(this).siblings('.nav-item').children('.dropdown-list').css('display', 'none');
    $(this).children('.dropdown-list').toggle();
});

$('.nav-item').on('click', '[data-click="status"]', function () {
    $(this).addClass('active')
        .siblings().removeClass('active');
    var code = $(this).data('code');
    if (code === '') {
        status = '';
        $(this).closest('.dropdown-list').siblings('.text').text('按状态');
    }
    else {
        $(this).closest('.dropdown-list').siblings('.text').text($(this).text());
        status = parseInt(code, 10);
    }
    obj.status = status;
    mainData.data.status = status;
    $('#code-list').html('');
    dropLoadInit();
});

// 下拉加载
var dropLoad = $('.code-content').dropload({
    scrollArea: window,
    autoLoad: true,
    distance: 10, // 拉动距离
    loadDownFn: function (me) {
        $.ajax(mainData).done(function (res) {
            ajaxResHandle(res, render, [me]);
            // console.log(Main_data);
        }).fail(function (jqXHR, textStatus) {
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

// 渲染码包列表
function render(res, me) {
    obj.page++;
    mainData.data.page++;
    var data = res.data;
    if (data.length > 0) {
        $('#code-list').append(tmpl('template_codelist', res));
    }
    else { // 锁定
        me.lock();
        // 无数据
        me.noData();
        // console.log('锁定');
    }
    // 每次数据插入，必须重置
    me.resetload();

    if (mainData.data.page == 2 && data.length <= 0) {
        // 如果page为2且上回返回的数据为空 那么说明没有任何数据
        $('.dropload-down').hide();
        $('#code-list').html(`<div class="codelist-nodata_container">
            <img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/nodata.png" alt="" class="codelist-img_nodata">
            <div class="codelist-info_nodata">暂无数据</div>`);
    }
}

// 弹窗点击灰色区域隐藏
$('.pop').click(function (event) {
    event.stopPropagation();
    var con = $('.pop>div');   // 设置目标区域
    if (!con.is(event.target) && con.has(event.target).length === 0) {
        $('.pop').addClass('invisible');
    }
    isScrollable();
});
function isScrollable() {
    if (!$('.pop').hasClass('invisible')) {
        $('html').addClass('html-unscrollable');
    }
    else {
        $('html').removeClass('html-unscrollable');
    }
}