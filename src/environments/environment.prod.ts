export const environment = {
  production: true,
  now_playing: {
    provider: 1,
    data_url: 'http://np.tritondigital.com/public/nowplaying?mountName=WSPKFMAAC&numberToFetch={{limit}}&eventType=track',
    generic_cover: './assets/img/mur-noartist-logo.png',
    format_tracks: false,
    default_title: 'Unknown Title',
    default_artist: 'Unknown Artist'
  },
  streaming: {
    url: 'http://stream.urbanza.co.za/mzansiurban_high',
    format: ['aac', 'mp3'],
    html5: true,
    autoplay: true
  },
  show_lineup: {
    url: 'http://smatmassbsc.westeurope.cloudapp.azure.com:8080/api/current-show-data',
  },
  mzansiurban: {
    provider: 3,
    data_url: 'http://radioinbox.co.za:8000/mzansiurban1',
    generic_cover: './assets/img/mur-noartist-logo.png',
    format_tracks: false,
    default_title: 'Unknown Title',
    default_artist: 'Unknown Artist'
  }
};
