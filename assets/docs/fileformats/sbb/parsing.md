## Building Parsing

 ```

[4 bytes] Version Number

[64 bytes] Building Name


// Building Size 

[4 bytes] Building Width

[4 bytes] Building Length

[4 bytes] Building Height

// Building Position

[4 bytes] Building Offset X

[4 bytes] Building Offset Y

[4 bytes] Building Offset Z


// Textures

[4 bytes] Number of Textures

for each Texture {

    [64 bytes] Texture Name

    }

// BuildBlocks

[4 bytes] Number of BuildBlocks

for each BuildBlock {

    [64 bytes] BuildBlock Name

    }

// ItemSets

[4 bytes] Number of ItemSets

for each ItemSet {

    [64 bytes] ItemSet Name

    }

// Tiles

for building height {

    for building length {

        for building width {

           
            // Tile Info

            [4 bytes] Block ? 
             
            [4 bytes] InteriorBlock ?

            [4 bytes] BuildBlock ?

            [4 bytes] edge X

            [4 bytes] edge Y

            [4 bytes] floor ?
            
            // Textures 0-7

            per texture 0 - 7 {

               [2 bytes] texture[index] 

            }

            // Interior Textures 0-7

            per texture 0 - 7 {

               [2 bytes] interiorTexture[index] 

            }

            // ItemSet

            [4 bytes] ItemSet ?

        }
}

 ```