// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  now_playing: {
    provider: 3,
    data_url: 'http://np.tritondigital.com/public/nowplaying?mountName=WSPKFMAAC&numberToFetch={{limit}}&eventType=track',
    alt_url: 'http://stream.urbanza.co.za/status-json.xsl',
    generic_cover: './assets/img/mur-noartist-logo.png',
    format_tracks: false,
    default_title: 'Unknown Title',
    default_artist: 'Unknown Artist'
  },
  streaming_audio: {
    url: 'http://stream.urbanza.co.za/mzansiurban_high',
    alt_url: 'http://radioinbox.co.za:8000/mzansiurban1',
    format: ['aac', 'mp3'],
    html5: true,
    autoplay: true
  },
  show_lineup: {
    url: 'http://smatmassbsc.westeurope.cloudapp.azure.com:8080/api/current-show-data'
  },
  lastfm: {
    LASTFM_APIURL: 'http://ws.audioscrobbler.com/2.0/?',
    LASTFM_APIKEY: '15c555d462be60c90948b7d4e74882de'
  }
};
