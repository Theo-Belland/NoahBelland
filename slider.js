const slide = ["images/1.jpg", "images/2.jpg"];
let numero = 0;

function ChangeSlide(sens){
    numero = numero + sens;
    if(numero < 0)
        numero = slide.length - 1;
    if(numero > slide.length - 1)
        numero = 0;

    document.getElementById("slide").src = slide[numero];
}

setInterval(function(){
    ChangeSlide(1);
}, 4000);