"""
Iterator Pattern — a Playlist exposes a PlaylistIterator instead of its internal list.
Run: python iterator.py
"""


class Playlist:
    def __init__(self):
        self.songs = []

    def add_song(self, song):
        self.songs.append(song)

    def create_iterator(self):
        return PlaylistIterator(self.songs)


class PlaylistIterator:
    def __init__(self, songs):
        self.songs = songs
        self.position = 0

    def has_next(self):
        return self.position < len(self.songs)

    def next(self):
        song = self.songs[self.position]
        self.position += 1
        return song


if __name__ == "__main__":
    playlist = Playlist()
    playlist.add_song("Clair de Lune")
    playlist.add_song("Gymnopedie No.1")
    playlist.add_song("River Flows in You")

    iterator = playlist.create_iterator()

    print("Playing playlist:")
    while iterator.has_next():
        print(f"Now playing: {iterator.next()}")
