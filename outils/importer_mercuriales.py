"""Importe les mercuriales de la DAAF Guyane (PDF Agreste) dans data/mercuriales.json.

Utilisation (depuis le dossier du projet, dans le terminal de VS Code) :
    pip install pdfplumber
    python outils/importer_mercuriales.py chemin/vers/dossier_ou_fichiers.pdf ...

Les deux PDF publiés chaque semaine sont reconnus automatiquement :
  - « Relevé des prix des marchés de Guyane » : prix moyen de chaque produit en Guyane
    (semaine du relevé et deux semaines précédentes), minimum, maximum, prix le plus observé ;
  - « Marchés de Guyane : prix des fruits et légumes » : prix moyen par famille et par marché.
Les relevés déjà présents sont conservés ; une même date n'est jamais comptée deux fois.
"""
import json, re, sys, unicodedata
from datetime import date
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    sys.exit("Installez d'abord pdfplumber :  pip install pdfplumber")

RACINE = Path(__file__).resolve().parent.parent
FICHIER = RACINE / 'data' / 'mercuriales.json'

MOIS = {'janvier':1,'fevrier':2,'mars':3,'avril':4,'mai':5,'juin':6,'juillet':7,'aout':8,'septembre':9,'octobre':10,'novembre':11,'decembre':12}

# Produit de l'appli -> libellés DAAF, par ordre de préférence
CORRESPONDANCE = {
    'laitue': ['Salades - laitues'],
    'chou_chinois': ['Choux chinois', 'Packchoi'],
    'chou': ['Choux pommes'],
    'bredes': ['Epinards'],
    'cive': ['Ciboule (Kg)', 'Ciboule'],
    'persil': ['Persil'],
    'tomate': ['Tomates'],
    'concombre': ['Concombres salades'],
    'poivron': ['Poivrons'],
    'aubergine': ['Aubergines'],
    'gombo': ['Calous'],
    'piment': ['Piments forts'],
    'giraumon': ['Citrouille (Giraumon)'],
    'pasteque': ['Pastèques'],
    'melon': ['Melons'],
    'haricot': ['Haricots chinois'],
    'mais': ['Maïs (en épis ; 1kg)'],
    'patate': ['Patates douces'],
    'dachine': ['Dachines'],
    'igname': ['Ignames blancs'],
    'manioc': ['Cramanioc'],
    'gingembre': ['Gingembre'],
}
FAMILLES = {'legumes tropicaux':'legumes_tropicaux', 'tubercules':'tubercules', 'condiments':'condiments', 'fruits tropicaux':'fruits_tropicaux',
            'agrumes':'agrumes', 'bananes':'bananes', 'legumes':'legumes', 'fruits':'fruits', 'total legumes fruits':'total'}
COLONNES = ['guyane', 'cayenne', 'ile_cayenne', 'kourou', 'stlaurent']  # ordre des colonnes du PDF « familles »

