import sys
sys.path.insert(0, '/home/osm-tchoutchou')
activate_this = '/home/osm-tchoutchou/local.virtualenv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
from webserver import app as application
