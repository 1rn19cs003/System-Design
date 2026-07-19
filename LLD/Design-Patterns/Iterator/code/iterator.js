/**
 * Iterator Pattern — a Playlist exposes a PlaylistIterator instead of its internal array.
 * Run: node iterator.js
 */

class Playlist {
  constructor() {
    this.songs = [];
  }

  addSong(song) {
    this.songs.push(song);
  }

  createIterator() {
    return new PlaylistIterator(this.songs);
  }
}

class PlaylistIterator {
  constructor(songs) {
    this.songs = songs;
    this.position = 0;
  }

  hasNext() {
    return this.position < this.songs.length;
  }

  next() {
    const song = this.songs[this.position];
    this.position += 1;
    return song;
  }
}

const playlist = new Playlist();
playlist.addSong("Clair de Lune");
playlist.addSong("Gymnopedie No.1");
playlist.addSong("River Flows in You");

const iterator = playlist.createIterator();

console.log("Playing playlist:");
while (iterator.hasNext()) {
  console.log(`Now playing: ${iterator.next()}`);
}

module.exports = { Playlist, PlaylistIterator };
