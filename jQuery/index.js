$("h1").addClass("big-title");

$("a").attr("href", "https://bing.com");

$("h1").click(function(){
    $("h1").css("color", "purple");
})

numOfButtons = document.querySelectorAll("button").length;

// for (var i = 0; i < numOfButtons; i++){
//     document.querySelectorAll("button")[i].addEventListener("click", function(){
//         document.querySelector("h1").style.color = "purple";
//     });
// }

//Easier way of doing it. 

$("button").on("click",function(){
    $("h1").slideUp().slideDown().animate({opacity:0.5});
})

$("input").keydown(function(e){
    console.log(e.key);
    $("h1").text(e.key);
});

$("h1").on("mouseover", function(){
    $("h1").css("color", "purple");
});

$("h1").before("<button>new</button>");