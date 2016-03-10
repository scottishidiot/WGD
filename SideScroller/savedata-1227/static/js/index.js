window.onload = function () {
    $("#myProgress").hide();
}
var username;

function logIn() {
    username = $("#Username").val();
    var password = $("#Password").val();

    $.ajax({
        type: 'GET',
        url: "/login?username=" + username + "&password=" + password,
        async: true,
        contentType: 'application/javascript',
        success: function (response) {
            console.dir(response);
            if (response == "Correct log in") {
                $("#logIn").hide();
                startGame();
            } else if (response == "Incorrect log in") {
                $("#Username").val("");
                $("#Password").val("");
                $("#Message").text("Incorrect log in details");
            }
        }
    });
}

function createAccount() {
    username = $("#Username").val();
    var password = $("#Password").val();

    $.ajax({
        type: 'GET',
        url: "/createaccount?username=" + username + "&password=" + password,
        async: true,
        contentType: 'application/javascript',
        success: function (response) {
            console.dir(response);
            if (response == "Account created") {
                $("#logIn").hide();
                startGame();
            } else if (response == "Username in use") {
                $("#Username").val("");
                $("#Password").val("");
                $("#Message").val("This account is already in use");
            }
        }
    });
}
var game;

function startGame() {
    $("#myProgress").show();
    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {
        preload: preload,
        create: create,
        update: update
    });

}

var items = new Array();
var blocks;
var trees;
var chunks = new Array();
var blocksA = new Array();
var blocksPickedUp;
var blocksAPickedUp = new Array();
var player;
var bg;
var inventoryBar;
var inventory;
var inventoryBarText = new Array();
var inventoryBarHighlighter;
var reDrawBar = false;
var inventoryControls;
var inventoryTabButton;
var updateInventory = false;
var blockKeyData = new Array();
var width = 0;
var inventoryType;
var startX;
var startY;

function updateProgressBar() {
    game.canvas.id = 'game';
    //console.log(game.load.progress);
    var elem = document.getElementById("myBar");
    if (game.load.progress <= 100) {
        elem.style.width = game.load.progress + '%';
        document.getElementById("label").innerHTML = game.load.progress * 1 + '%';
    }

    if (game.load.progress == 100) {
        $("#myBar").css('height', 0);
        $("#game").css({
            'position': 'fixed',
            'top': '0px'
        });
        $("#myBar").height = 0;
    }
}

function preload() {
    game.load.onFileComplete.add(updateProgressBar, this);
    game.load.image('player', 'Assets/GameImages/Player/p1_front.png');
    game.load.image('playerHurt', 'Assets/GameImages/Player/p1_hurt.png');
    game.load.image('playerJump', 'Assets/GameImages/Player/p1_jump.png');
    game.load.image('grass', 'Assets/GameImages/Blocks/dirt_grass.png', 70, 70);
    game.load.image('dirt', 'Assets/GameImages/Blocks/dirt.png', 70, 70);
    game.load.image('coal_block', 'Assets/GameImages/Blocks/stone_coal_alt.png', 70, 70);
    game.load.image('stone', 'Assets/GameImages/Blocks/stone.png', 70, 70);
    game.load.image('iron_block', 'Assets/GameImages/Blocks/stone_browniron_alt.png', 70, 70);
    game.load.image('gold_block', 'Assets/GameImages/Blocks/stone_gold_alt.png', 70, 70);
    game.load.image('silver_block', 'Assets/GameImages/Blocks/stone_silver_alt.png', 70, 70);
    game.load.image('diamond_block', 'Assets/GameImages/Blocks/stone_diamond_alt.png', 70, 70);
    game.load.image('unbreakable', 'Assets/GameImages/Blocks/greystone.png');
    game.load.image('bgAbove', 'Assets/GameImages/Background/bg.png');
    game.load.image('bgBelow', 'Assets/GameImages/Background/bg_castle.png');
    game.load.image('inventoryBar', 'Assets/GameImages/HUD/inventoryBar.png');
    game.load.image('inventory', 'Assets/GameImages/HUD/inventoryScreen2.png');
    game.load.image('inventoryBarHighlighter', 'Assets/GameImages/HUD/blue_panel.png');
    game.load.image('coal_ore', 'Assets/GameImages/Items/ore_coal.png');
    game.load.image('iron_ore', 'Assets/GameImages/Items/ore_ironAlt.png');
    game.load.image('gold_ore', 'Assets/GameImages/Items/ore_gold.png');
    game.load.image('diamond_ore', 'Assets/GameImages/Items/ore_diamond.png');
    game.load.image('silver_ore', 'Assets/GameImages/Items/ore_silver.png');
    game.load.image('tree', 'Assets/GameImages/Blocks/trunk_side.png');
    game.load.image('planks', 'Assets/GameImages/Blocks/wood.png');
    game.load.image('leaf', 'Assets/GameImages/Blocks/leaves_transparent.png');
    game.load.image('treeSeed', 'Assets/GameImages/Items/seed.png');
    game.load.image('woodPick', 'Assets/GameImages/Items/pick_bronze.png');
    game.load.image('woodAxe', 'Assets/GameImages/Items/axe_bronze.png');
    game.load.image('woodSword', 'Assets/GameImages/Items/sword_bronze.png');
    game.load.image('woodShovel', 'Assets/GameImages/Items/shovel_bronze.png');
    game.load.image('ironPick', 'Assets/GameImages/Items/pick_iron.png');
    game.load.image('ironAxe', 'Assets/GameImages/Items/axe_iron.png');
    game.load.image('ironSword', 'Assets/GameImages/Items/sword_iron.png');
    game.load.image('ironShovel', 'Assets/GameImages/Items/shovel_iron.png');
    game.load.image('silverPick', 'Assets/GameImages/Items/pick_silver.png');
    game.load.image('silverAxe', 'Assets/GameImages/Items/axe_silver.png');
    game.load.image('silverSword', 'Assets/GameImages/Items/sword_silver.png');
    game.load.image('silverShovel', 'Assets/GameImages/Items/shovel_silver.png');
    game.load.image('goldPick', 'Assets/GameImages/Items/pick_gold.png');
    game.load.image('goldAxe', 'Assets/GameImages/Items/axe_gold.png');
    game.load.image('goldSword', 'Assets/GameImages/Items/sword_gold.png');
    game.load.image('goldShovel', 'Assets/GameImages/Items/shovel_gold.png');
    game.load.image('diamondPick', 'Assets/GameImages/Items/pick_diamond.png');
    game.load.image('diamondAxe', 'Assets/GameImages/Items/axe_diamond.png');
    game.load.image('diamondSword', 'Assets/GameImages/Items/sword_diamond.png');
    game.load.image('diamondShovel', 'Assets/GameImages/Items/shovel_diamond.png');
    game.load.image('craftingTable', 'Assets/GameImages/Blocks/table.png');
    game.load.image('furnace', 'Assets/GameImages/Blocks/oven.png');
}