def cle(t):
    t = unicodedata.normalize('NFD', t or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', t).strip()

LIBELLE = {cle(lib): (pid, rang) for pid, libs in CORRESPONDANCE.items() for rang, lib in enumerate(libs)}

def prix(t):
    m = re.search(r'(\d+(?:[.,]\d+)?)', (t or '').replace(' ', '').replace(' ', ''))
    return round(float(m.group(1).replace(',', '.')), 2) if m else None

def dates_dans(t):
    out = []
    for j, mo, a in re.findall(r'(\d{1,2})\s+([A-Za-zéèêûôÉÈÊÛÔ]+)\s+(\d{4})', t or ''):
        n = MOIS.get(cle(mo))
        if n: out.append(date(int(a), n, int(j)).isoformat())
    return out

def lire_produits(pdf):
    res = {}
    for page in pdf.pages:
        for table in page.extract_tables():
            entete = next((r for r in table if r and len(dates_dans(' | '.join(c or '' for c in r[1:4]))) >= 1), None)
            if not entete: continue
            ds = [ (dates_dans(c or '') or [None])[0] for c in entete[1:4] ]
            for r in table:
                if not r or not r[0]: continue
                p = LIBELLE.get(cle(r[0]))
                if not p: continue
                pid, rang = p
                for i, d in enumerate(ds):
                    v = prix(r[1+i]) if len(r) > 1+i else None
                    if d and v:
                        rec = {'date': d, 'produit': pid, 'prix': v, 'daaf': r[0].strip()}
                        if i == 0 and len(r) >= 7:
                            for k, j in (('min', 4), ('max', 5), ('obs', 6)):
                                x = prix(r[j]);
                                if x: rec[k] = x
                        old = res.get((d, pid))
                        if not old or rang < old[0] or (rang == old[0] and len(rec) > len(old[1])): res[(d, pid)] = (rang, rec)
    return [v[1] for v in res.values()]

def lire_familles(pdf, texte):
    ds = dates_dans(texte)
    if not ds: return []
    d, out = ds[0], []
    for page in pdf.pages:
        for table in page.extract_tables():
            for r in table:
                if not r or not r[0]: continue
                f = FAMILLES.get(cle(r[0]))
                vals = [prix(c) for c in r[1:6]]
                if f and all(vals): out.append({'date': d, 'famille': f, **dict(zip(COLONNES, vals))})
    return out

def main(chemins):
    fichiers = []
    for c in chemins:
        p = Path(c)
        fichiers += sorted(p.glob('*.pdf')) if p.is_dir() else [p]
    if not fichiers: sys.exit(__doc__)
    base = json.loads(FICHIER.read_text(encoding='utf-8')) if FICHIER.exists() else {}
    rel = {(r['date'], r['produit']): r for r in base.get('releves', []) if 'marche' not in r}
    fam = {(r['date'], r['famille']): r for r in base.get('familles', [])}
    n0, f0 = len(rel), len(fam)
    for f in fichiers:
        with pdfplumber.open(f) as pdf:
            texte = ' '.join((pg.extract_text() or '') for pg in pdf.pages)
            k = cle(texte)
            if 'prix des fruits et legumes au' in k:
                for r in lire_familles(pdf, texte): fam[(r['date'], r['famille'])] = r
            elif 'releve des prix des marches' in k:
                for r in lire_produits(pdf):
                    old = rel.get((r['date'], r['produit']), {})
                    rel[(r['date'], r['produit'])] = {**old, **r}
            else:
                print('Ignoré (format inconnu) :', f.name); continue
        print('Lu :', f.name)
    sortie = {
        'version': 2,
        'source': 'DAAF Guyane (DGTM-DEAAF, Agreste) – relevé hebdomadaire des prix des marchés de Guyane',
        'maj': date.today().isoformat(),
        'unite': 'EUR/kg',
        'notes': "releves : prix moyen en Guyane par produit (min, max, obs = prix le plus observé, semaine du relevé). familles : prix moyen par famille et par marché, sert à passer du prix Guyane au prix de chaque marché. Prix arrondis aux dix centimes supérieurs par la DAAF.",
        'marches': {'cayenne': 'Cayenne Centre', 'ile_cayenne': 'Île de Cayenne Producteurs (Rémire-Montjoly, Matoury)', 'kourou': 'Kourou', 'stlaurent': 'Saint-Laurent du Maroni'},
        'correspondance': {k: v[0] for k, v in CORRESPONDANCE.items()},
        'releves': sorted(rel.values(), key=lambda r: (r['date'], r['produit'])),
        'familles': sorted(fam.values(), key=lambda r: (r['date'], r['famille'])),
    }
    FICHIER.write_text(json.dumps(sortie, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f"{len(rel)-n0} relevés produits et {len(fam)-f0} relevés par marché ajoutés ; "
          f"{len(rel)} relevés du {min(r['date'] for r in rel.values())} au {max(r['date'] for r in rel.values())}.")

if __name__ == '__main__':
    main(sys.argv[1:])
