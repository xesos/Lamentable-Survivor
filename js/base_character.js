var DIST_X = 71;
var DIST_Y = 71;

//All elements shown in the game derive from this
function BaseTile(x, y, image, game) {
    this.position_ = new Phaser.Point(0,0);
    this.game_ = game;

    this.drawable_ = game.add.isoSprite(0,0,0, image, 0);
    this.drawable_.anchor.set(0.5,1.0);
    this.setPosition(new Phaser.Point(x,y));
}

BaseTile.prototype.setPosition = function(pos)
{
    this.position_ = pos;
    this.drawable_.isoX = pos.x * DIST_X;
    this.drawable_.isoY = pos.y * DIST_Y;
}

BaseTile.prototype.position = function()
{
    return this.position_;
}

BaseTile.prototype.drawable = function()
{
    return this.drawable_;
}

//Defines the properties of a tile in the map
function TileProperty(image)
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
    this.image_id_ = image;
}

//Tiles drawn in the map. Contains information relevant to the characters in the game
function LevelTile(x, y, description, game)
{
    BaseTile.call(this, x, y, description.image_id_, game);
    this.description_ = description;
}

LevelTile.prototype = Object.create(BaseTile.prototype);
LevelTile.prototype.constructor = LevelTile;

//This elements update on each iteration and contain an id for sending them through the network
function BaseSprite (id, x, y, image, game) {
    BaseTile.call(this, x, y, image, game);
    this.character_id_ = id;
    this.level_ = undefined;
};

BaseSprite.prototype = Object.create(BaseTile.prototype);
BaseSprite.prototype.constructor = BaseSprite;

BaseSprite.prototype.update = function()
{
    console.log("unimplemented update function in character");
}

BaseSprite.prototype.setLevel = function(level)
{
    this.level_ = level;
}

//mixin for creating selectable elements
function asSelectable() {
    this.selected_ = false;
    this.select = function()
    {
        this.selected_ = true;
    }
    this.unSelect = function()
    {
        this.selected_ = false;
    }
}

function PCharacter (id, x, y, image, game) {
    BaseSprite.call(this, id, x, y, image, game);
    this.key_w_ = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.key_a_ = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.key_s_ = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.key_d_ = game.input.keyboard.addKey(Phaser.Keyboard.D);

    this.drawable_.animations.add('run');
    this.drawable_.animations.play('run', 15, true);
    this.prev_selected_ = undefined;
};

PCharacter.prototype = Object.create(BaseSprite.prototype);
PCharacter.prototype.constructor = PCharacter;

asSelectable.call(PCharacter.prototype);

PCharacter.prototype.addPosition = function(add)
{
    this.setPosition(Phaser.Point.add(this.position_, add));
}

PCharacter.prototype.update = function()
{
    if (this.selected_) {
        var selected = this.level_.getElementInMap(this.level_.getMapPositionFromMouse());
        if (selected) {
            if (this.prev_selected_ !== undefined) {
                this.prev_selected_.drawable().tint = 0xffffff;
            }
            this.prev_selected_ = selected;
            selected.drawable().tint = 0x86bfda;
        }
        if (this.prev_selected_) {
            if (this.game_.input.activePointer.isDown) {
                this.setPosition(this.prev_selected_.position());
            }
            if (this.key_w_.isDown) {
                this.addPosition(new Phaser.Point(-0.1, 0.0));
            }
            if (this.key_a_.isDown) {
                this.addPosition(new Phaser.Point(0.0, 0.1));
            }
            if (this.key_s_.isDown) {
                this.addPosition(new Phaser.Point(0.1, 0.0));
            }
            if (this.key_d_.isDown) {
                this.addPosition(new Phaser.Point(0.0, -0.1));
            }
        }
    }
}


