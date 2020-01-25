$(document).ready(function() {
  //console.log("ready");

  

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
          console.log(response);
          let results = response.data;
          //console.log(results);
          let randomPark = Math.floor(Math.random() * results.length);
          //console.log(randomPark);
          let featuredPark = results[randomPark];
          console.log(featuredPark);
          let cardTitle = featuredPark.fullName;
          console.log(cardTitle);
          let cardText = featuredPark.description;
          console.log(cardText); 

          $(".card-title").empty();
          $(".card-title").text(cardTitle);
          $(".card-text").text(cardText);
          
//need to get different parks into each card
          
          
          
          
          


          

          
      })
  });
});
