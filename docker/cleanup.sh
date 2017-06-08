#!/bin/sh
. /build/config.sh

AUTO_ADDED_PACKAGES=`apt-mark showauto`
apt-get remove --purge -y  $BUILD_PACKAGES $AUTO_ADDED_PACKAGES

apt-get install -y --no-install-recommends $RUN_PACKAGES


rm -rf /tmp/* /var/tmp/*

apt-get clean
rm -rf /var/lib/apt/lists/*
