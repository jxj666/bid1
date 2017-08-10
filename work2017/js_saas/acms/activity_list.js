/**
 * @file 活动列表
 * @author 韩原
 */
// 记录ajax请求前的tab,防止ajax取回结果后，当前tab已经不是ajax请求前的tab
/* 导航栏被点击时 开始 */
$('[data-cj=tab]').click(function (e) {
    e.preventDefault(); // 阻止a标签的默认行为
    if (!$(this).hasClass('active')) {
        $(this).closest('.nav').find('[data-cj=tab]').removeClass('active');
        $(this).addClass('active');
        let target = $(this).attr('href') || $(this).data('target');
        $(target).closest('.tab-content').find('.tab-pane.active').removeClass('active in').scrollTop(0);
        $(target).addClass('active in');
        dropLoadObj.ajaxObj.data.actstatus = $(this).data('actstatus');
        dropLoadObj.ajaxObj.data.start = $(target).data('start') - 0 || 0;
        dropLoadObj.dropLoadInit();
    }
});
/* 导航栏被点击时 结束 */

/* 无限滚动 开始 */
let dropLoadObj = {
    dropLoad: {}, // dropload对象
    ajaxObj: {
        url: '/api/v1/acms/GetActivities',
        type: 'GET',
        data: {
            start: 0,
            size: 10,
            actstatus: 1
        }
    },
    // 下拉加载
    dropLoadFn() {
        let that = this;
        this.dropLoad = $('.tab-content').dropload({
            scrollArea: window,
            autoLoad: true,
            distance: 10, // 拉动距离
            loadDownFn(me) {
                $.ajax(that.ajaxObj).done(function (result) {
                    ajaxResHandle(result, that.render, [me, that]);
                }).fail(function () {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                    // 即使加载出错，也得重置
                    me.resetload();
                    $('.dropload-noData').html('<div class="dropload-error">加载出错<br>点我重试</div>');
                    $('.dropload-error').off().click(() => {
                        dropLoad.noData(false);
                        dropLoad.unlock();
                        dropLoad.resetload();
                    });
                });
            }
        });
    },
    dropLoadInit() {
        this.ajaxObj.data.size = 10;
        $('.dropload-down').show();
        this.dropLoad.noData(false);
        this.dropLoad.unlock();
        this.dropLoad.resetload();
    },
    render(result, me, that) {
        let listArray = result.context.activities || [];
        let listNum = listArray.length;
        that.ajaxObj.data.start += listNum;
        let tabTarget = '#tab-' + result.context.actstatus;
        $(tabTarget).closest('.tab-pane').data('start', that.ajaxObj.data.start);
        if (listNum > 0) {
            $(tabTarget).find('.goods-list').append(tmpl('template_list', {activities: listArray}));
        }
        else {
            // 锁定
            me.lock();
            // 无数据
            me.noData();
        }
        // 每次数据插入，必须重置
        me.resetload();

        if (that.ajaxObj.data.start === 0) {
            $('.dropload-down').hide();
            // 如果start仍为0，说明没有一条数据
            $(tabTarget).find('.goods-list').html(`<div class="nodata-container">
<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/nodata.png" alt="" class="nodata-img">
<div class="nodata-info">暂无数据</div>
<a href="/html/acms/project-template-list.html" class="nodata-btn_add"><span class="plus">添加</span></a>
                </div>`);
            if (result.context.actstatus === 3) {
                $('.nodata-btn_add').hide();
            }
        }
    }
};

dropLoadObj.dropLoadFn();
/* 无限滚动 结束 */
