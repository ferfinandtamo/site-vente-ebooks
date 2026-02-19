import os
import uuid

# Define directories
dirs = [
    (r"f:\MesFormations\amour et sex-20251028T012407Z-1-001\amour et sex", "Relations & Sensation"),
    (r"f:\MesFormations\EBOOKS-20251022T013313Z-1-001\EBOOKS", None), # Subdirs will define category
    (r"f:\MesFormations\Pack 1200 Ebooks", "Littérature Classique"), # Files only
]

# Mapping for specific subdirs in EBOOKS
category_mapping = {
    "EBOOKS CHATGPT": "IA & Tech",
    "Trading827": "Finance & Trading",
    "Sport": "Santé & Performance",
    "Independance financiere et argent": "Richesse & Liberté",
    "Leadership": "Business & Leadership",
    "Management": "Business & Leadership",
    "Marketing digital": "Marketing Digital",
    "Marketing et vente": "Vente & Marketing",
    "Psychologie": "Psychologie & Mental",
    "Generalisté 1": "Culture Générale",
    "Generalisté 2": "Culture Générale",
    "Livres best seller": "Best-Sellers",
    "Medecine": "Science & Santé"
}

def sanitize_metadata(filename):
    name = os.path.splitext(filename)[0]
    # Standard format: author_-_title.pdf
    if "_-_" in name:
        parts = name.split("_-_")
        author = parts[0].replace("_", " ").strip().title()
        title = parts[1].replace("_", " ").strip().title()
        # Minor fix for Balzac and others
        if "Balzac" in author: author = "Honoré de Balzac"
        if "Zola" in author: author = "Émile Zola"
        if "Hugo" in author: author = "Victor Hugo"
        if "Maupassant" in author: author = "Guy de Maupassant"
        return title, author
    
    # Simple format: title.pdf
    title = name.replace("_", " ").replace("-", " ").strip().title()
    return title, "Édition Collection"

ebooks = []
categories_set = set()
authors_set = set()

# Scan directories
for path, default_cat in dirs:
    if not os.path.exists(path):
        print(f"Directory not found: {path}")
        continue
    
    if default_cat is None: # EBOOKS dir logic (Subdirectories)
        for root, subdirs, files in os.walk(path):
            dir_name = os.path.basename(root)
            if dir_name == "EBOOKS": continue
            cat = category_mapping.get(dir_name, "Développement")
            for f in files:
                if f.lower().endswith('.pdf'):
                    title, author = sanitize_metadata(f)
                    ebooks.append((title, author, cat))
                    categories_set.add(cat)
                    authors_set.add(author)
    else: # Flat directories (Pack 1200 or Amour & Sex)
        for f in os.listdir(path):
            full_path = os.path.join(path, f)
            # Exclude site directory and process only PDFs
            if os.path.isdir(full_path): continue
            if f.lower().endswith('.pdf'):
                title, author = sanitize_metadata(f)
                ebooks.append((title, author, default_cat))
                categories_set.add(default_cat)
                authors_set.add(author)

# Generate SQL
sql = """-- ########################################################
-- # EBOOKSTORE SEEDS - AUTO-GENERATED
-- ########################################################

"""

# Categories
cat_ids = {}
for cat in sorted(list(categories_set)):
    cat_id = str(uuid.uuid4())
    cat_ids[cat] = cat_id
    sql += f"INSERT INTO public.categories (id, name) VALUES ('{cat_id}', '{cat.replace(\"'\", \"''\")}') ON CONFLICT (name) DO NOTHING;\n"

sql += "\n"

# Authors
author_ids = {}
for author in sorted(list(authors_set)):
    author_id = str(uuid.uuid4())
    author_ids[author] = author_id
    sql += f"INSERT INTO public.authors (id, name) VALUES ('{author_id}', '{author.replace(\"'\", \"''\")}') ON CONFLICT (id) DO NOTHING;\n"

sql += "\n"

# Ebooks
for title, author, cat in ebooks:
    ebook_id = str(uuid.uuid4())
    c_id = cat_ids.get(cat)
    a_id = author_ids.get(author)
    price = 19.99
    # We use subqueries to handle IDs if they were skipped by 'ON CONFLICT DO NOTHING'
    sql += f"INSERT INTO public.ebooks (id, title, author_id, category_id, price) " \
           f"VALUES ('{ebook_id}', '{title.replace(\"'\", \"''\")}', " \
           f"(SELECT id FROM public.authors WHERE name = '{author.replace(\"'\", \"''\")}' LIMIT 1), " \
           f"(SELECT id FROM public.categories WHERE name = '{cat.replace(\"'\", \"''\")}' LIMIT 1), " \
           f"{price});\n"

output_path = r"f:\MesFormations\Pack 1200 Ebooks\site-vente-ebooks\seeds.sql"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(sql)

print(f"Successfully generated seeds for {len(ebooks)} ebooks at {output_path}")
