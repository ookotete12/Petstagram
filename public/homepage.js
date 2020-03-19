function makepost(){
    var iDiv = document.createElement('div');
    document.getElementById('col2').appendChild(iDiv);

    var div2 = document.createElement('div');
    var image = document.createElement('img');
    var username = document.getElementById("name").value;
    div2.className = 'feed';

    var url = document.getElementById("real").value;
    var spliturl = url.split('fakepath\\')[1];

    console.log(url);
    console.log(spliturl);
    image.src = "/public/" + spliturl   ;
    image.width = "250";
    image.height = "250";

    


    if (document.getElementById("scrollbarstyle").value){
        div2.innerHTML = username + ':<br>' + document.getElementById("scrollbarstyle").value + '<br>';
    } else{
        alert("You can't make an empty post!");
    }


    div2.appendChild(image); //not allowed to load local file, so failed
    iDiv.appendChild(div2);
    document.getElementById("photoinsert").disabled = false;
    document.getElementById("scrollbarstyle").value = '';
}