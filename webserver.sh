cd `echo "$0" | sed -e "s/[^\/]*$//"`
./local.virtualenv/bin/python webserver.py $@
