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
        this.finished_elements = 0;
    }

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

    var Boot = function () { };

    Boot.prototype =
    {
        level_: new Level(game),
        tile_properties_: {},
        preload: function () {
            game.add.sprite(0, 0, 'loading');
            var tilesets = mapInfo.tilesets;
            game.load.atlasJSONHash('bot', 'images/running_bot.png', 'images/running_bot.json');

            this.level_.setup();

            for (var i in tilesets)
            {
                for(var j in tilesets[i].tiles)
                {
                    var id = parseInt(j) + parseInt(tilesets[i].firstgid);
                    game.load.image(""+id, tilesets[i].tiles[j].image.substring(1));
                    this.tile_properties_[id] = new TileProperty(""+id);
                }
            }
        },
        create: function () {
            // Create a group for our tiles.
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
                        this.level_.addTile(new LevelTile(x, y, this.tile_properties_[layers[i].data[j]], game));
                    }
                }
            }
            // Let's make a load of tiles on a grid
            game.world.setBounds(-700, -700, 3000, 3000);

            // Provide a 3D position for the cursor

            this.level_.addCharacter(new PCharacter(network.registerCharacter(), 10, 10, "bot", game));
            this.level_.addCharacter(new PCharacter(network.registerCharacter(), 15, 15, "bot", game));
        },
        update: function () {

            this.level_.update();

            var this_obj = this;
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
