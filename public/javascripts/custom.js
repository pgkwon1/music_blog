$(document).ready(function() {

    $('.play').click(function() {
        let youtube_link = $(this).attr("data-youtube")
        let index = $(this).attr("data-index")
        let result = changeIframe(youtube_link, index)
        $('.play_frame').on("load",function() {
            $(".play_frame")[index].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
        })
    })
    function changeIframe(url, index) {
        $(".play_frame:eq("+index+")").attr("src", "https://www.youtube.com/embed/"+url+"?enablejsapi=1&version=3&playerapiid=ytplayer&modestbranding=1&controls=0&showinfo=0")
        return true
    }
})