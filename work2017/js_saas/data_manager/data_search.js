//通用全局数据
var cg_data = {};
cg_data.start = 'ok';
(function() {
    //内部全局数据
    var ig_data = {};
    ig_data.start = 'ok';
    console.log(cg_data.start, ig_data.start);
    $('.m_record').hide();
    $('.m_scan').show();
    $('.m_switch').on('click', '.switch_c', function(e) {
        var $t = $(e.target);
        var selector = '.' + $t.attr('data-click');
        if ($t.hasClass('j_switch_active')) {
            return;
        } else {
            $('.switch_c').removeClass('j_switch_active');
            $t.addClass('j_switch_active');
            $('.m_record').hide();
            $(selector).show();
        }
    });
    $('.m_scan').on('click','.scan_a',function(e){
    	var $t = $(e.target);
    	var $t_p=$t.closest('.scan_a');
    	$t_p.toggleClass('j_scan_open');
    });

}());
