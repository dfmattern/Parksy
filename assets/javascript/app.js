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
  let likedPark = "";
  let allStateCords = [
    "61.370716,-152.404419",
    "34.969704,-92.373123",
    "33.729759,-111.431221",
    "36.116203,-119.681564",
    "39.059811,-105.311104",
    "27.766279,-81.686783",
    "21.094318,-157.498337",
    "39.849426,-86.258278",
    "37.668140,-84.670067",
    "44.693947,-69.381927",
    "43.326618,-84.536095",
    "45.694454,-93.900192",
    "38.456085,-92.288368",
    "46.921925,-110.454353",
    "38.313515,-117.055374",
    "34.840515,-106.248482",
    "47.528912,-99.784012",
    "40.388783,-82.764915",
    "44.572021,-122.070938",
    "33.856892,-80.945007",
    "44.299782,-99.438828",
    "35.747845,-86.692345",
    "31.054487,-97.563461",
    "40.150032,-111.862434",
    "37.769337,-78.169968",
    "47.400902,-121.490494",
    "42.755966,-107.302490"
  ];
  populatePage();

  $("#state").on("change", function() {
    codeNumber = $("#state").val();
    parkNumber = codeNumber.replace(/^\D+/g, "");
    stateCode = codeNumber.replace(/[0-9]/g, "");
    sessionStorage.setItem("stateNumber", parkNumber);
    sessionStorage.setItem("stateCode", stateCode);
    stateCode = sessionStorage.getItem("stateCode");
    window.location = "stateselect.html";
    //console.log(stateCode);
  });

  //like function
  $("#like-btn").on("click", function(event) {
    event.preventDefault();
    likedPark = $("#park-title")
      .val()
      .trim();

    database.ref().set({
      likedPark: likedPark
    });
    //console.log(event);
  });

  //where the webcam gets add to the page
  var webCamNum = allStateCords[sessionStorage.getItem("stateNumber")];
  // console.log(webCamNum);
  var webCam =
    "https://api.windy.com/api/webcams/v2/list/nearby=" +
    webCamNum +
    ",250?key=PZcbLAY0Dop4Gbuyc9g6EHlASwBQW9SJ";

  $.ajax({
    url: webCam,
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    $("#liveWebcam").attr(
      "src",
      "https://webcams.windy.com/webcams/public/embed/player/" +
        response.result.webcams[0].id +
        "/day"
    );
    $("#liveWebcam1").attr(
      "src",
      "https://webcams.windy.com/webcams/public/embed/player/" +
        response.result.webcams[1].id +
        "/day"
    );
    $("#liveWebcam2").attr(
      "src",
      "https://webcams.windy.com/webcams/public/embed/player/" +
        response.result.webcams[2].id +
        "/day"
    );
  });

  function populatePage() {
    //console.log("something");
    $("#state-title").text(stateCode);
    let queryURL =
      "https://developer.nps.gov/api/v1/parks?stateCode=" +
      stateCode +
      "&q=National%20Park&api_key=mmnZ3oHc5B6EBEiihQUWhMb7QOocZRIgj8IploIN";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
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
    });
  }
});
