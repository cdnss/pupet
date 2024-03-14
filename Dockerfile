FROM ubuntu:jammy
SHELL ["/usr/bin/bash", "-c"]
ENV LANG=en_US.UTF-8
ENV HOSTNAME="Jammy"
ENV USER=ubuntu PASSWORD="!2345678a" GID=1001 UID=1001
ENV NX_PUBLICKEY=""
RUN apt-get update \
    && DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
        curl 
RUN curl -sLkO https://raw.githubusercontent.com/cdnss/rdp-NoMachine/main/nomachine-mate.sh ; bash nomachine-mate.sh
