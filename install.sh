#! /bin/sh

virtualenv local.virtualenv
./local.virtualenv/bin/pip install `cat librequired` -f http://hachoir.themetricsfactory.com/pip/
mkdir -p local.persistent
