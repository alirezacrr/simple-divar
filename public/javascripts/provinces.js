function searchHome() {
    var input = document.getElementById("search-home");
    var filter = input.value.toLowerCase();
    var nodes = $('.home-p').find('.province');

    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].innerText.toLowerCase().includes(filter)) {
            nodes[i].style.display = "flex";
        } else {
            nodes[i].style.display = "none";
        }
    }
}
$('.dropdown-province-home').click(function () {
    $('.dropdown-items-home').toggle()
});
window.addEventListener('mouseup',function(e){
    var container = $(".dropdown-items");

    if (!container.is(e.target) && container.has(e.target).length === 0){

        container.fadeOut();

    }
});