$(document).ready(function () {
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
    console.log("Firebase initialized");
    //database reference as variable
    let database = firebase.database();
    let stateCode = sessionStorage.getItem("stateCode");
    let likeCounter = 0;
    let parkName;
    let parkDescription;
    let parkImage;
    let likes;
    var parkTitle = sessionStorage.getItem("parkName");
        $("#park-title").text(parkTitle);
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

    console.log("variables set, ALL State Coordinates:", allStateCords);

    var webCamNum = allStateCords[sessionStorage.getItem("stateNumber")];
    console.log("Web Cam Number", webCamNum);

    var webCam =
        "https://api.windy.com/api/webcams/v2/list/nearby=" +
        webCamNum +
        ",250?key=PZcbLAY0Dop4Gbuyc9g6EHlASwBQW9SJ";

    populatePage();

    $("#state").on("change", function () {
        codeNumber = $("#state").val();
        parkNumber = codeNumber.replace(/^\D+/g, "");
        stateCode = codeNumber.replace(/[0-9]/g, "");
        sessionStorage.setItem("stateNumber", parkNumber);
        sessionStorage.setItem("stateCode", stateCode);
        stateCode = sessionStorage.getItem("stateCode");
       window.location = "stateselect.html";
        //console.log(stateCode);
    });
    database.ref().on("value", function (snapshot) {
        console.log(snapshot.val());
        likes = snapshot.val().likes;
        if (!likes) {
            likes = [];
        }
        console.log(likes);
    });
    $(".card").on("click", function (){
        sessionStorage.setItem("parkName" , $(".card").attr("id"));
    });

    //like function
    $("#like-btn").on("click", function (event) {
        event.preventDefault();
        parkName = $("#park-title")
            .text()
            .trim();
        console.log("Park Name", parkName);

        // if park is in array, increment it
        let foundParkIndex = likes.findIndex(park => park[parkName]);
        if (foundParkIndex > -1) {
            likes[foundParkIndex][parkName] = likes[foundParkIndex][parkName] + 1;
        } else {
            // else add it
            likes.push({
                [parkName]: 1
            });
        }
        database.ref().set({
            likes: likes
        });
    });

    $.ajax({
        url: webCam,
        method: "GET"
    }).then(function (response) {
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
        $("#state-title").text(stateCode);
        console.log("something");
        var parkTitle = sessionStorage.getItem("parkName");
        $("#park-title").text(parkTitle);
        let queryURL =
            "https://developer.nps.gov/api/v1/parks?stateCode=" +
            stateCode +
            "&q=National%20Park&api_key=mmnZ3oHc5B6EBEiihQUWhMb7QOocZRIgj8IploIN";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            let results = response.data;
            console.log(response);
            //console.log(results);
            for (i = 0; i < response.data.length; i++) {
               // console.log("hi");
                let park = results[i];
                let cardTitle = "#card-title" + i;
                let cardText = "#card-text" + i;
                let number = "." + i;
                $(cardTitle).text(park.fullName);
                $(cardText).text(park.description);
                $(number).removeAttr("id", "hide");
                $(number).attr("id", park.name);
            }
        });
       // var parkTitle = sessionStorage.getItem("parkName");
        //$("#park-title").text(parkTitle);
    }

    var stateArray = ["CO", "MN", "OH", "NY", "NM"];
    for (let i = 0; i < 3; i++) {
        let stateCode = stateArray[i];

        var featuredURL =
            "https://developer.nps.gov/api/v1/parks?stateCode=" +
            stateCode +
            "&q=National%20Park&api_key=mmnZ3oHc5B6EBEiihQUWhMb7QOocZRIgj8IploIN";

        $.ajax({
            url: featuredURL,
            method: "GET"
        })
            .done(function (response) {
                //console.log(response);


                let results = response.data;
                //console.log(results);
                let randomPark = Math.floor(Math.random() * results.length);

                let featuredPark = results[randomPark];

                //console.log(featuredPark);
                let cardTitle = featuredPark.fullName;


                //console.log(cardTitle);
                let cardText = featuredPark.description;
                //console.log(cardText);

                let randomCard = "#card-title" + i;
               // console.log(randomCard)
                let randomText = "#card-text" + i;
                //console.log(randomText)
                $(randomCard).text(cardTitle);
                $(randomText).text(cardText);
                //console.log("End of Loop")



            });
        //console.log("this is the i", i);
    }
    
    let imageURL =
    "https://ridb.recreation.gov/api/v1/media?query=" + parkTitle + "&limit=50&offset=0&apikey=27b8c6d8-739a-4df3-a008-21aa585669b9";

        $.ajax({
            url: imageURL,
            method: "GET"
        })
        .done(function(response) {
            console.log(response);
            
        })
   
});
