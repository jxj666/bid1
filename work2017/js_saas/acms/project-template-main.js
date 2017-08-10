/**
 * @file 活动管理
 */
const activityId = $.getSingleParam('activityid');
const typeTesters = {
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

    // Follow https://www.w3.org/TR/html5/infrastructure.html#floating-point-numbers
    number: /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,

    integer: /^-?\d+$/,

    digits: /^\d+$/,

    alphanum: /^\w+$/i,

    url: new RegExp('^'
        // protocol identifier
        + '(?:(?:https?|ftp):)?//' // ** mod: make scheme optiona
        // user:pass authentication
        + '(?:\\S+(?::\\S*)?@)?' + '(?:'
        + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' + '|'
        // host name
        + '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)'
        // domain name
        + '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*'
        // TLD identifier
        + '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' + ')'
        // port number
        + '(?::\\d{2,5})?'
        // resource path
        + '(?:/\\S*)?' + '$', 'i')
};
// 请求traceid
$.post('/api/v1/data/GetTraceid', {
    activity_id: activityId
}).done(data => {
    ajaxResHandle(data);
});


/** 活动数据 */
$.post('/api/v1/data/GetActivity', {
    activity_id: activityId
}).done(res => {
    ajaxResHandle(res, () => {
        res = res.context;
        $('[data-info="yUV"]').html(res.yUV);
        $('[data-info="yPV"]').html(res.yPV);
        $('[data-info="yScan"]').html(res.yScan);
        $('[data-info="yDraw"]').html(res.yDraw);
        $('[data-info="yOrder"]').html(res.yOrder);
        $('[data-info="yOrderMoney"]').html(res.yOrderMoney);
    });
});
/*notice begin*/
// 公告配置
// 是否启用公告
$('.g_notice_set .menu_c div').on('click', function (ev) {
    var target = ev.target;
    var $t = $(target);
    if (!$t.hasClass('j_active')) {
        $t.addClass('j_active');
        $t.siblings().removeClass('j_active');
        if ($t.hasClass('yes_c')) {
            $('.set_menu .menu_b').show();
        } else {
            $('.set_menu .menu_b').hide();
        }
    }
});
// 打开编辑
$('.g_notice_set .menu_s').on('click', 'button', function (ev) {
    var target = ev.target;
    var $t = $(target);
    $('.g_notice_pop').removeClass('hide');
});
// 上传照片
$('.g_notice_pop .box_a').on('click', '.img_up', function (ev) {
    $('#j_img_up').trigger('click');
});
// 去除红字

$('.link input').on('focus', function () {
    $('.link_e').hide();
});
// 顶置切换
$('.g_notice_pop .menu_c div').on('click', function (ev) {
    var target = ev.target;
    var $t = $(target);
    if (!$t.hasClass('j_active')) {
        $t.addClass('j_active');
        $t.siblings().removeClass('j_active');
    }
});
// 确定取消
$('.j_yes').click(function () {
    $('.g_notice_pop').addClass('hide');
});
$('.j_no').click(function () {
    $('.g_notice_pop').addClass('hide');
});
/*notice end*/

// 查看数据
$('[data-cj=goData]').click(() => {
    location.href = '/html/data/data-nav.html?activityid=' + activityId;
});
// tab切换
$('[data-cj=tab]').click(function (e) {
    $(e).is('a') && e.preventDefault();
    if (!$(this).hasClass('j_active')) {
        if ($('.set_menu.active').data('change') === 'true') {
            confirm('属性未保存，点击"确定"保存，"取消"放弃保存') ? $('[data-cj=updateParams]').trigger('click') :
                $('[data-cj=resetParams]').trigger('click');
        }
        $(this).closest('.nav').find('[data-cj=tab]').removeClass('j_active');
        $(this).addClass('j_active');
        let target = $(this).attr('href') || $(this).data('target');
        $(target).closest('.tab-content').find('.set_menu').removeClass('active in');

        e = $.Event('shown.cj.tab', {relatedTarget: this}); // 定义个tab显示的事件
        $(target).addClass('active in').trigger(e); // 触发事件

        $('html,body').scrollTop(0);
    }
});
// radio选择
$(document).on('change', 'input:radio', function () {
    let name = $(this).attr('name');
    $('[name="' + name + '"]').closest('.radio').removeClass('checked');
    $(this).closest('.radio').addClass('checked');
});
// checkbox选择
$(document).on('change', 'input:checkbox', function () {
    let $checkbox = $(this).closest('.checkbox');
    $(this).is(':checked') ? $checkbox.addClass('checked') : $checkbox.removeClass('checked');
});
// 弹窗
$(document).on('click', '[data-cj=modal]', function (e) {
    $(this).is('a') && e.preventDefault();
    let target = $(this).attr('href') || $(this).data('target');
    e = $.Event('shown.cj.modal', {relatedTarget: this});
    $(target).removeClass('hide').trigger(e);

    // 关闭弹窗
    $('[data-dismiss=modal]').off().click(function (e) {
        $(this).is('a') && e.preventDefault();
        let target = $(this).attr('href') || $(this).data('target');
        e = $.Event('hidden.cj.modal');
        $(target).addClass('hide').trigger(e);
    });
});

