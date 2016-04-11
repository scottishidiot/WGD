// TODO - Clear inventory bar selector on furnace, make furnace useable, player spawn point, player server save

/**
 * This is used to hdie the progress bar
 * @constructor
 */
window.onload = function () {
    $("#myProgress").hide();
}
var username;
/**
 * This is where the player attempts to log-in
 * @constructor
 */
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
                retrieve();
            } else if (response == "Incorrect log in") {
                $("#Username").val("");
                $("#Password").val("");
                $("#Message").text("Incorrect log in details");
            }
        }
    });
}

/**
 * This is where the player creates a new account
 * @constructor
 */
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
                retrieve();
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

var items = [];
var blocks;
var trees;
var chunks = [];
var blocksA = [];
var blocksPickedUp;
var blocksAPickedUp = [];
var player;
var bg;
var inventoryBar;
var inventory;
var inventoryBarText = [];
var inventoryBarHighlighter;
var reDrawBar = false;
var inventoryControls;
var inventoryTabButton;
var updateInventory = false;
var blockKeyData = [];
var width = 0;
var inventoryType;
var startX;
var startY;
var save;
var trash;
var lastTree = 0;
var toolTip;
var blockClicked = undefined;
var blockClickedNum = undefined;
var furnace;
var load = false;
/**
 * This is the loading bar that shows when the player has logged in
 * @constructor
 */
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
/**
 * This is where all the assets the game uses are loaded
 * @constructor
 */
function preload() {
    game.load.onFileComplete.add(updateProgressBar, this);
    game.load.image('player', 'Assets/GameImages/Player/p1_front.png');
    game.load.image('playerHurt', 'Assets/GameImages/Player/p1_hurt.png');
    game.load.image('playerJump', 'Assets/GameImages/Player/p1_jump.png');
    game.load.image('grass', 'Assets/GameImages/Blocks/dirt_grass.png');
    game.load.image('dirt', 'Assets/GameImages/Blocks/dirt.png');
    game.load.image('coal_block', 'Assets/GameImages/Blocks/stone_coal_alt.png');
    game.load.image('stone', 'Assets/GameImages/Blocks/stone.png');
    game.load.image('iron_block', 'Assets/GameImages/Blocks/stone_browniron_alt.png');
    game.load.image('gold_block', 'Assets/GameImages/Blocks/stone_gold_alt.png');
    game.load.image('silver_block', 'Assets/GameImages/Blocks/stone_silver_alt.png');
    game.load.image('diamond_block', 'Assets/GameImages/Blocks/stone_diamond_alt.png');
    game.load.image('unbreakable', 'Assets/GameImages/Blocks/greystone.png');
    game.load.image('bgAbove', 'Assets/GameImages/Background/bg.png');
    game.load.image('bgBelow', 'Assets/GameImages/Background/bg_castle.png');
    game.load.image('inventoryBar', 'Assets/GameImages/HUD/inventoryBar.png');
    game.load.image('inventory', 'Assets/GameImages/HUD/inventoryScreen.png');
    game.load.image('furnaceInterface', 'Assets/GameImages/HUD/furnace.png');
    game.load.image('save', 'Assets/GameImages/HUD/save.png');
    game.load.image('trash', 'Assets/GameImages/HUD/trashcanOpen.png');
    game.load.image('inventoryBarHighlighter', 'Assets/GameImages/HUD/blue_panel.png');
    game.load.image('coal_ore', 'Assets/GameImages/Items/ore_coal.png');
    game.load.image('iron_ore', 'Assets/GameImages/Items/ore_ironAlt.png');
    game.load.image('gold_ore', 'Assets/GameImages/Items/ore_gold.png');
    game.load.image('diamond_ore', 'Assets/GameImages/Items/ore_diamond.png');
    game.load.image('silver_ore', 'Assets/GameImages/Items/ore_silver.png');
    game.load.image('tree', 'Assets/GameImages/Blocks/trunk_side.png');
    game.load.image('wood', 'Assets/GameImages/Blocks/trunk_side.png');
    game.load.image('Planks', 'Assets/GameImages/Blocks/wood.png');
    game.load.image('leaf', 'Assets/GameImages/Blocks/leaves_transparent.png');
    game.load.image('treeSeed', 'Assets/GameImages/Items/seed.png');
    game.load.image('Wood Pick', 'Assets/GameImages/Items/pick_bronze.png');
    game.load.image('Wood Axe', 'Assets/GameImages/Items/axe_bronze.png');
    game.load.image('Wood Sword', 'Assets/GameImages/Items/sword_bronze.png');
    game.load.image('Wood Shovel', 'Assets/GameImages/Items/shovel_bronze.png');
    game.load.image('Iron Pick', 'Assets/GameImages/Items/pick_iron.png');
    game.load.image('Iron Axe', 'Assets/GameImages/Items/axe_iron.png');
    game.load.image('Iron Sword', 'Assets/GameImages/Items/sword_iron.png');
    game.load.image('Iron Shovel', 'Assets/GameImages/Items/shovel_iron.png');
    game.load.image('Silver Pick', 'Assets/GameImages/Items/pick_silver.png');
    game.load.image('Silver Axe', 'Assets/GameImages/Items/axe_silver.png');
    game.load.image('Silver Sword', 'Assets/GameImages/Items/sword_silver.png');
    game.load.image('Silver Shovel', 'Assets/GameImages/Items/shovel_silver.png');
    game.load.image('Gold Pick', 'Assets/GameImages/Items/pick_gold.png');
    game.load.image('Gold Axe', 'Assets/GameImages/Items/axe_gold.png');
    game.load.image('Gold Sword', 'Assets/GameImages/Items/sword_gold.png');
    game.load.image('Gold Shovel', 'Assets/GameImages/Items/shovel_gold.png');
    game.load.image('Diamond Pick', 'Assets/GameImages/Items/pick_diamond.png');
    game.load.image('Diamond Axe', 'Assets/GameImages/Items/axe_diamond.png');
    game.load.image('Diamond Sword', 'Assets/GameImages/Items/sword_diamond.png');
    game.load.image('Diamond Shovel', 'Assets/GameImages/Items/shovel_diamond.png');
    game.load.image('Crafting Table', 'Assets/GameImages/Blocks/table.png');
    game.load.image('Furnace', 'Assets/GameImages/Blocks/oven.png');
}
/**
 * This is where the variable that the game needs to run are filled
 * @constructor
 */
