// Iterator Pattern — a Playlist exposes a PlaylistIterator instead of its internal vector.
// Compile: g++ -std=c++14 Iterator.cpp -o iterator
// Run:     ./iterator

#include <iostream>
#include <string>
#include <vector>

class PlaylistIterator {
public:
    explicit PlaylistIterator(const std::vector<std::string>& songs) : songs_(songs), position_(0) {}

    bool hasNext() const {
        return position_ < songs_.size();
    }

    std::string next() {
        std::string song = songs_[position_];
        position_++;
        return song;
    }

private:
    const std::vector<std::string>& songs_;
    size_t position_;
};

class Playlist {
public:
    void addSong(const std::string& song) {
        songs_.push_back(song);
    }

    PlaylistIterator createIterator() const {
        return PlaylistIterator(songs_);
    }

private:
    std::vector<std::string> songs_;
};

int main() {
    Playlist playlist;
    playlist.addSong("Clair de Lune");
    playlist.addSong("Gymnopedie No.1");
    playlist.addSong("River Flows in You");

    PlaylistIterator iterator = playlist.createIterator();

    std::cout << "Playing playlist:" << std::endl;
    while (iterator.hasNext()) {
        std::cout << "Now playing: " << iterator.next() << std::endl;
    }

    return 0;
}
