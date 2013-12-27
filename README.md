osm-tchoutchou
==============

An Open Street Map (leaflet) inteface to Turblog's raildar.fr data.

Some details on the original raildar map and API : http://blog.spyou.org/wordpress-mu/2013/11/30/jstchoutchou/


How to install :
----------------

```
./install.sh
./webserver.sh

```

If you have some porblems when compiling lxml you should install lxml source, for exemple on debian/ubuntu :

```
sudo apt-get install libxml2
sudo apt-get install libxslt1.1
sudo apt-get install libxml2-dev
sudo apt-get install libxslt1-dev
```


How to run :
------------

```
./install.sh

```
Will launch a python webserver on http://localhost:5000/


