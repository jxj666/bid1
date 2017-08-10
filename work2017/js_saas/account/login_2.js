// 微信登录相关逻辑

//起始登录页

// window.onload = function () {
var $input = $('.login_l input');
var loginSwitch = 'no';

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


$('.login_l input').on('keyup', function() {
    var $input = $('.login_l input');
    loginSwitch = 'yes';
    for (var i = 0; i < $input.length; i++) {
        if ($input[i].value.length < 5) {
            loginSwitch = 'no';
        }
    }

    var password = $input[2].value;
    if (password.length > 5) {
        var index = password.search(/\f|\n|\r|\s/);
        // console.log(password)
        // console.log(index)
        if (index == -1) {
            $('.login_e').css('visibility', 'hidden');
            loginSwitch = 'yes';
        } else {
            $('.login_e').css('visibility', 'visible');
            loginSwitch = 'no';
        }
    }
    if (loginSwitch === 'yes') {
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
    var ruReg = new RegExp('[?&]ru=(.*)', 'ig');
    var ru = location.href.match(ruReg) ? location.href.match(ruReg)[0].replace(ruReg, function(res, $1) {
        return $1;
    }) : null;
    location.replace(ru ? ru : '/html/marketing/index.html');
}
// };

$('[data-click="login"]').click(function() {
    password_verify();
});


// 微信登录相关逻辑

//*********
// _________ 全局变量
var g_data_24596 = {};
g_data_24596.time = '1499324596';
g_data_24596.author = 'jxj';
g_data_24596.i = 0;
(function() {

    //*********
    // _________ 变量
    var i_data = {};
    //*********
    // _________ 执行
    get_token();
    build_img();


    //*********
    // _________ 绑定
    //选择相关企业
    // $('.enterprise-pop').on('click', '.enterprise-item', function() {
    //     var $this = $(this);
    //     $('.enterprise-item').removeClass('active');
    //     $this.addClass('active');
    //     $('.confirm-cut').addClass('active');
    //     $('.enterprise-name').text($this.attr('data-name'));
    //     i_data.orgId = $this.attr('data-orgId')
    // });
    //确定选择
    $('.confirm-cut').on('click', function() {
        var $this = $(this);
        if ($this.hasClass('active')) {
            $('.pop').addClass('invisible')
                .children('.enterprise-pop').addClass('invisible');

        } else {
            alert('请选择企业!')
        }
    });

    //重新选择
    $('.cut-enterprise').on('click', function() {
        $('.pop').removeClass('invisible')
            .children('.enterprise-pop').removeClass('invisible');
    });
    //确认进入
    $('.login-btn').on('click', function() {
        ajax_login();
    });



    //*********
    // _________ 函数

 
    //获取 url 字符
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(?:&|$)", 'i');
        var str_arr = window.location.search.substr(1).match(reg);
        return str_arr != null ? str_arr[2] : null;
    }
    //打印数据
    function console_data(res, name) {
        if (res.code != '1') {
            console.log(name + '数据错误! ->' + res.msg);
        } else {
            g_data_24596.i += 1;
            console.log('运行排序:' + g_data_24596.i, '接口:' + name, res);
        }

    }
    //获取token
    function get_token() {
        i_data.token = getQueryString('token');
        if (i_data.token) {
            ajax_getorgsByToken();
        }
    }
    //获取 img
    function build_img() {

        i_data.avatar = getQueryString('avatar');

        if (i_data.avatar) {
            $('.headshot-content img').attr('src', decodeURIComponent(i_data.avatar).replace(/https?:/, ''));
            $('.headshot-content img').css('border-radius', '50%');
        }
    }
    //企业选择
    // function company_list(res, name) {
    //     console_data(res, name);
    //     var orgs = [];
    //     var li_text = '';
    //     if (!res.data.context) {
    //         location.href = 'https://testmobile.chengjuiot.com/html/account/login.html';
    //     }
    //     orgs = res.data.context.orgs;
    //     for (var i = 0; i < orgs.length; i++) {
    //         li_text += `            
    //         <li class="enterprise-item" data-orgId='${orgs[i].org.orgId}' data-name='${orgs[i].org.name}' >
    //             <a href="javascript:;">${orgs[i].org.name}</a>
    //         </li>`;
    //     }
    //     $('.enterprise-pop .enterprise-list').html(li_text);

    // }
    //直选第一企业
    function company_list2(res, name) {
        console_data(res, name);
        var orgs = [];
        var li_text = '';
        if (!res.data.context) {
            location.href = location.origin+'/html/account/login.html';
        }
        $('.pop').hide();
        orgs = res.data.context.orgs;
        $('.enterprise-name').text(orgs[0].org.name);
        i_data.orgId = orgs[0].org.orgId;



    }
    //成功进入
    function in_account(res, name) {
        console_data(res, name);
        if (res.code == '1') {
            location.href = location.origin+'/html/account/account_info.html';
        }
    }


    //*********
    // _________ ajax
    function ajax_getorgsByToken() {
        i_data.port = '/auth/wechat/getorgsByToken';
        $.ajax({
            url: '/auth/wechat/getorgsByToken',
            method: 'GET',
            data: {
                token: i_data.token
            }
        }).done(function(res) {
            ajaxResHandle(res, company_list2, [i_data.port]);
        })
    }

    function ajax_login() {
        i_data.port = '/auth/wechat/login';
        $.ajax({
            url: '/auth/wechat/login',
            method: 'POST',
            data: {
                orgid: i_data.orgId,
                token: i_data.token
            }
        }).done(function(res) {
            ajaxResHandle(res, in_account, [i_data.port]);
        })
    }

})()