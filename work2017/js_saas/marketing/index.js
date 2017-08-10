/**
 * Created by carol on 2017/7/6.
 */
$.ajax({
    type: 'POST',
    url: '/api/v1/data/GetOrg',
    success: function (res) {
        ajaxResHandle(res, getData);
    }
});

function getData(res) {
    $('.data_scan').html(res.context.yScan);
    $('.data_person').html(res.context.yScanUser);
    $('.data_goods').html(res.context.yCode);
    $('.data_visit').html(res.context.yUV);
    $('#userTotal').html(res.context.yUser);
    $('#redBag').html(res.context.yRedpack);
}


var day1 = new Date();
day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
var s1 = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate();


$.ajax({
    type: 'POST',
    url: '/api/v1/data/GetOrgDay',
    data: {
        beginTime: new Date(s1).getTime()
    },
    success: function (res) {
        ajaxResHandle(res, pastTime);
    }
});

function pastTime(res) {
    if (res.code === 1) {
        $('#scanUser .y-person-count').html(res.context.yScan.cnt);
        $('#scanUser .qoq').html(res.context.yScan.hb + '%');
        $('#scanUser .yoy').html(res.context.yScan.tb + '%');

        $('#product .y-person-count').html(res.context.yVerify.cnt);
        $('#product .qoq').html(res.context.yVerify.hb + '%');
        $('#product .yoy').html(res.context.yVerify.tb + '%');

        $('#draw .y-person-count').html(res.context.yDraw.cnt);
        $('#draw .qoq').html(res.context.yDraw.hb + '%');
        $('#draw .yoy').html(res.context.yDraw.tb + '%');

        $('#newUser .y-person-count').html(res.context.yUser.cnt);
        $('#newUser .qoq').html(res.context.yUser.hb + '%');
        $('#newUser .yoy').html(res.context.yUser.tb + '%');

        $('#redBagNum .y-person-count').html(res.context.yRedpack.cnt);
        $('#redBagNum .qoq').html(res.context.yRedpack.hb + '%');
        $('#redBagNum .yoy').html(res.context.yRedpack.tb + '%');
    }
    else {
        $('#scanUser .y-person-count').html('0');
        $('#scanUser .qoq').html('0%');
        $('#scanUser .yoy').html('0%');

        $('#product .y-person-count').html('0');
        $('#product .qoq').html('0%');
        $('#product .yoy').html('0%');

        $('#draw .y-person-count').html('0');
        $('#draw .qoq').html('0%');
        $('#draw .yoy').html('0%');

        $('#newUser .y-person-count').html('0');
        $('#newUser .qoq').html('0%');
        $('#newUser .yoy').html('0%');

        $('#redBagNum .y-person-count').html('0');
        $('#redBagNum .qoq').html('0%');
        $('#redBagNum .yoy').html('0%');
    }
}

/** 正在进行的活动*/
/* 无限滚动 开始 */
let dropLoadObj = {
    dropLoad: {}, // dropload对象
    ajaxObj: {
        url: '/api/v1/acms/GetActivities',
        type: 'GET',
        data: {
            start: 0,
            size: 10,
            actstatus: 2 // 2:正在进行的活动
        }
    },
    // 下拉加载
    dropLoadFn() {
        let that = this;
        this.dropLoad = $('.online-activity').dropload({
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
        let activities = result.context.activities || [];
        let listNum = activities.length;
        that.ajaxObj.data.start += listNum;
        $onlineList = $('.online-activity').find('.online-list');
        if (listNum > 0) {
            for (let i = 0; i < listNum; i++) {
                $onlineList.append(`<li class="online-item clearfix">
<div class="online_img">
					<img src="${activities[i].firstBanner ? activities[i].firstBanner.image : '//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/common/banner-common.png'}">
					</div>
					<div class="online-right">
						<h3 class="online-title">${activities[i].activity && activities[i].activity.name}</h3>
						<div class="progress-content clearfix">
							<div class="progress-bg">
								<div class="progress" style="width:${activities[i].activity.endTime ? (result.systemTime - new Date(activities[i].activity.beginTime).getTime()) / (new Date(activities[i].activity.endTime).getTime() - new Date(activities[i].activity.beginTime).getTime()) * 100 : '0'}%"></div>
							</div>
							<span class="from-time">${activities[i].activity && activities[i].activity.beginTime.split(' ')[0]}</span>
							<span class="end-time">${activities[i].activity && activities[i].activity.endTime.split(' ')[0]}</span>
						</div>
						<div class="btns">
							<a href="/html/acms/project-template-main.html?activityid=${activities[i].activity.activityId}" class="online-btn">查看详情</a>
							<a href="/html/data/data-nav.html?activityid=${activities[i].activity.activityId}" class="online-btn">数据报告</a>
						</div>
					</div>
				</li>`);
            }
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
            $onlineList.html(`<div class="nodata-container">
<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/nodata.png" alt="" class="nodata-img">
<div class="nodata-info">暂无数据</div>
<a href="/html/acms/project-template-list.html" class="nodata-btn_add"><span class="plus">添加</span></a>
</div>`);
        }
    }
};

dropLoadObj.dropLoadFn();
/* 无限滚动 结束 */
