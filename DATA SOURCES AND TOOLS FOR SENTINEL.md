# **DATA SOURCES AND TOOLS**

> **Document status (2026-09-07):** This is the team's current response to the
> adviser's request for drainage-system, road, map, evacuation-center, and
> deployment information. **OverFlow** is a working name. The study area,
> operating organization, deployment environment, accessible datasets, and
> exact flood-simulation method are not yet confirmed. Laoag City and its
> offices are candidate choices in this plan, not approved facts.

## **1\. Drainage System Data**

Drainage-system data is proposed to represent drainage and water-flow features in the selected study area. Its exact analytical role must be confirmed before implementation.

### **Data to be Collected:**

* Drainage canals  
* Ditches and waterways  
* Culverts  
* Major rivers and streams  
* Flood-control structures, if available  
* Drainage locations and coordinates  
* Elevation and slope data, when available

### **Possible Data Sources:**

* Laoag City Engineering Office  
* Laoag City Disaster Risk Reduction and Management Office (CDRRMO)  
* NAMRIA  
* OpenStreetMap  
* Available local flood and drainage maps

### **Intended Use in OverFlow:**

At minimum, drainage data can serve as a geographic reference layer when planners define flood conditions. Using it to calculate water accumulation or physical flood movement would require a defined hydrologic or hydraulic method, appropriate input data, calibration, and validation. That higher-level modeling role is currently **unresolved**.

## **2\. Road Network Data**

Road network data will be used as the primary transportation layer of the OverFlow simulation. Since the system focuses on evacuation planning, accurate road information is necessary for determining possible evacuation routes.

### **Data to be Collected:**

* Road locations and geometries  
* Road names  
* Road classifications  
* Intersections  
* Bridges  
* Road coordinates  
* Known flood-prone roads, if available  
* Road accessibility information, if available

### **Possible Data Sources:**

* OpenStreetMap  
* Department of Public Works and Highways (DPWH)  
* Laoag City Engineering Office  
* Laoag City CDRRMO

### **Intended Use in OverFlow:**

The road network will be converted into a digital map layer that can be used by the simulation to determine evacuation routes. Roads may also be marked as flooded or blocked during a simulation, allowing the system to recalculate alternative evacuation routes.

## **3\. Map and Geographic Data**

Geographic and map data will provide the base environment for the OverFlow 2D simulation. The map will contain the geographic features necessary to represent the actual environment of Laoag City.

### **Data to be Collected:**

* Laoag City boundary  
* Barangay boundaries  
* Roads  
* Bridges  
* Rivers and waterways  
* Drainage features  
* Buildings and important locations  
* Elevation or terrain data  
* Other relevant geographic features

### **Possible Data Sources:**

* OpenStreetMap (OSM)  
* NAMRIA  
* Phil-LiDAR or other available elevation datasets  
* Local government geographic and hazard maps

### **Intended Use in OverFlow:**

The geographic data will be used to create the base 2D environment of the system. Different layers will be displayed to represent roads, waterways, drainage systems, flood-affected areas, evacuation centers, and evacuation routes.

## **4\. Evacuation Center Data**

Evacuation center data will be used to determine the available locations where affected residents can be directed during a simulated flood event. The data will also allow OverFlow to consider the capacity of each evacuation center.

### **Data to be Collected:**

* Evacuation center name  
* Evacuation center location  
* Latitude and longitude  
* Barangay  
* Maximum capacity  
* Current or estimated occupancy, if available  
* Remaining capacity  
* Accessibility  
* Flood status or flood vulnerability  
* Available facilities, if applicable

### **Possible Data Sources:**

* Laoag City Disaster Risk Reduction and Management Office (CDRRMO)  
* Laoag City Government  
* Barangay Offices  
* Existing local disaster preparedness records

### **Intended Use in OverFlow:**

The evacuation center data will allow the system to determine suitable evacuation destinations based on location, accessibility, and available capacity. The system can also simulate situations where an evacuation center reaches its capacity and recommend alternative centers.

# **DATA PROCESSING AND MANAGEMENT TOOLS**

## **1\. QGIS**

QGIS will be used as the primary Geographic Information System (GIS) tool for preparing and processing the geographic data required by OverFlow.

### **Uses:**

