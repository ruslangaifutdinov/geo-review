let modal = document.querySelector(".modal");
let btnClose = document.querySelector(".modal-header__close");
let modalCommentsWrapper = document.querySelector(".modal-comments__wrapper");
let locationItem = document.querySelector(".modal-header__location");
let addCommentBtn = document.querySelector(".modal-comment__btn");
let modalName = document.querySelector(".modal-comment__name");
let modalPlace = document.querySelector(".modal-comment__place");
let modalDesc = document.querySelector(".modal-comment__desc");

btnClose.addEventListener("click", () => {
  modal.classList.remove("modal-active");

  clearFields();

  modalCommentsWrapper.innerHTML =
    '<span class="modal-comments__comment-empty">Отзывов пока нет...</span>';
});

function clearFields() {
  modalName.value = "";
  modalPlace.value = "";
  modalDesc.value = "";
  modalName.placeholder = "Ваше имя";
  modalPlace.placeholder = "Укажите место";
  modalDesc.placeholder = "Поделитесь впечатлениями";
}

let MouseCoords = {

  getX: (e) => {
    if (e.pageX) {
      return e.pageX;
    } else if (e.clientX) {
      return (
        e.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft) -
        document.documentElement.clientLeft
      );
    }

    return 0;
  },

  getY: (e) => {
    if (e.pageY) {
      return e.pageY;
    } else if (e.clientY) {
      return (
        e.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop) -
        document.documentElement.clientTop
      );
    }

    return 0;
  }
};

window.onclick = (e) => {
  if (e.target.tagName == "YMAPS") {
    let positionX = MouseCoords.getX(e);
    let positionY = MouseCoords.getY(e);

    modal.style.left = positionX + "px";
    modal.style.top = positionY + "px";
  }
};

window.onload = addListeners();

let x_pos = 0,
    y_pos = 0;

function addListeners() {
  modal.addEventListener("mousedown", () => {
    modal.classList.add("draggable");
  });
  modal.addEventListener("mousedown", mouseDown, false);
  modal.addEventListener("mouseup", () => {
    modal.classList.remove("draggable");
  });
  window.addEventListener("mouseup", mouseUp, false);
}

function mouseUp() {
  window.removeEventListener("mousemove", divMove, true);
}

function mouseDown(e) {
  x_pos = e.clientX - modal.offsetLeft;
  y_pos = e.clientY - modal.offsetTop;
  window.addEventListener("mousemove", divMove, true);
}

function divMove(e) {
  if (
    e.target.classList.contains("modal-header") ||
    e.target.classList.contains("modal-header__location")
  ) {
    modal.style.top = e.clientY - y_pos + "px";
    modal.style.left = e.clientX - x_pos + "px";
  }
}

function validate() {
  let name = modalName.value.trim();
  let place = modalPlace.value.trim();
  let desc = modalDesc.value.trim();

  if (
    name == "" ||
    name.match(/\d+/g) ||
    place == "" ||
    place.match(/\d+/g) ||
    desc == ""
  ) {
    if (name == "" || name.match(/\d+/g)) {
      modalName.value = "";
      modalName.style.borderColor = "red";
      modalName.placeholder = "Введите правильное значение имени";
    } else {
      modalName.style.borderColor = "rgb(196,196,196)";
    }

    if (place == "" || place.match(/\d+/g)) {
      modalPlace.value = "";
      modalPlace.style.borderColor = "red";
      modalPlace.placeholder = "Введите правильное значение места";
    } else {
      modalPlace.style.borderColor = "rgb(196,196,196)";
    }

    if (desc == "") {
      modalDesc.style.borderColor = "red";
    } else {
      modalDesc.style.borderColor = "rgb(196,196,196)";
    }

    return false;
  } else {
    return true;
  }
}
