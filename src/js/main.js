/*HEADER BURGER*/

const iconMenu = document.querySelector(".menu__icon");
const menuBody = document.querySelector(".menu__body");
if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    iconMenu.classList.toggle("__active");
    menuBody.classList.toggle("__active");
  });
}

/*SUBMENU ACTIVE*/

/*
let menuParents = document.querySelectorAll(".menu-page__parent");
function handleTabletChange(e) {
  if (e.matches) {
    for (let i = 0; i < menuParents.length; i++) {
      const menuParent = menuParents[i];
      menuParent.addEventListener("click", function (e) {
        e.preventDefault()
        menuParent.classList.toggle("__active");

      });
    }
  } else {
    for (let i = 0; i < menuParents.length; i++) {
      const menuParent = menuParents[i];
      menuParent.addEventListener("mouseenter", function (e) {
        menuParent.classList.add("__active");
      });
      menuParent.addEventListener("mouseleave", function (e) {
        menuParent.classList.remove("__active");
      });
    }
  }

}
mQuery.addListener(handleTabletChange)
handleTabletChange(mQuery)
*/

/*ALTERNATIVE APPROACH*/

const mQuery = window.matchMedia("(max-width: 991px)");
if (mQuery.matches) {
  let menuParents = document.querySelectorAll(".menu-page__parent a");
  for (let i = 0; i < menuParents.length; i++) {
    const menuParent = menuParents[i];
    menuParent.addEventListener("click", function (e) {
      menuParent.parentElement.classList.toggle("__active");
      e.target.closest(".menu-page__link ").classList.toggle("__active");
      e.preventDefault();
    });
  }
} else {
  let menuParents = document.querySelectorAll(".menu-page__parent");
  for (let i = 0; i < menuParents.length; i++) {
    const menuParent = menuParents[i];
    menuParent.addEventListener("mouseenter", function (e) {
      e.preventDefault();
      menuParent.classList.add("__active");
      e.target.closest(".menu-page__link ").classList.add("__active");
    });
    menuParent.addEventListener("mouseleave", function (e) {
      e.preventDefault();
      menuParent.classList.remove("__active");
      e.target.closest(".menu-page__link ").classList.remove("__active");
    });
  }
}

/*MENU BURGERS  SIDEBAR*/

let menuPageBurger = document.querySelector(".menu-page__lines");
let burger = document.querySelector(".menu-page__burger");
let menuPageBody = document.querySelector(".menu-page__body");
burger.addEventListener("click", function (e) {
  menuPageBurger.classList.toggle("__active");
  menuPageBody.classList.toggle("__active");
});

//CATEGORIES SEARCH

let searchButton = document.querySelector(".search-page__title");

let categoriesSearch = document.querySelector(".categories-search__row");
searchButton.addEventListener("click", function (e) {
  categoriesSearch.classList.toggle("__active");
  searchButton.classList.toggle("__active");
});

//DYNAMIC SEARCH BUTTON

let numberOfCategories = 0;
let categories = document.querySelectorAll(".checkbox__input");
let selected = document.querySelector(".search-page__selected");
let all = document.querySelector(".search-page__all");
for (let category of categories) {
  category.addEventListener("change", function (e) {
    category.classList.toggle("selected");
    if (category.classList.contains("selected")) {
      numberOfCategories += 1;
    } else {
      numberOfCategories -= 1;
    }
    if (numberOfCategories > 0) {
      selected.style.display = "block";
      all.style.display = "none";
      selected.innerHTML = `${selected.getAttribute(
        "data-text"
      )} ${numberOfCategories}`;
    } else {
      selected.style.display = "none";
      all.style.display = "block";
    }
  });
}

//DYNAMIC ADAPTIVE

class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll("[data-da]")];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(
        ({ breakpoint }) =>
          `(${this.type}-width: ${breakpoint}px),${breakpoint}`
      )
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({ breakpoint }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index);
        }
      });
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === "last" || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === "first") {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === "min") {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return -1;
          }
          if (a.place === "last" || b.place === "first") {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return 1;
          }
          if (a.place === "last" || b.place === "first") {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
const da = new DynamicAdapt("max");
da.init();

//Slider Swiper

if (document.querySelector(".products-slider")) {
  let productsSlider = new Swiper(".products-slider__item", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    speed: 800,
    navigation: {
      nextEl: ".products-slider__arrow_next",
      prevEl: ".products-slider__arrow_prev",
    },
    pagination: {
      el: ".products-slider__info",
      type: "fraction",
    },
    on: {
      lazyImageReady: function () {
        ibg();
      },
    },
  });
}

if (document.querySelector(".brands-slide__body")) {
  let productsSlider = new Swiper(".brands-slide__body", {
    observer: true,
    observeParents: true,
    slidesPerView: 3,
    spaceBetween: 0,
    draggable: true,
    loop: true,
    speed: 800,
    navigation: {
      nextEl: ".brands-slide__arrow_next",
      prevEl: ".brands-slide__arrow_prev",
    },
    on: {
      lazyImageReady: function () {
        ibg();
      },
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        autoHeight: true,
      },

      480: {
        slidesPerView: 2,
      },

      600: {
        slidesPerView: 3,
      },

      800: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 5,
      },
    },
  });
}
