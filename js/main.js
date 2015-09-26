function loadFile(url, cb)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var info = JSON.parse(xmlhttp.responseText);
            cb(info);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function setup() {
    var game = new Phaser.Game(800, 800, Phaser.AUTO, 'test', null, true, false);

    var mapInfo;

    var Preload = function(game) {};

    Preload.prototype.preload = function()    {
        game.load.image("loading", "images/loading.png");
        var this_obj = this;
        loadFile("map/zombie_city.json",function(info){mapInfo = info; this_obj.updateAndCheck();});
        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        this.finished_elements = 0;
    }

    var cursors;

    Preload.prototype.create = function ()
    {
        console.log("Showing image");
        this.updateAndCheck();
    }

    Preload.prototype.updateAndCheck = function()
    {
        this.finished_elements++;
        if (this.finished_elements == 2) {
            game.state.start("Boot");
        }
    }

    var Boot = function (game) { };

    var isoGroup, cursorPos;

    Boot.prototype =
    {
        preload: function () {
            game.add.sprite(0, 0, 'loading');
            var tilesets = mapInfo.tilesets;
            for (var i in tilesets)
            {
                for(var j in tilesets[i].tiles)
                {
                    var id = parseInt(j) + parseInt(tilesets[i].firstgid);
                    game.load.image(""+id, tilesets[i].tiles[j].image.substring(1));
                }
            }
        },
        create: function () {
            // Create a group for our tiles.
            isoGroup = game.add.group();
            var layers = mapInfo.layers;
            for (var i in layers)
            {
                if (i == 0)
                {
                    var width = layers[i].width;
                    for (var j in layers[i].data)
                    {
                        var x = j % width;
                        var y = j / width;
                        Math.floor( y );
                        var tile = game.add.isoSprite(x*75, y*75, 0, ""+layers[i].data[j], 0, isoGroup);
                        tile.anchor.set(1.0,1.0);
                    }
                }
            }
            // Let's make a load of tiles on a grid
            game.world.setBounds(-700, 0, 3000, 2000);

            cursors = game.input.keyboard.createCursorKeys();


            // Provide a 3D position for the cursor
            cursorPos = new Phaser.Plugin.Isometric.Point3();
        },
        update: function () {
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);

            if (cursors.up.isDown)
            {
                game.camera.y -= 4;
            }
            else if (cursors.down.isDown)
            {
                game.camera.y += 4;
            }

            if (cursors.left.isDown)
            {
                game.camera.x -= 4;
            }
            else if (cursors.right.isDown)
            {
                game.camera.x += 4;
            }
            // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
            isoGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                // If it does, do a little animation and tint change.
                if (!tile.selected && inBounds) {
                    tile.selected = true;
                    tile.tint = 0x86bfda;
                }
                // If not, revert back to how it was.
                else if (tile.selected && !inBounds) {
                    tile.selected = false;
                    tile.tint = 0xffffff;
                }
            });
        },
        render: function () {
            game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
            game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
        }
    };

    var network = new Network();
    network.connect();

    game.state.add('Preload', Preload);
    game.state.add('Boot', Boot);
    game.state.start('Preload');
};
