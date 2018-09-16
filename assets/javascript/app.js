$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCd5USxCV_HCL_Xwd9oveZVBHI5Ks5BpzA",
        authDomain: "trainscheduler-b2a05.firebaseapp.com",
        databaseURL: "https://trainscheduler-b2a05.firebaseio.com",
        projectId: "trainscheduler-b2a05",
        storageBucket: "",
        messagingSenderId: "38425213653"
    };
    firebase.initializeApp(config);

    let trains = [];

    let database = firebase.database();

    database.ref().on("child_added", function (snapshot) {

        // Log everything that's coming out of snapshot
        console.log('snapshot.val(existing)', snapshot.val());
        let existingData = snapshot.val();

        console.log('existing data: ', existingData);

        trains.push(existingData);
        console.log('trains: ', trains);
        let rowItems = trains.map(function (p) {
            return '<tr><td>' + p.train + '</td><td>' + p.dest + '</td><td>' + p.freq + '</td><td>' + p.time + '</td></tr>';
        });
    
        let tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
        let createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';
        $(".table").html(createTable);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    $('.time').after("<p>" + moment(currentTime).format("hh:mm") + "</p>");

    $('#submit').on('click', function (event) {
        event.preventDefault();

        train = $('#inputTrainName').val().trim();
        dest = $('#inputDestination').val().trim();
        freq = $('#inputFrequency').val().trim();
        time = $('#inputTrainTime').val().trim();

        database.ref().push({
            train: train,
            dest: dest,
            freq: freq,
            time: time,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        rowItems = trains.map(function (p) {
            return '<tr><td>' + p.train + '</td><td>' + p.dest + '</td><td>' + p.freq + '</td><td>' + p.time + '</td></tr>';
        });
        tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
        createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';

        //Show new table
        $(".table").html(createTable);

        //Clear form fields
        $('.form-control').val('');
    })
})