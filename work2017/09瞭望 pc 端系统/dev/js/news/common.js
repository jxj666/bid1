//*********
// _________common
var common = {
    i: 0,
    theRequest: {},
    k: '',
    data: {
        ajax1: {
            name: 'getTrumpet',
            uid: 1001
        },
        ajax2: {
            name: 'info',
            uid: 1001,
            newsId: undefined
        },
        ajax3: {
            name: 'derived',
            uid: 1001,
            newsId: undefined
        }
    },
    //页面变量值获取
    val_reset: function() {
        var v1 = $('.val3').text();
        if (v1) {
            //common.k = v1;
            common.k = 1001;
        }
        var v2 = $('.val5').text();
        common.role = {};
        common.role.val1 = v2.search(/CMS001/) > -1 ? true : false;
        common.role.val2 = v2.search(/CMS002/) > -1 ? true : false;
        common.role.val3 = v2.search(/CMS003/) > -1 ? true : false;
        common.role.val4 = v2.search(/CMS004/) > -1 ? true : false;
        common.role.val5 = v2.search(/CMS005/) > -1 ? true : false;
        common.role.val6 = v2.search(/CMS006/) > -1 ? true : false;
        common.role.val7 = v2.search(/CMS007/) > -1 ? true : false;
        common.role.val8 = v2.search(/CMS008/) > -1 ? true : false;
        common.role.val9 = v2.search(/CMS009/) > -1 ? true : false;
        common.role.val10 = v2.search(/CMS010/) > -1 ? true : false;
    },
    //打印 ajax 回调
    console_data: function(res, name) {
        common.i += 1;
        if (res.code != '1') {
            console.log('运行排序:' + common.i, name + '接口错误! ->' + res.msg);
        } else {
            console.log('运行排序:' + common.i, '接口:' + name, res);
        }
    },
    //处理单个 url 数据
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(?:&|$)", 'i');
        var str_arr = window.location.search.substr(1).match(reg);
        return str_arr != null ? str_arr[2] : null;
    },
    //处理全部 url 数据
    getParamObj: function() {
        var str = location.search;
        if (!str) {
            return {};
        }
        str = str.substr(1);
        var theRequest = {};
        var strs = str.split('&');
        $.each(strs, function(i, v) {
            theRequest[v.split('=')[0]] = decodeURIComponent(v.split('=')[1]);
        });
        common.theRequest = theRequest;
    },
    //ajax 调用主程序
    ajax: function(url, method, data, explain, callback) {
        var port = explain;
        port = port + ' : ' + url;
        $.ajax({
            url: url,
            method: method,
            data: data
        }).done(function(res) {
            common.console_data(res, port);
            if (res.code != '1') {
                alert(port + ' 返回数据出错!');
            } else {
                callback && callback(res);
            }
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    //获取通知信息
    getTrumpet: function() {
        ajax_news.getTrumpet(common.data.ajax1, common.message_show);
    },
    //通知信息展示
    message_show: function(res) {
        var html1 = `<a href="javascript:void(0)"><li onclick="location.href=location.origin+'/page/p/news/auditWord.html'">待审核<span>${res.context.news}</span></li></a><a href="javascript:void(0)"><li onclick="location.href=location.origin+'/page/p/topic/themeManage'">选题</li></a><a href="javascript:void(0)"><li onclick="location.href=location.origin+'/page/p/message/message'">消息中心<span>${res.context.message}</span></li></a>`;
        $('.pop_alert ul').html(html1);
    },
    //选择信息展示
    select_show: function(data) {
        common.s_channel = [];
        common.s_field = [];
        common.s_author = [];

        var list = data.context.dictChannels || [];
        var list2 = data.context.dictFields || [];
        var list3 = data.context.users || [];


        function show_l(list, data, e, key, name) {

            if ($(e)) {
                for (var i = 0; i < list.length; i++) {
                    data.push({
                        id: list[i].id,
                        name: list[i].name,
                        username: list[i].username
                    })
                }
                var html1 = `<option value="0">所有${name}</option>`;
                var html2 = '';
                for (var i = 0, l = data; i < l.length; i++) {
                    if (key == 3) {
                        html2 = l[i].username;
                    } else {
                        html2 = l[i].name;
                    }
                    html1 += `<option value="${html2}">${html2}</option>`
                }
                $(e).html(html1);
            }
        }
        show_l(list, common.s_channel, '#s_channel', 1, '渠道');
        show_l(list2, common.s_field, '#s_field', 2, '领域');
        show_l(list3, common.s_author, '#s_author', 3, '作者');

    },
    //获取选择列表
    getPullDownList: function() {
        ajax_news.getPullDownList(undefined, common.select_show);
    },
    bind_element: function() {
        $('table').on('click', '.t_bidui', function() {
            common.click_bidui($(this));
        });
        $('.nav_user .hirt').on('click', function() {
            $('.pop_alert').toggleClass('hide');
        });
        $('.nav_user .user').on('click', function() {
            $('.pop_exit').toggleClass('hide');
        });
        $('.contain table').on('click', '.t_bianji', function(e) {
            common.change($(this));
        });
        $('.contain table').on('click', '.t_shenhe', function(e) {
            common.edit($(this));
        });
        $('.contain table').on('click', '.t_chakan', function(e) {
            common.look($(this));
        });
        $('.contain table').on('click', '.t_daochu', function(e) {
            common.download($(this));
        });
        $('.contain table').on('click', '.type2', function(e) {
            common.look($(this));
        });
        $('.pop_look .close').on('click', function(e) {
            $('.pop_look').addClass('hide');
        });
    },
    //下载文档
    download: function($this) {
        var $tr = $this.closest('tr');
        var id = $tr.attr('tr_id');
        location.href = location.origin + `/v1/p/news/derived?newsId=` + id;
    },
    //查看文档
    look: function($this) {
        $('.pop_look').removeClass('hide');
        var $tr = $this.closest('tr');
        var id = $tr.attr('tr_id');
        common.data.ajax2.newsId = id;
        ajax_news.info(common.data.ajax2, common.text_show);
    },
    //查看文档显示
    text_show: function(res) {
        var html1 = res.context.news.content;
        var html2 = `<h1>${res.context.news.title}</h1>`;
        var html3 = `<h3>${res.context.news.author}</h3>`;
        $('.pop_look .text_box').html(html2 + html3 + html1);
    },
    //变更文档
    change: function($this) {
        var $tr = $this.closest('tr');
        var id = $tr.attr('tr_id');
        location.href = location.origin + `/page/p/news/editNews?id=` + id;

    },
    //编辑文档
    edit: function($this) {
        var $tr = $this.closest('tr');
        var id = $tr.attr('tr_id');
        location.href = location.origin + `/page/p/news/reviewNews?id=` + id;

    },
    //点击比对反应
    click_bidui: function($this) {
        var $tr = $this.closest('tr');
        var id = $tr.attr('tr_id');
        location.href = location.origin + `/page/p/news/compareNews?id=` + id;

    },
    //页面清除浮动
    clearfloat: function() {
        var html1 = `<div class='clear'></div>`;
        $('.contain').after(html1)
    },
    //分页器
    skip: function(ajax_fun, data, res, table_show) {
        var total = res.context.total;
        var start = data.start;
        var num = 20;
        var now = (start) / 20 + 1;
        var prev = now - 1;
        var next = now + 1;
        var min = 1;
        var max = Math.ceil(total / num);
        var html1 = `<div class="first_div"><span>共${total}条</span></div><div><span class="sum">每页20条</span></div><div class="prev_est"></div><div class="prev"></div><div class="page_num"><div class="num num1 ${prev<min&&"hide"}">${prev}</div><div class="num num2 active">${now}</div><div class="num num3 ${next>max&&"hide"}">${next}</div><div class="clear"></div></div><div class="last"></div><div class="last_est"></div><div><span class="intro">当前${now}/${max}页</span></div><div class="last_div"><span>转到第<input type="text" name="" class="arrow">页</span></div>`;
        $('.m_skip').html(html1);
        $(".m_skip").off();
        $('.m_skip').on('click', 'div', function(e) {
            if ($(this).hasClass('prev_est')) {
                if (now > 1) { data.start = 0; } else { return }
            } else if ($(this).hasClass('prev')) {
                if (now > 1) { data.start = 20 * (now - 2); } else { return }
            } else if ($(this).hasClass('num')) {
                var k = Number($(this).text());
                data.start = 20 * (k - 1);
            } else if ($(this).hasClass('last')) {
                if (now < max) { data.start = 20 * (now); } else { return }
            } else if ($(this).hasClass('last_est')) {
                if (now < max) { data.start = 20 * (max - 1); } else { return }
            } else {
                return;
            }
            ajax_fun(data, table_show);
        })
        $('.m_skip .arrow').off();
        $('.m_skip .arrow').on('blur', function() {
            var v = $('.m_skip .arrow').val();
            var k = parseInt(v);
            if (0 < k < max + 1) {
                data.start = 20 * (k - 1);
            } else {
                alert('请输入正确数字!');
                return;
            }
            ajax_fun(data, table_show);
        });

    },
    //高度重置
    height_reset: function() {
        var height1 = ($(window).height() - 58) + 'px';
        $('.left_side').css({ "height": height1, 'box-sizing': 'border-box', 'overflow': 'hidden' });
        $('.left_side>ul').css({ "height": height1 });
        $('.contain').css({ "height": height1, "overflow": "auto" });
    },
    //用户信息展示
    user_show: function() {
        var username = $('.val2').text();
        var avatar = $('.val7').text();
        if (username) {
            $('.user').removeClass('hide')
            $('.user span').html(username);
        }
        if (avatar) {
            $('.people').removeClass('hide')
            //$('.people img').attr({ 'src': avatar });
        }

    }
}