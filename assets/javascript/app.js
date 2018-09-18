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

    //Array to store train data
    let trains = [];

    let database = firebase.database();

    database.ref().on("child_added", function (snapshot) {

        //Calculations for next arrival/minutes away based on frequency and first train
        let timeConverted = moment(snapshot.val().time, "HH:mm").subtract(1, "years");
        let diffTime = moment().diff(moment(timeConverted), "minutes");
        let tRemainder = diffTime % snapshot.val().freq;
        let tMinutesTillTrain = snapshot.val().freq - tRemainder;
        let nextTrain = moment().add(tMinutesTillTrain, "minutes");

        //Create new object to store snapshots and calculations
        let newData = {
            train: snapshot.val().train,
            time: snapshot.val().time,
            dest: snapshot.val().dest,
            freq: snapshot.val().freq,
            nextTrain: moment(nextTrain).format("hh:mm"),
            tMinutesTillTrain: tMinutesTillTrain
        }
        //Push data to trains array
        trains.push(newData);

        //Mapping data to create table
        let rowItems = trains.map(function (p) {
            return '<tr><td>' + p.train + '</td><td>' + p.dest + '</td><td>' + p.freq + '</td><td>' + p.nextTrain + '</td><td>' + p.tMinutesTillTrain + '</td></tr>';
        });

        let tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
        let createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';
        $(".table").html(createTable);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    let currentTime = moment();
    $('.time').after("<p>" + moment(currentTime).format("hh:mm") + "</p>");

    $('#submit').on('click', function (event) {
        event.preventDefault();

        //Pull user input
        train = $('#inputTrainName').val().trim();
        dest = $('#inputDestination').val().trim();
        freq = $('#inputFrequency').val().trim();
        time = $('#inputTrainTime').val().trim();

        //Push user input to Firebase
        database.ref().push({
            train: train,
            dest: dest,
            freq: freq,
            time: time,
        });

        //Clear user input
        $('.form-control').val('');
    })
})