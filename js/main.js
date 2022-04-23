enchant();

var SCREEN_WIDTH = 320;
var SCREEN_HEIGHT = 320;
var SCROLL_SPEED = 2;
var game, scene, score, highScore = 0,
    player, enemies, startScene, gameScene, endScene, createStartScene, createGameScene, createGameoverScene;
var enemies = [];

window.onload = function () {

    game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
    game.preload('img/bg.png', 'img/start.png', 'img/end.png', 'img/player.png', 'img/enemy.png', 'sound/kyoku.mp3');
    game.keybind('Z'.charCodeAt(0), 'a');
    game.keybind('X'.charCodeAt(0), 'b');

    game.onload = function () {

        createStartScene = function () {
            score = 0;

            startScene = new Scene();
            startScene.backgroundColor = '#000000';

            var startImage = new Sprite(236, 48);
            startImage.image = game.assets['img/start.png'];
            startImage.x = SCREEN_WIDTH / 2 - startImage.width / 2;;
            startImage.y = SCREEN_HEIGHT / 2 - startImage.height;;
            startScene.addChild(startImage);

            var label = new Label('現在のハイスコア : ' + highScore);
            label.color = '#ffffff';
            label.font = '12px sans-serif';
            label.textAlign = 'center';
            label.x = SCREEN_WIDTH / 2 - label.width / 2;
            label.y = 200;
            startScene.addChild(label);

            var label2 = new Label('Zキーでスタート');
            label2.color = '#ff0000';
            label2.font = '12px sans-serif';
            label2.textAlign = 'center';
            label2.x = SCREEN_WIDTH / 2 - label2.width / 2;
            label2.y = 230;
            startScene.addChild(label2);

            startScene.addEventListener(Event.ENTER_FRAME, function (e) {
                var input = game.input;
                if (input.a === true) {
                    this.removeEventListener(Event.ENTER_FRAME, arguments.callee);
                    game.assets['sound/kyoku.mp3'].play();
                    game.replaceScene(createGameScene());
                }
            });

            return startScene;
        };

        createGameScene = function () {
            game.frame = 0;

            gameScene = new Scene();
            gameScene.backgroundColor = "#000000";

            var bg1 = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
            bg1.image = game.assets['img/bg.png'];
            bg1.x = 0;
            bg1.y = 0;
            gameScene.addChild(bg1);

            var bg2 = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
            bg2.image = game.assets['img/bg.png'];
            bg2.x = SCREEN_WIDTH;
            bg2.y = 0;
            gameScene.addChild(bg2);

            player = new Sprite(50, 27);
            player.image = game.assets['img/player.png'];
            player.moveTo(50, 100);
            player.vy = 0;
            gameScene.addChild(player);

            var label = new Label('スコア : 0');
            label.color = '#ffffff';
            label.font = '12px sans-serif';
            gameScene.addChild(label);

            enemies = new Array();

            player.addEventListener(Event.ENTER_FRAME, function () {
                var input = game.input;
                if (input.left === true) {
                    this.x -= 2;
                }
                if (input.right === true) {
                    this.x += 2;
                }

                if (input.a === true) {
                    this.vy = -5;
                }

                this.y += this.vy;
                this.vy += 0.25;

                if (this.vy >= 0) {
                    this.frame = 0;
                }

                score = Math.floor((game.frame / game.fps) * 10) / 10;
                label.text = "スコア : " + score;

                if (this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
                    this.removeEventListener(Event.ENTER_FRAME, arguments.callee);
                    game.replaceScene(createGameoverScene());
                }

                if (Math.random() * 1000 < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 50) {
                    var enemy = new Enemy(SCREEN_WIDTH, Math.random() * SCREEN_HEIGHT);
                    enemy.key = game.frame;
                    enemies[game.frame] = enemy;
                }

                bg1.x -= SCROLL_SPEED;
                bg2.x -= SCROLL_SPEED;
                if (bg1.x <= -SCREEN_WIDTH) {
                    bg1.x = SCREEN_WIDTH;
                }
                if (bg2.x <= -SCREEN_WIDTH) {
                    bg2.x = SCREEN_WIDTH;
                }

            });

            return gameScene;
        };

        createGameoverScene = function () {
            game.assets['sound/kyoku.mp3'].stop();

            endScene = new Scene();
            endScene.backgroundColor = '#000000';

            var gameoverImage = new Sprite(189, 97);
            gameoverImage.image = game.assets['img/end.png'];
            gameoverImage.x = SCREEN_WIDTH / 2 - gameoverImage.width / 2;
            gameoverImage.y = SCREEN_HEIGHT / 2 - gameoverImage.height / 2;
            endScene.addChild(gameoverImage);

            var label = new Label('あなたのスコア : ' + score);
            label.color = '#ffffff';
            label.font = '12px sans-serif';
            label.textAlign = 'center';
            label.x = SCREEN_WIDTH / 2 - label.width / 2;
            label.y = 230;
            endScene.addChild(label);

            var label2 = new Label('Xキーでリトライ');
            label2.color = '#ff0000';
            label2.font = '12px sans-serif';
            label2.textAlign = 'center';
            label2.x = SCREEN_WIDTH / 2 - label2.width / 2;
            label2.y = 250;
            endScene.addChild(label2);

            if (score > highScore) {
                highScore = score;
            }

            endScene.addEventListener(Event.ENTER_FRAME, function (e) {
                var input = game.input;
                if (input.b === true) {
                    this.removeEventListener(Event.ENTER_FRAME, arguments.callee);
                    game.replaceScene(createStartScene());

                }
            });

            return endScene;
        };

        game.replaceScene(createStartScene());
    };

    game.start();
};

var Enemy = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y) {

        enchant.Sprite.call(this, 60, 27);
        this.image = game.assets['img/enemy.png'];
        this.x = x;
        this.y = y;
        this.moveSpeed = 3;
        this.addEventListener('enterframe', function () {
            this.move();
        });
        gameScene.insertBefore(this, gameScene.childNodes[2]);
    },

    move: function () {

        this.x -= this.moveSpeed;
        if (this.y > SCREEN_HEIGHT || this.x > SCREEN_WIDTH || this.x < -this.width || this.y < -this.height) {
            this.remove();
        }

        if (this.within(player, 32)) {
            game.replaceScene(createGameoverScene());
        }
    },
    remove: function () {

        gameScene.removeChild(this);
        delete enemies[this.key];
    }
});