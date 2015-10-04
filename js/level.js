
function Level(game)
{
    this.game_ = game;
    this.character_list_ = [];
    this.tile_map_ = {};
    this.selected_character_ = undefined;
    this.selected_tile_ = undefined;
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
    var ret;
    if (this.tile_map_[position.x] != undefined)
    {
      ret = this.tile_map_[position.x][position.y];
    }
    return ret;
}

Level.prototype.getMapPositionFromMouse = function()
{
    var cursorPos = new Phaser.Plugin.Isometric.Point3();
    var mouse_pos = this.game_.input.activePointer.position;
    var offset = Phaser.Point.add(Phaser.Point.add(new Phaser.Point(-500, -380), this.game_.camera.position), mouse_pos);
    this.game_.iso.unproject(offset, cursorPos);
    cursorPos.x = Math.floor(cursorPos.x / DIST_X);
    cursorPos.y = Math.floor(cursorPos.y / DIST_Y);
    return cursorPos;
}

Level.prototype.getCharacterInMap = function(position)
{
    var ret;
    for (var i in this.character_list_)
    {
        var char_position = this.character_list_[i].position();
        if (char_position.x == position.x && char_position.y == position.y)
        {
            ret = this.character_list_[i];
        }
    }
    return ret;
}

Level.prototype.update = function() {
    // Update camera position
    if (this.cursors_.up.isDown) {
        this.game_.camera.y -= 4;
    }
    else if (this.cursors_.down.isDown) {
        this.game_.camera.y += 4;
    }
    if (this.cursors_.left.isDown) {
        this.game_.camera.x -= 4;
    }
    else if (this.cursors_.right.isDown) {
        this.game_.camera.x += 4;
    }

    //Manage selected elements
    var mouse_pos = this.getMapPositionFromMouse();

    if (this.current_tile_) {
        this.current_tile_.drawable().tint = 0xffffff;
    }
    this.current_tile_ = this.getElementInMap(mouse_pos);
    if (this.current_tile_) {
        this.current_tile_.drawable().tint = 0x86bfda;
    }

    if (this.game_.input.activePointer.isDown) {
        var current_character = this.getCharacterInMap(mouse_pos);
        if (current_character && current_character.select != undefined) {
            if (this.selected_character_ != undefined) {
                this.selected_character_.unSelect();
            }
            this.selected_character_ = current_character;
            this.selected_character_.select();
        }
    }

    //Update sprites in the level
    for (var i in this.character_list_)
    {
        this.character_list_[i].update();
    }
}
