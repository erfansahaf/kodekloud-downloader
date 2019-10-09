var baseUrl = 'https://kodekloud.com';
var wistiaIframeBaseUrl = 'https://fast.wistia.net/embed/iframe/';
var downloadLinks = [];
var orderIndex = 0;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            downloadFileFromText($(".course-sidebar h2").text().toString() + '.txt', downloadLinks);
        }
    }
);



// Iterate over sidebar list items which are lectures
$('li')
.each(function() {
    if ($(this).find('.fa-youtube-play').length > 0) {
        var url = $(this).attr('data-lecture-url') || null;
        if (url) {
            arrengeDownloadLinks(orderIndex, baseUrl + url);
            orderIndex++;
        }
    }
});

function arrengeDownloadLinks(index, url) {
    getLectureInfo(url, function (id, title) {
        getVideoUrl(wistiaIframeBaseUrl + id, function(url) {
            downloadLinks[index] = title + ": " + url + "\n";
        });
    });
}

function getLectureInfo(page, cb) {
    $.get(page, function(data) {
        var wistiaId = $(data).find('div.attachment-wistia-player').attr('data-wistia-id');
        var videoTitle = $(data).find('#lecture_heading').text().toString().trim();
        
        cb(wistiaId, videoTitle);
    });
}

function getVideoUrl(wistiaPage, cb) {
    $.get(wistiaPage, function(pageSource) {
        var regex = /wistia.com\/deliveries\/(?:[a-zA-Z0-9]+)\.bin/gm;
        var result = regex.exec(pageSource.toString()).toString();
        result = 'http://embed.' + result.replace('bin', 'mp4');
        cb(result);
    });
}


function downloadFileFromText(filename, content) {
    var a = document.createElement('a');
    var blob = new Blob(content, {type : "text/plain;charset=UTF-8"});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click(); //this is probably the key - simulating a click on a download link
    delete a;// we don't need this anymore
}