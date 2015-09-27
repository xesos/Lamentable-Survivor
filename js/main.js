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
    var network = new Network();
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'test', null, true, false);

    var mapInfo;

    var Preload = function(game) {};

    Preload.prototype.preload = function()    {
        game.load.image("loading", "images/loading.jpg");
        var this_obj = this;
        loadFile("map/zombie_city.json",function(info){mapInfo = info; this_obj.updateAndCheck();});
        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        //game.iso.projectionAngle = 0.4236476090008061;
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

    var isoGroup;
    Boot.prototype =
    {
        level_: undefined,
        preload: function () {
            this.cursors_ = game.input.keyboard.createCursorKeys();
            this.key_w_ = game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.key_a_ = game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.key_s_ = game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.key_d_ = game.input.keyboard.addKey(Phaser.Keyboard.D);
            game.add.sprite(0, 0, 'loading');
            var tilesets = mapInfo.tilesets;
            game.load.atlasJSONHash('bot', 'images/running_bot.png', 'images/running_bot.json');
            for (var i in tilesets)
            {
                for(var j in tilesets[i].tiles)
                {
                    var id = parseInt(j) + parseInt(tilesets[i].firstgid);
                    game.load.image(""+id, tilesets[i].tiles[j].image.substring(1));
                }
            }

            this.level_ = new Level(mapInfo.layers[0].data, mapInfo.layers[0].width);
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
                        var y = Math.floor(j / width);
                        Math.floor( y );
                        var tile = game.add.isoSprite(x*71, y*71, 0, ""+layers[i].data[j], 0, isoGroup);
                        tile.anchor.set(0.5,1.0);
                    }
                }
            }
            // Let's make a load of tiles on a grid
            game.world.setBounds(-700, -700, 3000, 3000);

            // Provide a 3D position for the cursor

            this.character_ = new NPCharacter(network.registerCharacter(), 10, 10, "bot", game);
            this.level_.addCharacter(this.character_);
        },
        update: function () {

            if (this.cursors_.up.isDown)
            {
                game.camera.y -= 4;
            }
            else if (this.cursors_.down.isDown)
            {
                game.camera.y += 4;
            }

            if (this.cursors_.left.isDown)
            {
                game.camera.x -= 4;
            }
            else if (this.cursors_.right.isDown)
            {
                game.camera.x += 4;
            }

            if (this.key_w_.isDown)
            {
                this.character_.addPosition(new Phaser.Point(-3, 0.0));
            }
            if (this.key_a_.isDown)
            {
                this.character_.addPosition(new Phaser.Point(0.0, 3));
            }
            if (this.key_s_.isDown)
            {
                this.character_.addPosition(new Phaser.Point(3, 0.0));
            }
            if (this.key_d_.isDown)
            {
                this.character_.addPosition(new Phaser.Point(0.0, -3));
            }

            var this_obj = this;
            // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
            isoGroup.forEach(function (tile) {
                var cursorPos = new Phaser.Plugin.Isometric.Point3();
                game.iso.unproject(game.input.activePointer.position, cursorPos);
                var inBounds = tile.isoBounds.containsXY(cursorPos.x + 120, cursorPos.y + 100);
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

    network.connect();
    network.readActions();
    network.registerAction({action: "Move"});

    game.state.add('Preload', Preload);
    game.state.add('Boot', Boot);
    game.state.start('Preload');
};
