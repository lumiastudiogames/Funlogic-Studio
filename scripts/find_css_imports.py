import os
import re

root_dir = r"d:\FUNLOGIC.COM\funlogic.games\funlogic.games\src\games"
pattern = re.compile(r"import\s+['\"][^'\"]+\.css['\"]")

found = []
for dirpath, _, filenames in os.walk(root_dir):
    for f in filenames:
        if f.endswith('.js') or f.endswith('.mjs'):
            full_path = os.path.join(dirpath, f)
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as fp:
                for line_idx, line in enumerate(fp, 1):
                    if pattern.search(line):
                        found.append((os.path.relpath(full_path, root_dir), line_idx, line.strip()))

print(f"Total CSS imports found in JS: {len(found)}")
for rel, lno, text in found:
    print(f"  {rel}:{lno} -> {text}")
