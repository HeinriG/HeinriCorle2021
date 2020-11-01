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

function createCell(cellText){
      var cell = document.createElement("td");      
      if(cellText && !cellText.includes('undefined')){
        cell.innerHTML = cellText;
      }      
      return cell;
}

function fillGuestInfoForm(guest){

  console.log(guest)

  var properties = [
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
    document.getElementById("input-"+currProp).value = guest[currProp]
  }  
}

function populateGuestList(guestList) {
  console.log(guestList);
  var guestListTableBody = document.getElementById("guest-list-table-body"); 
  
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

      row.addEventListener("click", function(){
        fillGuestInfoForm(this.getAttribute("data-key"));
      }); 

      row.appendChild(createCell(guest + 1));
      row.appendChild(createCell(currGuest["firstName"] + " " + currGuest["lastName"]));
      row.appendChild(createCell(currGuest["party"]));
      row.appendChild(createCell(currGuest["phone"] + " " + currGuest["email"]));      
      row.appendChild(createCell(currGuest["rsvpResponse"]));
      row.appendChild(createCell(currGuest["rsvpNote"]));
      row.appendChild(createCell(currGuest["thankYouSent"]));
      row.appendChild(createCell(currGuest["group"]));
     
      guestListTableBody.appendChild(row);
    }
  }
}



var guestList = firebase.database().ref("Guests");

guestList.on("value", function (snapshot) {
  var guestData = [];
  snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    childData.key = childSnapshot.key;
    guestData.push(childData)    
  });
  populateGuestList(guestData);
});

function updateGuest() {   
  guestList.set({
    Test: newTest,
  });
}
