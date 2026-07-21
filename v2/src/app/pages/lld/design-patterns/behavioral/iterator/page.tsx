import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Iterator Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Iterator Pattern — a Playlist exposes a PlaylistIterator instead of its internal array.
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
}`,
    output: `Playing playlist:
Now playing: Clair de Lune
Now playing: Gymnopedie No.1
Now playing: River Flows in You`,
  },
  python: {
    code: `"""
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
        print(f"Now playing: {iterator.next()}")`,
    output: `Playing playlist:
Now playing: Clair de Lune
Now playing: Gymnopedie No.1
Now playing: River Flows in You`,
  },
  javascript: {
    code: `/**
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
  console.log(\`Now playing: \${iterator.next()}\`);
}

module.exports = { Playlist, PlaylistIterator };`,
    output: `Playing playlist:
Now playing: Clair de Lune
Now playing: Gymnopedie No.1
Now playing: River Flows in You`,
  },
  cpp: {
    code: `// Iterator Pattern — a Playlist exposes a PlaylistIterator instead of its internal vector.
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
}`,
    output: `Playing playlist:
Now playing: Clair de Lune
Now playing: Gymnopedie No.1
Now playing: River Flows in You`,
  },
};

const qaItems = [
  {
    q: 'What problem does Iterator solve?',
    a: <>It lets client code traverse a collection&apos;s elements one at a time using a uniform <code>hasNext()</code>/<code>next()</code> interface, without needing to know or depend on how the collection stores its elements internally. Changing the internal storage doesn&apos;t break traversal code.</>,
  },
  {
    q: 'How does Iterator support multiple simultaneous traversals of the same collection?',
    a: 'Because each iterator holds its own cursor/position state separate from the collection itself, you can create several independent iterators over the same collection, each tracking its own progress, without them interfering with each other.',
  },
  {
    q: 'Do you need to implement Iterator by hand in modern languages?',
    a: <>Rarely, for standard use — most modern languages have Iterator baked directly into their syntax (Python&apos;s <code>__iter__</code>/<code>__next__</code>, Java&apos;s <code>Iterable</code>, JavaScript&apos;s <code>Symbol.iterator</code>, C++ ranges), so implementing that language&apos;s iteration protocol is usually preferable to hand-rolling a custom Iterator class, unless you have a niche traversal need the built-in protocol doesn&apos;t cover.</>,
  },
  {
    q: 'What is "concurrent modification" and how does it relate to Iterator?',
    a: 'It’s the bug that occurs when a collection is mutated while an iterator is mid-traversal over it — the iterator’s cursor and internal assumptions about the collection’s size/structure no longer match reality, which can cause skipped elements, repeated elements, or a thrown exception depending on the language/implementation.',
  },
];

export default function IteratorPatternPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/lld/design-patterns"
          backLabel="Back to Design Patterns"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'theory', label: 'Theory' },
            { id: 'diagram', label: 'Diagram' },
            { id: 'when-to-use', label: 'When to Use' },
            { id: 'real-world', label: 'Real-World Examples' },
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Design Patterns', href: '/pages/lld/design-patterns' },
              { label: 'Behavioral', href: '/pages/lld/design-patterns#behavioral' },
              { label: 'Iterator' },
            ]}
          />
          <h1 id="overview">Iterator Pattern</h1>
          <p>Gives a collection a way to be traversed one element at a time through a uniform interface, without exposing how it stores its elements internally.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;ve built a <code>Playlist</code> class that stores songs internally as an array. Client code that wants to loop through the songs currently has to know it&apos;s an array and use array indexing directly — <code>playlist.songs[i]</code>. If you later switch the internal storage to a linked list or a tree (say, to support efficient insertion in the middle), every piece of client code that iterated over <code>playlist.songs[i]</code> breaks, because it was relying on the internal representation rather than just &quot;give me the songs one at a time.&quot;</p>
            <p>Iterator solves this by giving the collection a method that returns a separate <code>Iterator</code> object, which exposes only <code>hasNext()</code> and <code>next()</code>. Client code loops using just those two methods, with zero knowledge of whether the underlying storage is an array, a linked list, or something else entirely. The traversal logic and position-tracking live inside the Iterator, not scattered across every piece of code that needs to loop over the collection.</p>

            <h3>How it&apos;s built</h3>
            <p>An <code>Aggregate</code> interface (<code>Playlist</code>) declares a method like <code>createIterator()</code> that returns an <code>Iterator</code>. The <code>Iterator</code> interface declares <code>hasNext()</code> and <code>next()</code>. A concrete iterator (<code>PlaylistIterator</code>) holds a reference to the collection and an internal position/cursor, incrementing it on each <code>next()</code> call and checking bounds in <code>hasNext()</code>. Client code calls <code>iterator.hasNext()</code> in a loop condition and <code>iterator.next()</code> to advance, never touching the collection&apos;s internal storage directly.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Keep the iterator&apos;s cursor state entirely inside the iterator object, not the collection — that&apos;s what lets multiple independent traversals of the same collection coexist.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Mutating the underlying collection while an iterator is mid-traversal over it — a classic &quot;concurrent modification&quot; bug where the iterator&apos;s assumptions no longer match the collection&apos;s real state.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Most modern languages bake iteration directly into the language (<code>for...of</code> in JavaScript, <code>for</code> over anything implementing <code>Iterable</code> in Python/Java, range-based <code>for</code> in C++) via this exact pattern under the hood — so explicitly hand-rolling your own <code>Iterator</code> class is usually unnecessary unless you&apos;re building a custom collection type that needs to support this built-in iteration syntax. Also, if the underlying collection is mutated while an iterator is mid-traversal (elements added or removed), the iterator can behave unpredictably or throw — a real, common bug class often called &quot;concurrent modification.&quot;</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/iterator/class-diagram.svg"
                alt="Iterator pattern class diagram showing Playlist creating a PlaylistIterator that implements SongIterator, exposing hasNext() and next() to client code"
              />
              <figcaption>Client code only ever calls hasNext()/next() — it never sees Playlist&apos;s internal storage</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You&apos;re building a custom collection type and want client code to traverse it without depending on its internal storage.</li>
                  <li>You want to support multiple simultaneous, independent traversals of the same collection.</li>
                  <li>You want a uniform way to traverse different collection types through the same interface.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>Your language&apos;s built-in iteration protocol already covers your case — implement that protocol instead of a bespoke Iterator class.</li>
                  <li>The collection is simple and traversal is always the same, direct loop — a separate Iterator object adds no real value.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing that Iterator is largely already built into the language you&apos;re using, and being able to explain how (Python&apos;s <code>__iter__</code>/<code>__next__</code>, Java&apos;s <code>Iterable</code>, JavaScript&apos;s iterables). Also, understanding the &quot;concurrent modification&quot; risk — mutating a collection while iterating over it is a classic bug, and knowing why it happens demonstrates real understanding rather than rote pattern recall.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java&apos;s <code>Iterable</code>/<code>Iterator</code> interfaces</strong> — any class implementing <code>Iterable</code> can be used directly in a for-each loop.</li>
              <li><strong>Python&apos;s iterator protocol</strong> (<code>__iter__</code> and <code>__next__</code>) — powers <code>for</code> loops, generators, and comprehensions.</li>
              <li><strong>JavaScript&apos;s iterables</strong> (<code>Symbol.iterator</code>) — what makes <code>for...of</code>, spread syntax, and destructuring work.</li>
              <li><strong>Database cursors</strong> — a result set is traversed row by row via a cursor without loading the entire result into memory at once.</li>
              <li><strong>Tree/graph traversal utilities</strong> — depth-first and breadth-first iterators expose the same interface over different underlying structures.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Template Method', href: '/pages/lld/design-patterns/behavioral/template-method' }}
            next={{ label: 'Mediator', href: '/pages/lld/design-patterns/behavioral/mediator' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Design Patterns',
          links: [
            { label: 'Singleton', href: '/pages/lld/design-patterns/creational/singleton' },
            { label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' },
            { label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' },
            { label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' },
          ],
        }}
      />
    </>
  );
}
