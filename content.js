const baseUrl = "https://kodekloud.com";
const wistiaIframeBaseUrl = "https://fast.wistia.net/embed/iframe/";
const getNumber = (index) => (index < 10 ? "0" + index : index.toString());

const countVideos = $("li.section-item .fa-youtube-play").length;
let courseLinks = [];
let countVideoParsed = 0;
let parseCompleted = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    if (!parseCompleted) {
      // console.log("Not completed yet. Please try again later.");
      createAlert("Not completed yet. Please try again later!");
      return;
    }

    const htmlContent = createHtmlForDownload();
    downloadFileFromText($(".course-sidebar h2").text().toString() + ".html", htmlContent);
  }
});

// Look for lesson item [li with section item]
$(".course-sidebar")
  .find("li.section-item")
  .each(function (index, el) {
    // console.log("#", index, el);
    let self = $(this);
    let courseSection = self.parents(".course-section");
    let sectionTitle = $(courseSection).find(".section-title").text().trim();
    let lectureName = self.find(".lecture-name").text().trim();
    let lectureTitle = lectureName.replace(/(\r\n|\n|\r)/gm, "").replace(/(\s{2,})/gm, "");
    let number = getNumber(index + 1);

    let fullTitle = `${number}~${sectionTitle}~${lectureTitle}`;

    let lecture = {
      id: number,
      section: sectionTitle,
      name: "",
      title: lectureTitle,
      fullTitle: fullTitle,
      url: "",
    };

    //console.log(lecture);
    if ($(this).find(".fa-youtube-play").length > 0) {
      var url = $(this).attr("data-lecture-url") || null;
      if (url) {
        // console.log("--> get download link", number);
        arrangeDownloadLinks(number, baseUrl + url);
      }
    }

    courseLinks.push(lecture);
  });

// Add and find video lecture item into List of All lectures
function addLectureToList(id, videoName, lectureUrl) {
  let item = courseLinks.find((item) => item.id === id);
  item.url = lectureUrl;
  item.name = videoName;
  countVideoParsed++;
  //console.log(countVideoParsed, lectureUrl);

  if (countVideoParsed === countVideos) {
    console.log("Parsing completed. Total videos: ", countVideos);
    createAlert(`Parsing completed. Total videos: ${countVideos}`);
    parseCompleted = true;
  }
}

function arrangeDownloadLinks(index, url) {
  getLectureInfo(url, function (id, title) {
    getVideoUrl(wistiaIframeBaseUrl + id, function (url) {
      const lessonItemUrl = `<a href="${url}" title="${title}">${index} ${title}</a><br/>` + "\r\n";
      //console.log("--->", index, lessonItem);
      addLectureToList(index, title, lessonItemUrl);
    });
  });
}

function getLectureInfo(page, cb) {
  $.get(page, function (data) {
    var wistiaId = $(data).find("div.attachment-wistia-player").attr("data-wistia-id");
    var videoTitle = $(data).find("#lecture_heading").text().toString().trim();

    cb(wistiaId, videoTitle);
  });
}

function getVideoUrl(wistiaPage, cb) {
  $.get(wistiaPage, function (pageSource) {
    var regex = /wistia.com\/deliveries\/(?:[a-zA-Z0-9]+)\.bin/gm;
    var result = regex.exec(pageSource.toString()).toString();
    result = "http://embed." + result.replace("bin", "mp4");
    cb(result);
  });
}

function createHtmlForDownload() {
  let htmlContent = `<!doctype html> <html lang="en"><head> <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
      </head><body>
      <div class="container">
      <table class='table table-striped table-bordered'>
      <thead><td>No</td><td>Section</td><td>Name</td><td>Title</td><td>Video link</td></thead>
      <tbody>`;
  courseLinks.forEach((item) => {
    let row = `<tr><td>${item.id}</td><td>${item.section}</td><td>${item.title}</td><td>${item.fullTitle}</td><td>${item.url}</td></tr>\r\n`;
    htmlContent += row;
  });
  htmlContent += `</tbody></table></div></body></html>`;

  return htmlContent;
}

function createAlert(message) {
  const alertDiv =
    `<div class='message' 
              style='position: absolute; top: 10px; right: 10px; z-index: 5000; 
                  padding: 10px; width: 400px; min-height: 50px; height: 50px;
                  color: #fff; background-color: #1e90ff'>` +
    message +
    `<div style='cursor: pointer; float:right; margin-right: 10px' class='close-alert'>&#10005;</div>
      </div>
      <script>
        $("body").on("click", ".close-alert", function(e) {
          $(".message").remove();
          e.preventDefault();
        });
      </script>
      `;

  $(".message").remove();
  $("body").prepend(alertDiv);
}

function downloadFileFromText(filename, content) {
  var a = document.createElement("a");
  //var blob = new Blob(content, {type : "text/plain;charset=UTF-8"});

  const dataBytes = new TextEncoder().encode(content);
  const blob = new Blob([dataBytes], {
    type: "text/plain;charset=utf-8", // "application/json;charset=utf-8"
  });

  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click(); //this is probably the key - simulating a click on a download link
  delete a; // we don't need this anymore
}
