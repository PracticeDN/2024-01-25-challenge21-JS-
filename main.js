const RANDOM_DOG_API_URL = "https://dog.ceo/api/breeds/image/random/";
const DOGS_LIST_API_URL = "https://dog.ceo/api/breeds/list/all";
const dogsContainer = document.querySelector(".dogs-container");
const filterButton = document.querySelector(".filter-button");
const input = document.querySelector("input");
const select = document.querySelector("select");
const moreDogsButton = document.querySelector(".more-button");
const topButton = document.querySelector(".top-button");
const resetButton = document.querySelector(".reset-button");

let dogsImgUrls = [];

function loadFromLocalStorage() {
  const storedDogs = localStorage.getItem("dogsImgUrls");
  if (storedDogs) {
    dogsImgUrls = JSON.parse(storedDogs);
  }
}

function saveToLocalStorage() {
  localStorage.setItem("dogsImgUrls", JSON.stringify(dogsImgUrls));
}

async function fetchDogs(dogsNumber) {
  const response = await fetch(RANDOM_DOG_API_URL + dogsNumber, {
    method: "GET",
  });

  const data = await response.json();
  return data.message;
}

async function fetchDogsList() {
  const response = await fetch(DOGS_LIST_API_URL, {
    method: "GET",
  });

  const data = await response.json();
  return data.message;
}

async function setDogListToOptions() {
  const dogsList = await fetchDogsList();
  const keysOfDogsList = Object.keys(dogsList);

  keysOfDogsList.forEach((doglist) => {
    const option = document.createElement("option");
    option.innerHTML = `${doglist}`;
    select.append(option);
  });
}

function renderDogs(dogsImgUrls) {
  dogsContainer.innerHTML = "";

  if (dogsImgUrls.length === 0) {
    const noDogsMessage = document.createElement("h2");
    noDogsMessage.textContent = "강아지가 없어요 ㅠㅠ";
    dogsContainer.append(noDogsMessage);
    return;
  }

  dogsImgUrls.forEach((dogImgUrl) => {
    const dogsEl = document.createElement("img");
    dogsEl.src = dogImgUrl;
    dogsContainer.append(dogsEl);
  });
}

async function getRandomDogs() {
  if (dogsImgUrls.length === 0) {
    dogsImgUrls = await fetchDogs("42");
    saveToLocalStorage();
  }

  renderDogs(dogsImgUrls);
}

filterButton.addEventListener("click", () => {
  const value = input.value;

  const filteredDogs = dogsImgUrls.filter((dogImgUrl) => {
    return dogImgUrl.includes(value);
  });

  renderDogs(filteredDogs);
});

select.addEventListener("change", (event) => {
  const selectedValue = event.target.value;

  const filteredDogs = dogsImgUrls.filter((dogImgUrl) => {
    return dogImgUrl.includes(selectedValue);
  });

  renderDogs(filteredDogs);
});

moreDogsButton.addEventListener("click", async () => {
  const newDogsImgUrls = await fetchDogs("42");
  dogsImgUrls = dogsImgUrls.concat(newDogsImgUrls);

  saveToLocalStorage();

  renderDogs(dogsImgUrls);
});

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

resetButton.addEventListener("click", () => {
  dogsImgUrls = [];
  localStorage.removeItem("dogsImgUrls");

  getRandomDogs();
});

addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  getRandomDogs();
  fetchDogsList();
  setDogListToOptions();
  loadFromLocalStorage();
});
