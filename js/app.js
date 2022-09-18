let elForm = $(".form");
let elSearch = $(".search-input");
let elSelect = $(".form-select")
let elList = $(".list");
let elTempRender = $("#tempRender").content;
let elErrTemp = $("#errtemp").content
let elSpinner = document.querySelector(".spinner")
let pagination = $(".page")
let pageResult = $(".movies__page-res")
let pageButton = document.querySelectorAll(".movies__btns-pg")
let page = 1
let elModal = $(".modal")

let arr = []

// errorsTemp
let errRenderMovie = errr => {
  elList.innerHTML = null
  let createFragmentErr = document.createDocumentFragment()
  let errMovie = elErrTemp.cloneNode(true)
  errMovie.querySelector(".errtext").textContent = errr;
  createFragmentErr.appendChild(errMovie)
  elList.appendChild(createFragmentErr)
}

// renderTemp
let tempRenderMovie = (movies) => {
  elList.innerHTML = null
  let createFragment = document.createDocumentFragment()
  movies.forEach(movie => {
    let tempClonNode = elTempRender.cloneNode(true)

    $(".card-img-top", tempClonNode).src = movie.Poster
    $(".card-img-top", tempClonNode).alt = movie.Title
    $(".card-title", tempClonNode).textContent = movie.Title
    $(".card-text", tempClonNode).textContent = `Year: ${
      movie.Year
    }`
    $(".modal-button", tempClonNode).value = movie.imdbID
    $(".card-year-text", tempClonNode).textContent = `Cotegories: ${
      movie.Type
    }`
    createFragment.appendChild(tempClonNode)
  })

  elList.appendChild(createFragment)
}


// fetchs
const renderMovie = async (movie = "", category = "", page = 1) => {
  try {
    
    const response = await fetch(`https://www.omdbapi.com/?&apikey=2ae854bc&s=${movie}&type=${category}&page=${page}`);

    const data = await response.json();
    // console.log(sdsds);
    arr = data.Search
    tempRenderMovie(data.Search)
    // renderImdb(data.Search.imdbID)
    // if (!Response == 'True') {
    //   throw new Error(errRenderMovie("Bu yerda xatolik bor"));
    // }


  } catch (err) {
    pagination.classList.add("d-none")
    errRenderMovie("Kiritgan filmingiz noto'gri!")
  } finally {
    elSpinner.classList.add("d-none");
  }

}

pagination.classList.add("d-none")
// forms
elForm.addEventListener("submit", evt => {
  evt.preventDefault()
  elList.innerHTML = null
  elSpinner.classList.remove("d-none");
  pagination.classList.remove("d-none")
  page = 1
  pageResult.textContent = page
  elSearchValue = elSearch.value.toLowerCase().trim()
  selectValue = elSelect.value
  renderMovie(elSearchValue, selectValue, page)

})


elList.addEventListener("click", (e) => {
  if (e.target.matches(".js-query")) {
    const countryCode = e.target.value;
    const currentCountry = arr.find(counrty => counrty.imdbID == countryCode);
    $(".modal-title", elModal).textContent = currentCountry.Title
    $(".modal-img", elModal).src = currentCountry.Poster
    $(".modal-img", elModal).alt = currentCountry.Title
    $(".modal-texttype", elModal).textContent = currentCountry.Type
    $(".modal-textyear", elModal).textContent = currentCountry.Year
  }

});

pageButton.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.value == "preview") {
      if (page > 1) {
        --page
        pageResult.textContent = page
        renderMovie(elSearchValue, selectValue, page)
      }
    } else if (btn.value == "next") {
      ++page
      pageResult.textContent = page
      renderMovie(elSearchValue, selectValue, page)
    }
  })
});