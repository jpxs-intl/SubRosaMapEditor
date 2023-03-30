# CityFile: Parsing

Authors: gart | checkraisefold

# Parsing

```

[4 bytes] Version Number

// Item Sets

[4 bytes] Number of Item Sets

for each Item Set {

    [64 bytes] Item Set Name

    }

// Road Intersections

[4 bytes] Number of Road Intersections

for each Road Intersection {

    [4 bytes] Intersection Position X

    [4 bytes] Intersection Position Y

    [4 bytes] Intersection Position Z

    }

// Streets

[4 bytes] Number of Streets

for each Street {

    [4 bytes] Intersection 1 Index

    [4 bytes] Intersection 2 Index

    [4 bytes] Road Direction

    [4 bytes] Left Lane

    [4 bytes] Right Lane 

    [64 bytes] Street Name 

    }

// Buildings

[4 bytes] Number of Buildings

for each Building {

    [64 bytes] Building Name

    [4 bytes] Building Position X

    [4 bytes] Building Position Y

    [4 bytes] Building Position Z

    [4 bytes] Building Rotation

    }

// Sectors

[4 bytes] Number of Sectors

for each Sector {

    [4 bytes] Area Number

    [4 bytes] Sector Position X

    [4 bytes] Sector Position Y

    [4 bytes] Sector Position Z

    [2,048 bytes] List of 512 blocks (4 bytes each)

    [8,192 bytes] List of 4096 textures (2 bytes each)

    [2,048 bytes] List of 512 ItemSets (4 bytes each)

    }

// Waypoints

[4 bytes] Number of Waypoints

for each Waypoint {

    [4 bytes] Waypoint Position X

    [4 bytes] Waypoint Position Y

    [4 bytes] Waypoint Position Z

    }

EOF (End of File)

```

# More Information

## Item Sets

Nothing yet!

## Road Intersections

Nothing yet!

## Streets

Streets only connect two intersections.

### Left Lane and Right Lane

Unsure what these are for, could be lane width or something.

### Road Direction

Direction Table:

<table>
<thead>
<tr>
<th>Direction</th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>North (+x)</td>
<td>Unknown</td>
</tr>
<tr>
<td>South (-x)</td>
<td>Unknown</td>
</tr>
<tr>
<td>East (+z)</td>
<td>Unknown</td>
</tr>
<tr>
<td>West (-z)</td>
<td>Unknown</td>
</tr>
</tbody>
</table>

## Buildings

Building Name is used to grab the correct `.sbb` file for the building. See [Building Parsing](../sbb/parsing.md) for more information.

## Sectors

Nothing yet, literally what are these for.

## Waypoints

Used for Race Mode only 