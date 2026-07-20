import os
import re

root_dir = r"D:\YouTube\zerovitiligo\System-Design"

img_srcs = set()

for dirpath, _, filenames in os.walk(root_dir):
    if ".next" in dirpath or "node_modules" in dirpath or "public" in dirpath or "src" in dirpath:
        continue
    for f in filenames:
        if f.endswith(".html"):
            filepath = os.path.join(dirpath, f)
            with open(filepath, "r", encoding="utf-8", errors="ignore") as file:
                content = file.read()
                matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
                for m in matches:
                    img_srcs.add((os.path.relpath(filepath, root_dir), m))

print("Found image srcs in HTML files:")
for page, src in sorted(img_srcs):
    print(f"Page: {page} -> src: {src}")
