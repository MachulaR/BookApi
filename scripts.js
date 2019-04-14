function init() {
    document.getElementById('searchText').value = '';
}


var firstColor =  '#ccc'; // color for background record
var secondColor =  '#fff'; // color for background record
var recordBgColor = firstColor;

var imagePath;
var title;
var description;

document.getElementById('result');
var index;

/* Starting Api Parameters */
var searchAttribute = '';
var startIndex = 0;
var maxResults = 10;  // max is 40, 10 is default (api)

function textCutter(str, wordsNumber){
    if (wordsNumber == null) {
        wordsNumber = 15;
    }

    return ( str.split(' ').length > wordsNumber ? str.split(' ').splice(0,wordsNumber).join(' ') +'...' : str );
}

function displayItems(data, index) {

    if (data.totalItems > index * maxResults) {

        for (var i = 0; i < data.items.length; i++) {

            imagePath = ( (typeof data.items[i].volumeInfo.imageLinks === 'undefined') ?
                "<p class='image-text'>Image not exist</p>" :
                "<img src=" + data.items[i].volumeInfo.imageLinks.thumbnail + " alt='image not available'/>");

            title = data.items[i].volumeInfo.title;

            description = ( (typeof data.items[i].volumeInfo.description === 'undefined') ?
                'Description not exist' : textCutter(data.items[i].volumeInfo.description, 19) );

            result.innerHTML +=
                "<div class='image' style='background-color:" + recordBgColor + "'>" + imagePath + "</div>" +
                "<div class='content' style='background-color:" + recordBgColor + "'>" +
                "<div class='title'><h2>" + title + "</h2></div>" +
                "<div class='description'><br /><p>" + description + "</p></div>" +
                "</div>";

            recordBgColor = (recordBgColor === firstColor ? secondColor : firstColor);

        }
    } else if (result.innerHTML === ""){

        result.innerHTML = "<h1 id='emptySearch'>No book with that title exist! :(</h1>";

    }
}

function connectToAPI(index) {

    if(maxResults>40){
        maxResults = 40;
        result.innerHTML = "<p class='errorMsg'>Maximum results is 40! (Automatically set to 40).</p>";
    } else if (maxResults<1){
        maxResults = 1;
        result.innerHTML = "<p class='errorMsg'>Minimum results is 1! (Automatically set to 1).</p>";
    }

    const search = document.getElementById('searchText').value;

    $.ajax({
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchAttribute + search + '&startIndex=' + index * maxResults + '&maxResults=' + maxResults,
        dataType: 'json',

        success: [
            function (data) {
                displayItems(data, index)
            }
        ],
        error: [
            function () {
                result.innerHTML = "<h1 id='emptySearch'>Something went wrong!</h1><p class='errorMsg'>Check your internet connection or try again later.</p>"
            }
        ],
        type: 'GET'
    });
}

function search(searchAtt) {

    if (document.getElementById('searchText').value !== "") {

        if(typeof searchAtt !== 'undefined') {
            searchAttribute = searchAtt;
        }

        document.getElementById('result').innerHTML = "";

        if (startIndex<0 || isNaN(startIndex) ) {
            startIndex = 0;
        }
        index = startIndex;


        connectToAPI(index);

    } else {

        result.innerHTML = "<h1 id='emptySearch'>Search cannot be empty!</h1>";

    }
}

function loadDataAfterScrollingDown() {

    if( $(window).scrollTop() === $(document).height() - $(window).height()  &&
        $(document).height() !== $(window).height() ) {
        index++;
        connectToAPI(index);

    }
}

function main() {

    window.onload = init;

    document.getElementById('searchByTitleButton').addEventListener('click', search.bind(null, '+intitle:'));

    document.addEventListener("keyup", function() {
        if (event.keyCode === 13 ) {
            event.preventDefault();
            search('+intitle:');
        }
    }, false);

    window.onscroll = loadDataAfterScrollingDown;
}

main();

