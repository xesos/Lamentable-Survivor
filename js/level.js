
function Level(game)
{
    this.game_ = game;
    this.character_list_ = [];
    this.tile_map_ = {};
}

Level.prototype.setup = function()
{
    this.cursors_ = this.game_.input.keyboard.createCursorKeys();
}

Level.prototype.addCharacter = function(character)
{
    this.character_list_.push(character);
    character.setLevel(this);
}

Level.prototype.addTile = function(tile)
{
    if(this.tile_map_[tile.position().x] == undefined)
    {
        this.tile_map_[tile.position().x] = {};
    }
    this.tile_map_[tile.position().x][tile.position().y] = tile;
}

Level.prototype.getElementInMap = function(position)
{
    return this.tile_map_[position.x][position.y];
}

Level.prototype.getCharacterInMap = function(position)
{
    var ret;
    for (var i in this.character_list_)
    {
        if (this.character_list_[i].position == position)
        {
            ret = this.character_list_[i];
        }
    }
    return ret;
}

Level.prototype.getElementFromMousePosition = function(position)
{
    var ret;
    var cursorPos = new Phaser.Plugin.Isometric.Point3();
    var offset = Phaser.Point.add(Phaser.Point.add(new Phaser.Point(-511, -483), this.game_.camera.position), position);
    this.game_.iso.unproject(offset, cursorPos);
    console.log(offset);
    for (var i in this.tile_map_)
    {
        for (var j in this.tile_map_[i])
        {
            if (this.tile_map_[i][j].drawable().isoBounds.containsXY(cursorPos.x + 120 , cursorPos.y + 100))
            {
                ret = this.tile_map_[i][j];
                break;
            }
        }
    }
    return ret;
}

Level.prototype.update = function()
{

    if (this.cursors_.up.isDown)
    {
        this.game_.camera.y -= 4;
    }
    else if (this.cursors_.down.isDown)
    {
        this.game_.camera.y += 4;
    }

    if (this.cursors_.left.isDown)
    {
        this.game_.camera.x -= 4;
    }
    else if (this.cursors_.right.isDown)
    {
        this.game_.camera.x += 4;
    }

    for (var i in this.character_list_)
    {
        this.character_list_[i].update();
    }
}
