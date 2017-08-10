/**
 * @author fu
 * @file 单码状态查询
 */

var result = '';
if (isWeixin) {

    var urlReg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

    function scanQRCode() {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                // result = 'oRZYPKQnEYWaEy8DSGRifpwvBE';
                result = res.resultStr + ''; // 当needResult 为 1 时，扫码返回的结果
                result.indexOf(',') !== -1 && (result = result.split(',')[1].replace(/^\\s|\\s$/g, ''));

                if (urlReg.test(result)) {
                    var tbulReg = /https?:\/\/.+?\.(tbul.cn|cjiot.cc)\/\?c=(.+)/ig;
                    if (tbulReg.test(result)) {
                        result = result.replace(tbulReg, function (res, $1,$2) {
                            return $2;

                        });
                    }
                    else {
                        var i = result.lastIndexOf('/');
                        i !== -1 && (result = result.slice(i + 1));
                    }
                }

                if (result.substring(0, 4) === 'scan' || result === '') {
                    // alert(result);
                    return;
                }
                // alert('scan' + result);
                $('.scan-content').addClass('invisible');
                statusQuery();
            }
        });
    }

    wx.ready(function () {
        scanQRCode();
    });


    function statusQuery() {
        $.get('/api/v1/qr/GetQrcode', {
            qrcode: result
        }).done(function (data) {

            if (data.code === 1) {
                $('#info').html(tmpl('template_info', data.context));
            }
            else if (data.code === 11006 || data.code === 11005) {
                $('#info').addClass('invisible');
                $('#no-info').removeClass('invisible');
            }
            else if (data.code === 403) {
                window.location.replace('/html/account/login.html?ru=' + decodeURIComponent(location.href));
            }
            else {
                alert(data.msg);
            }
        });
    }


    // 重新扫描btn点击事件
    $('.code-content').on('click', '[data-click="scan-again"]', function () {
        scanQRCode();
    });

    // 作废该码btn点击事件
    $('.code-content').on('click', '[data-click="delete-code"]', function () {
        // console.log('作废该码');
        $.post('/api/v1/qr/DisableQrcode', {
            codeList: result
        }).done(function (data) {
            ajaxResHandle(data, function() {
                alert('该码作废成功！');
                statusQuery();
            });
        });
    });
}
else {
    document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
    document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
}