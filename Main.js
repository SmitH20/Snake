/* global Phaser, Storage */


var score = 0;
var startGame = {
    preload: function () {
        game.load.spritesheet('button', 'img/play.png', 400, 200);
        game.load.spritesheet('button2', 'img/play_white.png', 400, 200);
        game.load.audio('click', 'sounds/click_one.mp3');
    },
    create: function () {

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#555555';
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.setMinMax(100, 100, 450, 450);
        if (game.device.desktop) {
            game.scale.setGameSize(450, 450);
        }
        game.scale.refresh();
        this.but = game.add.button(game.world.centerX - (game.cache.getImage('button').width / 2),
                game.world.centerY - (game.cache.getImage('button').height / 2),
                'button',
                this.actione,
                this);
        this.but.events.onInputDown.add(this.down, this);
        this.but = game.add.audio('click');
    },
    down: function () {
        this.buttt = game.add.button(game.world.centerX - (game.cache.getImage('button2').width / 2),
                game.world.centerY - (game.cache.getImage('button2').height / 2),
                'button2',
                this.actione,
                this, 0, 0, 1, 0);
        console.log('Button down');
    },
    actione: function () {
        game.state.start('main');
        this.but.play();
    }
};
var mainState = {
    preload: function () {
        game.load.spritesheet('head_red', 'img/snake_red.png', 18, 18);
        game.load.spritesheet('head_green', 'img/snake_green.png', 18, 18);
        game.load.spritesheet('head_blue', 'img/snake_blue.png', 18, 18);
        game.load.spritesheet('head_orange', 'img/snake_orange.png', 18, 18);
        game.load.audio('eating', 'sounds/eating.mp3');
        game.load.audio('gameover', 'sounds/gameover.mp3');
        game.load.image('apple', 'img/apple.png');
        game.load.image('bg_darkgray_grid', 'img/background_darkgray_grid.png');
        game.load.image('bg_gray', 'img/background_gray.png');
        game.load.image('bg_darkblue', 'img/background_darkblue.png');
        game.load.image('bg_darkbrown_zigzag', 'img/background_darkbrown_zigzag.png');
        game.load.image('bg_darkred_grid', 'img/background_darkred_grid.png');
        game.load.image('bg_lightblue_mesh', 'img/background_lightblue_mesh.png');
        game.load.image('bg_purple_pixels', 'img/background_purple_pixels.png');
        game.load.image('bg_darkgreen_oldcanvas', 'img/background_darkgreen_oldcanvas.png');

        this.Direction = {'UP': 1, 'DOWN': 2, 'LEFT': 4, 'RIGHT': 8};
        this.currentDirection = 2;
        this.player = [];
        this.speed = 18;
        this.lastUpdate = 0;
        this.updateSpeed = 100;
        this.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyW = game.input.keyboard.addKey(Phaser.KeyCode.W);
        this.keyS = game.input.keyboard.addKey(Phaser.KeyCode.S);
        this.keyA = game.input.keyboard.addKey(Phaser.KeyCode.A);
        this.keyD = game.input.keyboard.addKey(Phaser.KeyCode.D);
        this.scoreText = null;
    },
    create: function () {
        game.add.tileSprite(0, 0, 450, 450, this.randomBG());
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.apple = game.add.sprite(144, 144, 'apple');
        this.apple_sound = game.add.audio('eating');

        this.color = this.randomSnake();
        for (var i = 0; i < 4; i++) {
            this.increaseLength();
        }
        game.input.onTap.add(this.touch, this);

        var style = {
            fontSize: '15pt',
            fill: '#ffffff',
            boundsAlignH: 'center',
            stroke: '#303030',
            strokeThickness: 4
        };
        this.scoreText = game.add.text(0, 5, '', style);
        this.updateScore();
    },
    randomSnake: function () {

        var head = Math.floor(Math.random() * 4) + 1;
        switch (head) {
            case 1:
                return 'head_red';
                break;
            case 2:
                return 'head_blue';
                break;
            case 3:
                return 'head_green';
                break;
            case 4:
                return 'head_orange';
                break;
            default:
                return 'head_red';
                break;
        }
    },
    randomBG: function () {
        var bg = Math.floor(Math.random() * 8) + 1;
        switch (bg) {
            case 1 :
                return 'bg_darkgray_grid';
                break;
            case 2 :
                return 'bg_gray';
                break;
            case 3 :
                return 'bg_darkblue';
                break;
            case 4 :
                return 'bg_darkbrown_zigzag';
                break;
            case 5 :
                return 'bg_darkred_grid';
                break;
            case 6 :
                return 'bg_lightblue_mesh';
                break;
            case 7 :
                return 'bg_purple_pixels';
                break;
            case 8 :
                return 'bg_darkgreen_oldcanvas';
                break;
        }
    },
    increaseLength: function () {
        var x = 90;
        var y = 90;
        if (this.player.length !== 0) {
            x = this.player[this.player.length - 1].x + 18;
            y = this.player[this.player.length - 1].y + 18;
        }

        var snakeHead = game.add.sprite(x, y, this.color);
        game.physics.arcade.enable(snakeHead);
        this.player.push(snakeHead);
    },
    getTimeStamp: function () {
        return new Date().getTime();
    },
    updateScore: function () {
        this.scoreText.setText('SCORE: ' + score);
    },
    saveScore: function () {
        if (typeof (Storage) !== 'undefined') {
            var myStorage = localStorage;
            if (!myStorage.score) {
                myStorage.setItem('score', 0);
            }
            myStorage.score = score;
        }
    },
    showScore: function () {
        var endStyle = {
            fontSize: '15pt',
            fill: '#000000',
            boundsAlignV: 'center',
            stroke: '#303030',
            strokeThickness: 1
        };
        this.scoreTxt = game.add.text(160, 300, '', endStyle);
        myStorage = localStorage;
        this.scoreTxt.setText('Your score: ' + myStorage.score);
    },
    checkOutOfBoundry: function () {
        if (this.player[0].x > game.world.width - (this.player[0].width - 1) || this.player[0].x < 0 - 10) {
            return true;
        }
        if (this.player[0].y > game.world.height - (this.player[0].height - 1) || this.player[0].y < 0 - 10) {
            return true;
        }

        return false;
    },
    checkCollisionSelf: function () {
        for (var i = 1; i < this.player.length; i++) {

            if (this.player[0].body.hitTest(this.player[i].x, this.player[i].y)) {

                return true;
            }
        }
        return false;
    },
    chDirect: function () {
        switch (this.currentDirection) {
            case this.Direction.UP:
                this.player[0].y -= this.speed;
                break;
            case this.Direction.DOWN:
                this.player[0].y += this.speed;
                break;
            case this.Direction.LEFT:
                this.player[0].x -= this.speed;
                break;
            case this.Direction.RIGHT:
                this.player[0].x += this.speed;
                break;
        }
    },
    touch: function () {
        var touch = [game.input.x, game.input.y];
        var lastPassed = [0, 0];
        var tiles = [];
        var w = game.width;
        var h = game.height;

        for (var i = 0; i < 3; i++) {
            tiles[i] = [];
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var tmp_x = Math.round(w / 3) + j * Math.round(w / 3);
                var tmp_y = Math.round(h / 3) + i * Math.round(h / 3);
                tiles[i][j] = [tmp_x, tmp_y];
            }
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (i === 0) {
                    if (touch[0] < tiles[i][j][0]) {
                        lastPassed[0]++;
                    }
                } else {
                    if (touch[0] > tiles[i - 1][j][0] && touch[0] < tiles[i][j][0]) {
                        lastPassed[0]++;
                    }
                }
                if (j === 0) {
                    if (touch[1] < tiles[i][j][1]) {
                        lastPassed[1]++;
                    }
                } else {
                    if (touch[1] > tiles[i][j - 1][1] && touch[1] < tiles[i][j][1]) {
                        lastPassed[1]++;
                    }
                }
            }
        }

        if (lastPassed[0] === 2 && lastPassed[1] === 3) { // 2
            if (this.currentDirection !== this.Direction.DOWN)
                this.currentDirection = this.Direction.UP;
            return;
        }
        if (lastPassed[0] === 1 && lastPassed[1] === 3) { // 3
            
            return;
        }
        if (lastPassed[0] === 3 && lastPassed[1] === 2) { // 4
            if (this.currentDirection !== this.Direction.RIGHT)
                this.currentDirection = this.Direction.LEFT;
            return;
        }
        if (lastPassed[0] === 2 && lastPassed[1] === 2) { // 5
          
            return;
        }
        if (lastPassed[0] === 1 && lastPassed[1] === 2) { // 6
            if (this.currentDirection !== this.Direction.LEFT)
                this.currentDirection = this.Direction.RIGHT;
            return;
        }
        if (lastPassed[0] === 3 && lastPassed[1] === 1) { // 7
            
            return;
        }
        if (lastPassed[0] === 2 && lastPassed[1] === 1) {// 8
            if (this.currentDirection !== this.Direction.UP)
                this.currentDirection = this.Direction.DOWN;
            return;
        }
        if (lastPassed[0] === 1 && lastPassed[1] === 1) { // 9
            
            return;
        }
    },
    update: function () {

        if (this.keyUP.isDown || this.keyW.isDown) {
            if (this.currentDirection !== this.Direction.DOWN)
                this.currentDirection = this.Direction.UP;

        }
        if (this.keyLEFT.isDown || this.keyA.isDown) {
            if (this.currentDirection !== this.Direction.RIGHT)
                this.currentDirection = this.Direction.LEFT;

        }
        if (this.keyRIGHT.isDown || this.keyD.isDown) {
            if (this.currentDirection !== this.Direction.LEFT) {
                this.currentDirection = this.Direction.RIGHT;

            }
        }

        if (this.keyDOWN.isDown || this.keyS.isDown) {
            if (this.currentDirection !== this.Direction.UP)
                this.currentDirection = this.Direction.DOWN;
        }
        if ((this.getTimeStamp() - this.lastUpdate) <= this.updateSpeed) {
            return;
        }
        if (this.checkCollisionSelf()) {

            game.state.start("end");

            return;
        }
        if (((this.player[0].x + (this.player[0].width / 2)) > this.apple.x) && (this.player[0].x < (this.apple.x + this.apple.width / 2))) {
            if (((this.player[0].y + (this.player[0].height / 2)) > this.apple.y) && (this.player[0].y < (this.apple.y + this.apple.height / 2))) {
                this.apple.destroy();
                this.apple_sound.play();
                this.increaseLength();
                var x = Math.floor((Math.random() * 450) + 18) % 18 * 18;
                var y = Math.floor((Math.random() * 450) + 54) % 18 * 18;

                for (var i = 0; i < this.player.length; i++) {
                    if (this.player[i].body.hitTest(x, y)) {
                        x = Math.floor((Math.random() * 450) + 18) % 18 * 18;
                        y = Math.floor((Math.random() * 450) + 54) % 18 * 18;
                        i = -1;

                    }

                }
                this.apple = game.add.sprite(x, y, 'apple');
                score += 5;

                if (score % 40 === 0) {
                    if (this.updateSpeed >= 10)
                        this.updateSpeed -= 10;
                }
                this.updateScore();
            }
        }
        this.lastUpdate = this.getTimeStamp();
        var oldX, oldY;
        for (var i = 0; i < this.player.length; i++) {
            var x = this.player[i].x;
            var y = this.player[i].y;
            if (i !== 0) {
                this.player[i].x = oldX;
                this.player[i].y = oldY;
            }
            oldX = x;
            oldY = y;
        }

        this.chDirect();
        if (this.checkOutOfBoundry()) {
            game.state.start('end');
            return;
        }
    }
};
var endGame = {
    preload: function () {
        game.load.spritesheet('gameover', 'img/gameover.png', 400, 200);
        game.load.spritesheet('gameover2', 'img/gameover_white.png', 400, 200);
    },
    create: function () {
        game.stage.backgroundColor = '#555555';
        this.gameover_sound = game.add.audio('gameover');
        this.gameover_sound.play();
        this.but3 = game.add.button(game.world.centerX - (game.cache.getImage('gameover').width / 2),
                game.world.centerY - (game.cache.getImage('gameover').height / 2),
                'gameover',
                this.endGame,
                this);
        this.but3.events.onInputDown.add(this.endDown, this);
        this.but3 = game.add.audio('click');
        mainState.saveScore();
        mainState.showScore();
    },
    endDown: function () {
        this.but4 = game.add.button(game.world.centerX - (game.cache.getImage('gameover2').width / 2),
                game.world.centerY - (game.cache.getImage('gameover2').height / 2),
                'gameover2',
                this.endGame,
                this);
        mainState.scoreTxt.fill = '#ffffff';
    },
    endGame: function () {
        score = 0;
        game.state.start('main');
        this.but3.play();
    }
};
var game = new Phaser.Game(450, 450, Phaser.AUTO);
game.state.add('state', startGame, true);
game.state.add('main', mainState, false);
game.state.add('end', endGame, false);

