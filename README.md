osm-tchoutchou
==============

*This version is deprecated, it used a small python backend to proxify and translate data from raildar. The new version
use directly data from raildail with cross-domain calls.*

An Open Street Map (leaflet) inteface to Turblog's raildar.fr data.

Some details on the original raildar map and API : http://blog.spyou.org/wordpress-mu/2013/11/30/jstchoutchou/


How to install :
----------------
Install python-pip and python-virtualenv on your system then run
```
./install.sh
```

If you have some porblems when compiling lxml you should install lxml source, for exemple on debian/ubuntu :

```
sudo apt-get install libxml2 libxslt1.1 libxml2-dev libxslt1-dev
```


How to run :
------------

```
./webserver.sh

```
Will launch a python webserver on http://localhost:5000/


