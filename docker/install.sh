#!/bin/sh

. /build/config.sh

apt-get update -y
apt-get install -y --no-install-recommends $BUILD_PACKAGES

cd /build/

# Get a Jetty distribution.
wget http://central.maven.org/maven2/org/eclipse/jetty/jetty-distribution/9.4.6.v20170531/jetty-distribution-9.4.6.v20170531.tar.gz
tar xfz jetty-distribution*.tar.gz
rm jetty-distribution-*.tar.gz
mv jetty-distribution* /jetty

# Compile LAREX
git clone https://github.com/chreul/LAREX.git
mkdir LAREX/Larex/src/main/webapp/WEB-INF/lib
ln -s /usr/share/java/opencv.jar LAREX/Larex/src/main/webapp/WEB-INF/lib/opencv.jar
cd LAREX/Larex/
mvn package

# Expand the LAREX web application as root webapp for Jetty.
mkdir /jetty/webapps/ROOT/
cd /jetty/webapps/ROOT/
jar xf /build/LAREX/Larex/target/Larex.war

# Create a directory for the books. It will be exposed as a Docker volume.
rm -r /jetty/webapps/ROOT/resources/books
mkdir /books
ln -s /books /jetty/webapps/ROOT/resources/books
