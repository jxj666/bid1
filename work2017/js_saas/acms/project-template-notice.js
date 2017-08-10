// ***公告配置部分

var g_1499051634 = {};
g_1499051634.author = 'jxj';

(function () {
    /** 变量 ******/

    var i_data = {};
    i_data.name = 'i_data';
    i_data.status = 'ok';
    i_data.effect = '公告配置';
    //公告下拉加载请求数据
    var Main_data = {
        url: '/api/v1/acms/GetAnnouncement',
        method: 'GET',
        data: {
            activity_id: 'act-Va2MiqDvZNu0F0pJ', //g_1499051634.activityid,
            pageNo: 0,
            pageSize: 10,
            status: 1
        }

    };


    /** 绑定 ******/
        //为公告配置添加下拉加载
    var notice_bol = false;
    $('[data-target="#notice"]').on('click', function () {
        if (notice_bol) {
            return;
        }
        notice_bol = true;
        $('#notice .dropload-down').remove();

        var dropLoad = $('#notice ').dropload({

            scrollArea: window,
            autoLoad: true,
            distance: 10, // 拉动距离
            loadDownFn: function (me) {
                console.log(Main_data);
                $.ajax(Main_data).done(function (result) {
                    ajaxResHandle(result, notice_show, [me]);
                }).fail(function (jqXHR, textStatus) {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                    // 即使加载出错，也得重置
                    me.resetload();
                    $('#notice ').html('<div class="dropload-error">加载出错<br>点我重试</div>');
                    $('.dropload-error').off().click(() => {
                        dropLoad.noData(false);
                        dropLoad.unlock();
                        dropLoad.resetload();
                    });
                });
            }
        });
        $('#notice .menu_b').html(' ');
        //dropLoadInit();

        //重置下拉加载
        function dropLoadInit() {
            Main_data.data.pageNo = 0;
            $('.dropload-down').show();
            dropLoad.noData(false);
            dropLoad.unlock();
            dropLoad.resetload();
        }
    });

    //图片上传
    $('#j_img_up').on('change', function () {
        var $this = $(this);
        var formData = new FormData();
        if (this.files[0]) {
            formData.append('file', this.files[0]);
            var channel = $this.data('channel');
            formData.append('channel', channel);
            ajax_img_up(formData);
        }
        else {
            i_data.img_1499051634 = i_data.image;

        }

    });
    // 时间
    let noticeBeginCalendar = flatpickr('#noticeBeginTime', {
        mode: 'single',
        enableTime: true,
        time_24hr: true, // AM/PM time picker is used by default
        // initial values for time. don't use these to preload a date
        defaultHour: 24,
        defaultMinute: 0,
        locale: 'zh',
        dateFormat: 'Y-m-d H:i',
        // minDate: 'today',
        defaultDate: '',
        disableMobile: false,
        plugins: [new confirmDatePlugin({
            // confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
            confirmText: '确认 ',
            showAlways: true,
            theme: 'light' // or "dark"
        })],
        onChange(selectedDates, dateStr, instance) {
            console.log('change');
        }
    });

    //是否启用公告
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
    $('#modal-notice').on('shown.cj.modal', function (e) {
        var $t = $(e.relatedTarget);
        var $this_set = $t.closest('.menu_a');
        i_data.begintime = $this_set.attr('data-begintime');
        i_data.endtime = $this_set.attr('data-endtime');
        i_data.target = $this_set.attr('data-target');
        i_data.image = $this_set.attr('data-image');
        i_data.title = $this_set.attr('data-title');
        i_data.isTop = Number($this_set.attr('data-isTop'));
        i_data.activityId = $this_set.attr('data-activityId');

        i_data.announceId = $this_set.attr('data-announceId');

        i_data.status = Number($this_set.attr('data-status'));
        i_data.img_data = i_data.image;
        $('.title_set input').val(i_data.title);
        if (i_data.target && i_data.target != 'null') {
            $('.link input').val(i_data.target);
            $('.link .link_e').hide();
        }
        $($('.time_a .time_s')[0]).find('input').val(i_data.begintime);
        $($('.time_a .time_s')[1]).find('input').val(i_data.endtime);
        if (i_data.isTop == '1') {

            $('.g_notice_pop .menu_c div').removeClass('j_active');

            $('.g_notice_pop .yes_c').addClass('j_active');

        } else {
            $('.g_notice_pop .menu_c div').removeClass('j_active');

            $('.g_notice_pop .no_c').addClass('j_active');

        }

    });
    // 上传照片开关
    $('.g_notice_pop .box_a').on('click', '.img_up', function () {
        $('#j_img_up').trigger('focus');
    });
    // 链接提示

    $('.link input').on('keyup', function () {

        if (!$('.link input').val()) {

            $('.link_e').show();

        } else {

            $('.link_e').hide();

        }
    });
    // 顶置切换
    $('.g_notice_pop .menu_c div').on('click', function (e) {

        var $t = $(e.target);
        if ($t.hasClass('yes_c')) {

            i_data.isTop = '1';

        } else {

            i_data.isTop = '0';

        }
        if ($t.hasClass('j_active')) {
            return;
        } else {
            $t.addClass('j_active');
            $t.siblings().removeClass('j_active');
        }
    });
    //修改保存
    $('#modal-notice .save').on('click', function () {
        var u_data = {};
        u_data.activity_id = i_data.activityId;
        u_data.announcement_id = i_data.announceId;

        u_data.image = i_data.img_data;
        u_data.isTop = i_data.isTop;
        u_data.status = i_data.status;
        if ($('.title_set input').val().length <= 0) {
            alert('请输入正确活动主题文字');
            return;
        }
        if ($($('.time_a .time_s')[0]).find('input').val().length <= 0) {
            alert('请输入正确开始时间');
            return;
        }
        if ($($('.time_a .time_s')[1]).find('input').val().length <= 0) {
            alert('请输入正确结束时间');
            return;
        }
        if ($('.link input').val()) {
            u_data.target = $('.link input').val();
        } else {
            u_data.target = undefined;
        }

        u_data.title = $('.title_set input').val();

        var time = $($('.time_a .time_s')[0]).find('input').val() + ' 00:00:00';
        u_data.beginTime = datetime_to_unix(time);
        var time = $($('.time_a .time_s')[1]).find('input').val() + ' 00:00:00';
        u_data.endTime = datetime_to_unix(time);
        console.log(u_data);
        ajax_data_up(u_data);
    });
    $('#modal-notice .default').on('click', function () {
        $('#j_img_up').val(null);
        $('#j_img_up').addClass('j_img_up');
    });

    /*** 执行 ******/
    get_activityid();

    //ajax_notice();

    /** 函数 ******/

    function data_success(obj) {
        console.log(obj);
        $('#modal-notice').addClass('hide');
        $('#j_img_up').val(null);
        $('#j_img_up').addClass('j_img_up');
        setTimeout(function () {
            ajax_notice();
        }, 500);


    }

    function datetime_to_unix(datetime) {
        var tmp_datetime = datetime.replace(/:/g, '-');
        tmp_datetime = tmp_datetime.replace(/ /g, '-');
        var arr = tmp_datetime.split("-");
        var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
        return parseInt(now.getTime());
    }


    function img_data(obj) {
        i_data.img_data = obj.data.replace(/(https:)|(http:)/, '');
        $('#j_img_up').removeClass('j_img_up');
        console.log(i_data);
    }


    function notice_show(obj, me) {
        var html = '';
        var context_arr = obj.context || [];
        var context_num = context_arr.length;
        var start_new = Main_data.data.pageNo + context_num;
        Main_data.data.pageNo = start_new;

        if (context_num > 0) {
            for (var i = 0; i < obj.context.length; i++) {
                html += `
          <div class="menu_a" data-beginTime='${obj.context[i].beginTime.split(' ')[0]}' data-endTime='${obj.context[i].endTime.split(' ')[0]}' data-title='${obj.context[i].title}' data-target='${obj.context[i].target}' data-image='${obj.context[i].image}' data-isTop='${obj.context[i].isTop }' data-activityId='${obj.context[i].activityId }' data-announceId='${obj.context[i].announceId }' data-status='${obj.context[i].status }'>
                    <img src="${obj.context[i].image}" alt="sx">
                    <div class="menu_s">
                        <h3>${obj.context[i].title}</h3>
                        <p>${obj.context[i].beginTime.split(' ')[0]}-${obj.context[i].endTime.split(' ')[0]}</p>
                        <button type="button" data-cj="modal" data-target="#modal-notice">编辑</button>
                    </div>
                </div>
            `;
            }
        } else {
            // 锁定
            me.lock();
            // 无数据
            me.noData();
            console.log('锁定');
        }


        $('#notice .menu_b').append(html);

        me.resetload();

        if (Main_data.data.pageNo == 0) {
            $('.dropload-down').hide();
            // 如果start仍为0，说明没有一条数据
            $('#notice').html(`<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/nodata.png" alt="" class="nodata-img">
<div class="nodata-info">暂无数据</div>`);
        }
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(?:&|$)", 'i');
        var str_arr = window.location.search.substr(1).match(reg);
        return str_arr != null ? str_arr[2] : null;
    }

    //获取token
    function get_activityid() {
        g_1499051634.activityid = getQueryString('activityid');
        // Main_data.data.activity_id = g_1499051634.activityid;
    }


    /** ajax ******/
    function ajax_notice() {
        $.ajax({
            url: '/api/v1/acms/GetAnnouncement',
            method: 'GET',
            data: {
                activity_id: 'act-Va2MiqDvZNu0F0pJ',
                //g_1499051634.activityid 
                pageNo: 1,
                pageSize: 1000,
                status: 1
            }

        }).done(function (result) {
            ajaxResHandle(result, notice_show);
        });
    }

    function ajax_img_up(formData) {
        $.ajax({
            url: '/io/upload',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            ajaxResHandle(res, img_data);
        });
    }

    function ajax_data_up(u_data) {
        $.ajax({
            url: '/api/v1/acms/UpdateAnnouncement',
            type: 'POST',
            data: u_data
        }).done(function (res) {
            ajaxResHandle(res, data_success);
        });
    }
})();