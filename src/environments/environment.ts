// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  now_playing: {
    provider: 1,
    data_url: 'http://np.tritondigital.com/public/nowplaying?mountName=WSPKFMAAC&numberToFetch={{limit}}&eventType=track',
    generic_cover: './assets/img/generic-cover-art.jpg',
    format_tracks: true,
    default_title: 'Unknown Title',
    default_artist: 'Unknown Artist'
  },
  streaming: {
    url: 'http://stream.urbanza.co.za/mzansiurban_high',
    format: ['aac', 'mp3'],
    html5: true,
    autoplay: true
  }
};
