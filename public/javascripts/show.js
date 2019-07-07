function modal(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
}
function bookmark(id) {
    $.post('/users/bookmark',{id:id} ,function (data) {
        if (data['status']){
            $('.bookmark').text('نشان شده');

            $('.bookmark').addClass('marked');
        }
        else {

            $('.bookmark').text('نشان کردن');
            $('.bookmark').removeClass('marked');

        }
    });

}
$('.btn-tool-red').click(function () {
    $( ".content" ).slideDown( "slow" );
    $( ".btn-tool-red" ).attr( "disabled" , true );
});

// COPY TEXT
function copyText(textSelector) {
    const textToCopy = document.querySelector(textSelector);
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(textToCopy);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    // Custom feedback
    // alert('Text copied: ' + textToCopy.textContent);
    $(".post-link").mouseout(function(){
        $(".post-link").attr('tooltip' , 'کپی لینک')

    });
    $(".post-link").attr('tooltip' , 'کپی شد!')

}

// USAGE
document.querySelector('.post-link').addEventListener('click', function() {
    copyText('.post-link-link');
});