// 上传图片弹窗
$('.bg-img_container').on('click', '.bg-img_item', function () {
    if (!$(this).hasClass('active') && $(this).data('type') !== 'file') {
        $('.bg-img_container .bg-img_item.active').removeClass('active');
        $(this).addClass('active');
        $(this).closest('form').find('[name="thumb"]').val($(this).data('url')).data('id', $(this).data('id')).data('action', 'change');
    }
});
let upLoadTar;
let banners = [];
$('#modal-upLoadImg').on('success.io.upload', function () { // 上传图片成功
    $('.bg-img_container .bg-img_item.active').removeClass('active');
    $(this).find('[name="thumb"]').data('action', 'add').data('id', '');
}).on('shown.cj.modal', function (e) {
    let relatedTarget = e.relatedTarget;
    let $this = $(this);
    if (relatedTarget) {
        upLoadTar = e.relatedTarget;
        if ($(relatedTarget).data('img') === 'act-background' || $(relatedTarget).data('img') === 'qrcode') {

            let src = $.trim($(relatedTarget).text());
            if (src.length > 0) {
                $(this).find('[data-info=url]').val(src);
                $(this).find('.pic img').attr('src', src);
            }

        } else if ($(relatedTarget).data('img') === 'banner') {
            if (banners.length > 0) {
                for (let i = banners.length - 1; i >= 0; i--) {
                    $(this).find('.bg-img_container').append(`<li class="bg-img_item" data-id="${banners[i].id}" data-url="${banners[i].image}">
                        <div class="bg-img">
                        <img src="${banners[i].image}">
                        </div>
                        </li>`);
                }
            }
        }
    }

    $('[data-cj="imgSave"]').off().click(() => {
        let urlVal = $.trim($this.find('[data-info=url]').val());
        if (urlVal.length <= 0) {
            $this.find('h6').html('不能为空');
            return;
        }
        if (!typeTesters.url.test(urlVal)) {
            $this.find('h6').html('请输入正确的图片地址');
            return;
        }
        if (upLoadTar) {
            let value = $('#modal-upLoadImg [data-info=url]').val();
            let id = $('#modal-upLoadImg [data-info=url]').data('id');
            let action = $('#modal-upLoadImg [data-info=url]').data('action');
            $(upLoadTar).html(value).next('[type=hidden]').val(value).data('bannerid', id).data('action', action);
            let e = $.Event('img.change');
            $(upLoadTar).trigger(e);
        }
        $('[data-dismiss=modal]').trigger('click');
    });
}).on('hidden.cj.modal', function () {
    let $this = $(this);
    $this.find('[type = "text"]').val('');
    $this.find('.bg-img_container').html(`<li class="bg-img_item" data-type="file">
                        <div class="pic bg-img">
                            <img src="//saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg" alt="分享图">
                            <input type="file" class="file" accept="image/png,image/jpg,image/jpeg" name="file" value="上传图片" data-cj="imgUpload">
                        </div>
                    </li>`);
    $this.find('h6').html('');
});

