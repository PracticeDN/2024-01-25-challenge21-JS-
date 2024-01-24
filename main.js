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

// 로컬스토리지에서 데이터 로드
function loadFromLocalStorage() {
  const storedDogs = localStorage.getItem("dogsImgUrls");
  if (storedDogs) {
    dogsImgUrls = JSON.parse(storedDogs);
  }
}

// 로컬스토리지에 데이터 저장
function saveToLocalStorage() {
  localStorage.setItem("dogsImgUrls", JSON.stringify(dogsImgUrls));
}

// 강아지 데이터 fetch 함수
async function fetchDogs(dogsNumber) {
  const response = await fetch(RANDOM_DOG_API_URL + dogsNumber, {
    method: "GET",
  });

  const data = await response.json();
  return data.message;
}

// 견종 리스트 fetch 함수
async function fetchDogsList() {
  const response = await fetch(DOGS_LIST_API_URL, {
    method: "GET",
  });

  const data = await response.json();
  return data.message;
}

// 견종 리스트 option에 추가하는 함수
async function setDogListToOptions() {
  const dogsList = await fetchDogsList();
  const keysOfDogsList = Object.keys(dogsList);

  keysOfDogsList.forEach((doglist) => {
    const option = document.createElement("option");
    option.innerHTML = `${doglist}`;
    select.append(option);
  });
}

// 강아지 화면에 렌더링하는 공통 함수
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

// 강아지 가져오는 함수
async function getRandomDogs() {
  if (dogsImgUrls.length === 0) {
    dogsImgUrls = await fetchDogs("42");
    saveToLocalStorage();
  }

  renderDogs(dogsImgUrls);
}

// 강아지 필터링
filterButton.addEventListener("click", () => {
  const value = input.value;

  const filteredDogs = dogsImgUrls.filter((dogImgUrl) => {
    return dogImgUrl.includes(value);
  });

  renderDogs(filteredDogs);
});

// 강아지 필터링 (select 태그로 인한 필터링)
select.addEventListener("change", (event) => {
  const selectedValue = event.target.value;

  const filteredDogs = dogsImgUrls.filter((dogImgUrl) => {
    return dogImgUrl.includes(selectedValue);
  });

  renderDogs(filteredDogs);
});

// 강아지 더 가져오기
moreDogsButton.addEventListener("click", async () => {
  const newDogsImgUrls = await fetchDogs("42");
  dogsImgUrls = dogsImgUrls.concat(newDogsImgUrls);

  saveToLocalStorage();

  renderDogs(dogsImgUrls);
});

// 페이지 상단으로 이동
topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Reset 버튼 클릭 시 새로운 강아지 42마리 다시 fetch
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
