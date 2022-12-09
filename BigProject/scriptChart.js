const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
listEl.addEventListener('click', (event) => {
  drawer.open = false;
});

document.querySelector(".mdc-top-app-bar__navigation-icon").addEventListener('click', () => {
  drawer.open = true;
})

let chartController = (() => {
  let notes = [];
  let total = 0,
    work = 0,
    school = 0,
    personal = 0,
    other = 0;
  // open dexie databas
  const request = window.indexedDB.open("MyNotesDB");
  request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
  }
  request.onsuccess = (event) => {
    db = event.target.result;
    db.transaction("notes").objectStore("notes").getAll().onsuccess = (event) => {
      notes = event.target.result;
      notes.forEach((note) => {
        total++;
        s = note.type;
        console.log(s)
        switch (s) {
          case "Work":
            work++;
            break;
          case "School":
            school++;
            break;
          case "Personal":
            personal++;
            break;
          default:
            other++;
            break;
        }
      });
      console.log(total, work, school, personal, other);
      let chart = new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
          labels: ["Work", "School", "Personal", "Other"],
          datasets: [{
            data: [work, school, personal, other],
            backgroundColor: ["#FF0000", "#FFA500", "#008000", "#00b4d8"],
            label: "Notes"
          }]
        },
        // insert label on pie chart
        options: {
          responsive: true,
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Notes by Type'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      })
    }
  }



});
chartController();


