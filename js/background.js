var $overlay = $("#overlay");
var deleteClick = false; //Used icons "delete" button toggle


//Used to specify default index of the ticks in the "Customisations" lightboxes

var e;
noteNum = 0; //Default notepad index in noteArray

//Array in which the notepads are stored in
noteArray = [];

var noteDelete;
var once;
var enter;


(function() {
  
  

  

  

  //This function checks if string inputted is a valid CSS color (from http://stackoverflow.com/questions/6386090/validating-css-color-names)
  function getColorCSS(c) {
    var ele = document.createElement("div");
    ele.style.color = c;
    return ele.style.color.split(/\s+/).join('').toLowerCase();
  };

  //The above section is devoted to styling when the customisation list items are selected.
  $overlay.click(function() {
    close();
  });

  function storeData() {
    //indexOf does not work for multi-dimensional arrays, had to use a for loop instead
    for (var i = 0; i < noteArray.length; i++) {
      if (noteArray[i][2] === "") { //if Notepad name is empty, it is set to "Blank"
        noteArray[i][2] = "Blank";
        $("#scroll ul li").children("p").html(noteArray[i][2]);
        storeData();
      }
    }
    if (noteArray.length === 0) { //if all the Notepads are deleted, a blank one is created
      noteArray = [
        []
      ];
      noteArray[0][0] = 1;
      noteArray[0][1] = "";
      noteArray[0][2] = "Blank";
      txt.value = "";
      localStorage.setItem("notes", JSON.stringify(noteArray));
      init2();
      $("#scroll ul li").children("p").html(noteArray[0][2]);
    }

    //Stores various pieces of data into localStorage for later use
    localStorage.setItem("noteNum", noteNum);

    //The following 3 lines of code make use of the style DOM object.
    localStorage.setItem("fstyle", txt.style.fontFamily);
    localStorage.setItem("fsize", txt.style.fontSize);
    localStorage.setItem("theme", document.body.style.backgroundColor);

    //Since there is no style fontColor object, I am using an array in its stead.
    localStorage.setItem("fcolor", txt.style.color);
    localStorage.setItem("tick1", tick1);
    localStorage.setItem("tick2", tick2);
    localStorage.setItem("tick3", tick3);
    localStorage.setItem("tick4", tick4);

    $img5.appendTo("#scroll ul li:eq(" + noteNum + ")");
    noteNum = parseInt(localStorage.getItem("noteNum"));
    //The textarea content is saved into noteArray as the content of the current Notepad
    noteArray[noteNum][1] = txt.value;
    //Notepad name is saved into noteArray
    noteArray[noteNum][2] = $("#scroll ul li:eq(" + noteNum + ")").children("p").html();
    //noteArray is saved in localStorage
    localStorage.setItem("notes", JSON.stringify(noteArray));

    var height = parseInt(txt.style.height) - 400;
    if (height < 400) height = 400;
    txt.style.height = height + "px";
  }

  function init() {
    //The following statement is set to run only once, when the extension is first opened.
    if (!Boolean(localStorage.getItem("once"))) {
      once = true;
      localStorage.setItem("once", once);
      storeData();
    }
    $('html').bind('keypress', function(e) {
      if (e.keyCode == 13) {
        if (!enter) {
          enter = true; //Allows the renaming function to occur
        } 
        else if (enter) {
          e.preventDefault();
          enter = false;
          close();
        }
      }
    });
    //localStorage only returns String so noteArray has to be converted into JSON format before being reverted back to an array.
    noteArray = JSON.parse(localStorage.getItem("notes"));
    //"Plus" button functionality
    $("#plus").click(function() {
      //Pushes blank notepad details into the last row of the array.
      noteArray.push([parseInt(noteArray[noteArray.length - 1]) + 1, "", "Blank"]);
      //Adds new notepad item into "Organisation" lightbox
      $("#scroll ul").append("<li id='" + noteArray[noteArray.length - 1][0] + "'><p>" + noteArray[noteArray.length - 1][2] + "</p></li>");
    });
    $("#delete").click(function() { //When "delete" button is clicked
      deleteClick = true;
      //Notepad items turn red to indicate that the "delete" function is active
      $("#scroll ul li").css("color", "#FF0000");
    });
    $("#scroll ul").on("click", "li", function() { //Click event handler is attached to Notepad item
      e = this;
      var $liID = $(this).attr("id"); //each Notepad's ID is stored in the first column of noteArray
      if (deleteClick) { //If delete function is enabled
        deleteClick = false;
        $(this).remove(); //Notepad item removed from DOM
        $("#scroll ul li").css("color", "#bfbfbf"); //Notepad names are reverted back to their original color
        //indexOf() does not work for multi-dimensional array.
        for (var i2 = 0; i2 < noteArray.length; i2++) {
          if (noteArray[i2][0] == $liID) {
            noteDelete = i2; //noteDelete is equal to the noteArray index of the selected Notepad
            break;
          }
        }
        noteArray.splice(noteDelete, 1); //The row of the selected notepad is removed from noteArray
        if (noteDelete < noteNum) { //If the deleted notepad is situated before the one that is in use (in terms of array index)
          noteNum--;
        } else if (noteNum == noteDelete && noteArray.length !== 0) { //If the deleted notepad is the one that is in use
          noteNum = 0;
          txt.value = noteArray[0][1];
          $img5.appendTo("#scroll ul li:eq(" + noteNum + ")");
        }
        storeData();
      } else {
        for (var i = 0; i < noteArray.length; i++) { //indexOf does not work for multi-dimensional arrays
          if (noteArray[i][0] == $liID) {
            noteNum = i; //noteNum is equal to the index of the array that is in use
            $img5.appendTo("#scroll ul li:eq(" + noteNum + ")"); //Tick image is added beside the selectd notepad
            localStorage.setItem("noteNum", noteNum);
            txt.value = noteArray[noteNum][1]; //value of textarea is set to the content of the current notepad
          }
        }
        if (!enter && !deleteClick) { //If delete and enter button were not clicked
          close();
        }
        if (enter) { //If enter button was clicked
          $(this).children("p").attr("contenteditable", "true");
          storeData();
        }
      }
    });

    //Main initiation block
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

  //Most of the code content below was taken from other sources
  //"Download" button functionality
  $("#download").click(function() {
    var savedText = txt.value;
    var textBlob = new Blob([savedText], { type: 'text/plain; charset=UTF-8' });
    var downloadLink = document.createElement("a");
    var fileName = "NOTE_HERE.txt"; // Change "custom_filename.txt" to your desired filename
    downloadLink.download = fileName; // Set the filename here
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