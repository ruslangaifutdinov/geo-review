// Storage module

let storage = (localStorage.getItem('reviews')) ? JSON.parse(localStorage.getItem('reviews')):{
    "coords": [],
    "address": [],
    "name": [],
    "place": [],
    "text": [],
    "date": []
};

function addItem (coords, address, name, place, desc, commentDate) {
    
    storage.coords.push(coords);
    storage.address.push(address);
    storage.name.push(name);
    storage.place.push(place);
    storage.text.push(desc);
    storage.date.push(commentDate);

    dataObjectUpdated();

}

function dataObjectUpdated() {
    localStorage.setItem('reviews', JSON.stringify(storage));
}