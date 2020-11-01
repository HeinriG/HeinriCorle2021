$(".carousel.slide .carousel-item").each(function () {
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(":first");
  }
  next.children(":first-child").clone().appendTo($(this));

  for (var i = 0; i < 1; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(":first");
    }
    next.children(":first-child").clone().appendTo($(this));
  }
});

//Get the button:
backToTopButton = document.getElementById("backToTopButton");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopButton.style.display = "inline-flex";
    backToTopButton.style.webkitDisplay = "inline-flex";
  } else {
    backToTopButton.style.display = "none";
    backToTopButton.style.webkitDisplay = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function onInitialize() {
  var guestListRef = firebase.database().ref("Guests");
  getGuestRefData(guestListRef);
}

function getGuestRefData(ref) {
  ref.on("value", function (snapshot) {
    var guestData = [];
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      childData.key = childSnapshot.key;
      guestData.push(childData);
    });
    populateGuestList(guestData);
  });
}

function createCell(cellText) {
  var cell = document.createElement("td");
  if (cellText && !cellText.includes("undefined")) {
    cell.innerHTML = cellText;
  }
  return cell;
}

function fillGuestInfoForm(guestKey) {
  getGuest(guestKey).then((guest) => {
    var properties = [
      "key",
      "firstName",
      "lastName",
      "party",
      "phone",
      "email",
      "rsvpResponse",
      "rsvpNote",
      "thankYouSent",
      "group",
    ];

    for (var prop in properties) {
      var currProp = properties[prop];
      if (guest[currProp]) {
        document.getElementById("input-" + currProp).value = guest[currProp];
      } else {
        document.getElementById("input-" + currProp).value = "";
      }
    }
  });
}

function populateGuestList(guestList) {
  console.log(guestList);
  var guestListTableBody = document.getElementById("guest-list-table-body");
  guestListTableBody.innerHTML = "";

  var attrDataToggle = document.createAttribute("data-toggle");
  var attrDataTarget = document.createAttribute("data-target");
  var attrDataKey = document.createAttribute("data-key");
  attrDataToggle.value = "modal";
  attrDataTarget.value = "#guest-info-modal";

  for (var guest in guestList) {
    if (guestList.hasOwnProperty(guest)) {
      var row = document.createElement("tr");
      var currGuest = guestList[guest];
      attrDataKey.value = currGuest.key;
      row.setAttributeNode(attrDataToggle.cloneNode(true));
      row.setAttributeNode(attrDataTarget.cloneNode(true));
      row.setAttributeNode(attrDataKey.cloneNode(true));

      row.addEventListener("click", function () {
        fillGuestInfoForm(this.getAttribute("data-key"));
      });
      row.appendChild(createCell(guest));
      row.appendChild(
        createCell(currGuest["firstName"] + " " + currGuest["lastName"])
      );
      row.appendChild(createCell(currGuest["party"]));
      row.appendChild(
        createCell(currGuest["phone"] + " " + currGuest["email"])
      );
      row.appendChild(createCell(currGuest["rsvpResponse"]));
      row.appendChild(createCell(currGuest["rsvpNote"]));
      row.appendChild(createCell(currGuest["thankYouSent"]));
      row.appendChild(createCell(currGuest["group"]));

      guestListTableBody.appendChild(row);
    }
  }
}

var getGuest = function (key) {
  return new Promise(function (resolve, reject) {
    var guestRef = firebase.database().ref("Guests/" + key);
    guestRef.on("value", function (snapshot) {
      var guest = snapshot.val();
      guest.key = snapshot.key;
      if (guest) {
        resolve(guest);
      } else {
        reject(Error("Guest could not be found!"));
      }
    });
  });
};

function searchGuests() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("guest-list-search-input");
  filter = input.value.toUpperCase();
  table = document.querySelector("#guest-list-table table");
  tr = table.getElementsByTagName("tr");
  textValue = "";
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    cells = tr[i].getElementsByTagName("td");
    textValue = "";
    if (cells){      
      for (j = 0; j < cells.length; j++) {
        td = cells[j]
        currTextValue = td.textContent || td.innerText
        textValue += currTextValue;
      }
      if (textValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";        
      } else {
        tr[i].style.display = "none";
      }
    }      
    
  }
}

function createOrUpdateGuest() {
  var properties = [
    "key",
    "firstName",
    "lastName",
    "party",
    "phone",
    "email",
    "rsvpResponse",
    "rsvpNote",
    "thankYouSent",
    "group",
  ];

  var guestData = {};

  for (var prop in properties) {
    var currProp = properties[prop];
    guestData[currProp] = document.getElementById("input-" + currProp).value;
  }

  firebase
    .database()
    .ref("Guests/" + guestData.key)
    .update(guestData);

  var guestListRef = firebase.database().ref("Guests");

  getGuestRefData(guestListRef);
}
