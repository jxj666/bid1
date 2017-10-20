(function() {
    var main = {
        name: 'compare_news',
        data: {
            tableClear: true,
            ajax1: {
                name: 'getCompareNews',
                newsId: undefined,
                start: 0,
                size: 20
            },
            ajax2: {
                name: 'compareNews',
                logId: undefined
            }
        },
        //启动
        start: function() {
            common.val_reset();
            common.height_reset();
            common.clearfloat();
            common.getTrumpet();
            common.getPullDownList();
            common.bind_element();
            common.user_show();
            common.getParamObj();
            common.new_role_control();
            main.data.ajax1.newsId = common.theRequest.id;
            ajax_news.getCompareNews(main.data.ajax1, main.table_show);
        },
        //列表显示
        table_show: function(res) {
            common.skip(main.skip_jump, main.data.ajax1, res, main.table_show);
            $('.compare_now span').html(`
                    【${res.context.field}】<a href="javascript:void(0)">${res.context.title}</a>                
                `);
            var log = res.context.log;
            var html1 = '';
            for (var i = 0; i < log.length; i++) {
                html1 += `<tr class="${i%2==0?'bg_write':'bg_gray'}"><td><input type="checkbox" name="" value='${log[i].id}' class='input1'></td><td class="type3">                ${log.length-i}</td><td class="type1">                ${log[i].createTime}</td><td class="type3" >                ${log[i].user.username}</td><td class="type3">                ${log[i].action}</td><td class="type1">                ${log[i].createTime}</td><td class="type3">                ${log[i].ip}</td></tr>`;
            }
            $('.contain_b tbody').html(html1)
        },
        //开始比较
        compare: function() {
            var key = '';
            $('.input1').each(function() {
                if ($(this)[0].checked == true) {
                    key += `${$(this).val()},`;
                }
            })
            main.data.ajax2.logId = key.slice(0, -1);
            ajax_news.compareNews(main.data.ajax2, main.different);
        },
        //比较内容导入
        different: function(res) {
            res1 = res.context[0];
            res2 = res.context[1];
            $('.pop_diff').removeClass('hide');
            $('#a').text(main.code_str(res2));
            $('#b').text(main.code_str(res1));

        },
        //比较内容导入前处理
        code_str: function(old_str) {
            var new_str = old_str.replace(/<.*?>/, "jxj11111").replace(/<.*?>/, "jxj11111").replace(/<\s*img.*?src="(.*?)".*?\/>/g, "jxj33333 - 图片 : $1 -  jxj33333").replace(/<.*?>/g, "jxj22222").replace(/&nbsp;|&lt;|&qt;|&quot;/g, " ").replace(/(jxj11111)+/g, "\n").replace(/(jxj22222)+/g, "\n").replace(/(jxj33333)+/g, "\n");
            return new_str;
        },
        //分页器跳转
        skip_jump: function(data, fun) {
            ajax_news.getCompareNews(data, fun);
        }
    }
    main.start();
    $('.compare_now button').on('click', function() {
        main.compare();
    })
    $('.hide_diff').on('click', function() {
        $('.pop_diff').addClass('hide');
        $('.class_middle')[0].checked = false;
        $('.class_hign')[0].checked = false;
        $('.class_low')[0].checked = false;

    })
    $('.show_toggle').on('click', function() {
        $('#a').toggleClass('hide');
        $('#b').toggleClass('hide');
    })
})()