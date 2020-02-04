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
    console.log("Firebase initialized");
    //database reference as variable
    let database = firebase.database();
    let likeCounter = 0;
    let parkName;
    let parkDescription;
    let parkImage;
    let likes;
    let zero = 6;
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
    // This function parses the url and finds the parameter that you are looking for
    function parseURLParameter(parameter) {
        var fullURL = window.location.search.substring(1);
        var parametersArray = fullURL.split("&");
        for (var i = 0; i < parametersArray.length; i++) {
            var currentParameter = parametersArray[i].split("=");
            if (currentParameter[0] == parameter) {
                return currentParameter[1];
            }
        }
    }
    // end of the parse function

    var parkTitle = parseURLParameter("park");
    var stateCode = parseURLParameter("state");
    var parkNumber = parseURLParameter("num");
    console.log("PARKTITLE: ", parkTitle);
    if (parkTitle == null) {} else {
        parkTitle = parkTitle.replace(/[^\w\s]/gi, " ").replace(/[0-9]/g, "");
    }

    $("#park-title").text(parkTitle);

    // grabing the url for the first ajax call later in the code
    var webCamNum = allStateCords[parkNumber];
    console.log("Web Cam Number", webCamNum);

    var webCam =
        "https://api.windy.com/api/webcams/v2/list/nearby=" +
        webCamNum +
        ",250?key=PZcbLAY0Dop4Gbuyc9g6EHlASwBQW9SJ";
    // Calls the populate Page function
    populatePage();

    // This code will change the window location and to obtain the correct state info
    $("#state").on("change", function() {
        codeNumber = $("#state").val();
        parkNumber = codeNumber.replace(/^\D+/g, "");
        stateCode = codeNumber.replace(/[0-9]/g, "");
        window.location =
            "stateselect.html?state=" + stateCode + "&num=" + parkNumber;
        //console.log(stateCode);
    });
    // Future development 
    // database.ref().on("value", function(snapshot) {
    //     console.log(snapshot.val());
    //     likes = snapshot.val().likes;
    //     if (!likes) {
    //         likes = [];
    //     }
    //     console.log(likes);
    // });

    // This code will track when we select a park card and bring us to the correct page
    $(".park").on("click", function() {
        parkTitle = $(this).attr("id");
        window.location =
            "parkpage.html?state=" +
            stateCode +
            "&num=" +
            parkNumber +
            "&park=" +
            parkTitle;
    });

    $("#link-camp-info").on("click", function() {
        window.location = "campgroundpage.html?park=" + parkTitle;
    });

    // Future Development
    //like function
    // $("#like-btn").on("click", function(event) {
    //     event.preventDefault();
    //     parkName = $("#park-title")
    //         .text()
    //         .trim();
    //     console.log("Park Name", parkName);

    //     // if park is in array, increment it
    //     let foundParkIndex = likes.findIndex(park => park[parkName]);
    //     if (foundParkIndex > -1) {
    //         likes[foundParkIndex][parkName] = likes[foundParkIndex][parkName] + 1;
    //     } else {
    //         // else add it
    //         likes.push({
    //             [parkName]: 1
    //         });
    //     }
    //     database.ref().set({
    //         likes: likes
    //     });
    // });

    // We use our first ajax call to insert the webcams its the page.
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
    // This goes through our nps api to grab the park information
    // to then insert it into the page
    function populatePage() {
        $("#state-title").text(stateCode);
        //console.log("something");
        let queryURL =
            "https://developer.nps.gov/api/v1/parks?stateCode=" +
            stateCode +
            "&q=National%20Park&api_key=joATpudQd2qABHgzChXZCAMLxuY6mIqpG9MfMiXR";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            let results = response.data;
            //console.log(response);
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
        //var parkTitle = sessionStorage.getItem("parkName");
        //$("#park-title").text(parkTitle);
    }
    // Our second nps api call to grab the information for our park info
    let alertURL =
        "https://developer.nps.gov/api/v1/alerts?q=" +
        parkTitle +
        "&api_key=L0yL36dUx3CDNFvtD7lwtnL6b08MABH5rDWu5KRo";


    // Caution and information alerts 
    $.ajax({
        url: alertURL,
        method: "GET"
    }).done(function(alertResponse) {
        let alertResults = alertResponse.data;
        console.log("alert API", alertResponse);
        let alert = alertResults[0];

        if (alertResponse.total == 0) {
            $("#caution-alert").hide();
            $("#info-alert").hide();
        } else {
            // console.log("alert for loop", alert.title);
            let alertCaution = "#alert0";
            let alertInfo = "#alert1";
            $(alertCaution).text(alert.title);
            $(alertInfo).text(alert.description);
            // console.log("alert message here", alertData)
        }
    });

    // Our third nps call to grab the infomation for our campground page

    let campURL =
        "https://developer.nps.gov/api/v1/campgrounds?q=" +
        parkTitle +
        "&api_key=bd6vYr0dYh1GNfF8Cgb7mzPAXL1D9b8m5QC4PNL9";

    $.ajax({
        url: campURL,
        method: "GET"
    }).done(function(campResponse) {
        let campResults = campResponse.data;

        console.log("CAMPURL: ", campURL);
        console.log("campgrounds API", campResponse);
        let camp = campResults[0];

        if (campResponse.total == 0) {
            $("#camp-header").hide();
            $("#camp-div").hide();
            $("#camp-hr").hide();
        } else {
            let campName = "#camp-name";
            let campInfo = "#camp-info";
            let campPageName = "#camp-title";
            let campDesc = "#description";
            let campFeatures = "#sites";
            let campHours = "#camp-hours";
            let campWeather = "#camp-weather";
            let campAcc = "#camp-acc";
            let campDir = "#camp-dir";

            $(campName).text(camp.name);
            $(campInfo).text(camp.description);
            $(campDesc).text(camp.description);
            $(campPageName).text(camp.name);
            $(campFeatures).text(camp.campsites.totalsites);
            $(campWeather).text(camp.weatheroverview);

            if (camp.directionsoverview == "") {
                $("#hide-dir").hide();
            } else {
                $(campDir).text(camp.directionsoverview);
            }
            if (camp.regulationsoverview == "") {
                $("#hide-op").hide();
            } else {
                $(campHours).text(camp.regulationsoverview);
            }
            if (
                camp.accessibility.wheelchairaccess == "" &&
                camp.accessibility.firestovepolicy == ""
            ) {
                $("#div-acc").hide();
            } else {
                $(campAcc).text(camp.accessibility.wheelchairaccess);
                $("#fire").text(camp.accessibility.firestovepolicy);
            }
        }
    });

    // another call to grab information to fill in our parks page
    let QueryUrlPark =
        "https://developer.nps.gov/api/v1/parks?q=" +
        parkTitle +
        "&api_key=SWBKpF0W08u2fpeIxFUpYZ65c9VoiQzk3Cy5WESC";
    $.ajax({
        url: QueryUrlPark,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $("#parkDirections").text(response.data[0].directionsInfo);
        $("#weather").text(response.data[0].weatherInfo);
        $("#description").text(response.data[0].description);
    });
    let QueryUrlVisitor =
        "https://developer.nps.gov/api/v1/visitorcenters?q=" +
        parkTitle +
        "&api_key=EEgWebQw8YDIq0fTnVceEfaK9Sc4MCvnfCVgkr0S";
    $.ajax({
        url: QueryUrlVisitor,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $("#centerName").text(response.data[0].name);
        $("#centerInfo").text(response.data[0].description);
    });


    // a randomizer to fill in all the information for the featured parks
    var numberArray = ["4", "0", "3", "8", "15"];
    var stateArray = ["CO", "AK", "CA", "KY", "NM"];
    var selectedStates = [];
    var important = 6;

    while (important < 9) {
        let j = Math.floor(Math.random() * 4);
        stateCode = stateArray[j];
        parkNumber = numberArray[j];
        if (selectedStates.includes(stateArray[j])) {
            continue;
        }
        selectedStates.push(stateArray[j]);

        var featuredURL =
            "https://developer.nps.gov/api/v1/parks?stateCode=" +
            stateCode +
            "&q=National%20Park&api_key=EJgEs0QdPiPeHSfdQffrvaqhOaEJ2xMpFWKICetf";

        $.ajax({
            url: featuredURL,
            method: "GET"
        }).done(function(response) {
            //console.log(important);
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

            let randomCard = "#card-title" + zero;
            console.log(randomCard)
            let randomText = "#card-text" + zero;
            let number = "." + zero;
            //console.log(randomText)
            $(randomCard).text(cardTitle);
            $(randomText).text(cardText);
            $(number).attr("id", featuredPark.fullName);
            zero++
        });
        ++important;
    }

    // lastly this is where we grab our images to insert them into the site.
    let imageURL =
        "https://cors-anywhere.herokuapp.com/ridb.recreation.gov/api/v1/media?query=" +
        parkTitle +
        "&limit=50&apikey=38183f6c-31a9-495f-88e5-855379837d30";
    //console.log(imageURL);

    $.ajax({
        url: imageURL,
        method: "GET"
    }).done(function(response) {
        console.log(response);
        let primaryImage;

        for (let i = 0; i < response.RECDATA.length; i++) {
            if (response.RECDATA[i].IsPrimary) {
                primaryImage = response.RECDATA[i];
                //console.log(primaryImage);
                displayImageURL = primaryImage.URL;
                console.log(displayImageURL);
                // $('.displayImage').attr('src',displayImageURL)

                $("#park-jumbo")
                    .css("background", "url(" + displayImageURL + ")")
                    .css("background-repeat", "no-repeat")
                    .css("background-size", "cover");
            } else {
                response.RECDATA[i].IsGallery;
                secondaryImage = response.RECDATA[i];
                console.log(secondaryImage);
                secDispURL = secondaryImage.URL;
                //console.log(secDispURL);
                //urlArr= [];
                // urlArr.push(secDispURL);
                //console.log(urlArr);
                // $("#img0").attr("src", "url(" + secDispURL + ")");


            }
        }
    });
    var gallery = ["gallery1.jpg", "gallery2.jpg", "gallery3.jpg", "gallery4.jpg", "gallery5.jpg", "gallery6.jpg", "gallery7.jpg", "gallery8.jpg", "gallery9.jpg", "gallery10.jpg", "gallery11.jpg", "gallery12.jpg", "gallery13.jpg", "gallery14.jpg", "gallery15.jpg", "gallery16.jpg", "gallery17.jpg"];
    var usedNumber = [];
    var images = 0;
    while (images < 6) {
        let j = Math.floor(Math.random() * 17);
        if (usedNumber.includes(gallery[j])) {
            continue;
        }
        usedNumber.push(gallery[j]);
        var whereToDisplay = "#img" + images;
        console.log(gallery[j]);
        $(whereToDisplay).attr("src", "assets/images/" + gallery[j]);
        images++
    }
});