
function Level(game)
{
    this.game_ = game;
    this.character_list_ = [];
    this.tile_map_ = {};
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
    this.game_.iso.unproject(position, cursorPos);
    for (var i in this.tile_map_)
    {
        for (var j in this.tile_map_[i])
        {
            if (this.tile_map_[i][j].drawable().isoBounds.containsXY(cursorPos.x + 120, cursorPos.y + 100))
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
    for (var i in this.character_list_)
    {
        this.character_list_[i].update();
    }
}
