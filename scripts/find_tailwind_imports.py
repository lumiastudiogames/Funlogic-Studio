import os
import re

patt = re.compile(r'@import\s+[\'"]tailwindcss[\'"]')
root_dir = r"d:\FUNLOGIC.COM\funlogic.games\funlogic.games\src\games"
found = []

for dirpath, _, filenames in os.walk(root_dir):
    for f in filenames:
        if f.endswith('.css'):
            p = os.path.join(dirpath, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                for lno, line in enumerate(fp, 1):
                    if patt.search(line):
                        found.append((os.path.relpath(p, root_dir), lno, line.strip()))

print(f"Found @import tailwindcss: {len(found)}")
for rel, lno, t in found:
    print(f"  {rel}:{lno} -> {t}")
