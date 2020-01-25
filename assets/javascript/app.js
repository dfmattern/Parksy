$(document).ready(function() {
  //console.log("ready");

  //Initialize Firebase
  let firebaseConfig = {
    apiKey: "AIzaSyA7jX5P7grrZlBwV0QW49UM6OtH9FnXh34",
    authDomain: "parksy-acb97.firebaseapp.com",
    databaseURL: "https://parksy-acb97.firebaseio.com",
    projectId: "parksy-acb97",
    storageBucket: "parksy-acb97.appspot.com",
    messagingSenderId: "75415393545",
    appId: "1:75415393545:web:4ccbdca33052f72300efd8",
    measurementId: "G-GYSCKSGM5V"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();

  //database reference as variable
  let database = firebase.database();
  let stateCode = sessionStorage.getItem("stateCode");
  let likeCounter = 0;
  let parkName;
  let parkDescription;
  let parkImage;

  $("#state").on("change", function() {
    sessionStorage.setItem("stateCode", $("#state").val());
    stateCode = sessionStorage.getItem("stateCode");
    //console.log(stateCode);
    let queryURL =
      "https://developer.nps.gov/api/v1/parks?stateCode=" +
      stateCode +
      "&q=National%20Park&api_key=mmnZ3oHc5B6EBEiihQUWhMb7QOocZRIgj8IploIN";

    $.ajax({
      url: queryURL,
      method: "GET"
    })
    .done(function(response) {
      console.log(response);
      let results = response.data;
      //console.log(results);
      let randomPark = Math.floor(Math.random() * results.length);
      //console.log(randomPark);
      let featuredPark = results[randomPark];
      //console.log(featuredPark);
      let cardTitle = featuredPark.fullName;
      //console.log(cardTitle);
      let cardText = featuredPark.description;
      //console.log(cardText);

      $(".card-title").empty();
      $(".card-title").text(cardTitle);
      $(".card-text").text(cardText);

      //need to get different parks into each card
      window.location.replace("stateselect.html");

      $(function() {
        $("#mdb-lightbox-ui").load("mdb-addons/mdb-lightbox-ui.html");
      });
    });
  });

  //like function
  $("#like-btn").on("click", function(event) {
    event.preventDefault();
    likeCounter++;
    database.ref().set({
      likeCounter: likeCounter
    });
    //console.log(event);
  });

  //where the webcam gets add to the page
  var webCam =
    "https://api.windy.com/api/webcams/v2/list/limit=50?show=webcams:location,image,player&key=PZcbLAY0Dop4Gbuyc9g6EHlASwBQW9SJ";

  $.ajax({
    url: webCam,
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    var vid = response.result.webcams[0].id;
    $("#liveWebcam").attr(
      "src",
      "https://webcams.windy.com/webcams/public/embed/player/" + vid + "/day"
    );
  });
});
