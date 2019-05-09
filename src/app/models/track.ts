import { environment } from '../../environments/environment';

export class Track {
  title: string;
  artist: string;
  album: string;
  cover_art: string;
  purchase_link: string;
  duration: any;
  played_at: any;
  ends_at: any;

  constructor(data: any) {
    this.title = data['title'];
    this.artist = data['artist'];
    this.album = data['album'];
    this.cover_art = data['cover_art'];
    this.purchase_link = data['purchase_link'];
    this.duration = data['duration'];
    this.played_at = data['played_at'];

    if (!this.cover_art && environment.now_playing.generic_cover) {
      this.cover_art = environment.now_playing.generic_cover;
    }

    if (this.played_at && this.duration) {
      this.ends_at = ((this.played_at / 1000) + (this.duration / 1000)) * 1000;
    } else {
      this.ends_at = (new Date).getTime() + 30000;
    }
  }

  hasEnded() {
    const date = new Date();
    return date.getTime() >= this.ends_at;
  }

  timeUntilEnds() {
    const date = new Date();
    const ends_in = this.ends_at - date.getTime();
    return (ends_in < 0) ? 10000 : ends_in;
  }

  playedAtDate(): Date {
    return new Date(this.played_at);
  }
}
