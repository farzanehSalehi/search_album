let previous_response_timestamp = 0;
let timeout;

document.getElementById("searchBar").addEventListener("keyup", on_change);

function on_change(evt) {
  clearTimeout(timeout);
  if (evt.target.value === "") {
    render_albums([]);
  } else {
    queue_album_request(evt.target.value).then(function(val) {
      render_albums(val);
    });
  }
}

const render_albums = (function() {
  const wrapper = document.querySelector("ul");

  return function(albums) {
    wrapper.innerHTML = "";

    albums.forEach(function(album) {
      wrapper.appendChild(createElement(album));
    });
  };
})();

function queue_album_request(term) {
  const url = "https://itunes.apple.com/search?media=music&entity=album&term=".concat(
    term
  );

  const executor = function(resolve, reject) {
    timeout = setTimeout(function() {
      make_net_call(url).then(function(response) {
        if (previous_response_timestamp < response.timestamp) {
          previous_response_timestamp = response.timestamp;
          resolve(response.data.results);
        }
      });
    }, 300);
  };

  const my_promise = new Promise(executor);
  return my_promise;
}

function make_net_call(url) {
  const timestamp = Date.now();

  return fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      return {
        data: response,
        timestamp: timestamp
      };
    })
    .catch(function(error) {
      console.error(
        "There has been a problem with your fetch operation: ",
        error.message
      );
    });
}

function createElement(params, wrapper) {
  let entity = document.createElement("li");

  let ParentDiv = document.createElement("div");

  let imgBoxDiv = document.createElement("div");

  let descDiv = document.createElement("div");

  let NodeA = document.createElement("a");
  let aTextlbl = document.createTextNode("Name : ");
  let aText = document.createTextNode(params.collectionName);

  let releaseNode = document.createElement("p");
  let releaseTextlbl = document.createTextNode("release date : ");
  let releaseText = document.createTextNode(params.releaseDate);

  let priceNode = document.createElement("p");
  let priceTextlbl = document.createTextNode("Price : ");
  let priceText = document.createTextNode(params.collectionPrice);

  let NodeP = document.createElement("p");
  let pTextlbl = document.createTextNode("Artist Name : ");
  let pText = document.createTextNode(params.artistName);

  let NodeImg = document.createElement("img");

  entity.setAttribute("class", "BoxArtist");

  ParentDiv.setAttribute("class", "parentDiv");

  imgBoxDiv.setAttribute("class", "imgBox");

  descDiv.setAttribute("class", "descBox");

  NodeA.setAttribute("class", "desc");

  releaseNode.setAttribute("class", "release");

  priceNode.setAttribute("class", "price");

  NodeP.setAttribute("class", "artistName");

  NodeA.setAttribute("href", params.artistViewUrl);

  NodeImg.setAttribute("src", params.artworkUrl60);
  NodeImg.setAttribute("class", "artistImage");

  entity.appendChild(ParentDiv);

  ParentDiv.appendChild(imgBoxDiv);
  ParentDiv.appendChild(descDiv);

  descDiv.appendChild(NodeA);
  descDiv.appendChild(NodeP);
  descDiv.appendChild(releaseNode);
  descDiv.appendChild(priceNode);

  imgBoxDiv.appendChild(NodeImg);

  NodeA.appendChild(aTextlbl);
  NodeA.appendChild(aText);

  imgBoxDiv.appendChild(NodeImg);

  NodeP.appendChild(pTextlbl);
  NodeP.appendChild(pText);

  descDiv.appendChild(NodeP);

  releaseNode.appendChild(releaseTextlbl);
  releaseNode.appendChild(releaseText);

  descDiv.appendChild(releaseNode);

  priceNode.appendChild(priceTextlbl);
  priceNode.appendChild(priceText);

  descDiv.appendChild(priceNode);

  return entity;
}
