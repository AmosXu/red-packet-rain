  
  //初始化图片
  let imgjishi = 'assets/img/daojishi.png'
  let bgPlan = 'assets/img/bg-plan.jpg'
  let bgRainer = 'assets/img/bg-rainer.jpg'
  let redpacket = 'assets/img/redpacket.png'
  let close = 'assets/img/close.png'
  let dialogExit = 'assets/img/dialog-exit.png'
  let buttonCancel = 'assets/img/button-cancel.png'
  let buttonExit = 'assets/img/button-exit.png'
  let openRedpacket = 'assets/img/open-redpacket.png'
  let open = 'assets/img/open.png'
  let redpacketResult = 'assets/img/redpacket-result.png'
  let buttonUseTicket = 'assets/img/button-use-ticket.png'
  let buttonContinue = 'assets/img/button-continue.png'
  let cursorAnimation = 'assets/img/cursor-animation.png'

  let states = {}
  let QingLvGroup;
  let hitNum = 0;
  let config = {
      selfPool:40,
      selfPic:'redpacket',
      rate:0.5,
      maxSpeed:1200,
      minSpeed:400,
      max:95
  }

  let ids = [0, 1, 2, 3, 4, 5]
  let redpackets = ['全场优惠50元', '20元代金券', '全场优惠50元', '20元代金券', '全场优惠50元', '20元代金券']
  let time = 25;
  let getIds = []
  let radio = document.documentElement.clientWidth/375;
  let e;

  function rfuc(n){
    return n*radio;
  }

  //初始化红包
  function QingLv(config, game){
    this.init = function(){
        this.config = config;
        QingLvGroup = game.add.group();
        QingLvGroup.enableBody = true;
        QingLvGroup.createMultiple(config.selfPool, config.selfPic); //初始化多个红包
        QingLvGroup.setAll('anchor.y',1)
        QingLvGroup.setAll('outOfBoundsKill', true);
        QingLvGroup.setAll('checkWorldBounds', true);
        this.maxWidth = game.width + 300;

        game.time.events.loop(Phaser.Timer.SECOND * config.rate, this.createQL, this);
    };
    this.createQL = function(){
        e = QingLvGroup.getFirstExists(false);
        
        if(e) {
            if(hitNum >= config.max) {
                return;
            }
            hitNum++;
            e.events.onInputDown.removeAll();
            var ram= Math.random();
            ram =ram<0.5?ram+=0.5: ram;
            e.loadTexture(this.config.selfPic)
            e.alpha = 1;
            e.angle = 30
            // e.scale.setTo(rfuc(ram));
            e.reset(game.rnd.integerInRange(100, this.maxWidth), 100)  //红包生成的位置
            e.body.velocity.x = game.rnd.integerInRange(-300, -150);   //红包移动的速度
            e.body.velocity.y = game.rnd.integerInRange(config.minSpeed, config.maxSpeed);
            e.inputEnabled = true;
            e.events.onInputDown.add(this.hitted, this)
        }
    };
    this.hitted = function(sprite){
        if(Math.random() < 1/4 && ids.length > 0) {
          sprite.kill();
          
          //点击获得红包,游戏暂停
          game.paused = true;

          //背景
          let hexGraphics = new Phaser.Graphics().beginFill(0x000000, 0.5).drawRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight + 2);
          let pausedMask = game.add.sprite(0, 0, hexGraphics.generateTexture())
          
          let openDialog = game.add.sprite(rfuc(62), rfuc(150), 'openRedpacket')
          
          let open = game.add.sprite(rfuc(130), rfuc(300), 'open')
          open.inputEnabled = true;
        
          let result = game.add.sprite(rfuc(0), rfuc(120), 'redpacketResult')
          result.visible = false

          let userTicket = game.add.sprite(rfuc(78), rfuc(445), 'buttonUseTicket')
          userTicket.visible = false

          let goOn = game.add.sprite(rfuc(198), rfuc(445), 'buttonContinue')
          goOn.visible = false

          let ticketText = {};
          let link = ''
          
          //拆红包
          let clickOpen = function() {

            //游戏暂停时,点击事件无效,只能通过这种画热点的形式来绑定事件
            let openRect = new Phaser.Rectangle(rfuc(130), rfuc(315), 239, 239).copyFrom(open);

            if (openRect.contains(game.input.x, game.input.y)) {
              let currentWidth = open.width

              //拆红包动画
              let tempArr = [2, 4, 8, 4, 2, 1]
              let index = 0;
              let timer = setInterval(function() {
                if (index > tempArr.length-1) { index = 0 }
                open.width = currentWidth / tempArr[index]
                open.height = open.height
                open.left = game.world.centerX - open.width / 2
                ++index
              }, 200)
              game.input.onDown.remove(clickOpen, this);
              let arrIndex = Math.floor(Math.random() * ids.length)
              let redpacketId = ids.splice(arrIndex, 1)
              getIds.push(redpacketId[0])

              setTimeout(()=> {
                timer && clearInterval(timer)
                document.getElementById('audioOpen').play()
                let text = redpackets[redpacketId[0]]
                ticketText = game.add.text(0, rfuc(338), text, {fill: '#ffe67d', fontSize: '46px', fontWeight: 'bolder'})
                ticketText.left = game.world.centerX - ticketText.width / 2    //文字相对于屏幕左右居中
                openDialog.visible = false
                open.visible = false
                result.visible = true
                userTicket.visible = true
                goOn.visible = true
                game.input.onDown.add(clickButton, this)
              }, 1000)
            } 
          };

          let clickButton = function() {
            let userTicketRect = new Phaser.Rectangle(rfuc(78), rfuc(445), 194, 66).copyFrom(userTicket);
            let continueRect = new Phaser.Rectangle(rfuc(198), rfuc(445), 194, 66).copyFrom(goOn);

            if (userTicketRect.contains(game.input.x, game.input.y)) {
              window.location.replace(link)
              game.input.onDown.remove(clickButton, this);

            } else if (continueRect.contains(game.input.x, game.input.y)) {
              result.visible = false
              userTicket.visible = false
              goOn.visible = false
              pausedMask.visible = false
              ticketText.visible = false
              game.paused = false
              game.input.onDown.remove(clickButton, this);
            }
          }

          game.input.onDown.add(clickOpen, this)
        } else {
          sprite.inputEnabled = false;
          var anim = sprite.animations.add(config.selfPic);
          sprite.play(config.selfPic, 40, false);
          anim.onComplete.add(this.fade, this, sprite)  
        }
    };
    this.fade = function(sprite){
        var tween = game.add.tween(sprite).to({alpha:0}, 300, 'Linear', true)
        tween.onComplete.add(this.killed, this, sprite);
    };
    this.killed = function(sprite){
        sprite.kill();
    }
  }
  states.boot = function(game) {
    this.preload = function() {
        if (typeof(GAME) !== "undefined") {
            this.load.baseURL = GAME + "/";
        }
        if (!game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
    };
    this.create = function() {
        game.stage.backgroundColor = '#FFF';
        game.state.start('preload');
    };
  };
  states.preload = function(game) {
      this.preload = function(game) {
          //加载图片
          game.load.spritesheet('daojishi', imgjishi, 250,120, 4)
          game.load.image('bgPlan', bgPlan)
          game.load.image('bgRainer', bgRainer)
          game.load.spritesheet('redpacket', redpacket, 144, 173, 2)
          game.load.image('close', close)
          game.load.image('dialogExit', dialogExit)
          game.load.image('buttonExit', buttonExit)
          game.load.image('buttonCancel', buttonCancel)
          game.load.image('openRedpacket', openRedpacket)
          game.load.image('open', open)
          game.load.image('redpacketResult', redpacketResult)
          game.load.image('buttonContinue', buttonContinue)
          game.load.image('buttonUseTicket', buttonUseTicket)
          game.load.spritesheet('cursorAnimation', cursorAnimation, 74, 108, 2)
      };
      this.create = function() {
          game.state.start('main');
      };
  };
  states.main = function(game) {
      this.create = function() {
          // 物理系统
          game.physics.startSystem(Phaser.Physics.ARCADE);

          // 背景图
          var bgPlan = game.add.sprite(0, 0, 'bgPlan');
          bgPlan.width = game.width;
          bgPlan.height = game.height;

          var cursorPointer = game.add.sprite(game.world.centerX - 36, game.world.centerY + 86, 'cursorAnimation');
          var anim = cursorPointer.animations.add('cursorAnimation');
          cursorPointer.play('cursorAnimation', 2, true);

          document.getElementById('audioCountDown').play()

          // 开始游戏倒计时
          var daojishi = game.add.sprite(game.world.centerX - 140, game.world.centerY - 400, 'daojishi');
          var anim = daojishi.animations.add('daojishi');
          daojishi.play('daojishi', 1, false);
          anim.onComplete.add(this.startGame, this, daojishi);
      };
      
      this.startGame = function(daojishi){
          this.leftTime = time
          let bgRainer = game.add.sprite(0, 0, 'bgRainer');
          bgRainer.width = game.width;
          bgRainer.height = game.height;
          daojishi.visible = false;
          this.createQingLv();

          //添加按钮,并绑定事件
          let closeImg = game.add.button(rfuc(20), rfuc(20), 'close', function(){
            game.paused = true
            pausedMask.visible = true
            exitDialog.visible = true
            exitButton.visible = true
            cancelButton.visible = true

            game.input.onDown.add(buttonClick, this)
          }.bind(this))
          
          // 剩余时间
          this.leftTimeText = game.add.text(0, 0, this.leftTime, {fill: '#FFF', fontSize: '40px', fontWeight: 'bolder'})
          this.leftTimeText.scale.setTo(rfuc(1))
          this.leftTimeText.fixedToCamera = true;
          this.leftTimeText.cameraOffset.setTo(game.camera.width - rfuc(80), rfuc(20));

          let hexGraphics = new Phaser.Graphics().beginFill(0x000000, 0.5).drawRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight + 2);
          let pausedMask = game.add.sprite(0, 0, hexGraphics.generateTexture())
          pausedMask.visible = false;

          let exitDialog = game.add.sprite(rfuc(62), rfuc(150), 'dialogExit')
          exitDialog.visible = false;

          let exitButton = game.add.button(rfuc(80), rfuc(315), 'buttonExit')
          exitButton.visible = false;

          let isExit = false
          let cancelButton = game.add.button(rfuc(200), rfuc(315), 'buttonCancel')
          cancelButton.visible = false;

          game.time.events.repeat(Phaser.Timer.SECOND, this.leftTime, this.refreshTime, this)

          let buttonClick = function() {
            let cancelRect = new Phaser.Rectangle(rfuc(200), rfuc(315), 194, 66).copyFrom(cancelButton);
            if (cancelRect.contains(game.input.x, game.input.y)) {
              game.input.onDown.remove(buttonClick, this)
              game.paused = false
              pausedMask.visible = false
              exitDialog.visible = false
              exitButton.visible = false
              cancelButton.visible = false
            }
          }
      };

      this.createQingLv = function(){
          this.qinglv = new QingLv(config, game);
          this.qinglv.init();
          this.qinglv = new QingLv(config, game);
          this.qinglv.init();
      };
      
      this.refreshTime = function(){
          this.leftTime--;
          var tem = this.leftTime;
          this.leftTimeText.text = tem;
          if(this.leftTime === 0) {
              game.paused = true;
          }
      }
  };

  //生成游戏
  let game = null
  if (game == null) {
    game = new Phaser.Game(document.documentElement.clientWidth, document.documentElement.clientHeight + 2, Phaser.AUTO, document.getElementById('gameScreen'));
    game.state.add('boot', states.boot.bind(game));
    game.state.add('preload', states.preload.bind(game));
    game.state.add('main', states.main.bind(game));
    game.state.start('boot');
  }

