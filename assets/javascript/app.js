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

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    let rowItems = trains.map(function (p) {
        return '<tr><td>' + p.trainName + '</td><td>' + p.trainDestination + '</td><td>' + p.trainFrequency + '</td><td>' + p.nextArrival + '</td></tr>';
    });

    let tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
    let createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';
    $(".table").html(createTable);

    //keep as-is until Moment.js
    let d = new Date();
    let n = d.toLocaleTimeString('en-GB');
    console.log('n', n);
    n = n.slice(0, -3);
    $('.time').after("<p>" + n + "</p>");

    $('#submit').on('click', function (event) {
        event.preventDefault();

        console.log('submit clicked');

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

        /*trains.push({ trainName: newTrainName, trainDestination: newDestination, nextArrival: newTrainTime, trainFrequency: newTrainFrequency });*/
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