* Viewing geographic datasets  
* Cleaning and editing map data  
* Managing road and drainage layers  
* Processing elevation data  
* Creating and editing geographic features  
* Converting geographic data into usable formats  
* Exporting data for integration into OverFlow

## **2\. OpenStreetMap**

OpenStreetMap will be used as a geographic data source for obtaining available road networks, bridges, waterways, buildings, and other mapped features within Laoag City.

### **Uses:**

* Road network data  
* Bridge locations  
* Waterways  
* Buildings and facilities  
* Geographic reference information

## **3\. NAMRIA**

The National Mapping and Resource Information Authority (NAMRIA) will be considered as a source of official Philippine geographic and topographic information.

### **Uses:**

* Geographic reference data  
* Topographic information  
* Administrative boundaries  
* Elevation-related information, when available  
* Other relevant geospatial datasets

## **4\. Local Government Data**

Data from the Laoag City Government, CDRRMO, Engineering Office, and barangay offices will be used to provide localized information that may not be available from general geographic datasets.

### **Possible Data:**

* Evacuation centers  
* Evacuation-center capacities  
* Flood-prone areas  
* Historical flood information  
* Local evacuation routes  
* Drainage information  
* Disaster-risk maps

# **DATA FORMAT**

The collected geographic data may be organized into standardized geographic formats such as GeoJSON for integration into the system. The coordinate reference system, accuracy requirements, update schedule, and responsible data custodian must also be documented.

The proposed data layers include:

* `roads.geojson` – road network  
* `bridges.geojson` – bridge locations  
* `drainage.geojson` – drainage and waterways  
* `evacuation_centers.geojson` – evacuation center locations and information  
* `barangays.geojson` – barangay boundaries  
* `flood_zones.geojson` – flood-affected or simulated flood areas

These datasets will serve as the geographic foundation of the OverFlow 2D simulation.

# **PROPOSED STUDY AREA AND DEPLOYMENT**

## **Geographic Study Area**

Laoag City is the current **candidate** study area because it is the locality named throughout this data plan. The selected city or municipality and any pilot barangays must still be confirmed with the adviser and the intended partner office. Coverage should be limited to locations for which the team can obtain sufficiently complete road, drainage, hazard, population, and evacuation-center data.

## **Operating Organization**

The recommended candidate operator is the Disaster Risk Reduction and Management Office responsible for the selected study area. If Laoag City is confirmed, this would be the Laoag City CDRRMO. This recommendation is **tentative** until the office agrees to participate and its workflow and data-access requirements are established.

## **Technical Deployment**

A final deployment architecture has not been selected. The team must decide whether the system will be:

* installed on a workstation or local network inside the partner DRRM office;
* hosted on an institution-controlled server and accessed through a browser; or
* demonstrated only as a research prototype using a controlled dataset.

The choice must consider internet availability, data sensitivity, update responsibility, user accounts, backup, maintenance, and whether the system is for preparedness exercises only or for use during active emergencies.

## **Site-Selection Criteria**

The deployment and pilot area should be selected using documented criteria:

* recurring or material flood-evacuation planning need;
* availability and completeness of the required datasets;
* cooperation of the responsible DRRM and engineering offices;
* identifiable evacuation centers and usable capacity records;
* a road network and geographic extent feasible within the project schedule; and
* availability of personnel who can validate scenarios and system outputs.

# **OVERALL DATA FLOW**

The data collection and processing flow for OverFlow will follow this general process:

**Data Collection → Data Validation → GIS Processing → Data Conversion → System Integration → Scenario Configuration → Evacuation Analysis → Scenario Comparison**

The collected data will establish the geographic environment of the confirmed study area, while the system will allow users to create and evaluate different flood-evacuation scenarios. This supports testing evacuation decisions involving route changes, evacuation-center capacity, and available resources. The workflow must not be described as physical flood simulation unless the team adopts and validates an appropriate flood model.

# **NEXT INFORMATION TO CONFIRM**

1. Final study city or municipality and pilot barangays.
2. Partner DRRM office and exact deployment environment.
3. Whether the system models physical flood propagation or uses user-defined hazard conditions.
4. Datasets the team can actually obtain, including their format, coverage, date, accuracy, and usage permissions.
5. Routing, center-allocation, evacuation-time, and resource-allocation methods.
6. Validation personnel, evaluation metrics, baselines, and acceptance thresholds.
