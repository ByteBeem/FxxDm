$(document).ready(function(){
  $(window).scroll(function(){
      // sticky navbar on scroll script
      if(this.scrollY > 20){
          $('.navbar').addClass("sticky");
      }else{
          $('.navbar').removeClass("sticky");
      }
      
      // scroll-up button show/hide script
      if(this.scrollY > 500){
          $('.scroll-up-btn').addClass("show");
      }else{
          $('.scroll-up-btn').removeClass("show");
      }
  });

  // slide-up script
  $('.scroll-up-btn').click(function(){
      $('html').animate({scrollTop: 0});
      // removing smooth scroll on slide-up button click
      $('html').css("scrollBehavior", "auto");
  });

  $('.navbar .menu li a').click(function(){
      // applying again smooth scroll on menu items click
      $('html').css("scrollBehavior", "smooth");
  });

  // toggle menu/navbar script
  $('.menu-btn').click(function(){
      $('.navbar .menu').toggleClass("active");
      $('.menu-btn i').toggleClass("active");
  });

  // Typing text animation script for Forex
var typed = new Typed(".typing", {
    strings: ["Forex Trader", "Technical Analyst", "Currency Analyst", "Pip Tracker", "Forex Educator"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});


  var typed = new Typed(".typing-2", {
      strings: ["Programmer", "White hat", "Pen tester", "Bug hunter", "Freelancer"],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true
  });

  // owl carousel script
  $('.carousel').owlCarousel({
      margin: 20,
      loop: true,
      autoplay: true,
      autoplayTimeOut: 2000,
      autoplayHoverPause: true,
      responsive: {
          0:{
              items: 1,
              nav: false
          },
          600:{
              items: 2,
              nav: false
          },
          1000:{
              items: 3,
              nav: false
          }
      }
  });
});

document.getElementById("predictButton").addEventListener("click", function () {
    // Display the loading indicator
    document.getElementById("loadingOverlay").style.display = "flex";

    
    fetch('https://fc4f-196-21-218-222.ngrok-free.app/predict', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
        // You can pass any data needed for prediction in the request body
        // Example: JSON.stringify({ key: value }),
        // Replace with your actual data
        body: JSON.stringify({}),
    })
    .then(response => {
        // Check if the response status is 502 (Bad Gateway)
        if (response.status === 502) {
            throw new Error('Server is down');
        }
        return response.json();
    })
    .then(prediction => {
        // Hide the loading indicator when the prediction is received
        document.getElementById("loadingOverlay").style.display = "none";

        // Check if prediction contains valid data (customize this check based on your response structure)
        if (prediction && prediction.values) {
            const predictedValues = prediction.values; // Replace with the actual key that holds the predicted values

            // Create a line graph using Chart.js
            const ctx = document.getElementById("predictionChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: predictedValues.map((_, index) => index.toString()),
                    datasets: [{
                        label: "Predicted Values",
                        data: predictedValues,
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        fill: false,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: "Time",
                            },
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: "Value",
                            },
                        },
                    },
                },
            });
        } else {
            // Handle the case where prediction data is not valid or missing
            console.error('Invalid prediction data:', prediction);
        }
    })
    .catch(error => {
        // Hide the loading indicator
        document.getElementById("loadingOverlay").style.display = "none";

        // Display a nice error message to the client
        const errorBox = document.getElementById("errorBox");
        errorBox.style.display = "block";
        errorBox.innerHTML = `
            <div class="error-content">
                <span class="error-text">Server is down</span>
                <button id="closeError" class="close-button">X</button>
            </div>
        `;
        const closeButton = document.getElementById("closeError");
        closeButton.addEventListener("click", function () {
            errorBox.style.display = "none"; // Close the error box when the close button is clicked
        });

        console.error('Error:', error);
    });
});
