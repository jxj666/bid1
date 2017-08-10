/**
 *@author fu
 *@file 下载管理
 */

$('a').click(function () {
    var href = $(this).href();
    console.log(href);
    return;
    window.location.replace();
});

function getQueryString(name) {
    var reg = new RegExp('(?:^|&)' + name + '=([^&]*)(?:&|$)', 'i');
    var strArr = window.location.search.substr(1).match(reg);
    return strArr != null ? strArr[1] : null;
}
var batchNo = getQueryString('batchNo');
var secret = '';
var codeName = getQueryString('codeName');
codeName = codeName.replace(/\//g,'\\');
// console.log(codeName);
var orgId = getQueryString('orgId');
// 转成中文编码
codeName = unescape(codeName.replace(/\\u/g, '%u')).replace(/\"/g, '');

$('.code-name').text(codeName);

$('.secret').on('change', function () {
    secret = $(this).val();
});
// var linkurl = location.origin + '/api/v1/qr/DownloadQrBatch';
var linkurl = location.origin + '/io/qr/download';
$('.download').click(function () {
    if (secret === '') {
        alert('请输入密钥');
    }
    else {
        $.post(linkurl+'/check', {
            batchNo: batchNo,
            secret: secret,
            orgId: orgId
        }, function (res) {
            if (res.code === 1) {
                dynamicSubmit(linkurl, {batchNo: batchNo, secret: secret, orgId: orgId});
            }
            else {
                alert(res.msg);
            }
        });
        
    }
});

// 动态构建一个Form 并且提交
function dynamicSubmit(url, datas) {

    var form = $('#dynamicForm');

    if (form.length <= 0) {
        form = $('<form>');
        form.attr('id', 'dynamicForm');
        form.attr('style', 'display:none');
        form.attr('target', '_self');
        form.attr('method', 'post');

        $('body').append(form);
    }

    form = $('#dynamicForm');
    form.attr('action', url);
    form.empty();

    if (datas && typeof (datas) === 'object') {
        for (var item in datas) {
            var input = $('<input>');
            input.attr('type', 'hidden');
            input.attr('name', item);
            input.val(datas[item]);

            input.appendTo(form);
        }
    }

    form.submit();
}

