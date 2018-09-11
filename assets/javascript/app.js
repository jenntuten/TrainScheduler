$(document).ready(function () {
    let trainName;
    let destination;
    let firstTrainTime;
    let trainFrequency;
    let frequency;
    let rows;
    let columns;
    let newTrainName;
    let newDestination;
    let newTrainFrequency;
    let newTrainTime;

    let trains = [
        {
            trainName: "Midnight Train",
            trainDestination: 'Anywhere',
            nextArrival: '00:00',
            trainFrequency: "?"
        },
        {
            trainName: "Crazy Train",
            trainDestination: "Off the rails",
            nextArrival: "10:00",
            trainFrequency: "60"
        }
    ];

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

    $('#submit').on('click', function () {
        console.log('submit clicked');
        $(".add-trains").after(function () {
            return "<tr class='new-trains'></tr>";
        });
        newTrainName = $('#inputTrainName').val();
        newDestination = $('#inputDestination').val();
        newTrainFrequency = $('#inputFrequency').val();
        newTrainTime = $('#inputTrainTime').val();
        trains.push({ trainName: newTrainName, trainDestination: newDestination, nextArrival: newTrainTime, trainFrequency: newTrainFrequency });
        rowItems = trains.map(function (p) {
            return '<tr><td>' + p.trainName + '</td><td>' + p.trainDestination + '</td><td>' + p.trainFrequency + '</td><td>' + p.nextArrival + '</td></tr>';
        });
        tableHead = '<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>';
        createTable = '<table> ' + tableHead + rowItems.join('') + ' </table>';

        //Show new table
        $(".table").html(createTable);

        //Clear form fields
        $('.form-control').val('');
    })
})