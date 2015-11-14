[![Build Status](https://travis-ci.org/slms4redd/portal.svg?branch=master)](https://travis-ci.org/slms4redd/portal)
###SLMS Overview
The objective of the UN-REDD **SLMS** - **S**atellite **L**andcover **M**onitoring **S**ystem -  is to create an infrastructure that helps in the transparent dissemination of forest change, by processing and publishing forest (remote sensing) data, validated and open for public feedback of people in the monitored areas.

###SLMS portal project Overview
This application is a web map-browser, it works as a client side visualization tool to display maps composed of overlayed layers and it displays charts of statistics generated server-side.

It works with a OGC WMS/WFS geospatial servers like [Geoserver](http://geoserver.org/).

## Build and Run

From the root of the repo:

  ```
    #user@host$ cd src
    #user@host$ mvn clean install
  ```

the deploy the war in a tomcat6/java7 container.

A ready test environment can be setup running this [cookbook](https://github.com/slms4redd/chef-slms-portal) on a fresh Ubuntu 12.04.5 Virtual Machine or using Vagrant.
