function init() {
    document.getElementById('searchText').value = '';
}

const FIRST_COLOR_BG =  '#ccc'; // color for background record
const SECOND_COLOR_BG =  '#fff'; // color for background record
let recordBgColor = FIRST_COLOR_BG;

let imagePath;
let title;
let description;

/* Api Parameters */
const BOOK_API = 'https://www.googleapis.com/books/v1/volumes?q=';
const MAX_RESULTS = 10;  // max is 40, 10 is default (api)

class books{
    constructor(){
        this.currentSearch = '';
        this.searchParameter = '';
        this.currentPage = 0;
    }

    attach() {
        this.bindButtonSearchByTitle();
        this.bindScroll();
    }

    bindButtonSearchByTitle(){
        document.getElementById('searchByTitleButton').addEventListener('click', () => {
            this.clearResults();
            this.searchParameter = '+intitle:';
            this.search(document.getElementById('searchText').value);
        }) ;
    }

    bindScroll(){
        this.scrollListener = () => {
            if( $(window).scrollTop() === $(document).height() - $(window).height()  &&
                $(document).height() !== $(window).height() ) {
                this.currentPage ++;
                this.loadPages();
            }
        };

        window.addEventListener('scroll', this.scrollListener);
    }

    clearResults(){
        this.currentPage=0;
        result.innerHTML = "";
        this.searchParameter = '';
    }

    async loadPages() {
        const items = await this.fetchData();
        this.displayItems(items);
    }

    getApiURL(){
        let startIndex = this.currentPage * MAX_RESULTS;

        return `${BOOK_API}${this.searchParameter}${this.currentSearch}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`
    }

    async search(title) {
        this.currentSearch = title;
        this.loadPages();
    }

    async fetchData() {
        const url = this.getApiURL();
        const response = await (await fetch(url)).json();

        return response;
    }

    displayItems(data){
        if (data.totalItems > this.currentPage  * MAX_RESULTS) {
            for (let i = 0; i < data.items.length; i++) {
                imagePath = ( (typeof data.items[i].volumeInfo.imageLinks === 'undefined') ?
                    "<p class='image-text'>Image not exist</p>" :
                    "<img src=" + data.items[i].volumeInfo.imageLinks.thumbnail + " alt='image not available'/>");

                title = data.items[i].volumeInfo.title;

                description = ( (typeof data.items[i].volumeInfo.description === 'undefined') ?
                    'Description not exist' : textTrimmer(data.items[i].volumeInfo.description, 19) );

                result.innerHTML +=
                    "<div class='image' style='background-color:" + recordBgColor + "'>" + imagePath + "</div>" +
                    "<div class='content' style='background-color:" + recordBgColor + "'>" +
                    "<div class='title'><h2>" + title + "</h2></div>" +
                    "<div class='description'><br /><p>" + description + "</p></div>" +
                    "</div>";

                recordBgColor = (recordBgColor === FIRST_COLOR_BG ? SECOND_COLOR_BG : FIRST_COLOR_BG);
            }
        } else if (result.innerHTML === ""){
            result.innerHTML = "<h1 id='emptySearch'>No book with that title exist! :(</h1>";
        }
    }
}

function textTrimmer(str, wordsNumber=15){ // to trim description
    return ( str.split(' ').length > wordsNumber ? str.split(' ').splice(0,wordsNumber).join(' ') +'...' : str );
}

function main() {
    window.onload = init;
    const book = new books();
    book.attach();
}

main();

