// Iterator Pattern — a Playlist exposes a PlaylistIterator instead of its internal array.
// Compile: javac Iterator.java
// Run:     java Iterator

import java.util.ArrayList;
import java.util.List;

interface SongIterator {
    boolean hasNext();
    String next();
}

class Playlist {
    private List<String> songs = new ArrayList<>();

    void addSong(String song) {
        songs.add(song);
    }

    SongIterator createIterator() {
        return new PlaylistIterator(songs);
    }
}

class PlaylistIterator implements SongIterator {
    private List<String> songs;
    private int position = 0;

    PlaylistIterator(List<String> songs) {
        this.songs = songs;
    }

    public boolean hasNext() {
        return position < songs.size();
    }

    public String next() {
        String song = songs.get(position);
        position++;
        return song;
    }
}

public class Iterator {
    public static void main(String[] args) {
        Playlist playlist = new Playlist();
        playlist.addSong("Clair de Lune");
        playlist.addSong("Gymnopedie No.1");
        playlist.addSong("River Flows in You");

        SongIterator iterator = playlist.createIterator();

        System.out.println("Playing playlist:");
        while (iterator.hasNext()) {
            System.out.println("Now playing: " + iterator.next());
        }
    }
}
