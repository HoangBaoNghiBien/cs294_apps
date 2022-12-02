// Register PWA
// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function () {
//         navigator.serviceWorker
//             .register("./sw.js")
//             .then(res => console.log("service worker registered"))
//             .catch(err => console.log("service worker not registered", err))
//     })
// }

// Create database access
const database = new MyNotesDB();

// Navigation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
const banner = new mdc.banner.MDCBanner(document.querySelector('.mdc-banner'));

// Navigation Drawer
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  drawer.open = false;
});

document.querySelector(".mdc-top-app-bar__navigation-icon").addEventListener('click', () => {
  drawer.open = true;
})

// Main List
const list = new mdc.list.MDCList(document.querySelector('.mdc-list'));

// Update Note Dialog
const updateDialog = new mdc.dialog.MDCDialog(document.querySelector('.updateDialog'));
const updateTextField = new mdc.textField.MDCTextField(document.querySelector('#updateText'));
const updateTitleField = new mdc.textField.MDCTextField(document.querySelector('#updateTitle'));
const updateTypeField = new mdc.textField.MDCTextField(document.querySelector('#updateType'));

let updateId = -1;
let updateImage = "";

document.querySelector("#editBtn").addEventListener("click", () => {
  const newNoteInput = document.querySelector("#editDes");
  const newNoteInputTitle = document.querySelector("#editTitle");
  const newNoteInputType = document.querySelector("#editType");
  const text = newNoteInput.value;
  const title = newNoteInputTitle.value;
  const type = newNoteInputType.value;

  newNoteInput.value = "";
  newNoteInputTitle.value = "";
  newNoteInputType.value = "";
  database.updateNote(updateId, type, title, text, updateImage);

  // Re-render all notes to show updated note
  getListOfNotes().then(() => renderNotes());
  banner.close();
})

// Render all notes onto page
let notes = [];
async function renderNotes() {
  // Reset notes list content
  const notesList = document.querySelector("#notes");
  notesList.innerHTML = "";

  notes.forEach((note) => {
    const itemRipple = document.createElement("span");
    itemRipple.classList.add("mdc-list-item__ripple");

    const itemTitle = document.createElement("span");
    itemTitle.classList.add("mdc-list-item__primary-text");
    itemTitle.innerHTML = note.title;

    const itemText = document.createElement("span");
    itemText.classList.add("mdc-list-item__secondary-text");
    itemText.innerHTML = note.text;

    const itemType = document.createElement("span");
    itemType.classList.add("mdc-list-item__secondary-text");
    // itemType.setAttribute("id", "testType");
    // set border color
    if (note.type == "Work" || note.type == "work") {
      itemType.style.color = "#FF0000";
    } else if (note.type == "School" || note.type == "Study" || note.type == "school" || note.type == "study") {
      itemType.style.color = "#FFA500";
    } else if (note.type == "Personal" || note.type == "personal") {
      itemType.style.color = "#008000";
    } else {
      itemType.style.color = "#00b4d8";
    }
    itemType.innerHTML = note.type;


    const itemLink = document.createElement("span");
    itemLink.classList.add("mdc-fab__icon");
    itemLink.classList.add("material-icons");
    itemLink.innerHTML = "image";
    itemLink.style.fontSize = "14px";
    itemLink.style.marginRight = "5px";

    const tex = document.createElement("span");
    tex.classList.add("mdc-list-item__text");
    tex.appendChild(itemLink);
    tex.appendChild(itemTitle);
    tex.appendChild(itemType);
    tex.appendChild(itemText);

    const itemTemplate = document.createElement("li");
    itemTemplate.classList.add("mdc-list-item")
    itemTemplate.tabIndex = 0;
    itemTemplate.appendChild(itemRipple);
    itemTemplate.appendChild(tex);


    itemTemplate.addEventListener("click", () => {
      updateDialog.open();
      document.querySelector("#editDes").value = note.text;
      document.querySelector("#editTitle").value = note.title;
      document.querySelector("#editType").value = note.type;
      document.querySelector("#updateText").focus();
      document.querySelector("#updateTitle").focus();
      document.querySelector("#updateType").focus();
      document.querySelector("#showImage").src = note.image;
      updateImage = note.image;
      updateId = note.id;
    });

    notesList.appendChild(itemTemplate);
  });
}

