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

function updateTest(test) {
  var testE = document.getElementById("test");
  testE.innerHTML = test;
}

function writeTest() {
  var testE = document.getElementById("test").innerHTML;
  var newTest = newTest == "true";
  console.log(newTest);
  firebase.database().ref().set({
    Test: newTest,
  });
}

var getTestRef = firebase.database().ref("Test");

getTestRef.on("value", function (snapshot) {
  updateTest(snapshot.val());
});
