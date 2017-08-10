/**
 * @author fu
 * @file 登录授权
 */

var result = '';
if (isWeixin) {

    var urlReg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

    function scanQRCode() {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                result = 'https://qrtest.cjiot.cc/?c=ODMbu7ujy8B2wGMU9aWETWpTg9';
                // result = res.resultStr + ''; // 当needResult 为 1 时，扫码返回的结果
                result.indexOf(',') !== -1 && (result = result.split(',')[1].replace(/^\\s|\\s$/g, ''));
                console.log(result);
                if (urlReg.test(result)) {
                    var tbulReg = /https?:\/\/.+?\.(tbul.cn|cjiot.cc)\/\?c=(.+)/ig;
                    if (tbulReg.test(result)) {
                        result = result.replace(tbulReg, function (res, $1, $2) {
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
                qualityControl();
            }
        });
    }

    wx.ready(function () {
        scanQRCode();
    });


    // 质检接口 页面展示
    function qualityControl() {
        if (result.substring(0, 4) === 'scan' || result === '') {
            return;
        }
        $.post('/api/v1/qr/QualityControl', {
            qrcode: result
        }).done(function (data) {
            if (data.code === 1) {
                $('.content').removeClass('invisible')
                    .siblings('.no-scan').addClass('invisible');
                $('.activating-content').removeClass('invisible');
                showOrg();
                ajaxResHandle(data, function () {
                    $('#batchinfo-info').html(tmpl('template_batchinfo', data.context));
                    $('#formal').html(tmpl('template_formal', data.context));
                });
            }
            else {
                alert(data.msg);
            }
        });
    };

    // 获取批次进度展示接口
    function showOrg() {
        var batchNo = $('.product-content').data('batchno');
        $.get('/api/v1/qr/GetQrBatchProcess', {
            batchNo: batchNo,
            qrcode: result,
            type: 'QualityControl'
        }, function (data) {
            ajaxResHandle(data, function () {
                var batchProcess = data.context.batchProcess;

                if ($('.production-bg').data('status') >= 4) {

                    if (batchProcess.length === 0) {
                        return;
                    }
                    $('#batch-process').html(tmpl('template_process', data.context));
                }
                else {
                    return;
                }
            });
        });
    }

    // 激活本批次
    $('.activating-content').on('click', '[data-click="activation-btn"]', function () {
        console.log('激活本批次');
        $('.activation-content').removeClass('invisible');
        $('.activating-content').addClass('invisible');
        var batchNo = $('.product-content').data('batchno');
        $.post('/api/v1/qr/ActivateQrBatch', {
            batchNo: batchNo
        }).done(function (data) {
            if (data.code === 1) {
                $('.activation-content').addClass('invisible');
                $('.activating-content').removeClass('invisible');
                qualityControl();
            }
            else {
                alert(msg);
            }

        });
    });

    // 继续激活其他批次
    $('.activating-content').on('click', '[data-click="again-activation"]', function () {
        // console.log('激活其他批次');
        // var href = window.location.href
        scanQRCode();
    });
    // 扫码
    $('#scanQRCode').click(function () {
        scanQRCode();
    });
    // // 返回
    // $('#goBack').click(function () {
    //     history.back();
    // });

}
else {
    document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
    document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
}



