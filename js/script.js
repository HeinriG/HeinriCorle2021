//Global vars

// RSVP wizard

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
  if(backToTopButton){
    scrollFunction();
  }
  
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

function onInitializeRSVP() {}

function onInitializeAdmin() {
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

var getPartyInvitesForGuest = function (key) {
  return new Promise(function (resolve, reject) {
    var guestRef = firebase.database().ref("Guests/" + key);
    guestRef.on("value", function (snapshot) {
      var guest = snapshot.val();
      guest.key = snapshot.key;
      if (guest) {
        var currentParty = guest.party;
        var partyRef = firebase.database().ref("Guests");
        partyRef.on("value", function (snapshot) {
          var guestsList = [];
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            childData.key = childSnapshot.key;
            guestsList.push(childData);
          });

          var filteredGuests = guestsList.filter((guest) => {
            return guest.party.indexOf(currentParty) >= 0;
          });

          if (filteredGuests) {
            resolve(filteredGuests);
          } else {
            reject(Error("Party members could not be found!"));
          }
        });
      } else {
        reject(Error("Guest could not be found!"));
      }
    });
  });
};

function searchGuestTable() {
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
    if (cells) {
      for (j = 0; j < cells.length; j++) {
        td = cells[j];
        currTextValue = td.textContent || td.innerText;
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

function searchGuestsForInvites() {
  var filter = document.getElementById("input-find-invitation").value;
  console.log(filter);
  var guestListRef = firebase.database().ref("Guests");
  guestListRef.on("value", function (snapshot) {
    var guestsList = [];
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      childData.key = childSnapshot.key;
      guestsList.push(childData);
    });

    var filteredGuests = guestsList.filter((guest) => {
      return guest.firstName.indexOf(filter) >= 0;
    });
    //TODO: Better filter
    console.log(filteredGuests);
    populateInviteListTable(filteredGuests);
    showInviteListStepWindow();
  });
}

function showSearchInviteStepWindow() {
  hideAllStepWindows();
  stepWindow = document.querySelector("div[stepNumber = '0']");
  stepWindow.style.display = "";
}

function showInviteListStepWindow() {
  hideAllStepWindows();
  stepWindow = document.querySelector("div[stepNumber = '1']");
  stepWindow.style.display = "";
}

function showInviteStepWindow() {
  hideAllStepWindows();
  stepWindow = document.querySelector("div[stepNumber = '2']");
  stepWindow.style.display = "";
}

function hideAllStepWindows() {
  stepWindows = document.querySelectorAll("div[stepNumber]");
  stepWindows.forEach((stepWindow) => {
    stepWindow.style.display = "none";
  });
}

function populateInviteListTable(inviteListData) {
  var inviteList = document.getElementById("inviteList");
  inviteList.innerHTML = "";
  inviteListData.forEach((invite) => {
    var guestFullName = invite.firstName + " " + invite.lastName;

    if (guestFullName && !guestFullName.includes("undefined")) {
      var listItem = document.createElement("label");
      listItem.classList.add("list-group-item");

      var listItemInput = document.createElement("input");
      listItemInput.classList.add("form-check-input");

      var attrType = document.createAttribute("type");
      attrType.value = "radio";
      listItemInput.setAttributeNode(attrType.cloneNode(true));

      var attrValue = document.createAttribute("value");
      attrValue.value = invite.key;
      listItemInput.setAttributeNode(attrValue.cloneNode(true));

      var attrName = document.createAttribute("name");
      attrName.value = "invite";
      listItemInput.setAttributeNode(attrName.cloneNode(true));

      listItem.appendChild(listItemInput);

      listItem.innerHTML = listItem.innerHTML + guestFullName;

      inviteList.appendChild(listItem);
    }
  });
}

function searchPartyInvitesForGuest() {
  var inviteListOptions = document.getElementsByName("invite");
  var checkedInviteKey = null;

  inviteListOptions.forEach((inviteOption) => {
    if (inviteOption.checked) {
      checkedInviteKey = inviteOption.value;
      console.log(checkedInviteKey);      
    }
  });
  if (checkedInviteKey) {
    getPartyInvitesForGuest(checkedInviteKey).then((guests) => {
      RSVPList = document.getElementById("RSVPList");
      RSVPList.innerHTML = "";

      guests.forEach((guest) => {
        var guestNameElement = document.createElement("div");
        guestNameElement.classList.add("col-6");
        guestNameElement.classList.add("mx-auto");
        guestNameElement.classList.add("margin-top-s");
        guestNameElement.innerHTML = guest.firstName + " " + guest.lastName;

        RSVPList.appendChild(guestNameElement);

        var RSVPOptionsElement = document.createElement("div");
        RSVPOptionsElement.classList.add("btn-group");
        RSVPOptionsElement.classList.add("btn-group-toggle");
        RSVPOptionsElement.classList.add("margin-top-s");

        var attrDataToggle = document.createAttribute("data-toggle");
        attrDataToggle.value = "buttons";
        RSVPOptionsElement.setAttributeNode(attrDataToggle.cloneNode(true));

        // Decline button
        var labelElementDecline = document.createElement("label");
        labelElementDecline.classList.add("btn");
        labelElementDecline.classList.add("btn-custom-primary-neutral");        

        var inputElementDecline = document.createElement("input");        

        var attrType = document.createAttribute("type");
        attrType.value = "radio";
        inputElementDecline.setAttributeNode(attrType.cloneNode(true));

        var attrValue = document.createAttribute("value");
        attrValue.value = false;
        inputElementDecline.setAttributeNode(attrValue.cloneNode(true));

        var attrName = document.createAttribute("name");
        attrName.value = guest.key;
        inputElementDecline.setAttributeNode(attrName.cloneNode(true));

        var attrAutocomplete = document.createAttribute("autocomplete");
        attrAutocomplete.value = "off";
        inputElementDecline.setAttributeNode(attrAutocomplete.cloneNode(true));

        
        labelElementDecline.appendChild(inputElementDecline);
        labelElementDecline.innerHTML = labelElementDecline.innerHTML + 'Decline';

        RSVPOptionsElement.appendChild(labelElementDecline);

        // Accept button
        var labelElementAccept = document.createElement("label");
        labelElementAccept.classList.add("btn");
        labelElementAccept.classList.add("btn-custom-primary-neutral");        

        var inputElementAccept = document.createElement("input");        

        var attrType = document.createAttribute("type");
        attrType.value = "radio";
        inputElementAccept.setAttributeNode(attrType.cloneNode(true));

        var attrValue = document.createAttribute("value");
        attrValue.value = true;
        inputElementAccept.setAttributeNode(attrValue.cloneNode(true));

        var attrName = document.createAttribute("name");
        attrName.value = guest.key;
        inputElementAccept.setAttributeNode(attrName.cloneNode(true));

        var attrAutocomplete = document.createAttribute("autocomplete");
        attrAutocomplete.value = "off";
        inputElementAccept.setAttributeNode(attrAutocomplete.cloneNode(true));
        
        labelElementAccept.appendChild(inputElementAccept);
        labelElementAccept.innerHTML = labelElementAccept.innerHTML + 'Accept';
        
        RSVPOptionsElement.appendChild(labelElementAccept);
        //Add to rendered element
        RSVPList.appendChild(RSVPOptionsElement);
      });

      
      
      showInviteStepWindow()
    });
  }
  //TODO: Add else here if not found
}
