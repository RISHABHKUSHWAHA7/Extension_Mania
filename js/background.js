var $overlay = $("#overlay");
var deleteClick = false; 
var e;
noteNum = 0; 
noteArray = [];
var noteDelete;
var once;
var enter;
(function() {
    $overlay.click(function() {
    close();
  });
  function init() {
    if (!Boolean(localStorage.getItem("once"))) {
      once = true;
      localStorage.setItem("once", once);
      storeData();
    }
 
    noteArray = JSON.parse(localStorage.getItem("notes"));
    noteNum = parseInt(localStorage.getItem("noteNum"));
    txt.value = noteArray[noteNum][1];

  }

  function init2() {
    for (num = 0; noteArray !== null && noteArray.length > 0 && num < noteArray.length; num++) {
      $("#scroll ul").append("<li id='" + noteArray[num][0] + "'><p></p></li>");
      $("#scroll ul li:eq(" + num + ")").children("p").html(noteArray[num][2]);
    }
    tick5 = localStorage.getItem("tick5");
    $img5.appendTo("#scroll ul li:eq(" + noteNum + ")");
    txt.onkeyup = storeData;
    storeData();
  }

  //"Download" button functionality
  $("#download").click(function() {
    var savedText = txt.value;
    var textBlob = new Blob([savedText], { type: 'text/plain; charset=UTF-8' });
    var downloadLink = document.createElement("a");
    var fileName = "NOTE_HERE.txt"; 
    downloadLink.download = fileName;
    downloadLink.innerHTML = "HiddenLink";
    window.URL = window.URL || window.webkitURL;
    downloadLink.href = window.URL.createObjectURL(textBlob);
    downloadLink.onclick = destroyLink;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  });
  

  function close() {
    $(".lightbox").hide(400);
    $("#overlay").hide();
    if (e !== null) {
      $(e).children("p").attr("contenteditable", "false");
    }
    enter = false;
    storeData();
  }

  function destroyLink(event) {
    document.body.removeChild(event.target);
  }
  init();
  init2();
}());
