var num = 0;
$('#more').click(function(){
    data();
});

function data() {
    $('.load').css('display' , 'block');
    $('#more').css('display' , 'none');

    $.ajax({
        type: 'post',
        data: {_page:num},
        url: '' + window.location.href ,
        success: function(result ) {
            $('.AD').append(result);
            $('.load').css('display' , 'none');
            if (num != all){
                $('#more').css('display' , 'block');
            }
            if (all === 0){
                $('#more').css('display' , 'none');
            }
        }
    });
    num = num+1;

}
var header = document.getElementsByClassName("box-category");
var btns = document.getElementsByClassName("category");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}
data();