function createPlacemark(coords,place,address,desc,finalDate) {

    var html  = '<div class="balloon_modal">';
    html +=     `<div class="balloon_head">`;
    html +=     `<h3 class="balloon_place">${place}</h3>`;
    html +=     `</div>`;
    html +=     `<a data-coords="${coords}" class="balloon_address">${address}</a>`;
    html +=     `<p class="balloon_desc">${desc}</p>`;
    html +=     `<span class="balloon_finalDate">${finalDate}</span>`;
    html +=     '</div>';

    return new ymaps.Placemark(coords, {
        balloonContentBody : html
    }, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: './img/Mark.png',
        iconImageSize: [30, 50],
        iconImageOffset: [-25, -70]
    });
}
