var main = {
    name: 'wait_news',
    data: {
        search: true,
        tableClear: true,
        table: 1,
        ajax1: {
            name: 'getNewsList',
            context: undefined,
            field: undefined,
            channel: undefined,
            newsStatus: 3,
            start: 0,
            size: 20
        },
        ajax2: {
            name: 'updateNews',
            channel: undefined,
            status: undefined,
            id: undefined,
            totalRead: undefined,
            periodical: undefined
        }

    },
    start: function() {
        common.val_reset();
        common.height_reset();
        common.clearfloat();
        common.getTrumpet();
        common.getPullDownList();
        common.bind_element();
        common.user_show();
        main.data.ajax1.uid = common.k;
        main.data.ajax2.uid = common.k;
        $('.left-list .item3').addClass('active');
        $('#switch .switch1').addClass('active');
        ajax_news.getNewsList(main.data.ajax1, main.tableno_show);
    },

    tableno_show: function(data) {
        common.skip(main.skip_jump, main.data.ajax1, data, main.tableno_show);
        var list = data.context.list;
        var html1 = ' ';
        for (var i = 0; i < list.length; i++) {
            var html2 = ' ';
            var html4 = ' ';
            var html3 = ' ';
            var html5 = ' ';
            var channel = list[i].news.moniChannel ? list[i].news.moniChannel.split(',') : [];
            var channel2 = list[i].news.channel ? list[i].news.channel.split(',') : [];
            var person = list[i].newsReviews;
            var arr1 = [];
            for (var j = 0; j < person.length; j++) {
                if (person[j].stage > 0) {
                    var boolean1 = false;
                    for (var k = 0; k < arr1.length; k++) {
                        if (person[j].stage == arr1[k]) {
                            boolean1 = true;
                        }
                    }
                    if (boolean1) { continue }
                    arr1.push(person[j].stage);
                    html5 += `<span>【${person[j].stage==3?'三':person[j].stage==2?'二':'一'}审】${person[j].user.username}</span><br>`
                }
            }

            for (var j = 0; j < channel.length; j++) {
                if (channel[j]) {
                    html2 += `<span>【${channel[j]}】</span>`;
                }

            }
            for (var j = 0; j < channel2.length; j++) {
                if (channel2[j]) {
                    html4 += `<span>【${channel2[j]}】</span>`;
                }

            }
            switch (list[i].news.status) {
                case 0:
                    html3 = "待审核";
                    break;
                case 1:
                    html3 = '一审通过';
                    break;
                case 2:
                    html3 = '二审通过';
                    break;
                case 3:
                    html3 = '三审通过';
                    break;
                case 4:
                    html3 = '已发刊'
                    break;
                case -1:
                    html3 = '草稿'
                    break;
                default:
                    html3 = "未知状态";
                    break;
            }
            html1 += `<tr class="${ i % 2 == 0 ? 'bg_write' : 'bg_gray' }" tr_id = '${list[i].news.id}'><td class="type1">                ${ list[i].news.id }</td><td class="type2"><span>【${ list[i].news.field }】</span><a href="javascript:void(0)">${ list[i].news.title }</a></td><td class="type3">                ${ list[i].news.author }</td><td class="type4">             ${html5}</td><td class="type4">                ${html2}</td><td class="type3">                ${html3}</td><td class="type6">               ${ list[i].news.createTime }</td><td class="type5"><a href="javascript:void(0)" class='t_daochu'>导出</a><a href="javascript:void(0)" class='t_chakan'>查看</a><a href="javascript:void(0)" class='t_bidui'>比对</a></td><td class="type5"><a href="javascript:void(0)" class='t_biangen'>变更</a></td></tr>`;
        }
        $('.tableno tbody').html(html1);

    },
    tableyes_show: function(data) {
        common.skip(main.skip_jump, main.data.ajax1, data, main.tableyes_show);
        var list = data.context.list;

        var html1 = ' ';

        for (var i = 0; i < list.length; i++) {
            var html2 = ' ';
            var html4 = ' ';
            var html3 = ' ';
            var html5 = ' ';
            var channel = list[i].news.moniChannel ? list[i].news.moniChannel.split(',') : [];
            var channel2 = list[i].news.channel ? list[i].news.channel.split(',') : [];
            var person = list[i].newsReviews;
            var arr1 = [];
            for (var j = 0; j < person.length; j++) {
                if (person[j].stage > 0) {
                    var boolean1 = false;
                    for (var k = 0; k < arr1.length; k++) {
                        if (person[j].stage == arr1[k]) {
                            boolean1 = true;
                        }
                    }
                    if (boolean1) { continue }
                    arr1.push(person[j].stage);
                    html5 += `<span>【${person[j].stage==3?'三':person[j].stage==2?'二':'一'}审】${person[j].user.username}</span><br>`
                }
            }

            for (var j = 0; j < channel.length; j++) {
                if (channel[j]) {
                    html2 += `<span>【${channel[j]}】</span>`;
                }

            }
            for (var j = 0; j < channel2.length; j++) {
                if (channel2[j]) {
                    html4 += `<span>【${channel2[j]}】</span>`;
                }

            }
            switch (list[i].news.status) {
                case 0:
                    html3 = "待审核";
                    break;
                case 1:
                    html3 = '一审通过';
                    break;
                case 2:
                    html3 = '二审通过';
                    break;
                case 3:
                    html3 = '三审通过';
                    break;
                case 4:
                    html3 = '已发刊'
                    break;
                case -1:
                    html3 = '草稿'
                    break;
                default:
                    html3 = "未知状态";
                    break;
            }

            html1 += `<tr class="${i%2==0?'bg_write':'bg_gray'}" tr_status='1' tr_id='${list[i].news.id}' ><td class="type1">                ${list[i].news.id}</td><td class="type2"><span>【${list[i].news.field}】</span><a href="javascript:void(0)">${list[i].news.title}</a></td><td class="type3">            ${list[i].news.author}</td><td class="type4">              ${html5}</td><td class="type4">            ${html2}</td><td class="type4">                 ${html4}</td><td class="type3">                ${html3}</td><td class="type1">                ${list[i].news.totalRead}</td><td class="type6">                ${list[i].news.createTime}</td><td class="type5"><a href="javascript:void(0)" class='t_chakan'>查看</a><a href="javascript:void(0)" class='t_daochu'>导出</a><a href="javascript:void(0)" class='t_bidui'>比对</a></td><td class="type1">                ${list[i].news.periodical}</td><td class="type5" test='1'><a href="javascript:void(0)" class='t_biangen'>变更</a></td></tr>`;
        }
        $('.tableyes tbody').html(html1);



    },
    click_change: function($this) {
        var $tr = $this.closest('tr');
        $('body>.pop').removeClass('hide');
        var html1 = ' ';
        for (var i = 0; i < common.s_channel.length; i++) {
            html1 += `<input type="checkbox" name="qudao" value='${common.s_channel[i].id}'><span>${common.s_channel[i].name}</span>`;
        }
        $('.qudao .check').html(html1);
        main.data.tr_status = $tr.attr('tr_status');
        main.data.tr_id = $tr.attr('tr_id');
    },
    click_submit: function() {
        var channel = '';
        $('.check input:checkbox').each(function() {
            if ($(this)[0].checked == true) {
                channel += `${$(this).val()},`
            }
        });
        channel = channel.slice(0, -1);
        var status = $('.zhuantai select').val();
        var id = main.data.tr_id;
        var totalRead = $('.yuedu input').val();
        var periodical = $('.qikan input').val();
        main.data.ajax2.channel = channel;
        main.data.ajax2.status = status;
        main.data.ajax2.id = id;
        main.data.ajax2.totalRead = totalRead;
        main.data.ajax2.periodical = periodical;
        ajax_news.updateNews(main.data.ajax2, undefined);
        $('body>.pop').addClass('hide');
    },

    click_li: function($this) {
        common.getPullDownList();
        $('.contain_b>div').addClass('hide');
        $('#switch li').removeClass('active');
        $this.addClass('active');
        if ($this.hasClass('switch1')) {
            main.data.table = 1;
            main.data.ajax1 = {
                context: undefined,
                field: undefined,
                channel: undefined,
                newsStatus: 3,
                start: 0,
                size: 20
            }
            main.data.ajax1.uid = common.k;
            ajax_news.getNewsList(main.data.ajax1, main.tableno_show);
            $('.tableno').removeClass('hide');
        } else {
            main.data.table = 2;
            main.data.ajax1 = {
                context: undefined,
                field: undefined,
                channel: undefined,
                newsStatus: 4,
                start: 0,
                size: 20
            }
            main.data.ajax1.uid = common.k;
            ajax_news.getNewsList(main.data.ajax1, main.tableyes_show);
            $('.tableyes').removeClass('hide');
        }
    },
    choice: function() {
        var k1 = $('#s_input')[0].value || undefined;
        var k2 = $('#s_field')[0].value || undefined;
        var k3 = $('#s_channel')[0].value || undefined;
        k2 = k2 == '0' ? undefined : k2;
        k3 = k3 == '0' ? undefined : k3;
        main.data.ajax1.context = k1;
        main.data.ajax1.field = k2;
        main.data.ajax1.channel = k3;
        main.data.ajax1.start = 0;
        main.data.ajax1.size = 20;
        if (main.data.table == 1) {
            ajax_news.getNewsList(main.data.ajax1, main.tableno_show);
        } else {
            ajax_news.getNewsList(main.data.ajax1, main.tableyes_show);
        }
    },
    skip_jump: function(data, fun) {
        ajax_news.getNewsList(data, fun);
    }
}


//绑定与运行
main.start();
$('table').on('click', '.t_biangen', function() {
    main.click_change($(this));
})
$('.pop .bg_blue').on('click', function() {
    main.click_submit($(this));
    setTimeout(function() {
        location.reload();
    }, 200);
})
$('.pop .bg_gray').on('click', function() {
    $('body>.pop').addClass('hide');
})
$('#switch').on('click', 'li', function() {
    main.click_li($(this));

})
$('#s_search').on('click', function() {
    main.choice();
})