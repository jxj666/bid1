var g_07682 = {};
g_07682.author = 'jxj';
g_07682.time = '1499307682';
g_07682.i = 0;
(function() {
    // ----- 变量
    var i_data = {};
    //i_data.userid = 'd8e8fca2dc0f896fd7cb4cb0031ba248';

    // ----- 执行
    clear_local();
    ajax_user();
    //ajax_GetOrgsByOpenid();
    ajax_GetOrgInfo();
    //ajax_GetOrgs();

    // ----- 绑定
    $('.exit').on('click', function() {
        ajax_logout();
    });

    // ----- 函数
    function clear_local() {
        sessionStorage.weixin_reload = '';
    }
    //确定退出
    function logout_show(res, name) {
        console_data(res, name);
        if (res.code == '1') {
            location.href = location.origin+'/html/account/login.html';
        } else {
            alert('退出失败!');
        }
    }
    //获取缓存
    function getCookie(name) {
        var arr;
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        }
        return null;
    }
    //打印数据
    function console_data(res, name) {
        if (res.code != '1') {
            console.log(name + '数据错误! ->' + res.msg);
        } else {
            g_07682.i += 1;
            console.log(g_07682.i, name, res);
        }

    }
    //企业展示
    function GetOrgInfo_show(res, name) {
        console_data(res, name);
        var name = res.context.name;
        $('.g_message .m_name span').text(name);

    }
    //展示用户
    function user_show(res, name) {
        console_data(res, name);
        var roles = res.context.roles;
        var perms = res.context.perms;
        var permsid = perms[0].id;
        var html_text = '';
        var user = res.context.user;

        if (user.avatar) {
            var user_img=`url(${user.avatar.replace(/https?:/,'')}) no-repeat 50%`;
          $('.g_message .m_img').css({'background':user_img,'background-size':'contain'}); 
        }
        $('.g_message .m_name h3').text(user.nickname);
        $('.g_option .users span').text(perms[0].name);
        $('.g_option .mobile span').text(user.phone);
        $('.g_option .mail span').text(user.mail);

        for (var i = 0; i < roles.length; i++) {
            html_text += `
      <div class="company_l clearfix" data-id='${roles[i].id}' style='display:${roles[i].id==permsid?'block':'none'}'>
                <div class="company_type">${roles[i].id==permsid?'当前企业':'已关联企业'}</div>
                <div class="company_img ${roles[i].id==permsid && 'active'}"></div>
                 <div class="company_user">${roles[i].name}</div>
                <div class="company_name">${roles[i].orgId}</div>
      </div>
      `
        }
        $('.g_company').html(html_text);
        var openid = res.context.user.openid;
        // alert(openid);
        // if (!openid) {
        //     alert('请绑定你的微信!');
        // }
    }

    // ----- ajax
    //调取用户信息
    function ajax_user() {
        var url_text = '/api/v1/es/GetUser';
        var port = '调取用户信息';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {}
        }).done(function(res) {
            ajaxResHandle(res, user_show, [port]);
        });
    }
    //根据OPENID获取用户绑定的企业列表
    function ajax_GetOrgsByOpenid() {
        var url_text = '/api/v1/es/GetOrgsByOpenid';
        var port = '根据OPENID获取用户绑定的企业列表';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {}
        }).done(function(res) {
            ajaxResHandle(res, console_data, [port]);
        });
    }
    //获取企业信息
    function ajax_GetOrgInfo() {
        var url_text = '/api/v1/es/GetOrgInfo';
        var port = '获取企业信息';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {}
        }).done(function(res) {
            ajaxResHandle(res, GetOrgInfo_show, [port]);
        });
    }
    //获取企业
    function ajax_GetOrgs() {
        var url_text = '/api/v1/es/GetOrgs';
        var port = '获取企业名称';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {}
        }).done(function(res) {
            ajaxResHandle(res, console_data, [port]);
        });
    }

    //退出接口
    function ajax_logout() {
        var url_text = '/auth/logout';
        var port = '退出接口';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {}
        }).done(function(res) {
            ajaxResHandle(res, logout_show, [port]);
        });
    }
})();
