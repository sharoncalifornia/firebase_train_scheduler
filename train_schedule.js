// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.


// 1. Initialize Firebase


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBL5fR9dCp3w1YROd_RcTQy3W15Xd1GrVA",
    authDomain: "train-schedule-aeffd.firebaseapp.com",
    databaseURL: "https://train-schedule-aeffd.firebaseio.com",
    projectId: "train-schedule-aeffd",
    storageBucket: "train-schedule-aeffd.appspot.com",
    messagingSenderId: "317848616004"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = $("#start-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      startTime: trainStart,
      frequency: trainFrequency
    };

  //uploads train data to the database  
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.startTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");

});


// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().startTime;
    var trainFrequency = childSnapshot.val().frequency;
  
    // Employee Info
    console.log("retrieve   " +trainName);
    console.log("retrieve   "+trainDestination);
    //console.log("retrieve   "+trainStart);
    console.log("retrieve   "+trainFrequency);
    
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var trainStartConverted = moment(trainStart,"HH:mm");
    var diffTime = moment().diff(moment(trainStartConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);  

    var tRemainder = diffTime % trainFrequency;
    //console.log("minutes remain   "+tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    
    
    console.log("ARRIVAL TIME: " + moment(nextTrain, "hmm").format("HH:mm"));
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Create the new row
   // 
   var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(moment(nextTrain).format("ddd, MMM Do, h:mm:ss a")),
      $("<td>").text(tMinutesTillTrain),
     // $("<td>").text(empBilled)
    );
  
    // Append the new row to the table
   $("#train-table > tbody").append(newRow);
  });



