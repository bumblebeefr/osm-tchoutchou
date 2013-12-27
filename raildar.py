from lxml import etree
from io import BytesIO
from pprint import pprint
from urlfetch import get
import math
import unicodedata

trans = {
  'lat': float,
  'lng': float,
  'minutes_to_next_gare': int,
  'retard': int
}
statuses = {
    "green": "ok",
    "yellow": "delayed",
    "orange": "delayed",
    "red": "delayed",
    "black": 'cancelled'
}
train_types = {
    'TGV/ICE': 'tgv',
    'TGV': 'tgv',
    'iDTGV': 'tgv',
    'Unknown': 'unknown',
    'TER/IC': 'simple',
    'Thalys': 'thalys',
    'TGV LYRIA': 'tgv'
}


def load_markers(url):
    markers = []
    brands = set()
    response = get(url)
    for event, element in etree.iterparse(BytesIO(response.body), events=("start", "end")):
        if(element.tag == 'marker' and event == 'start'):
            marker = {}
            for name, value in sorted(element.items()):
                if(name in trans):
                    try:
                        marker[name] = trans[name](value)
                    except Exception:
                        marker[name] = value
                else:
                    marker[name] = value
            markers.append(marker)
            brands.add(marker.get('brand'))
    print brands
    return markers


def map_generic():
    markers = []
    for m in load_markers('http://www.raildar.fr/xml/map_generic'):
        x1 = m.get('lng', None)
        y1 = m.get('lat', None)

        # ajout du status du train
        m['status'] = statuses.get(m.get('type', None), "unknown")
        m['train_type'] = train_types.get(m.get('brand', None), "unknown")

        # calcul l'angle a utiliser pour le picto de direction
        x2 = gare_dict.get(m.get('next_gare', None), {}).get('lng', None)
        y2 = gare_dict.get(m.get('next_gare', None), {}).get('lat', None)
        if(x1 and x2 and y1 and y2):
#             m["x_diff"] = x2 - x1
#             m["y_diff"] = y2 - y1
#             m["next_lat"] = gare_dict.get(remove_accents(m.get('next_gare', "")), {}).get('lat', None)
#             m["next_lng"] = gare_dict.get(remove_accents(m.get('next_gare', "")), {}).get('lng', None)
            if(x2 == x1):
                m["angle"] = 0
            else:
                m["angle"] = -(math.atan((y2 - y1) / (x2 - x1)) * 180 / math.pi)
                if((x2 - x1) < 0):
                    m["angle"] += 180

        markers.append(m)

    return markers


def gares():
    return load_markers('http://www.raildar.fr/xml/gares')


def remove_accents(input_str):
    nkfd_form = unicodedata.normalize('NFKD', u"".join(input_str))
    return u"".join([c for c in nkfd_form if not unicodedata.combining(c)])

# dict des gares initialisee au demarrage FAUDR
gare_dict = {}
for g in gares():
    gare_dict[remove_accents(g.get('name'))] = g

if __name__ == '__main__':
#     print("========= Liste des trains/mission en cours =========")
    # #pprint(map_generic())

    print("========= Liste des gares =========")
    pprint(gares())