function create() {
    game.stage.backgroundColor = '#ffffff'
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    }
    game.world.setBounds(0, 0, 5000, 1000);
    cursors = game.input.keyboard.createCursorKeys();
    bg = game.add.sprite(0, 0, 'bgAbove');
    bg.scale.setTo(8, 4);
    bg.fixedToCamera = true;
    player = game.add.sprite(200, 397, 'player');
    game.physics.arcade.enable(player);
    player.Reach = 350; //This determine how far away the player can affect blocks
    player.MineLevel = 1; //This is the players MineLevel
    player.handItem = 0; //This is used to take the data from inventory
    player.inventory = new Array();
    for (var e = 0; e <= 29; e++) {
        player.inventory.push({
            Name: "Null",
            MineLevel: 0,
            Health: 0,
            Amount: 0
        });
    }
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 350;
    player.body.collideWorldBounds = true;
    blocks = game.add.group();
    blocks.enableBody = true;
    trees = game.add.group();
    trees.enableBody = true;
    blocksPickedUp = game.add.group();
    blocksPickedUp.enableBody = true;
    game.camera.follow(player);
    loadItems();
    inventoryBar = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'inventoryBar');
    inventoryBar.fixedToCamera = true;
    inventoryBar.inventory = new Array();
    for (var e = 0; e < 9; e++) {
        inventoryBar.inventory.push();
    }
    inventoryBar.crafting = new Array();
    for (var e = 0; e < 4; e++) {
        inventoryBar.crafting.push({
            Key: "",
            Amount: "",
            Number: ""
        });
    }

    inventoryBarHighlighter = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'inventoryBarHighlighter');
    inventoryBarHighlighter.fixedToCamera = true;
    inventoryBarHighlighter.scale.setTo(0.83, 0.9);
    inventory = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'inventory');
    inventory.currentTab = 0;
    inventory.currentRow = 0;
    inventory.currentRowNumber = 0;
    inventory.items = new Array();
    inventory.items.crafting = new Array(9);

    inventory.items.crafting[0] = game.add.sprite(window.innerWidth / 4 + 40, window.innerHeight / 10 + 250, 'planks');
    inventory.items.crafting[0].scale.setTo(0.8, 0.9);
    inventory.items.crafting[0].visible = false;
    inventory.items.crafting[0].fixedToCamera = true;
    inventory.items.crafting[1] = game.add.sprite(window.innerWidth / 4 + 105, window.innerHeight / 10 + 250, 'planks');
    inventory.items.crafting[1].scale.setTo(0.8, 0.9);
    inventory.items.crafting[1].visible = false;
    inventory.items.crafting[1].fixedToCamera = true;
    inventory.items.crafting[2] = game.add.sprite(window.innerWidth / 4 + 168, window.innerHeight / 10 + 250, 'planks');
    inventory.items.crafting[2].scale.setTo(0.8, 0.9);
    inventory.items.crafting[2].visible = false;
    inventory.items.crafting[2].fixedToCamera = true;
    inventory.items.crafting[3] = game.add.sprite(window.innerWidth / 4 + 40, window.innerHeight / 10 + 330, 'planks');
    inventory.items.crafting[3].scale.setTo(0.8, 0.9);
    inventory.items.crafting[3].visible = false;
    inventory.items.crafting[3].fixedToCamera = true;
    inventory.items.crafting[4] = game.add.sprite(window.innerWidth / 4 + 105, window.innerHeight / 10 + 330, 'planks');
    inventory.items.crafting[4].scale.setTo(0.8, 0.9);
    inventory.items.crafting[4].visible = false;
    inventory.items.crafting[4].fixedToCamera = true;
    inventory.items.crafting[5] = game.add.sprite(window.innerWidth / 4 + 168, window.innerHeight / 10 + 330, 'planks');
    inventory.items.crafting[5].scale.setTo(0.8, 0.9);
    inventory.items.crafting[5].visible = false;
    inventory.items.crafting[5].fixedToCamera = true;
    inventory.items.crafting[6] = game.add.sprite(window.innerWidth / 4 + 40, window.innerHeight / 10 + 410, 'planks');
    inventory.items.crafting[6].scale.setTo(0.8, 0.9);
    inventory.items.crafting[6].visible = false;
    inventory.items.crafting[6].fixedToCamera = true;
    inventory.items.crafting[7] = game.add.sprite(window.innerWidth / 4 + 105, window.innerHeight / 10 + 410, 'planks');
    inventory.items.crafting[7].scale.setTo(0.8, 0.9);
    inventory.items.crafting[7].visible = false;
    inventory.items.crafting[7].fixedToCamera = true;
    inventory.items.crafting[8] = game.add.sprite(window.innerWidth / 4 + 168, window.innerHeight / 10 + 410, 'planks');
    inventory.items.crafting[8].scale.setTo(0.8, 0.9);
    inventory.items.crafting[8].visible = false;
    inventory.items.crafting[8].fixedToCamera = true;

    inventoryTabButton = new Array();
    inventoryTabButton.push({
        sprite: game.add.sprite(window.innerWidth / 4 + 120, window.innerHeight / 10 + 10, 'planks'),
        tabSprite: game.add.sprite(window.innerWidth / 4 + 55, window.innerHeight / 10 + 10, 'planks')

    });
    inventoryTabButton[0].sprite.scale.setTo(0.45, 0.45);
    inventoryTabButton[0].sprite.fixedToCamera = true;
    inventoryTabButton[0].sprite.visible = false;
    inventoryTabButton[0].tabSprite.scale.setTo(2.3, 0.45);
    inventoryTabButton[0].tabSprite.fixedToCamera = true;
    inventoryTabButton[0].tabSprite.alpha = 0;
    inventoryTabButton[0].tabSprite.tabNum = 0;
    inventoryTabButton[0].tabSprite.inputEnabled = true;
    inventoryTabButton[0].tabSprite.visible = false;
    inventoryTabButton[0].tabSprite.events.onInputDown.add(changeTab, this);

    inventoryTabButton.push({
        sprite: game.add.sprite(window.innerWidth / 4 + 310, window.innerHeight / 10 + 10, 'diamondPick'),
        tabSprite: game.add.sprite(window.innerWidth / 4 + 240, window.innerHeight / 10 + 10, 'planks')

    });
    inventoryTabButton[1].sprite.scale.setTo(0.45, 0.45);
    inventoryTabButton[1].sprite.fixedToCamera = true;
    inventoryTabButton[1].sprite.visible = false;
    inventoryTabButton[1].tabSprite.scale.setTo(2.3, 0.45);
    inventoryTabButton[1].tabSprite.fixedToCamera = true;
    inventoryTabButton[1].tabSprite.alpha = 0;
    inventoryTabButton[1].tabSprite.tabNum = 1;
    inventoryTabButton[1].tabSprite.inputEnabled = true;
    inventoryTabButton[1].tabSprite.visible = false;
    inventoryTabButton[1].tabSprite.events.onInputDown.add(changeTab, this);

    //X, Y, sprite_name, tab, row, rowNum, maxRow, craftingslots, - upto 9 different ingredients
    InvetoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'planks', 0, 0, 0, 0, 0, "planks");
    
    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'craftingTable', 0, 1, 0, 1, 2, "planks", "planks", undefined, "planks", "planks");
    
    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'furnace', 0, 1, 1, 1, 2, "stone", "stone", "stone", "stone", undefined, "stone", "stone", "stone", "stone");

    InvetoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'woodPick', 1, 0, 0, 4, 3, "planks", "planks", "planks", undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'ironPick', 1, 0, 1, 4, 3, "iron_ore", "iron_ore", "iron_ore", undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'goldPick', 1, 0, 2, 4, 3, "gold_ore", "gold_ore", "gold_ore", undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'silverPick', 1, 0, 3, 4, 3, "silver_ore", "silver_ore", "silver_ore", undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'diamondPick', 1, 0, 4, 4, 3, "diamond_ore", "diamond_ore", "diamond_ore", undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'woodShovel', 1, 1, 0, 4, 3, undefined, "planks", undefined, undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'ironShovel', 1, 1, 1, 4, 3, undefined, "iron_ore", undefined, undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'goldShovel', 1, 1, 2, 4, 3, undefined, "gold_ore", undefined, undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'silverShovel', 1, 1, 3, 4, 3, undefined, "silver_ore", undefined, undefined, "tree", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'diamondShovel', 1, 1, 4, 4, 3, undefined, "diamond_ore", undefined, undefined, "tree", undefined, undefined, "tree", undefined); 
    
    InvetoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'woodAxe', 1, 2, 0, 4, 3, undefined, "planks", "planks", undefined, "tree", "planks", undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'ironAxe', 1, 2, 1, 4, 3, undefined, "iron_ore", "iron_ore", undefined, "tree", "iron_ore", undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'goldAxe', 1, 2, 2, 4, 3, undefined, "gold_ore", "gold_ore", undefined, "tree", "gold_ore", undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'silverAxe', 1, 2, 3, 4, 3, undefined, "silver_ore", "silver_ore", undefined, "tree", "silver_ore", undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'diamondAxe', 1, 2, 4, 4, 3, undefined, "diamond_ore", "diamond_ore", undefined, "tree", "diamond_ore", undefined, "tree", undefined);   
    
    InvetoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'woodSword', 1, 3, 0, 4, 3, undefined, "planks", undefined, undefined, "planks", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'ironSword', 1, 3, 1, 4, 3, undefined, "iron_ore", undefined, undefined, "iron_ore", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'goldSword', 1, 3, 2, 4, 3, undefined, "gold_ore", undefined, undefined, "gold_ore", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'silverSword', 1, 3, 3, 4, 3, undefined, "silver_ore", undefined, undefined, "silver_ore", undefined, undefined, "tree", undefined);

    InvetoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'diamondSword', 1, 3, 4, 4, 3, undefined, "diamond_ore", undefined, undefined, "diamond_ore", undefined, undefined, "tree", undefined);


    for (var i = 0; i < inventory.items.length; i++) {
        inventory.items[i].sprite.fixedToCamera = true;
        inventory.items[i].sprite.visible = false;
        game.world.bringToTop(inventory.items[i].sprite);
    }


    inventory.visible = false;
    inventory.fixedToCamera = true;
}

