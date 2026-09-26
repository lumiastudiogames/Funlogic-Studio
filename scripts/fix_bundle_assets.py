import os
import re

root_dir = r"d:\FUNLOGIC.COM\funlogic.games\funlogic.games\src\games"

print("1. Checking and fixing absolute /src/ paths in HTML...")
abs_src_patt = re.compile(r'src=["\']/src/')
for r, _, files in os.walk(root_dir):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            if abs_src_patt.search(content):
                new_content = abs_src_patt.sub('src="./src/', content)
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                print(f"  Fixed absolute /src/ in {os.path.relpath(p, root_dir)}")

print("\n2. Removing CSS imports from JS files...")
css_import_patt = re.compile(r"^\s*import\s+['\"][^'\"]+\.css['\"];?\s*$", re.MULTILINE)
for r, _, files in os.walk(root_dir):
    for f in files:
        if f.endswith('.js') or f.endswith('.mjs'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            if css_import_patt.search(content):
                new_content = css_import_patt.sub('', content)
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                print(f"  Removed CSS import from {os.path.relpath(p, root_dir)}")

print("\n3. Fixing @import 'tailwindcss' in CSS and ensuring Tailwind CDN in HTML...")
tw_import_patt = re.compile(r"@import\s+['\"]tailwindcss['\"];?\s*")
tw_cdn_tag = '<script src="https://cdn.tailwindcss.com"></script>\n'

for r, _, files in os.walk(root_dir):
    for f in files:
        if f.endswith('.css'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            if tw_import_patt.search(content):
                new_content = tw_import_patt.sub('/* tailwindcss loaded via cdn */\n', content)
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                print(f"  Removed @import tailwindcss from {os.path.relpath(p, root_dir)}")
                
                # Check corresponding index.html in the same game directory
                # Find game root dir (ancestor right under src/games or src/games/seniors or src/games/kids)
                game_dir = p
                while game_dir != root_dir and os.path.basename(os.path.dirname(game_dir)) not in ['games', 'seniors', 'kids']:
                    game_dir = os.path.dirname(game_dir)
                html_path = os.path.join(game_dir, 'index.html')
                if os.path.exists(html_path):
                    with open(html_path, 'r', encoding='utf-8', errors='ignore') as hfp:
                        hcontent = hfp.read()
                    changed = False
                    if 'cdn.tailwindcss.com' not in hcontent:
                        hcontent = hcontent.replace('<head>', f'<head>\n    {tw_cdn_tag}')
                        changed = True
                    # Also make sure index.css is linked
                    rel_css = os.path.relpath(p, game_dir).replace('\\', '/')
                    link_css = f'<link rel="stylesheet" href="./{rel_css}" />'
                    if rel_css not in hcontent and f'./{rel_css}' not in hcontent and f'/{rel_css}' not in hcontent:
                        hcontent = hcontent.replace('</head>', f'    {link_css}\n  </head>')
                        changed = True
                    if changed:
                        with open(html_path, 'w', encoding='utf-8') as hfp:
                            hfp.write(hcontent)
                        print(f"  Updated index.html in {os.path.relpath(game_dir, root_dir)} with Tailwind CDN / CSS link")

print("\nBundle assets fix completed.")