function create() {
    var style = {
        font: "16px Arial",
        fill: "#000000",
        wordWrap: false,
        wordWrapWidth: 200,
        align: "center"
    };
    toolTip = game.add.text(0, 0, "", style);

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
    player.inventory = [];
    player.spawnX = 200;
    player.spawnY = 397;
    player.health = 100;
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
    new loadItems();
    inventoryBar = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'inventoryBar');
    inventoryBar.fixedToCamera = true;
    inventoryBar.inventory = [];
    for (var e = 0; e < 9; e++) {
        inventoryBar.inventory.push();
    }
    inventoryBar.crafting = [];
    for (var e = 0; e < 4; e++) {
        inventoryBar.crafting.push({
            Key: "",
            Amount: "",
            Number: ""
        });
    }

    furnace = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'furnaceInterface');
    furnace.alpha = 0;
    furnace.fixedToCamera = true;

    inventoryBarHighlighter = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'inventoryBarHighlighter');
    inventoryBarHighlighter.fixedToCamera = true;
    inventoryBarHighlighter.scale.setTo(0.83, 0.9);
    inventory = game.add.sprite(window.innerWidth / 4, window.innerHeight / 10, 'inventory');
    inventory.currentTab = 0;
    inventory.currentRow = 0;
    inventory.currentRowNumber = 0;
    inventory.items = [];
    inventory.items.crafting = new Array(9);

    inventory.items.crafting[0] = game.add.sprite(window.innerWidth / 4 + 40, window.innerHeight / 10 + 250, 'Planks');
    inventory.items.crafting[0].scale.setTo(0.8, 0.9);
    inventory.items.crafting[0].visible = false;
    inventory.items.crafting[0].fixedToCamera = true;
    inventory.items.crafting[1] = game.add.sprite(window.innerWidth / 4 + 105, window.innerHeight / 10 + 250, 'Planks');
    inventory.items.crafting[1].scale.setTo(0.8, 0.9);
    inventory.items.crafting[1].visible = false;
    inventory.items.crafting[1].fixedToCamera = true;
    inventory.items.crafting[2] = game.add.sprite(window.innerWidth / 4 + 168, window.innerHeight / 10 + 250, 'Planks');
    inventory.items.crafting[2].scale.setTo(0.8, 0.9);
    inventory.items.crafting[2].visible = false;
    inventory.items.crafting[2].fixedToCamera = true;
    inventory.items.crafting[3] = game.add.sprite(window.innerWidth / 4 + 40, window.innerHeight / 10 + 330, 'Planks');
    inventory.items.crafting[3].scale.setTo(0.8, 0.9);
    inventory.items.crafting[3].visible = false;
    inventory.items.crafting[3].fixedToCamera = true;
    inventory.items.crafting[4] = game.add.sprite(window.innerWidth / 4 + 105, window.innerHeight / 10 + 330, 'Planks');
    inventory.items.crafting[4].scale.setTo(0.8, 0.9);
    inventory.items.crafting[4].visible = false;
    inventory.items.crafting[4].fixedToCamera = true;
    inventory.items.crafting[5] = game.add.sprite(window.innerWidth / 4 + 168, window.innerHeight / 10 + 330, 'Planks');
    inventory.items.crafting[5].scale.setTo(0.8, 0.9);
    inventory.items.crafting[5].visible = false;
    inventory.items.crafting[5].fixedToCamera = true;
    inventory.items.crafting[6] = game.add.sprite(window.innerWidth / 4 + 40, window.innerHeight / 10 + 410, 'Planks');
    inventory.items.crafting[6].scale.setTo(0.8, 0.9);
    inventory.items.crafting[6].visible = false;
    inventory.items.crafting[6].fixedToCamera = true;
    inventory.items.crafting[7] = game.add.sprite(window.innerWidth / 4 + 105, window.innerHeight / 10 + 410, 'Planks');
    inventory.items.crafting[7].scale.setTo(0.8, 0.9);
    inventory.items.crafting[7].visible = false;
    inventory.items.crafting[7].fixedToCamera = true;
    inventory.items.crafting[8] = game.add.sprite(window.innerWidth / 4 + 168, window.innerHeight / 10 + 410, 'Planks');
    inventory.items.crafting[8].scale.setTo(0.8, 0.9);
    inventory.items.crafting[8].visible = false;
    inventory.items.crafting[8].fixedToCamera = true;

    inventoryTabButton = [];
    inventoryTabButton.push({
        sprite: game.add.sprite(window.innerWidth / 4 + 120, window.innerHeight / 10 + 10, 'Planks'),
        tabSprite: game.add.sprite(window.innerWidth / 4 + 55, window.innerHeight / 10 + 10, 'Planks')

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
        sprite: game.add.sprite(window.innerWidth / 4 + 310, window.innerHeight / 10 + 10, 'Diamond Pick'),
        tabSprite: game.add.sprite(window.innerWidth / 4 + 240, window.innerHeight / 10 + 10, 'Planks')

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
    new InventoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'Planks', 0, 0, 0, 0, 0, "wood", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 4);

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Crafting Table', 0, 1, 0, 1, 2, "Planks", "Planks", undefined, "Planks", "Planks");

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Furnace', 0, 1, 1, 1, 2, "stone", "stone", "stone", "stone", undefined, "stone", "stone", "stone", "stone");

    new InventoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'Wood Pick', 1, 0, 0, 4, 3, "Planks", "Planks", "Planks", undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'Iron Pick', 1, 0, 1, 4, 3, "iron_ore", "iron_ore", "iron_ore", undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'Gold Pick', 1, 0, 2, 4, 3, "gold_ore", "gold_ore", "gold_ore", undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'Silver Pick', 1, 0, 3, 4, 3, "silver_ore", "silver_ore", "silver_ore", undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 58, window.innerHeight / 10 + 95, 'Diamond Pick', 1, 0, 4, 4, 3, "diamond_ore", "diamond_ore", "diamond_ore", undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Wood Shovel', 1, 1, 0, 4, 3, undefined, "Planks", undefined, undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Iron Shovel', 1, 1, 1, 4, 3, undefined, "iron_ore", undefined, undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Gold Shovel', 1, 1, 2, 4, 3, undefined, "gold_ore", undefined, undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Silver Shovel', 1, 1, 3, 4, 3, undefined, "silver_ore", undefined, undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 140, window.innerHeight / 10 + 95, 'Diamond Shovel', 1, 1, 4, 4, 3, undefined, "diamond_ore", undefined, undefined, "wood", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'Wood Axe', 1, 2, 0, 4, 3, undefined, "Planks", "Planks", undefined, "wood", "Planks", undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'Iron Axe', 1, 2, 1, 4, 3, undefined, "iron_ore", "iron_ore", undefined, "wood", "iron_ore", undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'Gold Axe', 1, 2, 2, 4, 3, undefined, "gold_ore", "gold_ore", undefined, "wood", "gold_ore", undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'Silver Axe', 1, 2, 3, 4, 3, undefined, "silver_ore", "silver_ore", undefined, "wood", "silver_ore", undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 220, window.innerHeight / 10 + 95, 'Diamond Axe', 1, 2, 4, 4, 3, undefined, "diamond_ore", "diamond_ore", undefined, "wood", "diamond_ore", undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'Wood Sword', 1, 3, 0, 4, 3, undefined, "Planks", undefined, undefined, "Planks", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'Iron Sword', 1, 3, 1, 4, 3, undefined, "iron_ore", undefined, undefined, "iron_ore", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'Gold Sword', 1, 3, 2, 4, 3, undefined, "gold_ore", undefined, undefined, "gold_ore", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'Silver Sword', 1, 3, 3, 4, 3, undefined, "silver_ore", undefined, undefined, "silver_ore", undefined, undefined, "wood", undefined);

    new InventoryItems(window.innerWidth / 4 + 300, window.innerHeight / 10 + 95, 'Diamond Sword', 1, 3, 4, 4, 3, undefined, "diamond_ore", undefined, undefined, "diamond_ore", undefined, undefined, "wood", undefined);


    for (var i = 0; i < inventory.items.length; i++) {
        inventory.items[i].sprite.fixedToCamera = true;
        inventory.items[i].sprite.visible = false;
        game.world.bringToTop(inventory.items[i].sprite);
    }


    inventory.visible = false;
    inventory.fixedToCamera = true;

    if(load == true){
        load = false;
        $.ajax({
            type: 'GET',
            url: "/retrievePlayer?username=" + username,
            async: true,
            dataType: 'jsonp',
            contentType: 'application/javascript',
            success: function (response) {
                console.dir(response);
                player.health = response.Data[0].Health;
                player.spawnX = response.Data[0].SpawnX;
                player.spawnY = response.Data[0].SpawnY;
                //player.x = parseInt(response.Data[0].X);
                //player.y = parseInt(response.Data[0].Y);

                for(var e = 1; e < response.Data.length; e++){
                    var amount = response.Data[e].Amount.split(",");
                    var ItemHealth = response.Data[e].ItemHealth.split(",");
                    var Name = response.Data[e].Name.split(",");
                    var Placeable = response.Data[e].Placeable.split(",");
                    var Strength = response.Data[e].Strength.split(",");

                    for(var i = 0; i < amount.length; i++){
                        if(amount[i] == ""){
                            amount.splice(i, 1);
                            ItemHealth.splice(i, 1);
                            Name.splice(i, 1);
                            Placeable.splice(i, 1);
                            Strength.splice(i, 1);
                            i = -1;
                        }
                        if(i != -1){
                            player.inventory[i].Amount = amount[i];
                            player.inventory[i].Health = ItemHealth[i];
                            player.inventory[i].Name = Name[i];
                            if(Placeable[i] == "true") {
                                player.inventory[i].Placeable = true;
                            }
                            else{
                                player.inventory[i].Placeable = false;
                            }
                            player.inventory[i].Strength = Strength[i];
                            HUD();
                        }

                    }
                }
            }
        });
    }
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
function InventoryItems(X, Y, name, Tab, Row, RowNum, MaxRow, craftingSlot, slotOne, slotTwo, slotThree, slotFour, slotFive, slotSix, slotSeven, slotEight, slotNine, amountToCraft) {
    inventory.items.push({
        sprite: game.add.sprite(X, Y, name),
        Tab: Tab,
        Row: Row,
        RowNumber: RowNum,
        maxRowNumber: MaxRow,
        craftingSlots: craftingSlot,
        Requirements: new Array(9),
        amountToCraft: amountToCraft
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
    inventory.items[inventory.items.length - 1].sprite.inputEnabled = true;
    inventory.items[inventory.items.length - 1].sprite.events.onInputDown.add(crafting, this);
}

/**
 * This function simply changes the tab that is shown for crafting
 * @param {sprite} data - This hold the data for tab that has been clicked on
 * @constructor
 */
function changeTab(data) {
    inventory.currentTab = data.tabNum;
    updateInventory = true;
    new ePressed();
}

/**
 * This hold the data for the items/blocks found in the game
 * @param {string} name - This is the name of the block
 * @param {int} minelevel - This is the required mine level to break the block
 * @param {int} Health - This is how strong the blocks is
 * @param {int} amount - This is how many will be dropped when broken
 * @param {boolean} placeable - This determines whether the block is placeable
 * @param {int} strength - This is how strong the block is when held by the player
 * @param {int} growtime - This determines how long the block needs to grow
 * @param {int} burnTime - This determines how long the block needs to burn
 * @param {boolean} fuel - This determines whether the block is fuel for the furnace
 * @constructor
 */
function ItemsData(name, minelevel, Health, amount, placeable, strength, growtime, burnTime, fuel) {
    this.Name = name;
    //this.MineLevel = minelevel;
    this.MineLevel = 1; //Testing Line
    //this.Health = Health;
    this.Health = 1; //Testing Line
    this.Amount = amount;
    this.Placeable = placeable;
    this.Strength = strength;
    this.growTime = growtime;
    this.burnTime = parseInt(burnTime);
    this.fuel = fuel;
}

/**
 * This is where all the items/blocks in the game are created
 * @constructor
 */
function loadItems() {
    //This create all the item objects and fills them with data:
    //Name, Level it can be mined at, how many hits it takes, amount if drops and if it's placeable or not, how much damage it can do
    items.push(new ItemsData("dirt", 1, 3, 1, true, 1, null, null, false));
    items.push(new ItemsData("grass", 1, 3, 1, true, 1, null, null, false));
    items.push(new ItemsData("unbreakable", 9999, 1, 1, true, 1, null, null, false));
    items.push(new ItemsData("coal_block", 1, 3, 1, false, 1, null, null, false));
    items.push(new ItemsData("iron_block", 2, 3, 1, true, 1, null, 30, true));
    items.push(new ItemsData("silver_block", 3, 3, 1, true, 1, null, 30, true));
    items.push(new ItemsData("gold_block", 4, 3, 1, true, 1, null, 30, true));
    items.push(new ItemsData("diamond_block", 5, 3, 1, true, 1, null, 30, true));
    items.push(new ItemsData("stone", 2, 3, 1, true, 1, null, null, false));
    items.push(new ItemsData("coal_ore", 1, 3, 1, false, 1, null, 30, true));
    items.push(new ItemsData("iron_ore", 1, 3, 1, false, 1, null, 30, true));
    items.push(new ItemsData("silver_ore", 1, 3, 1, false, 1, null, 30, true));
    items.push(new ItemsData("gold_ore", 1, 3, 1, false, 1, null, 30, true));
    items.push(new ItemsData("diamond_ore", 1, 3, 1, false, 1, null, 30, true));
    items.push(new ItemsData("tree", 1, 3, 1, true, 1, null, null, false));
    items.push(new ItemsData("wood", 1, 3, 1, true, 1, null, 30, true));
    items.push(new ItemsData("Planks", 1, 3, 1, true, 1, null, 30, true));
    items.push(new ItemsData("leaf", 1, 3, 1, false, 1, null, null, false));
    items.push(new ItemsData("treeSeed", 1, 3, 1, true, 1, 15, null, false));
    items.push(new ItemsData("Wood Pick", 1, 3, 1, false, 2, null, null, false));
    items.push(new ItemsData("Wood Axe", 1, 3, 1, false, 2, null, null, false));
    items.push(new ItemsData("Wood Sword", 1, 3, 1, false, 2, null, null, false));
    items.push(new ItemsData("Wood Shovel", 1, 3, 1, false, 2, null, null, false));
    items.push(new ItemsData("Iron Pick", 1, 3, 1, false, 3, null, null, false));
    items.push(new ItemsData("Iron Axe", 1, 3, 1, false, 3, null, null, false));
    items.push(new ItemsData("Iron Sword", 1, 3, 1, false, 3, null, null, false));
    items.push(new ItemsData("Iron Shovel", 1, 3, 1, false, 3, null, null, false));
    items.push(new ItemsData("Silver Pick", 1, 3, 1, false, 4, null, null, false));
    items.push(new ItemsData("Silver Axe", 1, 3, 1, false, 4, null, null, false));
    items.push(new ItemsData("Silver Sword", 1, 3, 1, false, 4, null, null, false));
    items.push(new ItemsData("Silver Shovel", 1, 3, 1, false, 4, null, null, false));
    items.push(new ItemsData("Gold Pick", 1, 3, 1, false, 5, null, null, false));
    items.push(new ItemsData("Gold Axe", 1, 3, 1, false, 5, null, null, false));
    items.push(new ItemsData("Gold Sword", 1, 3, 1, false, 5, null, null, false));
    items.push(new ItemsData("Gold Shovel", 1, 3, 1, false, 5, null, null, false));
    items.push(new ItemsData("Diamond Pick", 1, 3, 1, false, 6, null, null, false));
    items.push(new ItemsData("Diamond Axe", 1, 3, 1, false, 6, null, null, false));
    items.push(new ItemsData("Diamond Sword", 1, 3, 1, false, 6, null, null, false));
    items.push(new ItemsData("Diamond Shovel", 1, 3, 1, false, 6, null, null, false));
    items.push(new ItemsData("Crafting Table", 1, 3, 1, true, 6, null, null, false));
    items.push(new ItemsData("Furnace", 1, 3, 1, true, 6, null, null, false));
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
        if(game.input.mouse.button == 2){
            for(var e = 0; e < blocksA.length; e++){
                if(blockStartX == blocksA[e].x && blockStartY == blocksA[e].y && blocksA[e].alive == true){
                    blockClicked = blocksA[e].key;
                    blockClickedNum = e;
                    if(blockClicked == "Furnace"){
                        if(furnace.alpha == 100){
                            furnace.alpha = 0;
                        }
                        else {
                            furnace.alpha = 100;
                            inventory.visible = false;
                            inventoryBar.visible = false;
                            var loopCount = 0;
                            for (var e = 0; e < inventoryBar.inventory.length; e++) {
                                if (inventoryBar.inventory[e] != undefined) {
                                    inventoryBar.inventory[e].kill();
                                    inventoryBar.inventory.splice(e, 1);
                                    e = -1;
                                }
                                if (inventoryBarText[loopCount] != null) {
                                    inventoryBarText[loopCount].text = "";
                                    inventoryBarText[loopCount] = "Null";
                                }
                                loopCount++;
                            }
                            openFurnace();
                            break;
                        }
                    }
                    else if(blockClicked == "Crafting Table"){
                       ePressed();
                    }
                }
            }
        }
        if ((mouseX < player.body.x + player.Reach && mouseX > player.body.x - player.Reach) && (mouseY < player.body.y + player.Reach && mouseY > player.body.y - player.Reach)) { //This checks that it is within a set distance from the player
            for (var e = 0; e < blocksA.length; e++) { //Loops through all blocks and checks position
                if (game.input.mouse.button == 0 && blockStartX == blocksA[e].x && blockStartY == blocksA[e].y && blocksA[e].alive == true) { //Checks if positions are the same
                    if (blocksA[e].health >= 1 && blocksA[e].MineLevel <= player.MineLevel) { //Checks the Health of the block
                        blocksA[e].health--; //Damages the block
                        break;
                    } else if (blocksA[e].health <= 0 && blocksA[e].MineLevel <= player.MineLevel) {
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
                        } else if(blocksA[e].key == "tree"){
                            blocksA[e].key = "wood";
                            blockDropped = "block";
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
                        new HUD(); //Updates the HUD
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
            if (game.input.mouse.button == 2 && finishedLoop == true && player.handItem != -1 && player.inventory[player.handItem].Amount > 0) {
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
                            var blockInPlace = false;
                            for(var k = 0; k < blocksA.length; k++){
                                if(blockStartX == blocksA[k].x && blockStartY == blocksA[k].y){
                                    blockInPlace = true;
                                }
                            }
                            if (player.inventory[player.handItem].Name == "treeSeed" && blockInPlace == false) {
                                blocksA.unshift(trees.create(blockStartX, blockStartY, player.inventory[player.handItem].Name)); //Creates a new block
                            } else if(blockInPlace == false) {
                                blocksA.unshift(blocks.create(blockStartX, blockStartY, player.inventory[player.handItem].Name)); //Creates a new block
                            }

                            for (var q = 0; q < items.length; q++) {
                                if (items[q].Name == blocksA[0].key && blockInPlace == false) {
                                    player.inventory[player.handItem].Amount--;
                                    blocksA[0].body.immovable = true; //Makes the block immovable
                                    blocksA[0].MineLevel = items[q].MineLevel; //This is the level of equipment needed to mine
                                    blocksA[0].Health = items[q].Health; //This is how many times the block needs to be hit
                                    blocksA[0].growTime = items[q].growTime; //This is how long it takes to grow - if it does
                                    blocksA[0].fuel = items[q].fuel; //This is how long it takes to grow - if it does
                                    blocksA[0].burnTime = items[q].burnTime; //This is how long it takes to grow - if it does
                                    blocksA[0].blockX = blocksA[0].body.x / 70; //This is the X position
                                    blocksA[0].blockY = blocksA[0].body.y / 70; //This is the Y position
                                }
                            }
                        }
                    }
                }
            }
            new HUD();
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
/***
 *
 * @param {sprite} block - This is the block the player is dragging
 * @constructor
 */
function startDrag(block) {
    startX = block.x;
    startY = block.y;
}
/***
 *
 * @param {sprite} block - This is the block the player is dragging
 * @constructor
 */
function stopDrag(block) {
    var loopCount = 0;
    if(furnace.alpha == 0) {
        for (var e = 0; e < inventoryBar.inventory.length; e++) {
            if (block.x > inventoryBar.inventory[e].x && block.x < inventoryBar.inventory[e].x + inventoryBar.inventory[e].width &&
                block.y > inventoryBar.inventory[e].y && block.y < inventoryBar.inventory[e].y + inventoryBar.inventory[e].height) {
                console.log("This collides with: " + inventoryBar.inventory[e].key);
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
                new HUD();
                break;

            } else if (e == inventoryBar.inventory.length - 1) {
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
                if (furnace.alpha == 100) {
                    new openFurnace();
                }
                else {
                    new HUD();
                }
            }
        }
    }
    else{
        console.log(block.x + ", " + block.y);
        for(var e = 0; e < items.length; e++){
            if(block.key == items[e].Name){
                block.burnTime = items[e].burnTime;
                block.fuel = items[e].fuel;
            }
        }
        if(block.x >= furnace.x + furnace.width / 6 && block.x <= furnace.x + furnace.width / 4 && block.y >= furnace.y + furnace.height / 7 && block.y <= furnace.y + furnace.height / 3.2 && block.fuel == true){
            console.log("Block inside fuel")
            blocksA[blockClickedNum].fuel = block.key;
            blocksA[blockClickedNum].burnTime = parseInt(block.burnTime * player.inventory[block.number].Amount);
            player.inventory[block.number].Amount = 0;
            player.inventory[block.number].Health = undefined;
            player.inventory[block.number].MineLevel = undefined;
            player.inventory[block.number].Name = "Null";
            player.inventory[block.number].Placeable = undefined;
            player.inventory[block.number].Strength = undefined;
        }
        else if(block.x >= furnace.x + furnace.width / 6 && block.x <= furnace.x + furnace.width / 4 && block.y >= furnace.y + furnace.height / 2.1 && block.y <= furnace.y + furnace.height / 1.56 && block.fuel == true){
            blocksA[blockClickedNum].ingredientAmount = parseInt(player.inventory[block.number].Amount);
            player.inventory[block.number].Amount = 0;
            player.inventory[block.number].Health = undefined;
            player.inventory[block.number].MineLevel = undefined;
            player.inventory[block.number].Name = "Null";
            player.inventory[block.number].Placeable = undefined;
            player.inventory[block.number].Strength = undefined;
            blocksA[blockClickedNum].ingredient = block.key;
            blocksA[blockClickedNum].cookTime = parseInt(block.burnTime * blocksA[blockClickedNum].ingredientAmount);
        }
        else{
            for (var e = 0; e < inventoryBar.inventory.length; e++) {
                inventoryBar.inventory[e].kill();
                inventoryBar.inventory.splice(e, 1);
                inventoryBarText[loopCount].text = "";
                inventoryBarText[loopCount] = "Null";
                loopCount++;
                e = -1;
            }

            if (furnace.alpha == 100) {
                new openFurnace();
            }
        }
    }
}

/**
 * This is where the crafting is handled
 * @param {sprite} first - This is the block the player has clicked on
 * @constructor
 */
function crafting(first) {
    var itemClickedRequirements = [];
    var craftingIngredients = [];
    var amountToCraft;
    for(var w = 0; w < inventory.items.length; w++){
        if(first.key == inventory.items[w].sprite.key){
            itemClickedRequirements = inventory.items[w].Requirements.slice(0, 9);
            amountToCraft = inventory.items[w].amountToCraft;
            if(itemClickedRequirements.length < 9){
                for(var p = itemClickedRequirements.length; p < 9; p++){
                    itemClickedRequirements.push(undefined)
                }
            }
            break;
        }
    }
    if(itemClickedRequirements != undefined){
        for(var r = 0; r < itemClickedRequirements.length; r++){
            for(var t = 0; t < player.inventory.length; t++) {
                if (player.inventory[t].Name == itemClickedRequirements[r]) {
                    itemClickedRequirements[r] = undefined;
                    craftingIngredients.push(t);
                }
                if(r == itemClickedRequirements.length - 1){
                    if(itemClickedRequirements[0] == undefined && itemClickedRequirements[1] == undefined
                        && itemClickedRequirements[2] == undefined && itemClickedRequirements[3] == undefined
                        && itemClickedRequirements[4] == undefined && itemClickedRequirements[5] == undefined
                        && itemClickedRequirements[6] == undefined && itemClickedRequirements[7] == undefined
                        && itemClickedRequirements[8] == undefined){
                        if(craftingIngredients.length < 9){
                            do{
                                craftingIngredients.push(undefined);
                            }while(craftingIngredients.length < 9)

                        }
                        if((craftingIngredients[0] == undefined || player.inventory[craftingIngredients[0]].Amount > 0)
                            && (craftingIngredients[1] == undefined || player.inventory[craftingIngredients[1]].Amount > 0)
                            && (craftingIngredients[2] == undefined || player.inventory[craftingIngredients[2]].Amount > 0)
                            && (craftingIngredients[3] == undefined || player.inventory[craftingIngredients[3]].Amount > 0)
                            && (craftingIngredients[4] == undefined || player.inventory[craftingIngredients[4]].Amount > 0)
                            && (craftingIngredients[5] == undefined || player.inventory[craftingIngredients[5]].Amount > 0)
                            && (craftingIngredients[6] == undefined || player.inventory[craftingIngredients[6]].Amount > 0)
                            && (craftingIngredients[7] == undefined || player.inventory[craftingIngredients[7]].Amount > 0)
                            && (craftingIngredients[8] == undefined || player.inventory[craftingIngredients[8]].Amount > 0)){
                            for(var y = 0; y < craftingIngredients.length; y++){
                                if(craftingIngredients[y] != undefined){
                                    player.inventory[craftingIngredients[y]].Amount--;
                                    inventoryBarText[craftingIngredients[y]].text = player.inventory[craftingIngredients[y]].Amount;
                                    if(player.inventory[craftingIngredients[y]].Amount <= 0){
                                        inventoryBar.inventory[craftingIngredients[y]].kill();
                                        player.inventory[craftingIngredients[y]] =({
                                            Name: "Null",
                                            MineLevel: 0,
                                            Health: 0,
                                            Amount: 0
                                        });
                                    }
                                }
                                if(y == craftingIngredients.length - 1){
                                            blocksAPickedUp[blocksAPickedUp.length] = blocksPickedUp.create(player.body.x, player.body.y, first.key);
                                            blocksAPickedUp[blocksAPickedUp.length - 1].amountToCraft = amountToCraft;
                                            blocksAPickedUp[blocksAPickedUp.length - 1].scale.setTo(.2, .2);
                                }
                            }
                            console.log("Can craft");
                        }
                        break;
                    }
                }
            }
        }
    }
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
            if(second.amountToCraft != undefined) {
                player.inventory[o].Amount += second.amountToCraft; //Add one to item if in inventory
            }
            else{
                player.inventory[o].Amount++;
            }
            second.kill(); //This kills the dropped block
            break; //Breaks the loop
        } else if (o == player.inventory.length - 1) { //If item is not there
            for (var e = 0; e < player.inventory.length; e++) { //Loops through inventory
                if (player.inventory[e].Name == "Null") { //Finds empty inventory slot
                    player.inventory[e].Name = items[item].Name; //Makes the inventory slot equal to the item found
                    player.inventory[e].MineLevel = items[item].MineLevel; //Makes the inventory slot equal to the item found
                    player.inventory[e].Strength = items[item].Strength; //Makes the inventory slot equal to the item found
                    player.inventory[e].Placeable = items[item].Placeable;
                    player.inventory[e].burnTime = items[item].burnTime;
                    player.inventory[e].fuel = items[item].fuel;
                    if (player.inventory[e].Amount == 0) {
                        if(second.amountToCraft != undefined) {
                            player.inventory[e].Amount += second.amountToCraft; //Add one to item if in inventory
                        }
                        else{
                            player.inventory[e].Amount++;
                        }
                    }
                    second.kill(); //This kills the dropped block
                    new HUD(); //Updates the HUD
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

    if(save != undefined && save.alive != false && save.input.pointerOver()){
            toolTip.x = save.x;
            toolTip.y = save.y + 50;
            toolTip.text = "Save current level";
            game.world.bringToTop(toolTip);
    }
    else if(trash != undefined && trash.alive != false && trash.input.pointerOver()){
            toolTip.x = trash.x;
            toolTip.y = trash.y + 50;
            toolTip.text = "Delete current save";
            game.world.bringToTop(toolTip);
    }
    else{
        toolTip.x = -200;
        toolTip.y = -200;
        toolTip.text = "";
    }
    for(var l = 0; l < inventory.items.length; l ++) {
        if(inventory.items[l].sprite.input.pointerOver()){
            toolTip.x = inventory.items[l].sprite.x;
            toolTip.y = inventory.items[l].sprite.y + 65;
            toolTip.text = inventory.items[l].sprite.key;
            game.world.bringToTop(toolTip);
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
    // Start of Updates player MineLevel
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
        if(blocksA[e].key == "Furnace"){
            if(blocksA[e].fuel != undefined && blocksA[e].ingredient != undefined){
                if(blocksA[e].burnTime > 0 && blocksA[e].cookTime != undefined){
                    blocksA[e].burnTime--;
                    blocksA[e].cookTime--;
                }
                if(blocksA[e].cookTime <= 0){
                    var itemToPlace;
                    if(blocksA[e].ingredient == "iron_block"){
                        itemToPlace = "iron_ore";
                    }
                    if(blocksA[e].ingredient == "silver_block"){
                        itemToPlace = "silver_ore";
                    }
                    if(blocksA[e].ingredient == "gold_block"){
                        itemToPlace = "gold_ore";
                    }
                    if(blocksA[e].ingredient == "diamond_block"){
                        itemToPlace = "diamond_ore";
                    }
                    blocksA[e].ingredient = undefined;
                    for(var f = 0; f <= blocksA[e].ingredientAmount; f++) {
                        blocksAPickedUp[blocksAPickedUp.length] = blocksPickedUp.create(blocksA[e].body.x, blocksA[e].body.y - 50, itemToPlace);
                        blocksAPickedUp[blocksAPickedUp.length - 1].scale.setTo(.4, .4);
                    }
                    console.log("item has cooked");
                }
            }
        }
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
    if (blocksA.length == 0 || furthestBlock < player.body.x + 1000) { //Checks if last block is less than 1000 away
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

        for (var e = lastX + 70; e < lastX + 2000; e += 70) { //Changes the X value for the loop
            var treeChance = Math.floor(Math.random() * (10 - 1) + 1);
            var tree = false;
            var treeHeight = Math.floor(Math.random() * (6 - 3) + 3);
            if (treeChance == 1 && e > (lastTree + 420)) {
                if (blockKeyData.length == 0) {
                    tree = true;
                    lastTree = e;
                    console.log(lastTree);
                }
            }
            for (var i = 490; i <= 4000; i += 70) { //Changes the Y value for the loop
                if (i == 490 && blockKeyData.length == 0) { //Checks if it's the top layer
                    //Checks if the array is empty
                    blocksA[blocksA.length] = blocks.create(e, i, 'grass'); //Creates a new block
                    blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                    blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                    blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].Name == blocksA[blocksA.length - 1].key) {
                            blocksA[blocksA.length - 1].MineLevel  = items[j].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[j].Health;
                        }
                    }
                } else if (i >= 3500) { //This is the bottom layer
                    blocksA[blocksA.length] = blocks.create(e, i, 'unbreakable'); //Creates a new block
                    blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                    blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                    blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                    if(blockKeyData.length > 0){
                        if(blockKeyData[0].Name == "unbreakable"){
                            blockKeyData.splice(0, 1);
                        }
                    }
                } else {
                    if(blockKeyData.length > 0){
                        var finalE;
                        for(var p = 0; p < blockKeyData.length; p++){
                            if(blockKeyData[p].Name != "tree" && blockKeyData[p].Name == "leaf"){
                                finalE = blockKeyData[p].X;
                            }
                            if(blockKeyData[p].Name == "unbreakable"){
                                blockKeyData.splice(0, 1);
                            }
                            groundGen(e,i);
                            p = 0;
                        }
                        e = finalE;

                    } else {
                        groundGen(e, i);
                    }
                }
                if (tree == true && blockKeyData.length == 0) {
                    for (var q = 0; q < treeHeight; q++) {
                        blocksA[blocksA.length] = trees.create(e, 420 - (q * 70), 'tree'); //Creates a new block
                        blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                        blocksA[blocksA.length - 1].blockX = e / 70;
                        blocksA[blocksA.length - 1].blockY = 420 - (q * 70);
                        tree = false;
                        blocksA[blocksA.length - 1].MineLevel  = items[10].MineLevel;
                        blocksA[blocksA.length - 1].Health = items[10].Health;

                        if (q == treeHeight - 1) {
                            //bottom layer
                            blocksA[blocksA.length] = trees.create(e - 70, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e - 70 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 140, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e - 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 210, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e - 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 70, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 70 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 140, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 210, 420 - (q * 70), 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            //second layer
                            blocksA[blocksA.length] = trees.create(e - 70, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 140, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 70, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e + 140, 420 - (q * 70) - 70, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;

                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;

                            blocksA[blocksA.length] = trees.create(e, 420 - (q * 70) - 70, 'tree'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[10].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[10].Health;
                            //Third layer
                            blocksA[blocksA.length] = trees.create(e + 70, 420 - (q * 70) - 140, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e - 70, 420 - (q * 70) - 140, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                            blocksA[blocksA.length] = trees.create(e, 420 - (q * 70) - 140, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 210 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;

                            //fourth layer
                            blocksA[blocksA.length] = trees.create(e, 420 - (q * 70) - 210, 'leaf'); //Creates a new block
                            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                            blocksA[blocksA.length - 1].blockX = e + 140 / 70;
                            blocksA[blocksA.length - 1].blockY = 420 - (q * 70) / 70;
                            tree = false;
                            blocksA[blocksA.length - 1].MineLevel  = items[11].MineLevel;
                            blocksA[blocksA.length - 1].Health = items[11].Health;
                        }
                    }
                }

            }
        }
    }
    //End of ground generation
    //Start of performance improvement
    var starting = null,
        ending = null;
    for (var e = 0; e < blocksA.length; e++) {
        if (blocksA[e].body.x < (player.body.x - 1400)) {
            chunks.unshift(blocksA[e]);
            blocksA[e].kill();
            blocksA.splice(e, 1);
            e=0;
        }
    }
    starting = null, ending = null;
    if (player.body.velocity.x < 0) {
        for (var e = 0; e < chunks.length; e++) {
            if (chunks[e].body.x > (player.body.x - 1400)) {
                if(chunks[e].key == "tree" || chunks[e].key == "leaf"){
                    blocksA.unshift(trees.create(chunks[e].body.x, chunks[e].body.y, chunks[e].key));
                } else {
                    blocksA.unshift(blocks.create(chunks[e].body.x, chunks[e].body.y, chunks[e].key));
                }
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
    var keys = [];
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
            new HUD();
        }
    }
    //End of HUD update
}

/***
 * This is where the ground that the player can move on/mine is handled
 * @param {int} e - This is the X co-ordinate of the block
 * @param {int} i - This is the Y co-ordinate of the block
 * @constructor
 */
function groundGen(e, i) {
    if (blockKeyData.length == 0) {
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
        for (var j = 0; j < items.length; j++) {
            if (items[j].Name == blocksA[blocksA.length - 1].key) {
                blocksA[blocksA.length - 1].MineLevel  = items[j].MineLevel;
                blocksA[blocksA.length - 1].Health = items[j].Health;
            }
        }
    } else if (blockKeyData.length > 0) {
        if(blockKeyData[0].X == 284){
            console.log("");
        }
        if (blockKeyData[0].Name != "leaf") {
            if (blockKeyData[0].Name != "tree") {
                e = parseInt(blockKeyData[0].X);
                i = parseInt(blockKeyData[0].Y);
                blocksA[blocksA.length] = blocks.create(e, i, blockKeyData[0].Name); //Creates a new block
                blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                blockKeyData.splice(0, 1);

                for (var j = 0; j < items.length; j++) {
                    if (items[j].Name == blocksA[blocksA.length - 1].key) {
                        blocksA[blocksA.length - 1].MineLevel  = items[j].MineLevel;
                        blocksA[blocksA.length - 1].Health = items[j].Health;
                    }
                }
            }
            else{
                e = parseInt(blockKeyData[0].X);
                i = parseInt(blockKeyData[0].Y);
                blocksA[blocksA.length] = trees.create(e, i, blockKeyData[0].Name); //Creates a new block
                blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
                blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
                blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
                blockKeyData.splice(0, 1);

                for (var j = 0; j < items.length; j++) {
                    if (items[j].Name == blocksA[blocksA.length - 1].key) {
                        blocksA[blocksA.length - 1].MineLevel  = items[j].MineLevel;
                        blocksA[blocksA.length - 1].Health = items[j].Health;
                    }
                }
            }
        } else {
            e = parseInt(blockKeyData[0].X);
            i = parseInt(blockKeyData[0].Y);
            blocksA[blocksA.length] = trees.create(e, i, blockKeyData[0].Name); //Creates a new block
            blocksA[blocksA.length - 1].body.immovable = true; //Makes the block immovable
            blocksA[blocksA.length - 1].blockX = blocksA[blocksA.length - 1].body.x / 70;
            blocksA[blocksA.length - 1].blockY = blocksA[blocksA.length - 1].body.y / 70;
            blockKeyData.splice(0, 1);
            for (var j = 0; j < items.length; j++) {
                if (items[j].Name == blocksA[blocksA.length - 1].key) {
                    blocksA[blocksA.length - 1].MineLevel  = items[j].MineLevel;
                    blocksA[blocksA.length - 1].Health = items[j].Health;
                }
            }
        }
    }
}

/**
 * This is where the inventory screen controls are dealt with
 * @constructor
 */
function controlInventoryScreen() {
    if(inventoryControls == null){
        return;
    }
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
        new HUD();
    }
    if ((inventoryControls[2].isDown || inventoryControls[3].isDown) && player.handItem < 9) {
        player.handItem++;
        inventory.currentRow = player.handItem;
        inventory.currentRowNumber = 0;
        new HUD();
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
 * This is where the furnace interface is drawn
 * @constructor
 */
function openFurnace() {
    save = game.add.sprite(0, 0, 'save');
    save.inputEnabled = true;
    save.events.onInputDown.add(upload, this);
    save.fixedToCamera = true;

    trash = game.add.sprite(0 + save.width, 0, 'trash');
    trash.inputEnabled = true;
    trash.events.onInputDown.add(clearLevel, this);
    trash.fixedToCamera = true;
    reDrawBar = true;
    inventoryBarHighlighter.visible = false;
    console.log("Furnace");
    var X = 0;
    var Y = 10;
    for(var e = 0; e < 30; e++) {
        var itemName = {Name: "Null"};
        if (furnace.visible == true) {
            if (player.inventory[e].Name != "Null") {
                itemName = player.inventory[e];
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
            }
            if(itemName.Name == "Null"){
                reDrawBar = false;
            }
            if (itemName.Name != "Null" && itemName.Amount > 0 && (inventoryBarText[e] == "Null" || inventoryBarText[e] == undefined) || reDrawBar == true) {
                inventoryBar.inventory[e] = game.add.sprite(inventoryBar.x + X - game.camera.x, inventoryBar.y - game.camera.y + Y, itemName.Name);
                inventoryBar.inventory[e].inputEnabled = true;
                inventoryBar.inventory[e].input.enableDrag();
                inventoryBar.inventory[e].enableBody = true;
                inventoryBar.inventory[e].events.onDragStart.add(startDrag, this);
                inventoryBar.inventory[e].events.onDragStop.add(stopDrag, this);
                if (furnace.visible == true) {
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
        }
        game.world.bringToTop(inventoryBarText);
    }
    reDrawBar = false;
}

/**
 * This is run when e is pressed and it either makes the crafting screen visible or invisible
 * @constructor
 */
function ePressed() {

    if(furnace.alpha == 100){
        furnace.alpha = 0;
        save.kill();
        trash.kill();
        inventory.visible = true;
    }
    var loopCount = 0;
    if (inventoryBar.visible == false && updateInventory == false) { //Inventory bar not visible
        blockClicked="";
        save.kill();
        trash.kill();
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
            if (inventoryBar.inventory[e] != undefined) {
                inventoryBar.inventory[e].kill();
                inventoryBar.inventory.splice(e, 1);
                e = -1;
            }
            if (inventoryBarText[loopCount] != null) {
                inventoryBarText[loopCount].text = "";
                inventoryBarText[loopCount] = "Null";
            }
            loopCount++;
        }
        new HUD();
    } else { //Inventory bar visible
        save = game.add.sprite(0, 0, 'save');
        save.inputEnabled = true;
        save.events.onInputDown.add(upload, this);
        save.fixedToCamera = true;

        trash = game.add.sprite(0 + save.width, 0, 'trash');
        trash.inputEnabled = true;
        trash.events.onInputDown.add(clearLevel, this);
        trash.fixedToCamera = true;
        for (var e = 0; e < inventoryTabButton.length; e++) {
            inventoryTabButton[e].sprite.visible = true;
            inventoryTabButton[e].tabSprite.visible = true;
        }
        inventory.currentRowNumber = 0;
        updateInventory = false;
        inventoryBar.visible = false;
        inventoryControls = [];
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
        if(blockClicked == "Crafting Table"){
            inventoryType = 3;
        }
        else {
            inventoryType = 2;
            inventory.currentTab = 0;
        }
        inventory.visible = true;
        reDrawBar = true;
        for (var e = 0; e < inventoryBar.inventory.length; e++) {
            if (inventoryBar.inventory[e] != undefined) {
                inventoryBar.inventory[e].kill();
                inventoryBar.inventory.splice(e, 1);
                e = -1;
            }
            if (inventoryBarText[loopCount] != null) {
                inventoryBarText[loopCount].text = "";
                inventoryBarText[loopCount] = "Null";
            }
            loopCount++;
        }
        new HUD();
        new controlInventoryScreen();
    }
}

/***
 * This delete the current save of the player
 * @constructor
 */
function clearLevel(){
    $.get("/delete?username=" + username + "&del=" + true);
    $.get("/playerDelete?username=" + username + "&del=" + true);
}

/***
 * This is where the saving of the level is handled
 * @constructor
 */
function upload() {
    var dataLength = 0;
    var storeData = [];
    var start = 0;
    var end;
    var del = true;
    var uploadData = false;
    for (var e = 0; e < blocksA.length; e++) {
        if (dataLength + blocksA[e].key.length + blocksA[e].body.x.toString().length + blocksA[e].body.y.toString().length < 500) {
            storeData.push(blocksA[e].key + "," + blocksA[e].body.x + "," + blocksA[e].body.y);
            dataLength = dataLength + blocksA[e].key.length + blocksA[e].body.x.toString().length + blocksA[e].body.y.toString().length;
            uploadData = false;
            end = e;
        } else {
            uploadData = true;
        }
        if(uploadData == true || e == blocksA.length - 1){
            uploadData = false;
            console.log("Pushing: " + start + " : " + end);
            start = e;
            if(e + 10 < blocksA.length) {
                e -= 1;
            }
            if (del == true) {
                $.get("/delete?username=" + username + "&del=" + del);
                del = false;
            }
            $.get("/save?username=" + username + "&blocks=" + storeData);
            storeData = [];
            dataLength = 0;
        }
    }
    dataLength = 0;
    storeData = [];
    start = 0;
    end = 0;
    for (var e = 0; e < chunks.length; e++) {
        if (dataLength + chunks[e].key.length + chunks[e].body.x.toString().length + chunks[e].body.y.toString().length < 500) {
            storeData.push(chunks[e].key + "," + chunks[e].body.x + "," + chunks[e].body.y);
            dataLength = dataLength + chunks[e].key.length + chunks[e].body.x.toString().length + chunks[e].body.y.toString().length;
            uploadData = false;
            end = e;
        } else{
            uploadData = true;
        }
        if(uploadData == true || e == chunks.length - 1){
            uploadData = false;
            console.log("Pushing: " + start + " : " + end);
            start = e;
            $.get("/save?username=" + username + "&blocks=" + storeData);
            storeData = [];
            dataLength = 0;
        }
    }
    storeData = [];
    dataLength = 0;
    for(var e = 0; e < player.inventory.length; e++){
        if(e == 0){
            $.get("/playerDelete?username=" + username + "&del=" + true);
            $.get("/playerSave?username=" + username + "&X=" + player.body.x  + "&Y=" + player.body.y + "&SpawnX=" + player.spawnX + "&SpawnY=" + player.spawnY + "&Health=" + player.health);
        }
        if(player.inventory[e].Name != "Null"){
            if(dataLength + player.inventory.toString().length < 500) {
                storeData.push(player.inventory[e].Amount + "," +  player.inventory[e].Name + "," +  player.inventory[e].Placeable + "," +  player.inventory[e].Strength + "," +  player.inventory[e].Health);
            }
            else{
                $.get("/playerInventorySave?username=" + username + "&data=" + storeData);
                storeData = [];
                dataLength = 0;
            }
        }
        if(e == player.inventory.length - 1){
            $.get("/playerInventorySave?username=" + username + "&data=" + storeData);
        }
    }

}

/***
 * This is where the loading of the level is handled
 * @constructor
 */
function retrieve() {
    blockKeyData = [];
    $.ajax({
        type: 'GET',
        url: "/retrieve?username=" + username,
        async: true,
        dataType: 'jsonp',
        contentType: 'application/javascript',
        success: function (response) {
            console.dir(response);
            var name;
            var x;
            var y;

            for (var i = 0; i < response.Data.length; i++) {
                load = true;
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
                    blockKeyData[e].X = parseInt(blockKeyData[e].X);
                    blockKeyData[e].Y = parseInt(blockKeyData[e].Y);
                }
            }
            blockKeyData.sort(function (a, b) {
  if (a.X == b.X) return a.Y - b.Y;
  return a.X - b.X;
            });
            if(game == undefined){
                startGame();
            }
        }
    });
}