const getListOfNotes = async () => {
  notes = await database.getListOfNotes();
  console.log(notes)
}

getListOfNotes().then(() => renderNotes());

// Add Note Dialog
const dialog = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));
const textField = new mdc.textField.MDCTextField(document.querySelector('#text'));
const titleField = new mdc.textField.MDCTextField(document.querySelector('#title'));
const typeField = new mdc.textField.MDCTextField(document.querySelector('#type'));

document.querySelector("#openAddModal").addEventListener("click", () => {
  dialog.open();
  document.querySelector("#showImageNewDialog").src = "";
  updateImage = "";
});

document.querySelector("#saveBtn").addEventListener("click", () => {
  const newNoteInput = document.querySelector("#newNoteText");
  const newNoteInputTitle = document.querySelector("#newNoteTitle");
  const newNoteInputType = document.querySelector("#newNoteType");
  const text = newNoteInput.value;
  const title = newNoteInputTitle.value;
  const type = newNoteInputType.value;

  newNoteInput.value = "";
  newNoteInputTitle.value = "";
  newNoteInputType.value = "";
  database.createNote(type, title, text, updateImage);

  // Re-render all notes to show new note
  getListOfNotes().then(() => renderNotes());
  banner.close();
})

// Delete Note in database when delete-button is clicked
document.querySelector("#deleteBtn").addEventListener("click", () => {
  database.deleteNote(updateId);

  // Re-render all notes to show updated note
  getListOfNotes().then(() => renderNotes());
  banner.close();
})

// Search Notes Dialog
const searchDialog = new mdc.dialog.MDCDialog(document.querySelector('.searchDialog'));
const queryField = new mdc.textField.MDCTextField(document.querySelector('#query'));

// Display search dialog when search button is clicked
document.querySelector("#openSearchModal").addEventListener("click", () => {
  searchDialog.open();
});

const filterNotes = async (val) => {
  notes = await database.searchNotes(val);
}

document.querySelector("#searchBtn").addEventListener("click", () => {
  const searchInput = document.querySelector("#searchNoteText");

  filterNotes(searchInput.value).then(() => renderNotes());
  searchInput.value = "";
  banner.open();
});


document.querySelector("#removeFilter").addEventListener("click", () => {
  // Re-render with all notes
  getListOfNotes().then(() => renderNotes());
  banner.close();
});

function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    updateImage = reader.result;
    document.querySelector("#showImageNewDialog").src = reader.result;
    document.querySelector("#showImage").src = reader.result;
  }
  reader.readAsDataURL(file);
}

// Begin capturing video
const width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

let streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

let video = null;
let canvas = null;
let photo = null;
let startbutton = null;
let updatePhoto = null;

function startup() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  photo = document.getElementById("showImageNewDialog");
  updatePhoto = document.getElementById("showImage");
  startbutton = document.getElementById("startbutton");
  updatebutton = document.getElementById("updatebutton");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });

  video.addEventListener(
    "canplay",
    (ev) => {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    false
  );

  startbutton.addEventListener(
    "click",
    (ev) => {
      takepicture();
      ev.preventDefault();
    },
    false
  );

  updatebutton.addEventListener(
    "click",
    (ev) => {
      takepicture();
      ev.preventDefault();
    },
    false
  );

  clearphoto();
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
  updatePhoto.setAttribute("src", data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takepicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
    updatePhoto.setAttribute("src", data);
    updateImage = data;
  } else {
    clearphoto();
  }
}



// BUDGET TRACKER

// Display Budget Tracker 
// const budgetTracker = new mdc.dialog.MDCDialog(document.querySelector('.main2'));
// // set budgetTracker is invisible
// budgetTracker.close();
// document.querySelector("#openBudgetTracker").addEventListener("click", () => {
//     budgetTracker.open();
// });



// Set up our event listener to run the startup process
// once loading is complete.
window.addEventListener("load", startup, false);