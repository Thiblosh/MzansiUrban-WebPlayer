$(window).on("load", function () {
  function radioTitle() {

    var currentArtist = '';
    var currentSong = '';
    var url = 'http://radioinbox.co.za:8000/json.xsl?callback=?';

    $.ajax({
      type: 'GET',
      url: url,
      async: false,
      jsonpCallback: 'parseMusic',
      contentType: "application/json",
      dataType: 'jsonp',
      success: function (json) {

        var nowSongInfo = mainPlayerCurrentlyPlaying(json);
        var artist = nowSongInfo[0].trim();
        var song = nowSongInfo[1].trim();

        if ((artist !== $.currentArtist) && (song !== $.currentSong)) {
          $.currentArtist = artist;
          $.currentSong = song;
          lastFMSongInfoAPI($.currentArtist, $.currentSong);
        }

        $('#artist-title-info').text(song);
        $('#song-title-info').text(artist);
        $(document).prop('title', song + ' by ' + artist + '|Mzansi Urban Radio');
      },
      error: function (e) {
        console.log(e.message);
      }
    });
  }

  function lastFMSongInfoAPI(artist, track) {
    var lastfmAPIKey = '15c555d462be60c90948b7d4e74882de';
    var url = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + lastfmAPIKey + '&artist=' + artist + '&track=' + track + '&format=json';
    url = encodeURI(url);

    $.ajax({
      type: 'GET',
      url: url,
      async: false,
      jsonpCallback: 'parseMusic',
      contentType: "application/json",
      dataType: 'jsonp',
      success: function (json) {

        if (!json['error']) {
          var albumImages = json['track']['album']['image'];
          if (albumImages) {
            // console.log(albumImages);
            jQuery.each(albumImages, function (i, albumImage) {
              if (albumImage['size'] === 'large') {
                var largeAlbumImage = albumImage['#text'];
                // console.log(largeAlbumImage);
                $('#album-cover-img').attr('src', largeAlbumImage);
              }
            });
          } else {
            $('#album-cover-img').attr('src', 'images/mur-noartist-logo.png');
          }

        }
      },
      error: function (e) {
        $('#album-cover-img').attr('src', 'images/mur-noartist-logo.png');
        // console.log(e.message);
      }
    });
  }

  function mainPlayerCurrentlyPlaying(json) {
    var currentMount = '/mzansiurban1'; //$('input[name=currentPlayingMount]').val();

    if (currentMount != '') {
      var title = json['mounts'][currentMount]['title'];

      if (title.indexOf("Unknown") > -1)
        return ["Song Information Not Available.", "Mzansi Urban Radio"];
      else
        return formatCurrentTitle(title);
    } else
      return "---";
  }

  function formatCurrentTitle(title) {
    if (title != '') {
      if (title.indexOf("Unknown") > -1) {
        return ["Song Information Not Available.", "Mzansi Urban Radio"];
      } else if (title.indexOf("Jingle") > -1) {
        return ["Mzansi Urban Radio", "The Southern Urban Experience"];
      } else {
        var details = title.split('-');
        return details;
      }
    } else {
      return ["Song Information Not Available.", "Mzansi Urban Radio"];
    }
  }

  $(document).ready(function () {
    setTimeout(function () {
      radioTitle();
    }, 2000);
    setInterval(function () {
      radioTitle();
    }, 15000);
  });
});
