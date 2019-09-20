ymaps.ready(init);

function init() {
    let myPlacemark;
    var myMap = new ymaps.Map('map', {
        center: [55.80119837886853, 49.10694353726471], // Kazan
        zoom: 13,
        controls: []
    }, {
        geoObjectOpenBalloonOnClick: false,
        searchControlProvider: 'yandex#search'
    });

}