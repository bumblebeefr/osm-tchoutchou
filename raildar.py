from lxml import etree
from io import BytesIO
from pprint import pprint
from urlfetch import get
import math
import unicodedata
import simplejson

trans = {
  'lat': float,
  'lng': float,
  'minutes_to_next_gare': int,
  'retard': int,
  'heading': float
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
    'TGV LYRIA': 'tgv',
    'Lunea': 'simple',
    'LER': 'simple',
    'Intercite': 'simple',
    'TER': 'simple'
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
    return get("http://www.raildar.fr/json/map_generic").body


def line(id_train="20071"):
    if(id_train):
        print("http://raildar.fr:3000/json/convert?url=draw_line&id_train=%s" % id_train)
        resp = get("http://raildar.fr:3000/json/convert?url=draw_line&id_train=%s" % id_train)
    else:
        print("http://raildar.fr:3000/json/convert?url=draw_line")
        resp = get("http://raildar.fr:3000/json/convert?url=draw_line")
    print(resp.body)
    return simplejson.loads(resp.body)


def gares():
    return load_markers('http://www.raildar.fr/xml/gares')


def remove_accents(input_str):
    nkfd_form = unicodedata.normalize('NFKD', u"".join(input_str))
    return u"".join([c for c in nkfd_form if not unicodedata.combining(c)])


if __name__ == '__main__':
    print("========= Liste des trains/mission en cours =========")
    pprint(map_generic())

    print("========= Liste des gares =========")
    pprint(gares())