/**
 * This creates the crafting items by taking in all relevant data so that it can be drawn later on screen
 * @param {int} X - X position of crafting items
 * @param {int} Y - Y position of crafting items
 * @param {string} name - This is the name of the sprite
 * @param {int} Tab - This is the tab that the sprite will be displayed on
 * @param {int} Row - This is the row the sprite will be displayed on
 * @param {int} RowNum - This is the order of the row
 * @param {int} MaxRow - This is how many different sprites will be on the same row
 * @param {int} craftingSlot - This decides whether the sprite can be crafted at a crafting table or in hand
 * @param {string} slotOne - This is the name of crafting ingredient one
 * @param {string} slotTwo - This is the name of crafting ingredient two
 * @param {string} slotThree - This is the name of crafting ingredient three
 * @param {string} slotFour - This is the name of crafting ingredient four
 * @param {string} slotFive - This is the name of crafting ingredient five
 * @param {string} slotSix - This is the name of crafting ingredient six
 * @param {string} slotSeven - This is the name of crafting ingredient seven
 * @param {string} slotEight - This is the name of crafting ingredient eight
 * @param {string} slotNine - This is the name of crafting ingredient nine
 * @constructor
 */
function InvetoryItems(X, Y, name, Tab, Row, RowNum, MaxRow, craftingSlot, slotOne, slotTwo, slotThree, slotFour, slotFive, slotSix, slotSeven, slotEight, slotNine) {
    inventory.items.push({
        sprite: game.add.sprite(X, Y, name),
        Tab: Tab,
        Row: Row,
        RowNumber: RowNum,
        maxRowNumber: MaxRow,
        craftingSlots: craftingSlot,
        Requirements: new Array(9)
    });
    if (slotOne != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[0] = slotOne;
    }
    if (slotTwo != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[1] = slotTwo;
    }
    if (slotThree != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[2] = slotThree;
    }
    if (slotFour != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[3] = slotFour;
    }
    if (slotFive != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[4] = slotFive;
    }
    if (slotSix != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[5] = slotSix;
    }
    if (slotSeven != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[6] = slotSeven;
    }
    if (slotEight != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[7] = slotEight;
    }
    if (slotNine != undefined) {
        inventory.items[inventory.items.length - 1].Requirements[8] = slotNine;
    }
}

/**
 * This function simply changes the tab that is shown for crafting
 * @param {sprite} data - This hold the data for tab that has been clicked on
 */
function changeTab(data) {
    inventory.currentTab = data.tabNum;
    updateInventory = true;
    ePressed();
}

/**
 * This hold the data for the items/blocks found in the game
 * @param {string} name - This is the name of the block
 * @param {int} minelevel - This is the required mine level to break the block
 * @param {int} Health - This is how strong the blocks is
 * @param {int} amount - This is how many will be dropped when broken
 * @param {boolean} placeable - This determines whether the block is placeable
 * @param {int} strength - This is how strong the block is when held by the player
 * @param {int} growtime - This determines of long the block needs to grow/burn
 * @constructor
 */
function ItemsData(name, minelevel, Health, amount, placeable, strength, growtime) {
    this.Name = name;
    //this.MineLevel = minelevel;
    this.MineLevel = 1; //Testing Line
    //this.Health = Health;
    this.Health = 1; //Testing Line
    this.Amount = amount;
    this.Placeable = placeable;
    this.Strength = strength;
    this.growTime = growtime;
}

/**
 * This is where all the items/blocks in the game are created
 * @constructor
 */
