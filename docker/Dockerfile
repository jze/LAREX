FROM ubuntu:16.04
MAINTAINER Jesper Zedlitz <j.zedlitz@email.uni-kiel.de>

COPY docker-entrypoint.sh /
COPY *.sh /build/

RUN /build/install.sh && \
    cd / && /build/cleanup.sh && rm -rf /build

EXPOSE 8080

VOLUME ["/books"]
CMD /docker-entrypoint.sh
