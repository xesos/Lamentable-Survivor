function TileProperty()
{
    TileProperty.EntryTypes = {
        NO_ENTRY : 0,
        TOP : 1,
        DOWN : 2,
        LEFT: 3,
        RIGHT: 4
    };
    this.canWalk = true;
    this.canEnter = TileProperty.NO_ENTRY;
}

function Level(map, map_x_size)
{
    this.map_ = map;
    this.map_x_size_ = map_x_size;
    this.character_list_ = [];
    this.tile_types_ = {};
}

Level.prototype.setTileType = function(id, properties)
{
    this.tile_types_[id] = properties;
}

Level.prototype.addCharacter = function(character)
{
    this.character_list_.push(character);
    character.setLevel(this);
}

Level.prototype.getElementInMap = function(position)
{
    var tile_id = this.map_[position.x + position.y * this.map_x_size_];
    var ret_tile = this.tile_types_[tile_id];
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