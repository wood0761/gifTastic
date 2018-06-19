$(document).ready(function(){

  var gifsArray = ["Lord of the Rings", "Philip K. Dick", "Frederick Douglass"];

  renderButton();
  
  $("#textBox").on("click", function(){ 
    event.preventDefault();     
    $("#textBox").val('');                // clears inputBox on click
    $("#textBox").css("opacity", "1");    // changes opacity to full
  })

  $("#submitButton").on("click", function(){                    // on clicking submitButton
    event.preventDefault();   
    gifsArray=[];                          
    var newTopic="";                                            
    if ($("#textBox").val() != "Tell me something you like!"){  // as long as it doesn't say "Tell me something you like!"
      newTopic = $("#textBox").val();                           // new topic is added to the array
      gifsArray.push(newTopic);
      renderButton();
    }
  });

  $("body").on("click", "img#gifs", function() {
    var state = $(this).attr("dataState");
   
    if (state === "still") {
      $(this).attr("src", $(this).attr("dataAnimate"));
      $(this).attr("dataState", "animate");
    } else {
      $(this).attr("src", $(this).attr("dataStill"));
      $(this).attr("dataState", "still");
    }
  });

function renderButton (){
  for (var i=0; i < gifsArray.length; i++){
    var b = $("<button>");
    b.addClass("topic");
    b.attr("topicName", gifsArray[i]);
    b.text(gifsArray[i]);
    $("#dynamicButtons").prepend(b);
  }
}

    $('body').on('click', 'button.topic', function() {          // events cannot be called on dynamic elemnts, have to attach to 'body' first, then the specific dynamic button
      var newGifs = $(this).attr("topicName");

      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        newGifs + "&api_key=dc6zaTOxFJmzC&limit=10";
      // Performing our AJAX GET request
      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
        
          console.log(response);
          var data = response.data;

          for (var i = 0; i < data.length; i++) {

            // Only taking action if the photo has an appropriate rating
            if (data[i].rating !== "r" && data[i].rating !== "pg-13") {
        
              var rating = data[i].rating;
              var p = $("<p>").text("Rating: " + rating);
              var gifVid = $("<img>");
              gifVid.attr("id", "gifs")
              gifVid.attr("src", data[i].images.fixed_height_still.url);
              gifVid.attr("dataState", "still");                             // for animating on click
              gifVid.attr("dataAnimate", data[i].images.fixed_height.url);
              gifVid.attr("dataStill", data[i].images.fixed_height_still.url);
              
              // Prepending the rating and gif to #gifs div
              $("#gifs").prepend(p);
              $("#gifs").prepend(gifVid);
               
            }
          }
        });
    }); 
  });