$('.switch div').on('click', function(e) {
    $this = $(this);
    $('.switch div').removeClass('active');
    $this.addClass('active');
    if ($('.switch .text').hasClass('active')) {
        $('.text_main').show();
        $('.talk_main').hide();
    } else {
        $('.text_main').hide();
        $('.talk_main').show();
    }
})
$('.talk_list').on('click', '.review_button', function(e) {
    $this = $(this);

    $this.closest('.talk_right').children(".talk_2").show();
})

$('.talk_list').on('click', '.talk_2_btn', function(e) {
    $this = $(this);

    $this.closest(".talk_2").hide();
})
var arr_img = [];

function img_font() {
    $('.talk_left img').each(function() {
        var key = $(this).attr('src');
        if (key) {
            arr_img.push(key);
        } else {
        	var $talk_cell = $(this).closest('.talk_cell ').find('h6');
        	console.log($talk_cell)
        	var str=$talk_cell.text();

        	console.log(str);
        	var html_str='<div>'+str[0]+'</div>';
        	$(this).closest('.talk_left').html(html_str);
        }
    })

}
img_font();