function loadItems() {
    //This create all the item objects and fills them with data:
    //Name, Level it can be mined at, how many hits it takes, amount if drops and if it's placeable or not, how much damage it can do
    items.push(new ItemsData("dirt", 1, 3, 1, true, 1, null));
    items.push(new ItemsData("grass", 1, 3, 1, true, 1, null));
    items.push(new ItemsData("unbreakable", 9999, 1, 1, true, 1, null));
    items.push(new ItemsData("coal_block", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("iron_block", 2, 3, 1, true, 1, null));
    items.push(new ItemsData("silver_block", 3, 3, 1, true, 1, null));
    items.push(new ItemsData("gold_block", 4, 3, 1, true, 1, null));
    items.push(new ItemsData("diamond_block", 5, 3, 1, true, 1, null));
    items.push(new ItemsData("stone", 2, 3, 1, true, 1, null));
    items.push(new ItemsData("coal_ore", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("iron_ore", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("silver_ore", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("gold_ore", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("diamond_ore", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("tree", 1, 3, 1, true, 1, null));
    items.push(new ItemsData("leaf", 1, 3, 1, false, 1, null));
    items.push(new ItemsData("treeSeed", 1, 3, 1, true, 1, 15));
    items.push(new ItemsData("woodPick", 1, 3, 1, false, 2, null));
    items.push(new ItemsData("woodAxe", 1, 3, 1, false, 2, null));
    items.push(new ItemsData("woodSword", 1, 3, 1, false, 2, null));
    items.push(new ItemsData("woodShovel", 1, 3, 1, false, 2, null));
    items.push(new ItemsData("ironPick", 1, 3, 1, false, 3, null));
    items.push(new ItemsData("ironAxe", 1, 3, 1, false, 3, null));
    items.push(new ItemsData("ironSword", 1, 3, 1, false, 3, null));
    items.push(new ItemsData("ironShovel", 1, 3, 1, false, 3, null));
    items.push(new ItemsData("silverPick", 1, 3, 1, false, 4, null));
    items.push(new ItemsData("silverAxe", 1, 3, 1, false, 4, null));
    items.push(new ItemsData("silverSword", 1, 3, 1, false, 4, null));
    items.push(new ItemsData("silverShovel", 1, 3, 1, false, 4, null));
    items.push(new ItemsData("goldPick", 1, 3, 1, false, 5, null));
    items.push(new ItemsData("goldAxe", 1, 3, 1, false, 5, null));
    items.push(new ItemsData("goldSword", 1, 3, 1, false, 5, null));
    items.push(new ItemsData("goldShovel", 1, 3, 1, false, 5, null));
    items.push(new ItemsData("diamondPick", 1, 3, 1, false, 6, null));
    items.push(new ItemsData("diamondAxe", 1, 3, 1, false, 6, null));
    items.push(new ItemsData("diamondSword", 1, 3, 1, false, 6, null));
    items.push(new ItemsData("diamondShovel", 1, 3, 1, false, 6, null));
}

/**
 * This handles the mouse clicks
 * @constructor
 */
function mouseClicked() {
    var mouseX = game.input.mousePointer.x + game.camera.x; //Gets X postion of mouse and adds the current camera position  
    var mouseY = game.input.mousePointer.y + game.camera.y; //Gets Y postion of mouse and adds the current camera position
    var blockStartX; //This is used to store the origin point of the block
    var blockStartY; //This is used to store the origin point of the block
    var finishedLoop = false; //This is used to check if all blocks have been checked
    if (inventoryBar.visible == true) {
        if (mouseX % 70 != 0) { //This checks if it's directly on the origin point
            blockStartX = mouseX - (mouseX % 70); //This takes a way the difference between the origin and clicked point
        } else {
            blockStartX = mouseX; //This is used if the click if on the origin point
        }
        if (mouseY % 70 != 0) { //This checks if it's directly on the origin point
            blockStartY = mouseY - (mouseY % 70); //This takes a way the difference between the origin and clicked point
        } else {
            blockStartY = mouseY; //This is used if the click if on the origin point
        }
        if ((mouseX < player.body.x + player.Reach && mouseX > player.body.x - player.Reach) && (mouseY < player.body.y + player.Reach && mouseY > player.body.y - player.Reach)) { //This checks that it is within a set distance from the player
            for (var e = 0; e < blocksA.length; e++) { //Loops through all blocks and checks position
                if (blockStartX == blocksA[e].x && blockStartY == blocksA[e].y && blocksA[e].alive == true) { //Checks if positions are the same
                    if (blocksA[e].Health >= 1 && blocksA[e].MineLevel <= player.MineLevel) { //Checks the Health of the block
                        blocksA[e].Health--; //Damages the block
                        break;
                    } else if (blocksA[e].Health <= 0 && blocksA[e].MineLevel <= player.MineLevel) {
                        var minX = blocksA[e].body.x + 10; //Random X minimum
                        var maxX = blocksA[e].body.x + (blocksA[e].body.width - 10); //Random X maximum
                        var randomX = Math.floor(Math.random() * (maxX - minX) + minX); //Finds a random X
                        var blockDropped;
                        if (blocksA[e].key == "coal_block") {
                            blocksA[e].key = "coal_ore";
                            blockDropped = "item";
                        } else if (blocksA[e].key == "leaf") {
                            var randomNum = Math.floor(Math.random() * (5 - 1) + 1);
                            if (randomNum == 1) {
                                blocksA[e].key = "treeSeed";
                                blockDropped = "item";
                            }
                        } else {
                            blockDropped = "block";
                        }
                        blocksAPickedUp[blocksAPickedUp.length] = blocksPickedUp.create(randomX, blocksA[e].body.y, blocksA[e].key); //Places the dropped block to be picked up
                        if (blockDropped == "block") {
                            blocksAPickedUp[blocksAPickedUp.length - 1].scale.setTo(.2, .2); //Scales the block down
                        } else {
                            blocksAPickedUp[blocksAPickedUp.length - 1].scale.setTo(.5, .5); //Scales the block down
                        }
                        //blocksAPickedUp[blocksAPickedUp.length - 1].body.bounce.y = 0.2; //Sets the block bounce
                        blocksAPickedUp[blocksAPickedUp.length - 1].body.velocity.y = 100; //Sets the block gravity
                        console.log("Block X: " + blocksA[e].blockX + " Block Y: " + blocksA[e].blockY);
                        blocksA[e].kill(); //Kills the block
                        blocksA.splice(e, 1);
                        HUD(); //Updates the HUD
                        break; //Breaks the loop
                    } else {
                        break;
                    }
                } else if (e == blocksA.length - 1) {
                    if (e == blocksA.length - 1 && player.inventory[player.handItem].Name != "Null") { //This is only looked at once all blocks have been seen
                        finishedLoop = true; //This changes to true which means that no blocks are where the player clicked
                    }
                }
            }
            if (finishedLoop == true && player.handItem != -1 && player.inventory[player.handItem].Amount > 0) {
                if ((blockStartX <= player.x && (blockStartX + blocksA[0].width) <= player.x) || (blockStartX >= player.x + player.width && (blockStartX + blocksA[0].width) >= player.x + player.width) || ((blockStartY <= player.y && (blockStartY + blocksA[0].height) <= player.y)) || (blockStartY >= player.y + player.height && (blockStartY + blocksA[0].height) >= player.y + player.height)) {
                    if (player.inventory[player.handItem].Placeable == true) {
                        finishedLoop = false; //Resets the variable 
                        var seedHeld = false;
                        var plantable = true;
                        for (var l = 0; l < blocksA.length; l++) {
                            if (player.inventory[player.handItem].Name == "treeSeed") {
                                seedHeld = true;
                                if (blocksA[l].blockY == (blockStartY / 70) + 1 && blocksA[l].blockX == blockStartX / 70) {
                                    if (blocksA[l].key == "grass" || blocksA[l].key == "dirt") {
                                        plantable = true;
                                        break;
                                    } else {
                                        plantable = false;
                                    }
                                }
                            } else {
                                break;
                            }
                        }
                        if (plantable == true) {
                            if (player.inventory[player.handItem].Name == "treeSeed") {
                                blocksA.unshift(trees.create(blockStartX, blockStartY, player.inventory[player.handItem].Name)); //Creates a new block
                            } else {
                                blocksA.unshift(blocks.create(blockStartX, blockStartY, player.inventory[player.handItem].Name)); //Creates a new block
                            }

                            player.inventory[player.handItem].Amount--;
                            for (var q = 0; q < items.length; q++) {
                                if (items[q].Name == blocksA[0].key) {
                                    blocksA[0].body.immovable = true; //Makes the block immovable
                                    blocksA[0].MineLevel = items[q].MineLevel; //This is the level of equipment needed to mine
                                    blocksA[0].Health = items[q].Health; //This is how many times the block needs to be hit
                                    blocksA[0].growTime = items[q].growTime; //This is how long it takes to grow - if it does
                                    blocksA[0].blockX = blocksA[0].body.x / 70; //This is the X position
                                    blocksA[0].blockY = blocksA[0].body.y / 70; //This is the Y position
                                }
                            }
                        }
                    }
                }
            }
            HUD();
        }
    }
}

/**
 * This is where the HUD is handles
 * @constructor
 */
function HUD() {
    var length = 10;
    for (var e = 0; e < length; e++) {
        if (inventory.visible == true) {
            length = 30;
        }
        if (e == player.handItem && inventoryBar.visible == true) {
            inventoryBarHighlighter.cameraOffset.y = window.innerHeight / 10;
            switch (e) {
            case 0:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4;
                break;
            case 1:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 80;
                break;
            case 2:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 162;
                break;
            case 3:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 244;
                break;
            case 4:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 325;
                break;
            case 5:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 405;
                break;
            case 6:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 485;
                break;
            case 7:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 567;
                break;
            case 8:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 647;
                break;
            case 9:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 728;
                break;
            }
        } else if (e == player.handItem && inventory.visible == true) {
            game.world.bringToTop(inventoryBarHighlighter);
            inventoryBarHighlighter.cameraOffset.y = window.innerHeight / 10 + 87;
            switch (e) {
            case 0:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 50;
                break;
            case 1:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 132;
                break;
            case 2:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 214;
                break;
            case 3:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 295;
                break;
            case 4:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 376;
                break;
            case 5:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 457;
                break;
            case 6:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 538;
                break;
            case 7:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 619;
                break;
            case 8:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 698;
                break;
            case 9:
                inventoryBarHighlighter.cameraOffset.x = window.innerWidth / 4 + 779;
                break;
            }
        }

        if (player.inventory[e].Name != "Null" && player.inventory[e].Amount > 0) {
            var itemName = player.inventory[e];
            var X = 0;
            var Y = 10;
            if (inventory.visible == true) {
                switch (e) {
                case 0:
                    X = 259;
                    Y = 245;
                    break;
                case 1:
                    X = 322;
                    Y = 245;
                    break;
                case 2:
                    X = 387;
                    Y = 245;
                    break;
                case 3:
                    X = 450;
                    Y = 245;
                    break;
                case 4:
                    X = 513;
                    Y = 245;
                    break;
                case 5:
                    X = 578;
                    Y = 245;
                    break;
                case 6:
                    X = 641;
                    Y = 245;
                    break;
                case 7:
                    X = 705;
                    Y = 245;
                    break;
                case 8:
                    X = 768;
                    Y = 245;
                    break;
                case 9:
                    X = 831;
                    Y = 245;
                    break;
                case 10:
                    X = 259;
                    Y = 330;
                    break;
                case 11:
                    X = 322;
                    Y = 330;
                    break;
                case 12:
                    X = 387;
                    Y = 330;
                    break;
                case 13:
                    X = 249;
                    Y = 330;
                    break;
                case 14:
                    X = 450;
                    Y = 330;
                    break;
                case 15:
                    X = 578;
                    Y = 330;
                    break;
                case 16:
                    X = 641;
                    Y = 330;
                    break;
                case 17:
                    X = 705;
                    Y = 330;
                    break;
                case 18:
                    X = 768;
                    Y = 330;
                    break;
                case 19:
                    X = 831;
                    Y = 330;
                    break;
                case 20:
                    X = 259;
                    Y = 410;
                    break;
                case 21:
                    X = 322;
                    Y = 410;
                    break;
                case 22:
                    X = 387;
                    Y = 410;
                    break;
                case 23:
                    X = 249;
                    Y = 410;
                    break;
                case 24:
                    X = 450;
                    Y = 410;
                    break;
                case 25:
                    X = 578;
                    Y = 410;
                    break;
                case 26:
                    X = 641;
                    Y = 410;
                    break;
                case 27:
                    X = 705;
                    Y = 410;
                    break;
                case 28:
                    X = 768;
                    Y = 410;
                    break;
                case 29:
                    X = 831;
                    Y = 410;
                    break;
                }
            } else {
                switch (e) {
                case 0:
                    X = 7;
                    break;
                case 1:
                    X = 87;
                    break;
                case 2:
                    X = 168;
                    break;
                case 3:
                    X = 249;
                    break;
                case 4:
                    X = 330;
                    break;
                case 5:
                    X = 411;
                    break;
                case 6:
                    X = 492;
                    break;
                case 7:
                    X = 573;
                    break;
                case 8:
                    X = 657;
                    break;
                case 9:
                    X = 735;
                    break;
                }
            }
            if (itemName.Name != "Null" && itemName.Amount > 0 && (inventoryBarText[e] == "Null" || inventoryBarText[e] == undefined) || reDrawBar == true) {
                inventoryBar.inventory[e] = game.add.sprite(inventoryBar.x + X - game.camera.x, inventoryBar.y - game.camera.y + Y, itemName.Name);
                inventoryBar.inventory[e].inputEnabled = true;
                inventoryBar.inventory[e].input.enableDrag();
                inventoryBar.inventory[e].enableBody = true;
                inventoryBar.inventory[e].events.onDragStart.add(startDrag, this);
                inventoryBar.inventory[e].events.onDragStop.add(stopDrag, this);
                if (inventory.visible == true) {
                    inventoryBar.inventory[e].scale.setTo(0.8, 0.9);
                }
                inventoryBar.inventory[e].fixedToCamera = true;
                inventoryBar.inventory[e].number = e;
                inventoryBar.inventory[e].number = e;
                inventoryBarText[e] = game.add.text(inventoryBar.x + X - game.camera.x, inventoryBar.y - game.camera.y + Y, player.inventory[e].Amount, {
                    font: "32px Arial",
                    fill: "#000000",
                    align: "center"
                });
                inventoryBarText[e].fixedToCamera = true;
            }
            game.world.bringToTop(inventoryBarText);
        }
        if (player.inventory[e].Amount <= 0 && player.inventory[e].Name != "Null") {
            inventoryBar.inventory[e].kill();
            inventoryBar.inventory[e] = undefined;
            player.inventory[e] = {
                Name: "Null",
                Amount: 0,
                MineLevel: 1,
                Health: 0
            };
        }
    }
    reDrawBar = false;
}

function startDrag(block){
    startX = block.x;
    startY = block.y;
}

function stopDrag(block){
    var loopCount = 0;
    for(var e = 0; e < inventoryBar.inventory.length; e++){
        if (block.x > inventoryBar.inventory[e].x && block.x < inventoryBar.inventory[e].x + inventoryBar.inventory[e].width &&
        block.y > inventoryBar.inventory[e].y && block.y < inventoryBar.inventory[e].y + inventoryBar.inventory[e].height){
            console.log("This collides with: " +  inventoryBar.inventory[e].key);
            //Use .number to see which position they are in the array
            var clickedBlockData;
            for (var i = 0; i < items.length; i++) {
                if (inventoryBar.inventory[e].key == items[i].Name) {
                    clickedBlockData = i;
                }
            }

            var object1Amount = player.inventory[block.number].Amount;
            var object2Amount = player.inventory[e].Amount

            player.inventory[block.number].Name = items[clickedBlockData].Name;
            player.inventory[block.number].Amount = object2Amount;
            player.inventory[block.number].MineLevel = items[clickedBlockData].MineLevel;
            player.inventory[block.number].Health = items[clickedBlockData].Health;

            for (var i = 0; i < items.length; i++) {
                if (block.key == items[i].Name) {
                    clickedBlockData = i;
                }
            }

            player.inventory[e].Name = items[clickedBlockData].Name;
            player.inventory[e].Amount = object1Amount;
            player.inventory[e].MineLevel = items[clickedBlockData].MineLevel;
            player.inventory[e].Health = items[clickedBlockData].Health;

            for (var e = 0; e < inventoryBar.inventory.length; e++) {
                inventoryBar.inventory[e].kill();
                inventoryBar.inventory.splice(e, 1);
                inventoryBarText[loopCount].text = "";
                inventoryBarText[loopCount] = "Null";
                loopCount++;
                e = -1;
            }

            reDrawBar = true;
            HUD();
            break;

        }
        else if(e == inventoryBar.inventory.length - 1){
            loopCount = 0;
            for (var i = 0; i < inventoryBar.inventory.length; i++) {
                inventoryBar.inventory[i].kill();
                inventoryBar.inventory.splice(i, 1);
                inventoryBarText[loopCount].text = "";
                inventoryBarText[loopCount] = "Null";
                loopCount++;
                i = -1;
            }

            reDrawBar = true;
            HUD();
        }
    }

}

/**
 *
 * @constructor
 */
function crafting() {

}

/**
 * This handles the player picking up items
 * @param {sprite} first - This is the player object
 * @param {sprite} second - This is the object the player has ran into
 * @constructor
 */
function pickUpItems(first, second) {
    var item; //Used to store item number
    for (var i = 0; i < items.length; i++) { //Loops through all items data
        if (items[i].Name == second.key) { //Checks if block touching is the same as item looped through
            item = i; //This makes the variable the found item number
        }
    }
    for (var o = 0; o < player.inventory.length; o++) { //Loops through player inventory to check if item already there
        if (player.inventory[o].Name == items[item].Name) { //If item is already there
            player.inventory[o].Amount++; //Add one to item if in inventory
            second.kill(); //This kills the dropped block
            break; //Breaks the loop
        } else if (o == player.inventory.length - 1) { //If item is not there
            for (var e = 0; e < player.inventory.length; e++) { //Loops through inventory
                if (player.inventory[e].Name == "Null") { //Finds empty inventory slot
                    player.inventory[e].Name = items[item].Name; //Makes the inventory slot equal to the item found
                    player.inventory[e].MineLevel = items[item].MineLevel; //Makes the inventory slot equal to the item found
                    player.inventory[e].Strength = items[item].Strength; //Makes the inventory slot equal to the item found
                    player.inventory[e].Placeable = items[item].Placeable;
                    if (player.inventory[e].Amount == 0) {
                        player.inventory[e].Amount++;
                    }
                    second.kill(); //This kills the dropped block
                    HUD(); //Updates the HUD
                    break; //Breaks the loop
                }
            }
        }
    }
}

/**
 * This is the main update function.
 * @constructor
 */
function update() {
    //Start of text update
    for (var e = 0; e < inventoryBarText.length; e++) {
        if (player.inventory[e].Amount > 0) {
            inventoryBarText[e].text = player.inventory[e].Amount;
        } else if (player.inventory[e].Amount <= 0 && inventoryBarText[e] != "Null") {
            inventoryBarText[e].text = "";
            inventoryBarText[e] = "Null";
        }
    }
    //End of text update
    //Start of background change
    if (game.camera.y > 500) {
        bg.loadTexture("bgBelow");
    } else {
        bg.loadTexture("bgAbove");
    }
    //End of background change
    //Start of blocks velocity
    for (var e = 0; e < blocksAPickedUp.length; e++) {
        blocksAPickedUp[e].body.velocity.y = 100;
    }
    //End of blocks velocity
    // Start of Updates player mineLevel
    if (player.inventory[player.handItem].Name != "Null") {
        player.MineLevel = player.inventory[player.handItem].Strength;
    }
    //End of player minelevel update
    //Start of collision
    game.physics.arcade.collide(player, blocks); //This is the collision between blocks and players
    game.physics.arcade.collide(blocks, blocksPickedUp); //This is the collision between blocks and dropped blocks
    game.physics.arcade.collide(player, blocksPickedUp, pickUpItems); //This is the collision between blocks and dropped blocks
    //End of collision
    //Start of tree growth
    for (var e = 0; e < blocksA.length; e++) {
        if (blocksA[e].key == "treeSeed") {
            if (blocksA[e].growTime <= 0) {
                blocksA[e].kill();
                blocksA.splice(e, 1);
            } else {
                var randomNum = Math.floor(Math.random() * (10 - 1) + 1);
                if (randomNum == 3) {
                    blocksA[e].growTime--;
                }
            }
        }
    }
    //End of tree growth
    //Start of ground generation
    var furthestBlock = 0;
    for (var e = 0; e < blocksA.length; e++) {
        if (blocksA[e].x > furthestBlock) {
            furthestBlock = blocksA[e].x
        }
    }
    if (blocksA.length == 0 || furthestBlock < player.body.x + 1000) { //Checks if last block is less than 700 away
        if (blocksA.length != 0) {
            var first = 0;
            var blockNumber;
            for (var e = 0; e < blocksA.length; e++) {
                if (blocksA[e].x > first) {
                    first = blocksA[e].x;
                    blockNumber = e;
                }
            }
            var lastX = blocksA[blockNumber].x; //Stores the last block co-ordinates
        } else {
            var lastX = -70; //This is used if there is no blocks on screen
        }
        var lastTree = 0
        for (var e = lastX + 70; e < lastX + 2000; e += 70) { //Changes the X value for the loop
            var treeChance = Math.floor(Math.random() * (10 - 1) + 1);
            var tree = false;
            var treeHeight = Math.floor(Math.random() * (6 - 3) + 3);
            if (treeChance == 1 && e > (lastTree + 700)) {
                tree = true;
                lastTree = e;
            }
            for (var i = 490; i <= 4000; i += 70) { //Changes the Y value for the loop
                if (i == 490) { //Checks if it's the top layer
                    //Checks if the array is empty
                    blocksA[blocksA.length] = blocks.create(e, i, 'grass'); //Creates a new block
                    blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                    blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                    blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                } else if (i >= 3500) { //This is the bottom layer
                    blocksA[blocksA.length] = blocks.create(e, i, 'unbreakable'); //Creates a new block
                    blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                    blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                    blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                } else {
                    var randomBlock = Math.floor(Math.random() * (8 - 1) + 1);
                    var oreChance;
                    if (randomBlock == 3 && i / 70 > 25) { //Iron
                        oreChance = Math.floor(Math.random() * (100 - 1) + 1);
                        if (oreChance > 50) {
                            randomBlock = -1;
                        }
                    } else if (randomBlock == 4 && i / 70 > 40) { //Gold
                        oreChance = Math.floor(Math.random() * (100 - 1) + 1);
                        if (oreChance > 20) {
                            randomBlock = -1;
                        }
                    } else if (randomBlock == 5 && i / 70 > 40) { //Silver
                        oreChance = Math.floor(Math.random() * (100 - 1) + 1);
                        if (oreChance > 30) {
                            randomBlock = -1;
                        }
                    } else if (randomBlock == 6) { //Diamond
                        oreChance = Math.floor(Math.random() * (100 - 1) + 1);
                        if (oreChance > 10) {
                            randomBlock = -1;
                        }
                    }
                    if (i / 70 >= 2 && randomBlock == 1) {
                        blocksA[blocksA.length] = blocks.create(e, i, 'dirt'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                        blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    } else if (i / 70 >= 11 && randomBlock == 2) {
                        blocksA[blocksA.length] = blocks.create(e, i, 'coal_block'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                        blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    } else if (i / 70 >= 16 && randomBlock == 3) {
                        blocksA[blocksA.length] = blocks.create(e, i, 'iron_block'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                        blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    } else if (i / 70 >= 30 && randomBlock == 4) {
                        blocksA[blocksA.length] = blocks.create(e, i, 'gold_block'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                        blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    } else if (i / 70 >= 19 && randomBlock == 5) {
                        blocksA[blocksA.length] = blocks.create(e, i, 'silver_block'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                        blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    } else if (i / 70 > 40 && randomBlock == 6) {
                        blocksA[blocksA.length] = blocks.create(e, i, 'diamond_block'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                        blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    } else if (i / 70 > 7) {
                        if (i / 70 == 8) {
                            blocksA[blocksA.length] = blocks.create(e, i, 'dirt'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                            blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                        } else {
                            blocksA[blocksA.length] = blocks.create(e, i, 'stone'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                            blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                        }
                    }
                }
                for (var j = 0; j < items.length; j++) {
                    if (items[j].Name == blocksA[blocksA.length - 1].key) {
                        blocksA[blocksA.length - 1].MineLevel = items[j].MineLevel;
                        blocksA[blocksA.length - 1].Health = items[j].Health;
                    }
                }
                if (tree == true) {
                    for (var q = 0; q < treeHeight; q++) {
                        blocksA[blocksA.length] = trees.create(e, 420 - (q * 70), 'tree'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = e / 70;
                        blocksA[blocksA.length - 1].blockY = 420 - (q * 70);
                        tree = false;
                        blocksA[blocksA.length - 1].MineLevel = items[10].MineLevel;
                        blocksA[blocksA.length - 1].Health = items[10].Health;

                        if (q == treeHeight - 1) {
                            //bottom layer
                            blocksA[blocksA.length] = trees.create(e - 70, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e - 70 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 140, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e - 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 210, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e - 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 70, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 70 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 140, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 210, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            //second layer
                            blocksA[blocksA.length] = trees.create(e - 70, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 140, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 70, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 140, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;

                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;

                            blocksA[blocksA.length] = trees.create(e, 420 - (q * 70) - 70, 'tree'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[10].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[10].Health;
                            //Third layer
                            blocksA[blocksA.length] = trees.create(e + 70, 420 - (q * 70) - 140, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 70, 420 - (q * 70) - 140, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e, 420 - (q * 70) - 140, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;

                            //fourth layer
                            blocksA[blocksA.length] = trees.create(e, 420 - (q * 70) - 210, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            tree = false;
                            blocksA[blocksA.length - 1].MineLevel = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                        }
                    }
                }
            }
        }
    }
    //End of ground generation
    //Start of performance imporvement
    var starting = null,
        ending = null;
    for (var e = 0; e < blocksA.length; e++) {
        if (blocksA[e].body.x < (player.body.x - 1400)) {
            if (starting != null) {
                if (blocksA[e].body.x < blocksA[starting].body.x) {
                    console.log("");
                }
            }
            if (starting == null || blocksA[e].body.x < blocksA[starting].body.x) {
                starting = e;
            } else if (ending == null || blocksA[e].body.x <= blocksA[ending].body.x) {
                ending = e;
            }
        }
        if (starting != null && ending != null && e == blocksA.length - 1) {
            for (var i = starting; i < ending; i++) {
                chunks.unshift(blocksA[i]);
                blocksA[i].kill();
            }
            blocksA.splice(starting, (ending - starting));
        }
    }
    starting = null, ending = null;
    if (player.body.velocity.x < 0) {
        for (var e = 0; e < chunks.length; e++) {
            if (chunks[e].body.x > (player.body.x - 1400)) {
                blocksA.unshift(blocks.create(chunks[e].body.x, chunks[e].body.y, chunks[e].key));
                blocksA[0].body.immovable = true; //Makes the block immovable
                blocksA[0].blockX = chunks[e].body.x / 70;
                blocksA[0].blockY = chunks[e].body.y / 70;
                for (var j = 0; j < items.length; j++) {
                    if (items[j].Name == blocksA[0].key) {
                        if (blocksA[blocksA.length - 1].key == "stone") {
                            console.log("");
                        }
                        blocksA[0].MineLevel = items[j].MineLevel;
                        blocksA[0].Health = items[j].Health;
                    }
                }
                chunks.splice(e, 1);
            }
        }
    }
    //End of performance improvement
    game.input.onDown.add(mouseClicked, this); //Handles all click events
    game.world.setBounds(0, -200, player.body.x + 1000, player.body.y + 500); //Changes the world bounds
    //Start of player movement
    //player.body.velocity.x = 0; //Clears all velocity from the player
    if (inventoryBar.visible == true) {
        if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) { //Checks if the left arrow is cleared
            player.body.velocity.x = -150; //Moves the player left
        } else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) { //Checks if the right arrow key is down
            player.body.velocity.x = 150; //Moves the player right
        } else {
            player.body.velocity.x = 0;
        }
        if ((cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && player.body.touching.down) { //Checks if the player is touching the ground and the down key is pressed
            player.body.velocity.y = -400; //Moves the player up
            player.loadTexture("playerJump");
            player.SpriteChange = 5;
        }
    }

    if (player.body.touching.down && player.SpriteChange < 0) {
        player.loadTexture("player");
    } else {
        player.SpriteChange--;
    }

    //End of player movement
    var keys = new Array();
    keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    keys[1] = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    keys[2] = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    keys[3] = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    keys[4] = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    keys[5] = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    keys[6] = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    keys[7] = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
    keys[8] = game.input.keyboard.addKey(Phaser.Keyboard.NINE);
    keys[9] = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
    keys[10] = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keys[10].onDown.add(ePressed, this);


    //Start of HUD update
    for (var e = 0; e < keys.length; e++) {
        if (keys[e].isDown) {
            if (e < 9) {
                player.handItem = e;
            } else if (e == 9) {
                e = 9;
                player.handItem = e;
            }
            HUD();
        }
    }
    //End of HUD update
}

/**
 * This is where the inventory screen controls are dealt with
 * @constructor
 */
function controlInventoryScreen() {
    for (var e = 0; e < 9; e++) {
        inventory.items.crafting[e].kill();
    }
    for (var i = 0; i < inventory.items.length; i++) {
        inventory.items[i].sprite.visible = false;
        game.world.bringToTop(inventory.items[i].sprite);
    }
    player.body.velocity.x = 0;
    if ((inventoryControls[0].isDown || inventoryControls[1].isDown) && player.handItem > 0) {
        player.handItem--;
        inventory.currentRow = player.handItem;
        inventory.currentRowNumber = 0;
        HUD();
    }
    if ((inventoryControls[2].isDown || inventoryControls[3].isDown) && player.handItem < 9) {
        player.handItem++;
        inventory.currentRow = player.handItem;
        inventory.currentRowNumber = 0;
        HUD();
    }
    if ((inventoryControls[4].isDown || inventoryControls[5].isDown)) {
        for (var g = 0; g < inventory.items.length; g++) {
            if (inventory.items[g].Row == inventory.currentRow && inventory.items[g].Tab == inventory.currentTab) {
                if (inventory.items[g].maxRowNumber > inventory.currentRowNumber) {
                    inventory.currentRowNumber++;
                    break;
                } else {
                    inventory.currentRowNumber = 0;
                    break;
                }
            }
        }
    }
    if ((inventoryControls[6].isDown || inventoryControls[7].isDown)) {
        for (var g = 0; g < inventory.items.length; g++) {
            if (inventory.items[g].Row == inventory.currentRow && inventory.items[g].Tab == inventory.currentTab) {
                if (inventory.currentRowNumber > 0) {
                    inventory.currentRowNumber--;
                    break;
                } else {
                    inventory.currentRowNumber = inventory.items[g].maxRowNumber;
                    break;
                }
            }
        }
    }
    for (var e = 0; e < inventory.items.length; e++) {
        if (inventory.items[e].Row == inventory.currentRow && inventory.items[e].Tab == inventory.currentTab && inventory.items[e].RowNumber == inventory.currentRowNumber && inventory.items[e].craftingSlots <= inventoryType) {
            inventory.items[e].sprite.visible = true;
            for (var i = 0; i < inventory.items[e].Requirements.length; i++) {
                if (inventory.items[e].Requirements[i] != undefined) {
                    var X;
                    var Y;
                    switch (i) {
                    case 0:
                        X = window.innerWidth / 4 + 40;
                        Y = window.innerHeight / 10 + 250;
                        break;
                    case 1:
                        X = window.innerWidth / 4 + 105;
                        Y = window.innerHeight / 10 + 250;
                        break;
                    case 2:
                        X = window.innerWidth / 4 + 168;
                        Y = window.innerHeight / 10 + 250;
                        break;
                    case 3:
                        X = window.innerWidth / 4 + 40;
                        Y = window.innerHeight / 10 + 330;
                        break;
                    case 4:
                        X = window.innerWidth / 4 + 105;
                        Y = window.innerHeight / 10 + 330;
                        break;
                    case 5:
                        X = window.innerWidth / 4 + 168;
                        Y = window.innerHeight / 10 + 330;
                        break;
                    case 6:
                        X = window.innerWidth / 4 + 40;
                        Y = window.innerHeight / 10 + 410;
                        break;
                    case 7:
                        X = window.innerWidth / 4 + 105;
                        Y = window.innerHeight / 10 + 410;
                        break;
                    case 8:
                        X = window.innerWidth / 4 + 168;
                        Y = window.innerHeight / 10 + 410;
                        break;
                    }
                    inventory.items.crafting[i] = game.add.sprite(X, Y, inventory.items[e].Requirements[i]);
                    inventory.items.crafting[i].scale.setTo(0.8, 0.9);
                    inventory.items.crafting[i].fixedToCamera = true;
                }
            }
            craftingKilled = true;
            console.log(inventory.items[e].sprite.key);
        } else if (inventory.items[e].Tab == inventory.currentTab && inventory.items[e].Row != inventory.currentRow && inventory.items[e].RowNumber == 0 && inventory.items[e].craftingSlots <= inventoryType) {
            inventory.items[e].sprite.visible = true;
        }
    }
    for (var e = 0; e < inventoryControls.length; e++) {
        inventoryControls[e].isDown = false;
    }

}

/**
 * This is run when e is pressed and it either makes the crafting screen visible or invisible
 * @constructor
 */
function ePressed() {

    var loopCount = 0;
    if (inventoryBar.visible == false && updateInventory == false) { //Inventory bar not visible
        for (var e = 0; e < inventory.items.length; e++) {
            for (var i = 0; i < inventory.items.length; i++) {
                inventory.items[i].sprite.visible = false;
                game.world.bringToTop(inventory.items[i].sprite);
            }
        }
        for (var e = 0; e < inventory.items.crafting.length; e++) {
            inventory.items.crafting[e].visible = false;
        }
        inventoryBar.visible = true;
        inventoryBarHighlighter.visible = true;
        inventory.visible = false;
        inventoryControls = null;
        reDrawBar = true;
        for (var e = 0; e < inventoryTabButton.length; e++) {
            inventoryTabButton[e].sprite.visible = false;
            inventoryTabButton[e].tabSprite.visible = false;
        }
        for (var e = 0; e < inventoryBar.inventory.length; e++) {
            inventoryBar.inventory[e].kill();
            inventoryBar.inventory.splice(e, 1);
            inventoryBarText[loopCount].text = "";
            inventoryBarText[loopCount] = "Null";
            loopCount++;
            e = -1;
        }
        HUD();
    } else { //Inventory bar visible
        for (var e = 0; e < inventoryTabButton.length; e++) {
            inventoryTabButton[e].sprite.visible = true;
            inventoryTabButton[e].tabSprite.visible = true;
        }
        inventory.currentRowNumber = 0;
        updateInventory = false;
        inventoryBar.visible = false;
        inventoryControls = new Array();
        inventoryControls[0] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        inventoryControls[0].onDown.add(controlInventoryScreen, this);
        inventoryControls[1] = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        inventoryControls[1].onDown.add(controlInventoryScreen, this);
        inventoryControls[2] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        inventoryControls[2].onDown.add(controlInventoryScreen, this);
        inventoryControls[3] = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        inventoryControls[3].onDown.add(controlInventoryScreen, this);
        inventoryControls[4] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        inventoryControls[4].onDown.add(controlInventoryScreen, this);
        inventoryControls[5] = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        inventoryControls[5].onDown.add(controlInventoryScreen, this);
        inventoryControls[6] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        inventoryControls[6].onDown.add(controlInventoryScreen, this);
        inventoryControls[7] = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        inventoryControls[7].onDown.add(controlInventoryScreen, this);
        inventoryType = 3;
        inventory.visible = true;
        for (var e = 0; e < inventoryBar.inventory.length; e++) {
            inventoryBar.inventory[e].kill();
            inventoryBar.inventory.splice(e, 1);
            inventoryBarText[loopCount].text = "";
            inventoryBarText[loopCount] = "Null";
            loopCount++;
            e = -1;
        }
        HUD();
        controlInventoryScreen();
    }
}

//Server tests
//This function sends data to the server
function upload() {
    var dataLength = 0;
    var storeData = new Array();
    var start = 0;
    var end;
    var del = true;
    for (var e = 0; e < blocksA.length; e++) {
        if (dataLength + blocksA[e].key.length + blocksA[e].body.x.toString().length + blocksA[e].body.y.toString().length < 500) {
            storeData.push(blocksA[e].key + "," + blocksA[e].body.x + "," + blocksA[e].body.y);
            dataLength = dataLength + blocksA[e].key.length + blocksA[e].body.x.toString().length + blocksA[e].body.y.toString().length;
        } else {
            end = e;
            console.log("Pushing: " + start + " : " + end);
            start = e;
            if(del == true){
                $.get("/delete?username=" + username + "&del=" + del);
                del = false;
            }
            $.get("/save?username=" + username + "&blocks=" + storeData);
            storeData = new Array();
            dataLength = 0;
        }
    }
    dataLength = 0;
    storeData = new Array();
    start = 0;
    end;
    for (var e = 0; e < chunks.length; e++) {
        if (dataLength + chunks[e].key.length + chunks[e].body.x.toString().length + chunks[e].body.y.toString().length < 500) {
            storeData.push(chunks[e].key + "," + chunks[e].body.x + "," + chunks[e].body.y);
            dataLength = dataLength + chunks[e].key.length + chunks[e].body.x.toString().length + chunks[e].body.y.toString().length;
        } else {
            end = e;
            console.log("Pushing: " + start + " : " + end);
            start = e;
            $.get("/save?username=" + username + "&blocks=" + storeData);
            storeData = new Array();
            dataLength = 0;
        }
    }
}
//This function retrieves data from server
function retrieve() {
    blockKeyData = new Array();
    $.ajax({
        type: 'GET',
        url: "/retrieve?username=" + username,
        async: true,
        dataType: 'jsonp',
        contentType: 'application/javascript',
        success: function (response) {
            console.dir(response);
            //response.Data[0].Blocks
            //response.Data[0].X
            //response.Data[0].Y
            var name
            var x
            var y
            for (var e = 0; e < response.Data.length; e++) {
                response.Data[e].Blocks = response.Data[e].Blocks;
                response.Data[e].X = response.Data[e].X;
                response.Data[e].Y = response.Data[e].Y;

            }
            for (var i = 0; i < response.Data.length; i++) {
                name = response.Data[i].Blocks.split(",");
                name.splice(0, 1);
                x = response.Data[i].X.split(",");
                x.splice(0, 1);
                y = response.Data[i].Y.split(",");
                y.splice(0, 1);

                for (var e = 0; e < name.length; e++) {
                    blockKeyData.push({
                        Name: name[e],
                        X: x[e],
                        Y: y[e]
                    });
                }
            }
        }
    });
}
