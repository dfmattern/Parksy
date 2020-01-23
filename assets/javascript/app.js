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
          
      })
  });
});
