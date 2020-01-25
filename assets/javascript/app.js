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
  firebase.analytics();

  //database reference as variable
  let database = firebase.database


  //navigate to new page based on state selction !!!this needs fixed!!!
  $("#state").on("change", function(){
    let newPage = $(this).val();
    if (newPage) {
      window.location = newPage;
    }
    return false;
  });





  

  $("#state").on("change", function() {
    let stateCode = $("#state").val();
    //console.log(stateCode);
    let queryURL =
      "https://developer.nps.gov/api/v1/parks?stateCode=" +
      stateCode +
      "&q=National%20Park&api_key=mmnZ3oHc5B6EBEiihQUWhMb7QOocZRIgj8IploIN";

      $.ajax({
          url: queryURL,
          method: "GET"
      })

      .done(function(response){
          //console.log(response);
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
          
          
          
          
          


          

          
      })
  });
});
