
function BaseCharacter (id, x, y, image, game) {
    this.position_ = new Phaser.Point(0,0);
    this.character_id_ = id;
    this.image_ = image;
    this.level_ = undefined;
    this.game_ = game;
};

BaseCharacter.prototype.update = function()
{
    console.log("unimplemented update function in character");
}

BaseCharacter.prototype.setLevel = function(level)
{
    this.level_ = level;
}

function NPCharacter (id, x, y, image, game) {
    BaseCharacter.call(this, id, x, y, image, game);

    this.drawable_ = game.add.isoSprite(0,0,0, 'bot', 0);
    this.setPosition(new Phaser.Point(x,y))
    this.drawable_.animations.add('run');
    this.drawable_.animations.play('run', 15, true);
};

NPCharacter.prototype = new BaseCharacter();
NPCharacter.prototype.constructor = NPCharacter;

NPCharacter.prototype.setPosition = function(pos)
{
    this.position_ = pos;
    this.drawable_.isoX = pos.x;
    this.drawable_.isoY = pos.y;
    console.log("Position is now ");
    console.log(pos);
}

NPCharacter.prototype.addPosition = function(add)
{
    this.setPosition(Phaser.Point.add(this.position_, add));
}

NPCharacter.prototype.update = function()
{
}


