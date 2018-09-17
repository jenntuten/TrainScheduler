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
    let currentTime = moment();
    console.log('true current time: ', currentTime);

    let currentTimeConverted = moment(currentTime, "HH:mm").subtract(1, "years");
    console.log('currentTimeConverted: ', currentTimeConverted);

    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
    $('.time').after("<p>" + moment(currentTime).format("hh:mm") + "</p>");

    database.ref().on("child_added", function (snapshot) {

        // Log everything that's coming out of snapshot
        //console.log('snapshot.val(existing)', snapshot.val());

        //Make sure everything carried over from Firebase

        let existingData = snapshot.val();
        console.log('CURRENT TRAINS: ', existingData)
        console.log('next train (existing): ', snapshot.val().nextTrain);
        let nextTrainUpdate = snapshot.val().nextTrain;
        console.log('nextTrainUpdate', nextTrainUpdate);

        let tMinutesTillTrainUpdated = snapshot.val().tMinutesTillTrain;
        console.log('tMinutesTillTrainUpdated: ', tMinutesTillTrainUpdated);

        let newTrainUpdate = moment().add(tMinutesTillTrainUpdated, "minutes");
        console.log('newTrainUpdate', newTrainUpdate);

        let newArrival = moment(newTrainUpdate).format("hh:mm");
        console.log('newArrival', newArrival);

        let newTimeConverted = moment(currentTime, "HH:mm").subtract(1, "years");
        console.log('newTimeConverted', newTimeConverted);

        let trainFrequency = snapshot.val().freq;
        console.log('trainFrequency', trainFrequency);
        //next arrival and minutes away not updating - need to compare to current time
        let newDiffTime = moment().diff(moment(currentTimeConverted), "minutes");
        console.log("NEW diffTime: " + newDiffTime);

        let tRemainderUpdated = newDiffTime % trainFrequency;
        console.log('tRemainderUpdated', tRemainderUpdated);

        let newMinutesTillTrain = trainFrequency - tRemainderUpdated;
        console.log("*NEW* MINUTES TILL TRAIN: " + newMinutesTillTrain);

        //console.log('existing data: ', existingData);

        //create new variables to update Trains array even though they are not being updated.
        let trainName = snapshot.val().train;
        let trainDest = snapshot.val().dest;

        //seems to always be the same amount of time off. 

        let updatedData = {
            trainName: trainName,
            trainDest: trainDest,
            trainFrequency: trainFrequency,
            newMinutesTillTrain: newMinutesTillTrain,
            newArrival: newArrival,
        }

        //Push everything back to Firebase with current time factored in (not currently working)
        trains.push(updatedData);
        console.log('NEW trains: ', trains);
        let rowItems = trains.map(function (p) {
            return '<tr><td>' + p.trainName + '</td><td>' + p.trainDest + '</td><td>' + p.trainFrequency + '</td><td>' + p.newArrival + '</td><td>' + p.newMinutesTillTrain + '</td></tr>';
        });

        let tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
        let createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';
        $(".table").html(createTable);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });



    $('#submit').on('click', function (event) {
        event.preventDefault();

        train = $('#inputTrainName').val().trim();
        dest = $('#inputDestination').val().trim();
        freq = $('#inputFrequency').val().trim();
        console.log('freq: ', freq);
        time = $('#inputTrainTime').val().trim();
        console.log('train time input: ', time)

        let timeConverted = moment(time, "HH:mm").subtract(1, "years");
        console.log('timeconverted: ', timeConverted);

        let diffTime = moment().diff(moment(timeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        let tRemainder = diffTime % freq;
        console.log('freq: ', freq);
        console.log('tremainder: ', tRemainder);

        let tMinutesTillTrain = freq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        let nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        database.ref().push({
            train: train,
            dest: dest,
            freq: freq,
            tMinutesTillTrain: tMinutesTillTrain,
            nextTrain: moment(nextTrain).format("hh:mm"),
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        rowItems = trains.map(function (p) {
            return '<tr><td>' + p.trainName + '</td><td>' + p.trainDest + '</td><td>' + p.trainFrequency + '</td><td>' + p.newArrival + '</td><td>' + p.newMinutesTillTrain + '</td></tr>';
        });
        tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
        createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';
        console.log('TRAINS ON CLICK: ', trains)
        //Show new table
        $(".table").html(createTable);

        //Clear form fields
        $('.form-control').val('');
    })
})