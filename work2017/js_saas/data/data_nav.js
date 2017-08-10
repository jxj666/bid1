/**
 * Created by carol on 2017/6/27.
 */
var activity_id = $.getSingleParam('activityid');

if (activity_id) {
    $('.query_box').hide();
    $('#scan_url').attr('href', '/html/data/scan-data.html?activity_id=' + activity_id);
    $('#user_url').attr('href', '/html/data/user-data.html?activity_id=' + activity_id);
    $('#prize_url').attr('href', '/html/data/prize-data.html?activity_id=' + activity_id);

}
else {
    $.ajax({
        type: 'GET',
        url: '/api/v1/acms/GetActivities?start=0&size=1000&actstatus=1',
        success: function (res) {
            ajaxResHandle(res, getList);
        }
    });

    function getList(res) {
        var html = '';
        var list = res.context.activities;
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                html += '<option value="' + list[i].activity.activityId + '">' + list[i].activity.name + '</option>'
            }

            $('.query_box select').html(html);

            activity_id = $('.query_box select').find('option:selected').val();
            $('#scan_url').attr('href', '/html/data/scan-data.html?activity_id=' + activity_id);
            $('#user_url').attr('href', '/html/data/user-data.html?activity_id=' + activity_id);
            $('#prize_url').attr('href', '/html/data/prize-data.html?activity_id=' + activity_id);

            $('.query_box select').change(function () {
                activity_id = $(this).find('option:selected').val();
                $('#scan_url').attr('href', '/html/data/scan-data.html?activity_id=' + activity_id);
                $('#user_url').attr('href', '/html/data/user-data.html?activity_id=' + activity_id);
                $('#prize_url').attr('href', '/html/data/prize-data.html?activity_id=' + activity_id);

            });
        }
        else {
            $('#modal').removeClass('hide');
        }
    }
}
// 跳转效果
$('.nav-list>li>a').click(function (e) {
    e.preventDefault();
    $.when($(this).addClass('focus')).done(() => {
        location.href = $(this).attr('href');
    });
});

