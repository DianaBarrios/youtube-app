const API_KEY = "AIzaSyCkRkRuXSv06HCxTZ9DHR9-ZY9_b1mIvbs";
let currSearch = "";

$(document).ready(function() {
  // This function gets the data from the YouTube API and displays it on the page
  function getResults(searchTerm, page) {
    $.getJSON(
      "https://www.googleapis.com/youtube/v3/search",
      {
        part: "snippet",
        key: API_KEY,
        q: searchTerm,
        type: "video",
        maxResults: 10,
        pageToken: page
      },
      function(data) {
        if (data.pageInfo.totalResults == 0) {
          alert("No results!");
        }
        // If no results, empty the list
        displayResults(data);
      }
    );
  }

  //Display results in ul
  function displayResults(data) {
    var prevPage = data.prevPageToken;
    var nextPage = data.nextPageToken;
    var videos = data.items;
    var html = "";
    $.each(videos, function(index, video) {
      // Append results li to ul
      console.log(video.snippet.title);
      console.log(video.snippet.thumbnails.high.url);
      html =
        html +
        "<li><p>" +
        video.snippet.title +
        "</p> <a target='_blank' href='https://www.youtube.com/watch?v=" +
        video.id.videoId +
        "'><img src='" +
        video.snippet.thumbnails.high.url +
        "'/></a></li>";
    });
    $("#results ul").html(html);

    if (prevPage && nextPage) {
      let html = `
            <button id="prev-btn"> Prev </button>
            <button id="next-btn"> Next </button>`;
      $("#controls").html(html);
      $("#prev-btn").click(function(event) {
        getResults(currSearch, prevPage);
      });
    } else if (!prevPage && nextPage) {
      let html = `<button id="next-btn"> Next </button>`;
      $("#controls").html(html);
    }
    $("#next-btn").click(function(event) {
      getResults(currSearch, nextPage);
    });
  }
  //Use search term
  $("#submit-btn").click(function(event) {
    event.preventDefault();
    currSearch = $("#topic-input").val();
    getResults(currSearch, "");
  });
});
