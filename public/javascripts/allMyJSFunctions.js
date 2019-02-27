function disableTheRadio(){

    var theradio1 = document.getElementById("fromHere");
    var theradio2= document.getElementById("OtherLocRadio");

    if (theradio2.checked === true){
        document.getElementById("theOtherLoc").disabled=false;
    } else if (theradio1.checked === true){
        document.getElementById("theOtherLoc").disabled=true;

    }
    else{return;}
}


function toResults(){

    if( document.getElementById('favBut').classList.contains('btn-primary')){
        $("#favBut").removeClass("btn-primary");
        $("#favBut").addClass("btn-link");
        $("#resultsBut").removeClass("btn-link");
        $("#resultsBut").addClass("btn-primary");
    }
}
function toFav(){

    if( document.getElementById('resultsBut').classList.contains('btn-primary')){
        $("#resultsBut").removeClass("btn-primary");
        $("#resultsBut").addClass("btn-link");
        $("#favBut").removeClass("btn-link"); 
        $("#favBut").addClass("btn-primary");
    }
}

