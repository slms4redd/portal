To make the plugin work it is necessary to:

- Include in the pom.xml of demo
- Configure the following data source in the Context.xml of Tomcat (with the actual URL):

	<Resource name="jdbc/geoexplorer" auth="Container" type="javax.sql.DataSource"
		driverClassName="org.sqlite.JDBC" url="jdbc:sqlite:/.../portal/geoexplorer-reader/geoexplorer.db"
		username="" password="" maxActive="20" maxIdle="10"
		maxWait="-1" />

- Configure in plugin-conf.json the URL of the "local" GeoExplorer:

	{
		"default-conf" : {
			"geoexplorer-layers" : {
				"local-geoserver-url" : "http://192.168.0.18:8080/geoserver"
			}
		}
	}

TODO:

- Be able to specify the map in the geoexplorer database in a URL parameter

- Set the zoom level and center

- Set the GetLegendGraphics

- Groups