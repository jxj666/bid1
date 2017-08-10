//验证是否为测试环境
var host_name = location.hostname;
var is_online = host_name === 'mobile.chengjuiot.com';
(function() {
    if (sessionStorage.weixin_reload) {

    } else {
        if (isWeixin) {
            var url_text = is_online ? 'https://act.yucent.com/a/p/saas-wechat-login.html' : 'https://testweiop.chengjuiot.com/a/p/saas-wechat-login.html';
            location.href = url_text;
        } else {

        }
    }
    sessionStorage.weixin_reload = 1;
})();

var g_data = {};
var k = 1;
var enterpriseName = '';
$('[data-click="cut-enterprise"]').click(function() {
    $('.pop').removeClass('invisible')
        .children('.enterprise-pop').removeClass('invisible');
});
$('.enterprise-item').on('click', function() {
    enterpriseName = $(this).children('a').text();
    // console.log(enterpriseName);
});
$('[data-click="confirm-cut"]').click(function() {
    $('.enterprise-name').text(enterpriseName);
    $('.pop').addClass('invisible')
        .children('.enterprise-pop').addClass('invisible');
});


var $input = $('.login_l input');
var bol_login1 = false;
var bol_login2 = false;

$('.login_l span').on('click', function(ev) {
    var $t = $(ev.target);
    // console.log($t);
    $t.toggleClass('look_password');
    if ($t.hasClass('look_password')) {
        $('.password_i input').attr('type', 'password');
    } else {
        $('.password_i input').attr('type', 'text');
    }
});

$('.login_explain_btn').on('click', function() {
    if (sessionStorage.login_box) {
        $('.login_box').addClass('invisible');
    }
});
$('.login_l input').on('keyup', function() {
    var $input = $('.login_l input');
    bol_login1 = true;
    bol_login2 = true;
    $('.login_e').css('display', 'none');
    for (var i = 0; i < $input.length; i++) {
        if ($input[i].value.length < 5) {
            bol_login1 = false;
        }
        if ($input[i].value.search(/\f|\n|\r|\s/) > 0) {
            bol_login2 = false;
            $('.login_e').css('display', 'block');
        }
    }


    if (bol_login2 && bol_login1) {
        $('#g_login_box .login_pop a').addClass('login_able');

    } else {
        $('#g_login_box .login_pop a').removeClass('login_able');

    }
});

function password_verify() {
    var argument0 = $input[0].value;
    var argument1 = $input[1].value;
    var argument2 = $input[2].value;
    $.ajax({
        url: ' /auth/login',
        method: 'post',
        data: {
            orgid: argument0,
            name: argument1,
            password: argument2
        }
    }).done(function(result) {
        ajaxResHandle(result, infoDispose(result));
    });
}

function infoDispose(result) {
    console.log(result);
    if (result.code != '1') {
        // $('.login_box h3').text(result.msg || '登录错误!');
        // $('.login_box').removeClass('invisible');
        sessionStorage.login_box = 1;
        return;
    }
    var ruReg = new RegExp('[?&]ru=(.*)', 'ig');
    var ru = location.href.match(ruReg) ? location.href.match(ruReg)[0].replace(ruReg, function(res, $1) {
        return $1;
    }) : 'null';
    if(ru && ru.search(/login/)>0){
        ru='/html/marketing/index.html';
    }

    if (result.data.context.user.openid) {
        location.replace(ru ? ru : '/html/marketing/index.html');
    } else {
        if (isWeixin) {
            $('.bind_box h3').text('确认账户绑定该微信，方便之后快捷登录?');
            $('.bind_box').removeClass('invisible');
            sessionStorage.bind_box = 1;
            g_data.ru = ru;
        } else {
            location.replace(ru ? ru : '/html/marketing/index.html');
        }
    }
}

$('.bind_yes_btn').on('click', function() {
    if (sessionStorage.bind_box) {
        var ru = g_data.ru;
        var cj_ru = (ru ? ru : '/html/marketing/index.html');
        sessionStorage.storage_ru = cj_ru;
        var url_text = is_online ? '//act.yucent.com/a/p/saas-wechat-bind.html' : '//testweiop.chengjuiot.com/a/p/saas-wechat-bind.html';
        location.replace(url_text);
    }
});
$('.bind_no_btn').on('click', function() {
    if (sessionStorage.bind_box) {
        var ru = g_data.ru;
        location.replace(ru ? ru : '/html/marketing/index.html');
    }
});
$('[data-click="login"]').click(
    function() {
        var $this = $(this);
        var bol = $this.hasClass('login_able');
        if (bol) {
            password_verify();
            $this.removeClass('login_able');
        } else {
            alert('请正确输入!');
        }

    }
);