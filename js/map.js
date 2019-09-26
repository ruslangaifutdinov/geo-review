ymaps.ready(init);

let dataComments = {};
let count = 0;

function init() {
  let myPlacemark;
  var myMap = new ymaps.Map(
    "map",
    {
      center: [55.80119837886853, 49.10694353726471], // Kazan location
      zoom: 13,
      controls: []
    },
    {
      geoObjectOpenBalloonOnClick: false
    }
  );

  let data = JSON.parse(localStorage.getItem("reviews"));
    if (data) {3
      for (let i = 0; i <= data.coords.length; i++) {
        let coordsStorage = data.coords[i];
    
        var storagePlacemark = place(coordsStorage);
    
        myMap.geoObjects.add(storagePlacemark);
    
        function place(coordsStorage) {
          var html = '<div class="balloon_modal">';
    
          return new ymaps.Placemark(
            coordsStorage,
            {
              balloonContentBody: html
            },
            {
              preset: "islands#violetDotIconWithCaption",
              draggable: false,
              iconLayout: "default#image",
              iconImageHref: "./img/Mark.png",
              iconImageSize: [30, 50],
              iconImageOffset: [-25, -70]
            }            
          );
          myMap.geoObjects.add(clusterer);
        }
      }
    }



  myMap.events.add("click", e => {
    let coords = e.get("coords");
    let [coordX, coordY] = coords;

    const dataKeys = Object.keys(dataComments);

    modal.dataset.coordX = coordX;
    modal.dataset.coordY = coordY;

    if (!modal.classList.contains("modal-active")) {
      modal.classList.add("modal-active");
    }

    for (let coord of dataKeys) {
      if (coord !== coords) {
        modalCommentsWrapper.innerHTML =
          '<span class="modal-comments__comment-empty">Отзывов пока нет...</span>';
      }
    }

    ymaps.geocode(coords).then(res => {
      var markAdress = res.geoObjects.get(0).properties.get("text");
      locationItem.innerHTML = markAdress;
    });
  });

  addCommentBtn.addEventListener("click", e => {
    e.preventDefault();
    if (validate()) {
      let x = modal.dataset.coordX;
      let y = modal.dataset.coordY;
      let coords = [x, y];
      let name = modalName.value;
      let place = modalPlace.value;
      let desc = modalDesc.value;
      let address = locationItem.textContent;
      var date = new Date();
      var dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };

      let commentDate = date.toLocaleString("ru", dateOptions);

      var comment = {
        coords: coords,
        address: address,
        name: name,
        place: place,
        text: desc,
        date: commentDate
      };

      addItem(coords, address, name, place, desc, commentDate);

      if (dataComments[coords]) {
        dataComments[coords].push(comment);
      } else {
        dataComments[coords] = [];
        dataComments[coords].push(comment);
      }

      const template = document.querySelector("#comments").textContent;
      const render = Handlebars.compile(template);
      const dataValues = Object.values(dataComments);

      console.log("data Values" + JSON.stringify(dataValues));

      for (let value of dataValues) {
        console.log(value);
        if (value == dataComments[coords]) {
          const htmlComments = render(value);
          modalCommentsWrapper.innerHTML = htmlComments;
        }
      }

      let coordValue = dataComments[coords];

      if (coordValue.length <= 1) {
        myPlacemark = createPlacemark(
          coords,
          place,
          address,
          desc,
          commentDate
        );

        myMap.geoObjects.add(myPlacemark);
        clusterer.add(myPlacemark);
        myPlacemark.events
          .add("mouseenter", e => {
            e.get("target").options.set(
              "iconImageHref",
              "./img/ActiveMark.png"
            );
          })
          .add("mouseleave", e => {
            e.get("target").options.set("iconImageHref", "./img/Mark.png");
          });
      }

      clearFields();
    }
  });

  myMap.geoObjects.events.add("click", e => {
    const template = document.querySelector("#comments").textContent;
    const render = Handlebars.compile(template);
    const dataKeys = Object.keys(dataComments);
    let placeMarkCoords = e.get("target").geometry.getCoordinates();
    let [coordX, coordY] = placeMarkCoords;

    modal.dataset.coordX = coordX;
    modal.dataset.coordY = coordY;
    console.log(placeMarkCoords, coordX, coordY);

    for (let comment of dataKeys) {
      if (!modal.classList.contains("modal-active")) {
        modal.classList.add("modal-active");

        clearFields();
      }

      if (comment == placeMarkCoords) {
        const htmlComments = render(dataComments[comment]);
        modalCommentsWrapper.innerHTML = htmlComments;
      }
    }

    let geoObject = e.get("target");

    if (clusterer.getObjectState(myPlacemark).isClustered) {

      if (modal.classList.contains("modal-active")) {
        modal.classList.remove("modal-active");
      }

      clusterer.balloon.events.add("click", () => {
        if (modal.classList.contains("modal-active")) {
          modal.classList.remove("modal-active");
        }
      });
    }

    document.addEventListener("click", e => {
      const dataKeys = Object.keys(dataComments);
      let target = e.target;

      if (target.tagName === "A") {
        let coords = target.dataset.coords;
        let coordinates = coords.split(",");
        let [coordinateX, coordinateY] = coordinates;

        modal.dataset.coordX = coordinateX;
        modal.dataset.coordY = coordinateY;

        for (let comment of dataKeys) {
          if (!modal.classList.contains("modal-active")) {
            modal.classList.add("modal-active");

            clearFields();
          }

          if (comment == coords) {
            const htmlComments = render(dataComments[comment]);
            modalCommentsWrapper.innerHTML = htmlComments;
          }
        }
      }
    });
  });

  var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    "<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>" +
      "<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>" +
      "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>"
  );

  var clusterer = new ymaps.Clusterer({
    preset: "twirl#invertedRedClusterIcons",
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: true,
    clusterBalloonContentLayout: "cluster#balloonCarousel",
    clusterBalloonItemContentLayout: customItemContentLayout
  });

  myMap.geoObjects.add(clusterer);
}