// 上传图片
if (isWeixin) {
    $('[data-cj="imgUpload"]').hide();
    // 微信上传图片
    $('[data-cj=wxUpLoad]').click(function () {
        const $this = $(this);
        wx.ready(() => {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success(res) {
                    const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success(res) {
                            const serverId = res.serverId; // 返回图片的服务器端ID
                            $.post('/io/upload/fwx', {
                                mediaId: serverId
                            }).done(res => {
                                ajaxResHandle(res, () => {
                                    let url = res.data;
                                    if (url) {
                                        $this.closest('form').find('[name="thumb"]').val(url);
                                        $this.siblings('img').remove();
                                        $(`<img src="${url}">`).insertBefore($this);

                                        let e = $.Event('success.io.upload');
                                        $('#modal-upLoadImg').trigger(e);
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });
    });
}
else {
    $('[data-cj=wxUpLoad]').hide();
    // 普通上传图片
    $('[data-cj="imgUpload"]').change(function () {
        var $this = $(this);
        var formData = new FormData();
        formData.append('file', this.files[0]);
        var channel = $this.data('channel');
        formData.append('channel', channel);
        $.ajax({
            url: '/io/upload',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            ajaxResHandle(res, function () {
                let url = res.data;
                if (url) {
                    $this.closest('form').find('[name="thumb"]').val(url);
                    $this.siblings('img').remove();
                    $(`<img src="${url}">`).insertBefore($this);

                    let e = $.Event('success.io.upload');
                    $('#modal-upLoadImg').trigger(e);
                }
            });
        });
    });
}

$('#modal-upLoadImg [data-info = url]').on('change', function () {
    $(this).data('action', 'add');
    $('#modal-upLoadImg .pic img').attr('src', $(this).val());
});

let actBeginCalendar; // 活动开始时间
let actEndCalendar; // 活动结束时间
let firstBeginTimeCalendar; // 手抽必中时间日历
let firstEndTimeCalendar; // 手抽必中时间日历
let ratesObj = {}; // 概率
function getActivity() {
    $.get('/api/v1/acms/GetActivity', {
        activity_id: activityId,
        cache: false, // 是否从缓存里读取
        with_params: true, // 是否返回活动所有参数
        with_rules: false, // 是否返回活动所有规则
        with_rates: true, // 是否返回活动所有奖品概率配置
        with_banners: true // 是否返回banner配置
    }).done(result => {
        ajaxResHandle(result, () => {
            const context = result.context;
            const activity = context.activity || {}; // 活动信息

            banners = context.banners || [];
            let banner = {};
            if (banners.length > 0) {
                $.each(banners, (i, v) => {
                    v.status === 1 && (banner = v);
                });
            }
            const params = context.params || {}; // 参数
            context.rates && (ratesObj = context.rates); // 概率

            $('.banner').html(`<h1 class="banner-info">${activity.name}</h1>
            <img src="${banner.image && banner.image}" class="banner-img">
            <ul class="banner-mask clearfix">
            <li class="banner-mask_item">
            ${activity.beginTime}-${activity.endTime}
            </li>
            <li class="banner-mask_item spread">
                #${activity.type}
        </li>
        </ul>`);
            //     <p class="banner-time">活动时间：${activity.beginTime}-${activity.endTime}</p>
            // 活动名称
            $('.data_title h3').html(activity.name);
            // 属性展示
            $('#attr').html(tmpl('template_params', result.context));
            // banner图
            if (banner.image) {
                $('#banner').val(banner.image).data('bannerid', banner.id);
                $('[data-img="banner"]').html(banner.image);
            }
            wechat();
            /** 日期插件 */
            // 活动时间
            actBeginCalendar = flatpickr('#actBeginTime', {
                mode: 'single',
                enableTime: true,
                time_24hr: true, // AM/PM time picker is used by default
                // initial values for time. don't use these to preload a date
                defaultHour: 24,
                defaultMinute: 0,
                locale: 'zh',
                dateFormat: 'Y-m-d H:i',
                // minDate: activity.beginTime,
                defaultDate: activity.beginTime ? activity.beginTime : '',
                disableMobile: false,
                plugins: [new confirmDatePlugin({
                    // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                    confirmText: '确认 ',
                    showAlways: true,
                    theme: 'light' // or "dark"
                })],
                onChange(selectedDates, dateStr, instance) {
                    console.log(selectedDates, dateStr, instance);
                    actEndCalendar.set('minDate', selectedDates[0]);
                }
            });
            actEndCalendar = flatpickr('#actEndTime', {
                mode: 'single',
                enableTime: true,
                time_24hr: true, // AM/PM time picker is used by default
                // initial values for time. don't use these to preload a date
                defaultHour: 24,
                defaultMinute: 0,
                locale: 'zh',
                dateFormat: 'Y-m-d H:i',
                // minDate: 'today',
                defaultDate: activity.endTime ? activity.endTime : '',
                disableMobile: false,
                plugins: [new confirmDatePlugin({
                    // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                    confirmText: '确认 ',
                    showAlways: true,
                    theme: 'light' // or "dark"
                })],
                onChange(selectedDates, dateStr, instance) {
                    actBeginCalendar.set('maxDate', selectedDates[0]);
                }
            });
            /** 礼品预警 */
            $('[name="acms.act.alert.quantity"]').val(params['acms.act.alert.quantity'] ? params['acms.act.alert.quantity'].value : 0);
            $('[name="acms.act.alert.cost.day"]').val(params['acms.act.alert.cost.day'] ? params['acms.act.alert.cost.day'].value : 0);
            $('[name="acms.act.alert.cost.total"]').val(params['acms.act.alert.cost.total'] ? params['acms.act.alert.cost.total'].value : 0);
            // 首抽必中时间
            firstBeginTimeCalendar = flatpickr('#firstBeginTime', {
                mode: 'single',
                enableTime: true,
                time_24hr: true, // AM/PM time picker is used by default
                // initial values for time. don't use these to preload a date
                defaultHour: 24,
                defaultMinute: 0,
                locale: 'zh',
                dateFormat: 'Y-m-d H:i',
                // minDate: 'today',
                defaultDate: params['acms.act.award.first.begin'] && params['acms.act.award.first.begin'].value ? params['acms.act.award.first.begin'].value - 0 : '',
                disableMobile: false,
                plugins: [new confirmDatePlugin({
                    // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                    confirmText: '确认 ',
                    showAlways: true,
                    theme: 'light' // or "dark"
                })],
                onChange(selectedDates, dateStr, instance) {
                    console.log(selectedDate);
                    firstEndTimeCalendar.set('minDate', selectedDates[0]);
                }
            });
            firstEndTimeCalendar = flatpickr('#firstEndTime', {
                mode: 'single',
                enableTime: true,
                time_24hr: true, // AM/PM time picker is used by default
                // initial values for time. don't use these to preload a date
                defaultHour: 24,
                defaultMinute: 0,
                locale: 'zh',
                dateFormat: 'Y-m-d H:i',
                // minDate: 'today',
                defaultDate: params['acms.act.award.first.end'] && params['acms.act.award.first.end'].value ? params['acms.act.award.first.end'].value - 0 : '',
                disableMobile: false,
                plugins: [new confirmDatePlugin({
                    // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
                    confirmText: '确认 ',
                    showAlways: true,
                    theme: 'light' // or "dark"
                })],
                onChange(selectedDates, dateStr, instance) {
                    console.log(selectedDate);
                    firstBeginTimeCalendar.set('maxDate', selectedDates[0]);
                }
            });
            /** 首次必中 */
            if (ratesObj.default) {
                // 小广播礼品
                $('.prizes-block_container').html('');

                $('#firstSku').html('');
                $(ratesObj.default.rates).each(function () {
                    $('#firstSku').append(`<option value="${this.pid}" data-skuid="${this.pid}"></option>`);

                    // 小广播礼品
                    $('.prizes-block_container').append(`<li class="prizes-block_item">
                                        <div class="prizes-block" data-skuid="${this.pid}" data-cj="bcAward"></div>
                                    </li>`);
                });
                params['acms.act.broadcast.pid'] && $('[data-cj="bcAward"][data-skuid="' + params['acms.act.broadcast.pid'].value + '"]').addClass('active');                
                $('[data-cj="bcAward"]').click(function () {
                    if (!$(this).hasClass('active')) {
                        $(this).closest('.prizes-block_container').find('.prizes-block.active').removeClass('active');
                        $(this).addClass('active');
                        let e = $.Event('change.cj.bcAward');
                        $(this).trigger(e);
                    }
                });
                params['acms.act.award.first.sku'] && $('#firstSku').val(params['acms.act.award.first.sku'].value);
            }
            /** 概率弹窗 */
            $('#modal-rate').on('shown.cj.modal', function (e) {
                // 对应概率
                $('#modal-rate .box_num_b').html('');
                let relatedTarget = e.relatedTarget;
                if (!relatedTarget) {
                    console.warn('设置概率缺少触发元素！');
                    return;
                }
                let group = $(relatedTarget).data('group');

                if (ratesObj[group]) {
                    $(ratesObj[group].rates).each(function () {
                        $('#modal-rate .box_num_b').append(`<div class="m_num">
                 <p>${this.name}</p>
                 <input type="tel" value="${this.rate}" name="${this.pid}">
                 </div>`);
                    });
                } else if (ratesObj.default) {
                    $(ratesObj.default.rates).each(function () {
                        $('#modal-rate .box_num_b').append(`<div class="m_num">
                <p>${this.name}</p>
                <input type="tel" value="${this.rate}" name="${this.pid}">
            </div>`);
                    });
                } else {
                    $('#modal-rate .box_num_b').html('请先添加奖品');
                }
                $(this).find('[data-cj=save]').off().click(function () {
                    let arr = $('#modal-rate').serializeArray();
                    let awards = [];
                    let rateTotal = 0;
                    $.each(arr, (i, v) => {
                        let obj = {
                            skuId: v.name, // 奖品SKU id
                            rate: v.value, // 概率
                            needHelp: false
                        };
                        rateTotal += v.value - 0;
                        awards.push(obj);
                    });
                    if (rateTotal > 100) {
                        alert('总概率不能超过100');
                        return;
                    }
                    let params = {
                        activityId: activityId,
                        group: group,
                        awards: awards
                    };
                    let e = $.Event('change.cj.rate');
                    $(relatedTarget).trigger(e).data('awards', JSON.stringify(params));

                    $('[data-dismiss=modal]').trigger('click');
                });
            }).on('hidden.cj.modal', function () {
            });

            getAwardList();
        });

    });
}

getActivity();
// 重置参数
const resetParams = function () {
    getActivity();

    $('.set_menu.active').data('change', 'false');

    $('#attr').parsley().reset();
    $('#strategy').parsley().reset();

    /** 概率清空*/
    $('[data-group="first"]').data('awards', '');

    $('.footer-btn_container').hide();
    $('.body').removeClass('body-m-b200');
};

// 保存按钮
$('.tab-content').on('change', 'input,select,textarea', footerBtnStatus)
    .on('img.change', '[data-cj=modal]', footerBtnStatus)
    .on('change.cj.rate', '[data-cj=modal]', footerBtnStatus)
    .on('change.cj.bcAward', '[data-cj=bcAward]', footerBtnStatus)
    .on('blur', '.copywriting', copywriting);

function copywriting() {
    if ($.trim($(this).text()) !== '') {
        footerBtnStatus();
    }
}

function footerBtnStatus() {
    $('.set_menu.active').data('change', 'true');
    $('.footer-btn_container').show();
    $('.body').addClass('body-m-b200');
    // 更新参数
    $('[data-cj=updateParams]').off().click(function () {
        $('.set_menu.active').find('[type=submit]').trigger('click');
    });
    // 重置参数
    $('[data-cj=resetParams]').off().click(function () {
        confirm('确定重置？') ? resetParams() : $('.footer-btn_container').hide();
        // resetParams();
    });
}

/** 保存属性 **/
$('#attr').parsley().on('form:submit', function () {
    let data = this.$element.serializeObject();
    data.activity_id = activityId;
    data['acms.act.broadcast.pid'] = this.$element.find('.prizes-block_container .prizes-block.active').data('skuid') || '';
    data['acms.act.rules'] = $('#copywriting_rules').text(); // 奖项规则
    data['acms.act.cstext'] = $('#copywriting_kefu').text(); // 联系客服
    data['acms.act.copyright'] = $('#copywriting_footer').text(); // 底部文案
    data['acms.act.org'] = $('#copywriting_sponsor').text(); // 活动主办方
    data['acms.act.wechat'] = $('#copywriting_wechat option:checked').data('id'); // 公众号
    console.log(data);
    let progress = 0;
    // 更新活动时间
    let dateObj = {};
    if (actBeginCalendar.selectedDates.length === 1 && actEndCalendar.selectedDates.length === 1) {
        dateObj.activity_id = data.activity_id;
        dateObj.begin_time = new Date(actBeginCalendar.selectedDates[0]).getTime();
        dateObj.end_time = new Date(actEndCalendar.selectedDates[0]).getTime();

        $.post('/api/v1/acms/SetActivityTimeRange', dateObj).done(res => {
            ajaxResHandle(res, () => {
                progress += 25;
                progress === 100 && resetParams();
            });
        });
    }
    else {
        progress += 25;
    }
    // banner
    let action = $('#banner').data('action');
    if (action === 'add') {
        $.post('/api/v1/acms/AddBanner', {
            activity_id: activityId,
            image: $('#banner').val()
        }).done(res => {
            ajaxResHandle(res, () => {
                progress += 25;
                progress === 100 && resetParams();
            });
        });
    }
    else if (action === 'change') {
        $.post('/api/v1/acms/UpdateBanner', {
            activity_id: activityId,
            banner_id: $('#banner').data('bannerid'),
            status: 1
        }).done(res => {
            ajaxResHandle(res, () => {
                progress += 25;
                progress === 100 && resetParams();
            });
        });
    }
    else {
        progress += 25;
        progress === 100 && resetParams();
    }

    // 更新参数
    $.post('/api/v1/acms/BatchUpdateParamValue', data).done(res => {
        ajaxResHandle(res, () => {
            progress += 50;
            progress === 100 && resetParams();
        });
    });

    return false;
});
/** 礼品和策略 **/
// 概率是否切换
$('#quantity-config').on('click', '[data-cj="changeStatus"]', function () {
    let $t = $(this);
    if (!$t.hasClass('j_active')) {
        $t.addClass('j_active');
        $t.siblings().removeClass('j_active');
        if ($t.hasClass('yes_c')) {
            $t.siblings('input[type=hidden]').val(1);
        } else {
            $t.siblings('input[type=hidden]').val(0);
        }

    }
}).find('[name=needHelp]').change(function () {
    if (!!($(this).val() - 0)) {
        $(this).siblings('.yes_c').trigger('click');
    } else {
        $(this).siblings('.no_c').trigger('click');
    }
});

function getAwardList() {
    $.get('/func/acms/award/list', {
        activity_id: activityId
    }).done(res => {
        ajaxResHandle(res, () => {
            /** 活动已添加的奖品 **/
            let exists = res.data.exists || [];
            $('#existsList').html('');
            $('.gift_box').html('');
            let awardObj = {};
            if (exists.length > 0) {
                $.each(exists, (i, v) => {
                    $('#existsList').append(`<div class="gift_s" data-cj="modal" data-target="#modal-strategy" data-skuid="${v.skuId}">
                            <img src="${v.image}" alt="奖品图">
                            <h5>${v.skuName}</h5>
                            <p>剩余库存:<span>${v.quantity}</span>个</p>
                            <p>需要拆礼盒: <span>${v.needHelp ? '是' : '否'}</span></p>
                            <p>默认概率:<span>${v.defaultRate}%</span></p>
                        </div>`);

                    $('.gift_box').append(`<div class="m_box" data-cj="awardConfig" data-max="${v.allQuantity}" data-rate="${v.defaultRate}" data-help="${v.needHelp ? 1 : 0}" data-skuid="${v.skuId}" data-addquantity="0">
                                <img src="${v.image}" alt="奖品图">
                                <p>${v.skuName}</p>
                            </div>`);

                    /** 渲染奖品名称 */
                    // 小广播
                    $('.prizes-block_container').find(`[data-skuid="${v.skuId}"]`).text(v.skuName ? v.skuName : 'null');
                    // 首次必中
                    $('#firstSku').find(`[data-skuid="${v.skuId}"]`).text(v.skuName ? v.skuName : 'null');
                    awardObj[v.skuId] = v.skuName;
                });
                // 给概率（ratesObj）加名称
                if (!$.isEmptyObject(ratesObj)) {
                    for (let key in ratesObj) {
                        if (ratesObj[key].rates.length > 0) {
                            let ratesArr = ratesObj[key].rates;
                            for (let i = 0, len = ratesArr.length; i < len; i++) {
                                ratesArr[i].name = awardObj[ratesArr[i].pid];
                            }
                        }
                    }
                }
                console.log(ratesObj);
            }

            $('.gift_box').prepend(`<div class="m_box" data-cj="modal" data-target="#org-quantity">
                                <h3 class="j_add_gift"></h3>
                            </div>`);
            // 配置奖品
            $('.gift_box').on('click', '[data-cj=awardConfig]', function () {
                if (!$(this).hasClass('j_active')) {
                    $('#quantity-config').find('[name=quantity]').prop('disabled', false);
                    $('#quantity-config').find('[name=defaultRate]').prop('disabled', false);

                    // 验证
                    let test = {
                        number: /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,
                        integer: /^-?\d+$/
                    };
                    let val = $.trim($('#quantity-config').find('[name=quantity]').val());
                    let $active = $('.gift_box .m_box.j_active');
                    if (val.length <= 0) {
                        $('[data-info=validate]').html('库存不能为空');
                        return;
                    }
                    if (!test.integer.test(val)) {
                        $('[data-info=validate]').html('库存必须为整数');
                        return;
                    }
                    if (val < 0) {
                        $('[data-info=validate]').html('库存最小为0');
                        return;
                    }
                    let max = $active.data('max');
                    if (max && val > max) {
                        $('[data-info=validate]').html(`库存最大为${max}`);
                        return;
                    }
                    val = $.trim($('#quantity-config').find('[name=defaultRate]').val());
                    if (val.length <= 0) {
                        $('[data-info=validate]').html('概率不能为空');
                        return;
                    }
                    if (!test.number.test(val)) {
                        $('[data-info=validate]').html('概率必须为数字');
                        return;
                    }
                    if (val < 0) {
                        $('[data-info=validate]').html('概率最小为0');
                        return;
                    }
                    if (val > 100) {
                        $('[data-info=validate]').html('概率最大为100');
                        return;
                    }

                    /** 保存修改数据到自身 **/
                    $active.data('help', $('#quantity-config').find('[name=needHelp]').val());
                    $active.data('addquantity', $('#quantity-config').find('[name=quantity]').val());
                    $active.data('rate', $('#quantity-config').find('[name=defaultRate]').val());

                    $('[data-info=validate]').html('');
                    $active.removeClass('j_active');
                    $(this).addClass('j_active');
                    $('#quantity-config').find('[name=quantity]').val($(this).data('addquantity'));
                    $('#quantity-config').find('[data-info=allQuantity]').html($(this).data('max'));
                    $('#quantity-config').find('[name=needHelp]').val($(this).data('help')).trigger('change');
                    $('#quantity-config').find('[name=defaultRate]').val($(this).data('rate'));
                }
            });
            $('#modal-strategy').on('shown.cj.modal', function (e) {
                // 从奖品点击弹出弹窗时直接编辑
                let relatedTarget = e.relatedTarget;
                let skuId = $(relatedTarget).data('skuid');
                if (skuId) {
                    $('.gift_box').find('[data-skuid=' + skuId + ']').trigger('click');
                }
            }).on('hidden.cj.modal', function () {
                // 关闭弹窗时
                $('#quantity-config').find('[name=quantity]').prop('disabled', true);
                $('#quantity-config').find('[name=defaultRate]').prop('disabled', true);

                $('.gift_box').find('[data-cj=awardConfig]').removeClass('j_active');
                $('#quantity-config').find('[name=quantity]').val(0);
                $('#quantity-config').find('[name=needHelp]').val(0).trigger('change');
                $('#quantity-config').find('[name=defaultRate]').val(0);

            });

            $('#existsList').prepend(`<div class="gift_s">
                            <a href="#modal-strategy" data-cj="modal"><h3 class="j_add_gift"></h3></a>
                        </div>`);

            // 更新奖品库
            $('[data-cj=updateEexists]').click(function () {
                // 验证
                let test = {
                    number: /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,
                    integer: /^-?\d+$/
                };
                let val = $.trim($('#quantity-config').find('[name=quantity]').val());
                let $active = $('.gift_box .m_box.j_active');
                if (val.length <= 0) {
                    $('[data-info=validate]').html('库存不能为空');
                    return;
                }
                if (!test.integer.test(val)) {
                    $('[data-info=validate]').html('库存必须为整数');
                    return;
                }
                if (val < 0) {
                    $('[data-info=validate]').html('库存最小为0');
                    return;
                }
                let max = $active.data('max');
                if (max && val > max) {
                    $('[data-info=validate]').html(`库存最大为${max}`);
                    return;
                }
                val = $.trim($('#quantity-config').find('[name=defaultRate]').val());
                if (val.length <= 0) {
                    $('[data-info=validate]').html('概率不能为空');
                    return;
                }
                if (!test.number.test(val)) {
                    $('[data-info=validate]').html('概率必须为数字');
                    return;
                }
                if (val < 0) {
                    $('[data-info=validate]').html('概率最小为0');
                    return;
                }
                if (val > 100) {
                    $('[data-info=validate]').html('概率最大为100');
                    return;
                }

                /** 保存修改数据到自身 **/
                $active.data('help', $('#quantity-config').find('[name=needHelp]').val());
                $active.data('quantity', $('#quantity-config').find('[name=quantity]').val());
                $active.data('rate', $('#quantity-config').find('[name=defaultRate]').val());

                // 更新
                let $awardConfig = $('[data-cj=awardConfig]');
                let awards = [];
                if ($awardConfig.length < 0) {
                    $('[data-info=validate]').html('还没有添加奖品');
                    return;
                }
                let rateTotal = 0;
                $awardConfig.each(function () {
                    rateTotal += $(this).data('rate') - 0;

                    let obj = {
                        skuId: $(this).data('skuid'), // 奖品SKU id
                        addQuantity: $(this).data('quantity'), // 添加的库存
                        needHelp: !!($(this).data('help') - 0), // 是否助力
                        rate: $(this).data('rate') // 默认概率
                    };
                    awards.push(obj);
                });
                if (rateTotal > 100) {
                    $('[data-info=validate]').html('所有奖品的概率总和不能大于100');
                    return;
                }
                $('[data-info=validate]').html('');
                let params = {
                    activityId: activityId,
                    group: 'default',
                    awards: awards
                };
                $.post('/func/acms/rate/update', {
                    award_config: JSON.stringify(params)
                }).done(res => {
                    ajaxResHandle(res, () => {
                        resetParams();
                        $('[data-dismiss=modal]').trigger('click');
                    });
                });
            });
            /** 活动未添加的奖品 **/
            let notAdded = res.data.not_added || [];
            $('.org-list').html('');
            $.each(notAdded, (i, v) => {
                $('.org-list').append(`<div>
                        <div class="checkbox-inline">
                            <label class="checkbox">
                                <input type="checkbox" hidden name="${v.skuId}" value="0"> ${v.skuName}
                            </label>
                        </div>
                    </div>`);
            });
        });
    });
}

// 公众号接口

function wechat() {
    $.get('/api/v1/acms/GetWechatHostings').done(res => {
        ajaxResHandle(res, () => {
            // $('#copywriting_wechat').html('');
            if (res.context.length > 0) {
                $.each(res.context, (i, v) => {
                    $('#copywriting_wechat').append(`<option data-id="${v.authorizerAppid}">${v.nickname}</option>`);
                });
            }
        });
    });
}

$('#org-quantity').on('shown.cj.modal', function () {
    $('#orgEdit').hide();

    // 总奖品库添加到活动奖品库
    $('[data-cj=notAdd2Eexists]').off().click(() => {
        let arr = $('.org-list').serializeArray();
        let awards = [];
        $.each(arr, (i, v) => {
            let obj = {
                skuId: v.name, // 奖品SKU id
                addQuantity: 0, // 添加的库存
                needHelp: false, // 是否助力
                rate: 0 // 默认概率
            };
            awards.push(obj);
        });
        let params = {
            activityId: activityId,
            group: 'default',
            awards: awards
        };
        $.post('/func/acms/rate/update', {
            award_config: JSON.stringify(params)
        }).done(res => {
            ajaxResHandle(res, () => {
                resetParams();
                $('#org-quantity [data-dismiss=modal]').trigger('click');
            });
        });
    });

}).on('hidden.cj.modal', function () {
    $('#orgEdit').show();
});

// 保存礼品配置
$('#strategy').parsley().on('form:submit', function () {
    let progress = 0;
    let dataObj = this.$element.serializeObject();
    dataObj.activity_id = activityId;
    if (firstBeginTimeCalendar.selectedDates.length > 0) {
        dataObj['acms.act.award.first.begin'] = new Date(firstBeginTimeCalendar.selectedDates[0]).getTime();
    }
    if (firstEndTimeCalendar.selectedDates.length > 0) {
        dataObj['acms.act.award.first.end'] = new Date(firstEndTimeCalendar.selectedDates[0]).getTime();
    }
    // 更新参数
    $.post('/api/v1/acms/BatchUpdateParamValue', dataObj).done(res => {
        ajaxResHandle(res, () => {
            progress += 50;
            if (progress === 100) {
                resetParams();
            }
        });
    });

    // 对应概率
    let target = $('[data-cj=modal][href="#modal-rate"]');
    if (target && target.data('awards')) {
        // $.post('/api/v1/acms/UpdateActivityRates', {
        let params = {
            activityId: activityId,
            group: target.data('group'),
            awards: target.data('awards')
        };
        $.post('/func/acms/rate/update', {
            /*activity_id: activityId,
             group_name: target.data('group'),
             awards: target.data('awards')*/
            award_config: target.data('awards')
        }).done(res => {
            ajaxResHandle(res, () => {
                progress += 50;
                if (progress === 100) {
                    resetParams();
                }

            });
        });
    }
    else {
        progress += 50;
        if (progress === 100) {
            resetParams();
        }
    }

    return false;
});







