FROM ubuntu:jammy
SHELL ["/usr/bin/bash", "-c"]
ENV LANG=en_US.UTF-8
ENV HOSTNAME="Jammy"
ENV USER=ubuntu PASSWORD="!2345678a" GID=1001 UID=1001
ENV NX_PUBLICKEY=""
RUN apt-get update \
    && DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
        curl 
RUN docker pull lordcris/nomachine
RUN docker run --rm -d -p 4000:4000 --name nomachine -e PASSWORD=password -e USER=user --cap-add=SYS_PTRACE --shm-size=1g lordcris/nomachine
