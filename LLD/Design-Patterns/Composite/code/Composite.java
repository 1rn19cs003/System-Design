// Composite Pattern — file system, uniform size() across files and folders.
// Compile: javac Composite.java
// Run:     java Composite

import java.util.ArrayList;
import java.util.List;

interface FileSystemComponent {
    int getSize();
    void print(String indent);
}

class FileLeaf implements FileSystemComponent {
    private String name;
    private int sizeKB;

    FileLeaf(String name, int sizeKB) {
        this.name = name;
        this.sizeKB = sizeKB;
    }

    public int getSize() {
        return sizeKB;
    }

    public void print(String indent) {
        System.out.println(indent + "- " + name + " (" + sizeKB + "KB)");
    }
}

class Folder implements FileSystemComponent {
    private String name;
    private List<FileSystemComponent> children = new ArrayList<>();

    Folder(String name) {
        this.name = name;
    }

    void add(FileSystemComponent component) {
        children.add(component);
    }

    public int getSize() {
        int total = 0;
        for (FileSystemComponent child : children) {
            total += child.getSize();
        }
        return total;
    }

    public void print(String indent) {
        System.out.println(indent + "+ " + name + "/ (" + getSize() + "KB total)");
        for (FileSystemComponent child : children) {
            child.print(indent + "  ");
        }
    }
}

public class Composite {
    public static void main(String[] args) {
        Folder root = new Folder("project");
        Folder src = new Folder("src");
        src.add(new FileLeaf("main.java", 12));
        src.add(new FileLeaf("utils.java", 5));

        Folder docs = new Folder("docs");
        docs.add(new FileLeaf("readme.md", 3));

        root.add(src);
        root.add(docs);
        root.add(new FileLeaf("build.gradle", 2));

        root.print("");
        System.out.println("Total size: " + root.getSize() + "KB");
    }
}
