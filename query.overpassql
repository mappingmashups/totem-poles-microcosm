[out:json][timeout:300]
---
style:
  extends: https://tiles.stadiamaps.com/styles/stamen_terrain.json
  layers:
    - type: circle
      paint: &paint
        circle-color: pink
        circle-stroke-color: steelblue
        circle-stroke-width: 2
        circle-opacity: .5
    - type: circle
      filter: [==, [get, artwork_type], totem_pole]
      paint:
        <<: *paint
        circle-color: lightblue

---

/*
NOTE: artwork_type=totem_pole seems to be the growing consensus. This query looks for other possible alternative tags, which will help us find features that need further investigation and retagging.

The style rules above render artwork_type=totem_pole in blue, and everything else in pink.

Other possible values to look for:
https://taginfo.openstreetmap.org/search?q=%22totem+pole%22#values

*/

(

nwr["artwork_type"="totem_pole"];
nwr["sculpture_type"="totem_pole"];
nwr["man_made"="totem_pole"];
nwr["monument"="totem_pole"];
nwr["culture"="totem pole"];

/*
slow fuzzy name matches:
*/

nwr["name"~"Totem Pole",i];
nwr["description"~"Totem Pole",i];
//nwr["name"~"Pole",i];
//nwr["description"~"Pole",i];
//nwr["name"~"Post",i];
//nwr["description"~"Post",i];

/*
For faster performance, use these non-fuzzy name matches instead:
*/

//nwr["name"="Totem pole"];
//nwr["name"="Totem Pole"];
//nwr["description"="Totem pole"];
//nwr["description"="Totem Pole"];

);

out center body;
