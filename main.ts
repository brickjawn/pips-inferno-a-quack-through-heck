// ==================== PIPS INFERNO - COMPLETE WITH POWERUPS ====================
// Updated with Speed Bean, Soul Bead, and Lava Boots on Level 3

namespace SpriteKind {
    export const Exit = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
    export const Crab = SpriteKind.create()
    export const Crumb = SpriteKind.create()
    export const ShieldPowerup = SpriteKind.create()
    export const Bubble = SpriteKind.create()
    export const Golem = SpriteKind.create()
    export const Mimic = SpriteKind.create()
    export const WavePowerup = SpriteKind.create()
    export const Dino = SpriteKind.create()
    export const Boss = SpriteKind.create()
    export const WindWave = SpriteKind.create()
    export const SpeedBean = SpriteKind.create()
    export const SoulBead = SpriteKind.create()
    export const LavaBoots = SpriteKind.create()
    export const TreasureChest = SpriteKind.create()
    export const SoulRock = SpriteKind.create()
    export const RevivalBean = SpriteKind.create()

}

/**
 * Pips Inferno - Main Game File with Level 3 + Lava + Golems
 */;

// ==================== ENUMS ====================
enum Facing {
    North,
    East,
    South,
    West
}

// ==================== GLOBAL VARIABLES ====================
let TILE_SIZE = 16
let facing: Facing = Facing.East
let inTitleScreen = false
let titleImage: Image = null
let hatSprite: Sprite = null
let hp: StatusBarSprite = null
let enemies: Sprite[] = []
let crabs: Sprite[] = []
let bubbles: Sprite[] = []
let corruptedEggs: Sprite[] = []
let golems: Sprite[] = []
let player2: Sprite = null
let hasLaserPowerup = false
let hasWaveShotPowerup = false
let shieldHits = 0
let mimicSprite: Sprite = null
let mimicActivated = false
let startText: TextSprite = null
let currentLevel = 1
let soulsCollected = 0
let gameStartTime = 0
let timerText: TextSprite = null
let dinos: Sprite[] = []
let bossSprite: Sprite = null
let bossPhase = 1
let inBossFight = false
let bossHP: StatusBarSprite = null
let isTransitioningLevel = false
let hasShownIntro = false
let minions: Sprite[] = []
let hasSpeedBean = false
let hasSoulBead = false
let hasLavaBoots = false
let baseSpeed = 60
let hasRevivalBean = false




// Music Tracks
// 1. YOUR CUSTOM HEX TRACK (Title Screen)
let titleSong = music.createSong(hex`00b4000408040300001c00010a006400f401640000040000000000000000000000000005000004180018001c00031b1e2238003c0003161ea358005c00031b1e2203001c0001dc00690000045e01000400000000000000000000056400010400031e0000002000011b20004000011640006000019760007000011470008000011609010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800c0000000010001060400050001070800090001080c000d0001071000110001061400150001071800190001081c001d0001072000210001062400250001072800290001082c002d0001073000310001063400350001073800390001083c003d0001074000410001064400450001074800490001084c004d0001075000510001065400550001075800590001085c005d0001076000610001066400650001076800690001086c006d0001077000710001067400750001077800790001087c007d000107`)

// 2. LEVEL 1: "The Descent" (Spooky)
let level1Song = music.createSong(hex`00b4000408040500001c00010a006400f401640000040000000000000000000000000005000004180018001c00031b1e2238003c0003161ea358005c00031b1e2203001c0001dc00690000045e01000400000000000000000000056400010400031e0000002000011b20004000011640006000019760007000011470008000011604001c00100500640000041e000004000000000000000000000000000a040004300008000c00010f10001400010f28002c00010a30003400010a48004c00010c50005400010c68006c00010870007400010a07001c00020a006400f401640000040000000000000000000000000000000003540000000400011b14001800011618001c00011b1c002000011e20002400011d38003c00011940004400011b54005800011658005c00011b5c006000011e60006400012068006c00011e70007400011d78007c00011e09010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800c0000000010001060400050001070800090001080c000d0001071000110001061400150001071800190001081c001d0001072000210001062400250001072800290001082c002d0001073000310001063400350001073800390001083c003d0001074000410001064400450001074800490001084c004d0001075000510001065400550001075800590001085c005d0001076000610001066400650001076800690001086c006d0001077000710001067400750001077800790001087c007d000107`)

// 3. LEVEL 2: "Magma Caverns" (Faster)
let level2Song = music.createSong(hex`00b4000408040500001c00010a006400f401640000040000000000000000000000000005000004180018001c00031b1e2238003c0003161ea358005c00031b1e2203001c0001dc00690000045e01000400000000000000000000056400010400031e0000002000011b20004000011e40006000012060007000012270008000012504001c00100500640000041e000004000000000000000000000000000a040004300008000c00010f10001400010f28002c00010a30003400010a48004c00010c50005400010c68006c00010870007400010a07001c00020a006400f4016400000400000000000000000000000000000000037e0000000400011b0c001000011910001400011b18001c00011e20002400011d2c003000011b30003400011d38003c00012040004400011e48004c00012050005400012254005800011658005c00012560006400012a64006800012968006c0001276c007000012a70007400012774007800012578007c0001a37c008000012209010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800c0000000010001060400050001070800090001080c000d0001071000110001061400150001071800190001081c001d0001072000210001062400250001072800290001082c002d0001073000310001063400350001073800390001083c003d0001074000410001064400450001074800490001084c004d0001075000510001065400550001075800590001085c005d0001076000610001066400650001076800690001086c006d0001077000710001067400750001077800790001087c007d000107`)

// 4. LEVEL 3: "Inner Circle" (Intense, High Pitch)
let level3Song = music.createSong(hex`00b4000408040500001c00010a006400f401640000040000000000000000000000000005000004180018001c00031b1e2238003c0003161ea358005c00031b1e2203001c0001dc00690000045e01000400000000000000000000056400010400031e0000002000011b20004000011640006000019760007000011470008000011604001c00100500640000041e000004000000000000000000000000000a040004300008000c00010f10001400010f28002c00010a30003400010a48004c00010c50005400010c68006c00010870007400010a07001c00020a006400f401640000040000000000000000000000000000000003600000000400011b18001c00011e2000240001202c003000011e30003400011d38003c00011e4000440001225400580001166000640001a364006800012268006c0001206c007000012270007400012074007800011e78007c00011d7c008000011b09010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800c0000000010001060400050001070800090001080c000d0001071000110001061400150001071800190001081c001d0001072000210001062400250001072800290001082c002d0001073000310001063400350001073800390001083c003d0001074000410001064400450001074800490001084c004d0001075000510001065400550001075800590001085c005d0001076000610001066400650001076800690001086c006d0001077000710001067400750001077800790001087c007d000107`)

// 5. BOSS FIGHT: "Satan's Gallop" (Very Fast, Chromatic)
let bossSong = music.stringPlayable("C5 A B G A F G E C5 B C5 A B G E C ", 240)


// ==================== SPRITE ASSETS ====================
let crumbImage = img`
    . . b b b . . .
    . b 5 5 5 b . .
    b 5 5 5 5 5 b .
    b 5 5 5 5 5 b .
    b 5 5 5 5 5 b .
    b b b b b b b .
    . . . . . . . .
    . . . . . . . .
`

let normalProjectile = img`
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    . . . 2 2 . . .
    . . 2 5 e 2 . .
    . . 2 e 5 2 . .
    . . . 2 2 . . .
`

let laserHorizontal = img`
    . . . . . . . . . . . .
    . . . . . . . . . . . .
    . . . . . . . . . . . .
    . . . . . . . . . . . .
    . . . . . . . . . . . .
    . 9 9 9 9 9 9 9 9 9 9 9
    . 8 8 8 8 8 8 8 8 8 8 8
    . 9 9 9 9 9 9 9 9 9 9 9
`

let laserVertical = img`
    . . . . . . . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . 9 8 9 . . .
    . . . . . . . . .
`

let ghostPulse = img`
    . . . . 1 1 1 1 . . . .
    . . 1 1 1 1 1 1 1 1 . .
    . 1 1 . . . . . . 1 1 .
    . 1 . . . . . . . . 1 .
    1 1 . . . . . . . . 1 1
    1 1 . . . . . . . . 1 1
    1 1 . . . . . . . . 1 1
    1 1 . . . . . . . . 1 1
    . 1 . . . . . . . . 1 .
    . 1 1 . . . . . . 1 1 .
    . . 1 1 1 1 1 1 1 1 . .
    . . . . 1 1 1 1 . . . .
`

let poisonProjectile = img`
    . . 7 7 . .
    . 7 7 7 7 .
    . 7 7 7 7 .
    . . 7 7 . .
`

let batVenom = img`
    . . 7 7 . .
    . 7 7 7 7 .
    . 7 7 7 7 .
    . . 7 7 . .
`

let snakeShot = img`
    . . 2 2 . .
    . 2 5 5 2 .
    . 2 5 5 2 .
    . . 2 2 . .
`

let crabWater = img`
    . . 9 9 . .
    . 9 8 8 9 .
    . 9 8 8 9 .
    . . 9 9 . .
`

let eggExplosion = img`
    . . . . . . . .
    . . . . . . . .
    . . . 4 4 . . .
    . . 4 4 4 4 . .
    . . 4 4 4 4 . .
    . . . 4 4 . . .
    . . . . . . . .
    . . . . . . . .
`

let fireDart = img`
    . . 4 4 . .
    . 4 2 2 4 .
    . 4 2 2 4 .
    . . 4 4 . .
`

let fireArc = img`
    . . 4 4 4 . .
    . 4 2 2 2 4 .
    4 2 4 4 2 2 4
    . 4 2 2 2 4 .
    . . 4 4 4 . .
`

// NEW: Dino spike projectile
let dinoSpike = img`
    . . . . . . . .
    . . . 1 1 . . .
    . . 1 f f 1 . .
    . 1 f f f f 1 .
    . 1 f f f f 1 .
    . . 1 f f 1 . .
    . . . 1 1 . . .
    . . . . . . . .
`

// NEW: Wind wave projectile (bounces off walls)
let windWave = img`
    . . . . . . . . . .
    . . 9 9 9 9 9 . . .
    . 9 1 1 1 1 1 9 . .
    9 1 9 9 9 9 9 1 9 .
    9 1 9 9 9 9 9 1 9 .
    . 9 1 1 1 1 1 9 . .
    . . 9 9 9 9 9 . . .
    . . . . . . . . . .
`

// NEW: Boss form 1 (placeholder - replace with your asset)
let bossForm1 = img`
. . . . . . . . . . . . . . . . . f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 8 f . . . . . . . . f f f . . . . . .
. . . . . . . . . . . . . . . f 8 8 8 f . . . . . . f 4 4 f . . . . . .
. . . . . . . . . . . . . . f 8 8 f 8 8 f . . . . . f 4 4 4 f f . . . .
. . . . . . . . . . . . f f 8 8 f f f 8 8 f f . . . f 4 4 4 e e f . . .
. . . . . . . . . . . f 8 8 8 f f f f f 8 8 8 f . . f 4 4 4 e e f . . .
. . . . . . . . . . . f 8 8 8 f f f f f f 8 8 8 f . . 4 4 4 2 e f . . .
. . . . . . . . . . . f 8 f f f f f f f f 8 8 8 f . . f 4 2 e e f . . .
. . . . . . . f f f f f f f f f f f f f f f f 8 8 f . . f f f f . . . .
. . . . f f f a c c c c c c f c f f f f f f f f 8 8 f . f c f f . . . .
. . . f a a a a c c c c c c c f c f f f f f f f f 8 f . f c f f . . . .
. . f a a a a c c c c c c c c f f c f f f f f f f 8 f . f c f f . . . .
. . f c c c c c c c f f f f f c c c c f c f f f f 8 f f c c f f f . . .
. . f c c c c c c c f f f f f c c c c f c f f f f 8 f f c c f f f . . .
. f a a c c c c c f 1 1 5 1 f c c f c f c c f f f 8 f f f c c c f . . .
. f c c c c c c f d 1 1 5 1 f c c f c c f f f f f 8 f c f f c c f . . .
. f c c c c c c f d d d d 1 f c c f f c f f f f f 8 f c f f f f . . . .
. f c c f c c c c c d d f f f c c f f c c f f f f 8 f f c c f f . . . .
. f c f f f f f c c f f c c c c f f f c f f f f f 8 f f c f c c f . . .
. . f f c c c c c f c c c c c c f f f c f f f f f 8 f c c f c c f . . .
. . . f f c c c c c c c c c c f f f f c 8 f f f f 8 f f c c f f f f . .
. . . . f f f f f c c c c c f f f c c f 8 f f f f 8 f f f c f f c c . .
. . . . . . . . f c c c f f f c c c f f 8 8 f f 8 f f f f c f f f f f .
. . . . . . . . f c c c f f f c c c f f 8 8 f f 8 f f f f c f f f f f .
. . . . . . . . c c c c f 3 3 3 3 3 f f f 8 8 8 f f f f f c f f f f f .
. . . . . . . f c c c 3 3 3 2 2 2 3 f c c f f f c c f f f f c c c c f .
. . . . . f f c c f c 3 2 2 2 2 2 3 c c c f f f f f c c c c c c f f . .
. . . . f c c c c f c c 3 2 2 2 3 3 c c f f f f c c f f f f f f c . . .
. . . f c c c c c f f c 3 3 2 3 c f f f f f c c c c c f f f c c c f . .
. . . f c c c c c c f f c c c c c c f f f f c c c c c c f f c c c f . .
. . . f c c c c c c f . f f c c c f f f f f c c c c c c f f c c c c f .
. . . f c c c c c c f . f f f f f f f f f f c c c c c c f c c c c c f .
. . f c c c c c c f . . . . f f f f f f f f c c c c c c f f c c c f f .
. . f c f c c c f f . . . . . f f f f . . f c c c c c c f f c c f c f .
. . f f f f f f f . . . . . . . . . . . . f c c f c c f . f f f f f f .
. . . . . . . . . . . . . . . . . . . . . . f f f f f f . . . . . . . .
`

// NEW: Boss form 2 (final form placeholder - replace with your asset)
let bossForm2 = img`
. . . . . . . f f f f . . . . . . . . . . . f f f . . . . . . . . . . .
. . . . . . f f f f . . . . . . . . . . . . . f e f . . . . . . . . . .
. . . . . f 2 2 f f . . . . . . . . . . . . . . e 2 f f . . . . . . . .
. . . . f 3 2 2 f . . . . . . . . . . . . . . . f 2 f 2 f . . . . . . .
. . . . f 3 2 2 f . . . . . . . . . . . . . . . f 2 f f f . . . . . . .
. . . . f f 2 2 f f . . . . . . . . . . . . . . f 2 e e f . . . . . . .
. . . f f f 2 2 e f . . . f f f f f f f f . f e 2 2 f f f f . . . . . .
. . . f f f 2 2 2 2 f f f f f f f f f f f f e 2 2 f f f f f . . . . . .
. . . f f f f f 3 2 2 f f f f f f f f f f e e 2 f f f f f f . . . . . .
. . . . f f f f f e f f f f f f f f f f f f e e f 3 f f f . . . . . . .
. . . . f f f f f f f f f f f f f f f f f f f f 3 f f f f . . . . . . .
. . . . f f f f f f f 2 f f f f f f f f 2 f f f e f f f . . . . . . . .
. . . . . . . f f f f 2 f f f f f f f f 2 d f f f . . . . . . . . . . .
. . . . . . . . . f f 2 2 f f f f f f 2 2 d f f f f f f . . . . . . . .
. . . . . . . . . f f 2 2 f e e f f f 2 2 d 2 f f f c c f . . . . . . .
. . . . . . . . f e e f f e e e e e f f f f 2 e f c c c c c f . . . . .
. . . . . . . . f e 2 1 f e e e e e f f 1 f 2 e f f c c c c f f . . . .
. . . . f f f . f e f 1 f e e f e e e f 1 f e e f 1 f f c c f f f . . .
. . . f f f f . f f 2 1 f 1 f 1 1 1 f 1 1 f e f f d 2 f c c c c f . . .
. . f 1 1 f f . . f 2 1 f f f f f f f f 1 f f f f f 2 1 f c c c f . . .
. f 1 3 f e f f . . f 1 1 f 1 f 1 f 1 e e f f f e f f f c c c c f f . .
. f 1 f e e f f f f f e e e e e e e e e e f f e e e e f f f c c c f . .
. f f f e f f f f f f f f f f f f f f f f f f e e e e e e f f c c f . .
. . f 1 e f f f e e f f f c c c c c c c c c 1 e e e e e 2 f f f f f . .
. . f f f f e e e e f f c c c f c c c c c c f e e e e e e f f f 6 f . .
. . . f e e e e e e f f f c c c 3 f 3 f f 3 1 3 2 1 f f e f c c f f . .
. . . . f e e e e e f f c c 3 3 3 3 3 3 f 1 1 f 1 1 1 f e f f c f . . .
. . . . f f f f f 1 f f c 3 3 2 2 2 2 3 3 1 1 f 1 2 f f f f c c c . . .
. . . . . f f f f f f f c c 3 2 2 2 2 3 c f f f 1 e f f f c c f f f . .
. . . . . . . . . f e f f c 3 3 3 3 3 3 f f 6 f f f f f f f f f f f f .
. . . . . . . . f e 2 2 f f c 3 f f 3 c c c f e 2 2 2 2 e f f f f f f .
. . . . . . f f e e 2 2 e f f c c c c f c f f e 2 2 2 2 e f f f f f . .
. . . . . . f f e 2 e e e f f . f f f f f f e e e 2 2 2 2 f f f . . . .
. . . . . f f 1 e e e e e e f . . f f f . f e e e e 2 2 2 f . . . . . .
. . . . f 2 d 1 e 1 e e e e f . . . . . . f e 2 1 e 1 e e 1 f . . . . .
. . . . f f f f f f f f f f f . . . . . . f f f f f f f f f f . . . . .
`

// Flame Wisp minion for boss fight
let flameWisp = img`
    . . 2 f 2 . . . . .
    . . . 2 f 2 . 2 . .
    . e . e 4 e 2 2 . .
    . 2 e e 4 4 2 . . .
    . f 2 4 4 e . f . .
    f 2 5 4 5 e f 4 2 .
    e . 4 4 f 4 . . e .
    2 f 4 4 f 4 2 . . .
    f 4 2 f 4 2 f . . .
    . f 2 2 2 f . . . .
`

// Black flame projectile
let blackFlame = img`
    . . 1 1 . .
    . 1 1 1 1 .
    . 1 1 1 1 .
    . . 1 1 . .
`

//speed bean item
let speedBeanImage = img`
. . . . . f f f f f f f . . . .
. . . . f 6 6 6 6 2 2 f f . . .
. . . f 6 1 6 6 6 f 2 2 e . . .
. . . 6 1 1 6 6 6 f 2 2 2 f . .
. . . 6 1 1 6 6 6 f 2 2 2 f . .
. . f 6 6 6 6 6 6 f 2 2 2 f . .
. . f 6 6 6 6 6 6 4 4 4 2 f . .
. . f 6 6 6 6 6 6 2 2 2 2 f . .
. . f 6 6 6 6 6 f 4 5 e 2 f . .
. . f 6 6 6 6 6 f 2 2 2 2 f . .
. . f 6 6 6 6 f 4 4 4 2 2 f . .
. . . 6 6 6 6 f 2 2 2 2 e f . .
. . . f 6 6 6 f 2 2 2 e e f . .
. . . f 6 6 6 f e e e e f . . .
. . . . f f 6 6 f e e f f . . .
. . . . . . f f f f f . . . . .
`


//soulBeadImage
let soulBeadImage = img`
. . . . . . f f f f . . . . . .
. . . . f f 9 9 9 9 f f . . . .
. . . f 9 1 1 9 f 9 9 6 f . . .
. . f 9 1 1 9 f 4 9 9 9 6 f . .
. f 9 1 1 9 9 f 4 f 9 9 9 6 f .
. 8 9 1 9 9 f 4 4 f f 9 9 6 f .
f 9 1 9 9 f 4 4 5 4 f 9 9 9 6 f
f 9 1 9 f 2 5 5 5 5 2 f 9 9 6 f
f 9 9 9 f 2 5 5 5 5 2 f 9 9 6 f
f 9 9 9 f 2 5 1 5 5 2 f 9 6 6 f
. f 9 9 9 f 2 d 1 2 f 9 9 6 f .
. f 6 9 9 9 f 2 2 f 9 9 6 6 f .
. . f 6 9 9 9 f f 6 9 6 6 f . .
. . . f 6 6 9 9 9 6 6 6 f . . .
. . . . f f 6 6 6 6 f f . . . .
. . . . . . f f f f . . . . . .
`

//lavaBootsImage
let lavaBootsImage = img`
. . . . c c c c c c . . . . . .
. . . . 2 c c c c f f f e e e c
. . . . 2 2 2 2 c 2 c c c c c c
. . . . e 2 2 2 c 2 2 2 2 e e c
. . . . c f f e f c c c c c c .
. . . . c 2 2 2 e c e e e e f .
. . . . c 2 4 2 e c 2 4 e 4 e .
. . . . c 2 4 2 e c 5 4 e e e .
. . c c c 2 4 4 e c 5 4 e e e .
. 2 2 2 2 2 4 c c c 2 4 4 2 e .
. 2 2 4 2 4 c 2 2 2 2 4 4 2 e c
c 4 4 4 4 4 2 2 4 2 4 e 2 4 e c
c 2 2 2 4 4 4 4 4 4 4 4 4 2 4 c
c 4 4 4 4 c 4 4 4 4 4 4 4 4 4 c
. . . . . c 4 4 4 4 4 4 4 c f .
. . . . . . c c c c c c c . . .
`

// Revival Bean - Auto revive to 100% HP
let revivalBeanImage = img`
    . . . . . f f f f f f f . . . . .
    . . . . f e e e e 2 2 f f . . . .
    . . . f e 1 e e e f 2 2 e . . . .
    . . . e 1 1 e e e f 2 2 2 f . . .
    . . . e 1 1 e e e f 2 2 2 f . . .
    . . f e e e e e e f 2 2 2 f . . .
    . . f e e e e e e 5 5 5 2 f . . .
    . . f e e e e e e 2 2 2 2 f . . .
    . . f e e e e e f 5 4 e 2 f . . .
    . . f e e e e e f 2 2 2 2 f . . .
    . . f e e e e f 5 5 5 2 2 f . . .
    . . . e e e e f 2 2 2 2 e f . . .
    . . . f e e e f 2 2 2 e e f . . .
    . . . f e e e f e e e e f . . . .
    . . . . f f e e f e e f f . . . .
    . . . . . f f f f f f . . . . . .
`

//

// ==================== TITLE SCREEN ====================

titleImage = img`
    ccfffccfcfcccccccccccccccffccfffcccccccccccccffcccccccccfcc4cfcfccccccccfcccccccfffffffffffffffffffffffffffffffffffffffffccffcccf4ccccccccccccccccccccccccccccc
    cccccfffccffcccccccccccccccccffecccccccccccccceccccccccccfffffccccccccccfcfffffcffffffffffffffffeffffffffffffffffffffffffffffcccfeccccccccccccccccccccccccccccc
    cccccccfcfcccccccccccccccccccffffeccccccccffcf4cfcccccccfffffccccccccccccccfffffffecffffffffffffeffffffffffffffffffffffffccccccfefccccccccccccccccccccccccccccc
    cccccccfffccccccccccccccccccccfcf4ffcccfffccfcffcccccccccff4ccccccccccccccfffffffcecffffffffffffffffffffffffffffffffffcfcfffccccc4eccccccccccccccccccccccccfccc
    ccccccccfccccccccccccccccccccffff4fccccccecccffcefcffcccc4f4fcccccccccfcccffc4ffcf4fffcfffffffffcf4ffeffffffeffffffffcfffffccccfb44ccccccccccccccccccccccccfcff
    ccfccccccffccccccccccccccccccc4ee44fccccf4cfff4c44fffccc4f44feccccccccfffccfe4ffff44ffffffffffff4f4fe4fffefe4ffffffcf4fffc4eccfc444cecccccccccccccccccccccccfcc
    cccccccccffccccccccccccccccccf4444444ecf444ff4444444eccf444444cccccccc444efe444fe444cf4444444ef44444444fe444444eccc4e4ece44ecc4e444e4cccccccccccccccccccccccccc
    cccccccccffccccccccccccccccccc44444444ff444ff44444444ec4444444eccccccc444efe444fe444fc4444444ef44444444fc4444444ecc444ece44ccc4444444cccccccccccccccccccccccccc
    ccccffcfcffccccccccccccccccccc444ee4ddbf444fce4dec4dd4f444e4444ccccccc444ece444fe444ff4444444ef4444444eff444e44d4fc4dd4c444ecf444e444eccccccccccccccccccccccccc
    cccccccfcfcccccccccccccccccccc444fc4dd4fdddfc4ddecfdddfdddcfd44ccccccc44dece4dd4edd4ff4ddfffcfc4ddfffffcfd44cfdddfcddddf4d4ecedd4fe444ccccccccccccccccccccccccc
    ccccccfcfcccccccccccccccccccccd4dfcfdd4fdddfcddd4ccdddfdddff444ccccccc4dd4cfddddedd4cfdd4cffffc4ddfffffffdddff4ddfc4ddde4ddfc4ddecf444ccccccccccccccccccccccccc
    cccccccccfccccccccccccccccccccdddccfdd4fdddfcedd4ccdddfddd4cccccccccccddd4cfdddd4dd4ccdddffcccfdddffcffffdd4ccdddfcedddd4ddfc4ddccf44dccccccccccccccccccccccccc
    cccccccccccfccccccccccccccccccdddcc4dd4fdddfcedd4cfdd4c4ddd4cccccccccc4ddfccdddd4dd4cfddd444bccdddd444cffddde4dddcc4dddd4ddefdddfccdddccccccccccccccccccccccccc
    fcccccfcffcccccccccccccccccccc4dd44dddffdddfceddd4dddecc4ddd4ccccccccc4ddfceddddddd4cfdddddd4cfdddddd4ccedddddddeccdddddddd4fdddfccdddccccccccccccccccccccccccc
    ccffffccccccccccccccccccccccccddddddd4cfdddfcedddddd4ccccdddd4cccccccc4ddeceddddddd4ffdddddd4cfdddddd4cceddddddecccddddddddefdddfcc4ddfcccccccccccccccccccccccc
    cffcccccccccccccccccccccccccccdddddd4ccfdddfceddddd4fccccf4dddeccccccc4ddeccdd4dddd4ccdddcccecfdddffcfccfdddedd4cccddd4ddddecdddfccdddfcccccccccccccccfffcccccc
    fccccccfcffbbbfcccfcccccccccccdddcfccccfdddfceddeffccccffcfddd4ccccccceddecedd4dddd4cfdddfcccccdddfcccccfdddfdd4cccddd4ddddcfdddfcfd44fccccccccfcffffcccccffcfc
    ccccccfccfcbbbbccccccccfffcccc4ddfcccccfdddfce4deccccce44ecf444cccccccfddeceddeeddd4ccdddfccccc4ddfcccccfdddc4d4fcc4dde44ddec4ddecc444cccccccffffcffcccccccfccc
    ccccccffccbbbbdbfccdffcccccfcc444fcccccf444cce44ecccccc44ecc444ccccccce44ecf44ef4444cc444cccccc444fcccccf444ce44ecc444ee444ece44ece44ecccccffcfffcccccccccccccc
    cccccffcfcccccbbdcccccccfccccc444fcccccf444fce44ecccccf444ee444ccccccc444ecc44ec4444fc444cccccc44444444fc444cf444cc444ef444ece444c444efccfcffcfcccccccccccccccc
    ccccffffffcccccbbcccffcccccccc444fccccff444fce44ecccccc4444444eccccccce44ece44ece444fc444fccccc44444444cf444cc444fc444ec444ecf4444444fcccffffffcccccccccfcccccc
    cccccffffffcccbdbfcccffcccfccf444ffccfcf444fce44eccccccfe4444ecccccccce44ece44ecf444cc444cccccc44444444ff444cce44ece44ecc44eccf44444cccccfffffffccccccccccccccc
    ccffcfffffccccbdbfcccffcccfccf44fcccccccfffccccffccccccccceefccccccccccffccfeffccfeecf44fccccccffffcfffccfcccccfffcfeffcceeccccfceefccfcfffffccffffcccccccccccc
    ccffcfffffffccbdbccccfccccfccc4ccccccccccccccccccccccccccccccccccccccccccccccccccccccf4fccccccccccccccccccccccccccccccccccccccccccccccfffffffcccccccfcccccccccc
    ccfccffffffcfcbbdffcccccfcfccceccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccffffffcccccccccfcccccccc
    ccfccfcffffcfcfdfcfcccccccfcccccccccfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfffffffffcffcccccccccccccccfccccccccfcfcffccccccccccccfcccccc
    ccfcfccfffffffccccccccccccffcccccfcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfcfccccccffffccccccccccccccccfcccccccccfffffccccccccccfccccccccc
    ccfcccffffccfccccccccfecfcccccccfcccfccccccccccccfccffccccccccccccccccccccccccccccccccccccccccfccccccccccffcfffcccccfcccccccccccccccccfffccffccccccfccccccccccc
    ccccffccccccccccccfccceefcccccccccccccfffccfccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfcccffccccccccccccccfccccccccfccccccffccccfcccccccccccc
    ccfffcccccccccccccfcfccccccccccccffcccccccfccfcfccccccccccccccccccccccccccccccccccccccccccccccccccccccffccccccccccccccccccccfcfccccfffffcccccccccfccccccccccccc
    cffccccccccccccfccfcfffccccfcccccccccffccfccccfcfcccccccccccccccccffccccccccccccccccccccfcccfccccccccfcccccfccfffcccffccccccfcccccccccccccccccccccccccccccccccc
    fccccccccccccccccfcfccfcfcccccccccccfccfccccfcfccfccccccffccccccccfccccccccccccccccccccccc6cccccccccccccccccfccccfccfcccccfcfffcfcccffccccccccfcfcccccccccccccc
    fcccccccfccfccccccccfcfcffbccccccccfccccccfccccfccfcccccffffcccccccccccccccccccccccccccccbbcccccccfccccccccfcccccccccfcccccfcfffcfccfcccccccccccccccccccccccccc
    ccccfcccecccfcccccccccccffcccccccccccfccfcccccccfcccccccccccfffcccccccccfcccccccccccccccbbbcccccccccecccccccccccccffccccccfefcccffffccccccccccccccccccccccccccc
    cccccfcccccccccccccccccccccccccccccfccccccccccfcccfcccfccfcccccfccccccfcfcccccccccccbbbbbbbccccccccccfcccccccccccffffecccfeeccccffffcccccccccccfccccccccccccccc
    ccccccccccccccccccccccccfcfcccfcccccccccccccccccccccccccfcccccccccccccccccccccccccc66bbbbbccccccccccccccccccccccccccfffcccccfcccfffccccccfcccccfccccccccccccccc
    cccccfccccccccccccccccccccccfcfcfccfcfcccccccccccccccccfcccccfcccccfcccccccccccccc666bbbbcccccccccccccccccccccccccccccccccfcccfccfcccccfccccccccccccccccccccccc
    cfccbbccccccccccccccccccccccccccccccccccccbbccccccccccfcccccccccccccfcccfccccccccb6bbcccccccccccccccccccccccccccccccccfcfcbcccfccffcccccccccccccccddccccccccccc
    ccbccbcccccccccfcccccccccccccfccccccccfcfccccfcccccccfccccbccccccccccffcfcccccccbb6ccccccccccccccccccccccccccccccccccffcccccfcfcccfcccccccccccccccbcccccccccccc
    ccbbcccccccccccccccccccfccccccfccccccccccccbcfebcfcccccfcbbbbcbcccccccccccccfcccccccccccccccccccccccccccccccccccccccccccfccccfccccfcccccccccccccccccccccccccccc
    ccfcfffcccccccfccccccccfcffffccccccccbcccbbbbbbbbbbcccccccbbbbbccccccccccccccfcccccccccfcccccccccccccccccb9ccccccccccccccbfcfcccccfcccccccccccccccccccccdcccccc
    fccffffffccccfcccccffcfcccccfccfcccbbbbbbbbbbbbbbccccbbbeffbbbbfccbccfcccccccccccccccfccccccccccdcccbccccdddccccccccccccfcffccccccfcccccccccccccdddcccccdcccccc
    ffccccffcccfcccccfcccfcfccccccfccccccbbbbbbbddbdddbceeddd333ddddccbdcccbeccccccfcccccccccfccccccbcdddddccdddcccccccccccccfcccccccfcccccccccccc6bdddccccddcccccc
    fffcccfffcfcccccfccccfcccccfcfccccfcbbbbbbbbddbbbbbbbbdddddddd3bbfddfcccbbcfcccccfccccccccccccccccddddd966ddccccccccccfcccccbccccfccccccccccc9bddddbcccddcccccc
    ffcccccccffccccffccfcccfccccfcccbcbbbbbb3bbbbbbbbbbb33dd33bbbbbbbbbeccbcc3bccffccccccccccfcccc666bddd9dd99ddbccccccccccccccccfffcccccccccccccdbbdcdcccdddcccccc
    ffcccccffcffccffcfccccfcfccffccbbdddddddfbbbcbbbbb33bbbbbccccacbbcebbfcecbdbcccccfcccfcffcccc666bddd9ccddddddcccccccccccccccccccccccccccccccc9dbdcddcddddcccccc
    fffcccccccffffcccffccccccfccfbbdddddddbfbddbbcecccccccbbbcccccbccbcbbbfbdddbbcccccfccffcfccfc66bbb9cdd9ddddddccccccccccccccccc6666666ccccccc6bddddddddddbccdccc
    cccfccccccfcfffffcccfccbbcfcfbedddddbbbbbbbbbbcccccccccccccccccbbcccceeabbddbbcccccffccccccc666bb6dcdcccddddddccccccccccccffcc6666666666cc66bbddcdddddcdccccccc
    ccccccccccfccfccfcffcccbbbddffcdbdbbbbcddccccbcccccccccccccccccccccccccebbbddbbcccccccfccbfcc666966db6ddddddddcccccccccccccccb66666666666cb666dddddddbccccccccc
    fcfccccccccfcfccccfcccce333bfbbbbbbbbcccbccccbccccccbbbbbbcccccccccceeccabbbddbbfcccccccffcffb66ddcddddddddddddcccccccccccccc666666666666ccb66bddddddcccccccccc
    cfccfccccccffffcccccfcfc3bbcbbbbbbccccccbbccdbcccccccccccccbbbccccccccbbeaaebddbbcbccccfcccccfc6dddddddddddddddcccccccccccccc666666666666cccb66ddddddddcccccccc
    cfcccfccccccfcfcccccccccddfcbbbbeebbcccccdbbd3bccccccccccccccccbccccccccb3bcbddbdbbcecbcfccfcccccdddddddddddddbccfccccccccccc666666666666cccccbdddddddddccccdcc
    cfcccccccccffccccccccfccffcbbacb3bccccccccb333bbbbbbccccccccccccccccccccccbebbddddbbbfcccfc6ccccccbdddddddddddcbdccccbcccccccb666666666dcccccccbdddddddddddbccd
    cccccfcccccccfccccccdbfcccccccbbccccccccc43bcccccccccccccccccccccccccccccccbeaeddddb4bbcfccfb6ccccccc6bdddddddcddcfbbccfccccfc6666666666ccccccccc9bdddbbddccccb
    ccfccccffcfccccccccbdbfcfbbccbcccccfccccbbccccccccccccccccccccccbcccccccccbbbbcbbbddddbbcfccc6ffccccc6666ddddd66666ccbcccccccc666666666cccccccccccbbbbccccccccc
    cccccccccfcccfcffccbdefcfbccccccccccccbeccccccccccccccccccccccccccbcccccccccbdbcbbbbdddbccccfccfcccc66b669dd96666666bbbbfcccccf66666666ccccccccfccbbbbccccfcccc
    cccccccffccccfccccbbdfcccccbcccccccccfcccccccccccccfccccb33bcccccccebbccccccccbbbeeebdddbcccfcccfc666b6669dd966666666cbcccccccc66b99966cccccccccccbbbbcccc9cccc
    ffcccccfccccccccbbbdeccfccccccbccccfcfccccccccccccccccfccccccccccccccb4ccccccbccb33bbbdddecccccccccc6cfc6d9d966666666cccccccccffbddddddbcccbccccccbbbbbbbbccccc
    cffc66cffccccffbbbddcccccccccbccccccbccccccccccccccccccccccccccccccccccdbbcccccccce333bbdbbcfcfcfc6c6cccf69ddd666666ccbcbcccccfcdddddddbfcbbcccfccbbbdccbcccccc
    cccc666ffccccfcbbbdcfbccccccbcccccccccccccccccccccccccccccccccccccccccccbdbcccccccccbb33bdbcccfcff666ccccc6dddd699666ccbcccccfcdddddddddccbcfcccccbbbc6bccccccc
    ccfc666cccfccccfbdbfcccccccffcccccccccccccccccccccccccccccbbcccccccccccccbbbcccccccbcccb33deccccfff66666cc69ddd9666666bbbccccccddddccddddcccccdbcccbbbbcccccccc
    cfccc6cccccfccfbdbbccbccccfccffcccccccccccbcccccccbbccccddddddbcccccccccccccbcccbcccbcceebddcfccfccc66f66cc66b666666666cccccccddcddccddddbcccccdfccbbbccccbcccc
    ccccc6fccbcfccccdbbccbcccccccccccbccccccccccccccbbbbbccbbcbbbdddcbcccbbccccccccccbccccccbcbdbcfcfffc66666cf6666666666666ccccccddcddccddddddccccccccbdddddfcdddd
    ccccccfccbcfcccbbbbcccccccccccccccccccbbbccccccbbcbbbbcccccccccddccccccbcffcccccccbcccccbcebccccfcfc666bccf6666666cc666cccccccddcbdd6dddddddd1bccccdddddffddddd
    cccccfccecccccbfbbbfcccccccccffcccccbdddcccbbbbbbcccbbbbccbbbbbbbdccbbbcccddfccccbcccccccbcbccccfcfcf66cccf699666cc666ccbcccccddddccddddddddddddddddddddddddddc
    cfcccfcffcccccfcbbb3cfccccccfbcccccddbddddddbbbbbccccbbcccbfccbbbdbbccfbdecdbfcccccccccccccbccecfcfcf66ccfb999966666666bccccccddddcbcddddddddddddddddddddddddbc
    ccccccfcfcbcccfccb4bfcfccccfbcccccddbbddddbbbbbbbccfbbdddcbcfcbbbbbbbccfdd4b4bcffccccccccccfcfbcccfcc66ccf99999996b9666cbccccccddddddddddddddcbcbddddbccccccccc
    ffccccccccfeccccfb4ecfccffcccccccddbbbddbbbbbbbcbcbcbbbbdddcfdbbbdbbbbfdddd44444444fcccccccfceccccccc66ff999999999c6666bbbccccbcdddddddddddddccccccccccccfccccc
    cccccccccccbccfccbbcbccfcfccccccbdbbbccbbbbbbcbbbbbbfddbbbbbbbdbbbbdbcbdd4d4444444444fccccbfc3bccfcfcc6cc999999999cc669b6cbccbccbdddddddddddddcccccccccccfccccc
    cfcccccfcccbebfccccccccccccccbccdbbcccbbbbbcbbbbbdddddbbbbbbbbbbbbbbdbcddd4d4444444444eccccccbdccccffcccfccbc99999bccc9b6bbcccbccddddddddddddddddbdddddccfccccc
    cfcccccccccbddbcffccccccccccbccbdccccbbbbccbbbbdddddbbbbbbbbbbbbbbbbbbdddd4dd44444444bbccccfcbdccccffccf69bcf99996bccc6bb6cccccfccbdddddddddddddddddddddcccfccc
    ccccccccbcfdddccecbccccccccbcbcbbcccbbbbbbdbbbddddbbbbbbbbbbbbbdbbbbbddd44d44444444e4cb4fccb3cddcccccccb6ffcccd666bcccccdbbbccccccccddddddddddddddddcfccdbccfcc
    fcfcccccbcbddbcccccccccccccbcccbcccbbbbbcdbbbddbbbbbbbdddddddddcbbbbcddde4d44d4e444bfddbbcccbcbdbcccccf96bffccc669bccccccd9cccccccccccddddddddbdddccccccccccccc
    cffcccccbfbddbcfcbcccccccbbccccbccbccbbbbbbddbbbbbbbbddddddddddbdbbbbddd4bffebbc44444dcb4ccccbcbbcbbccc66ccfcccb96cccccccbbcccbcfcccccccdddddbddcccccccccfccccc
    cffcccccbbbd3cccfbccccccddcccccbcbbfcfbbbbdbbbbbddddddddbdddddddbdbcdd4447dddff44444dfddbefccbccbbbbccfccccccccc9cccccccbcccbcccccccccccccccccccccccccbccccfccc
    cccccccc3bbdbcbbcccccccbbbbbccbbbcfcfccbbbbbbbdddbbddddddddddbcddbdfdddd4bdddbf444eeeefcce444cccbbbbcccccccf6ccc9cccbbcccccccbccccccccccccccccccccccfbccccccccc
    ccfccccbbbbdbcbcccccccbdbbbbccbbbcfcbbcfcbbbbdddbddbbbddddbdddcddddcdddd4e1ddfbd4dee444f4eeeefbccbbbaccfccfb6cccf6cbbccccccccbcbcccccccccccccccccccccbccccccccc
    fccfcccbbbddccbcccccccdbbbbcccbbbccccccbbcfbbddbdddddddddddbdddddddcdddd4d1dddd7dceee4f4efeeebcccbdeacfcccb99ccccbdbbcccccccccbbccccccccccccccccccccbfccccbcccc
    ccccffbbbbddfffccccccc3bbbbccbbbbcccfccccccbbfbcdcddddddddddddddddddddddd4fdddedce4eee4efeeefbcfcc3bcffcfd996cccccccccceccccccbcccccccccccccccccccccbcccccccccc
    cfcccbbbbbfbbbbbdccccbbbbbbccbbbbbbdcfcffccccccfcfffcbfddddddbddddddddddddbdbd7feeeee4efcfcccccdbcbdbfccf99999dcccccccccccccccccffccccccccccccccfbbbccccccccccc
    fcccfbebbcdbbcbdddccc3bbbbcccbbbbbbdbbbbfbcfccccccfccbffbcddddddddddddddd474feeeeeeeeefceffccccd4fbdbfccf999f99dccccccccccfcccfcccccfcccccccccbccbbbbcccccccccc
    cccfccbbfbbbbccbddcccddbbbccbbbbbbdbbbbbdddfccfccffcfcccbffcdddddddcd4dddd4f4eeeeeeeeceececcccd44bcddcccf999c999fccccccfffccccccccfcccccccccccccbbcbccccccccccc
    ccccccfbbbcbbcccbddcc3ddbcccbdbbbbdbbbbbdddffffccccfccfbccbcdddddddcddddddddecffeeefffceeefcced44bcddfccf9cbc999ccccccfccccccccccccccccccdbbccbbbbbbbcccccccfcc
    fcccafccbbcbbbcccddccbddbcccb9bbbbbbbbbbddddbcfccfccccccccbbbccdddddfdddd44feeeeeeeeeeefbbccbd444bcbdcccc9ff999dbcbccccccccccccfcccccccdbddbbbcbbbccccccccccccc
    ccfcccccbccbbbbccddccbddccccbdbbbbbbcbbddddddcfcccfccfcccfccffcddddddddd4ddddd444eeeeeeecccdd4444bcbdccccbcfddd9bccc99dccccccccccccccccddbbcbbcbbbccccccccccfcc
    ffcfccfcbbcbbbbccbdccc3bbfcccbbbbdbbbbbdddccdccccccfcccfcccccddddddddcedddddd4444444eeefebcb44444efbdccbccccb9d9dcccc99cbcccccccccccccddbcbbcbccbcccccccccccccc
    ffcfcfbebbccbbb6dbccccbcbcfcbbbbbdbbbbbdddcbddccfcfcccfccccfccdddddddddbddd4444444444ebeeb44ccfbeefbdccbcfcccddddccccc9bbbcccccccbccccdbbbbcbbccbcfccccccccfccc
    ffcccfbbfbbbccbbddccccbcbccbbbbbbdbbbbbdddcbdddddcfccfcccccccfddddddddddfddd4444444eeeee444b4ccceecbdccbbcccc999dcccccc6ccccccccccccccdbbbbccbfcccccccccccccccf
    fccfbbbbbfdbbbbbccccccbcbccbbbbbbdbbbbbdddfbdddddddccffccccccdbcddddddddbbbfb7d44444444444444fccfbccecb3efccfdddddbcbccbbbccccccccccccbbbbcbbbccbcbcccccccccccc
    ffcccbbbbbdfccfccccccc3cccccbbbbbdbbbbbddddddddddddfcbbefcff444dc1dbddddbbfddd444444444444444cccceccbe33eeccccdd99dbccccbccccccccccccccdbbcbbfccbccccfccccccccc
    ffcfccbbbbdbbbccccccbcbcccccbbbdbdbbbbbddddddddddddbccbe4befd4b4dcddedddbfdddd44444444444444bfffccfcbd3bcccccc999ddccbccccbccccccccccbbcfbbccccccbccccccccfcccc
    cfccccbbbbdbbbccccccbcbbcbccbbbdbddbbbbdddddddddddddccfb4bbedbc44ddedcdcdddd4dd44444444d4444ecffcffcbd3cfccccdbdbbbbbcccbcccccccb6ccbccbbbccccccccccccccccfcccc
    cccfcfcbbbd3bbccccccbccbcbbcbbbdbdbbdbbddddddddddddddd1bbbeeeffb4dddcdd7ddddd44444db4444447ffccffcccbdbcfcccdd9dbbcbbcccbccccccbcbccbcccccccccccbccccccccfffccc
    cccccccbbdddbbbccccccccbcbbbbbbdddbbdbbdbddddddddddddddddbefccce4dd44dddd44d4444444e7d4444cccfccfccbbdccccfc9dcbb6bbccccbccccccbbcbbbccccccccccffccccfcccffccfc
    cfccccbbbdddcecbcccccccbcbbbbbbbdbbbbbbdbdddbddddddddddfceeccccf4dd4dddd444d4dd4444744444cfcccfceef3cdccbccfbbbbbcbcccbbcbccbbbcccccccccfccffccccccccccfcccfccc
    fcfcccebbdddccccccccccccbbbbbcbbdbbbbbbbdddddddddddddddd44bccfcc4444d4444444444444444444cfcccccc4eedeccfbccfbbcbcbccccbbccccccbbcccbccccccccccccccccccbcccfccfc
    ccccccbbbddbcfcccbccccccbbbbbcbbbbbdbbcbddddccdddddddddcbccccfcc444444444444444444444444bcccccce44b3dccceccfdf4cbcccbcbbbcccccbcccbcccccfccccccfccccccececccfcf
    cccfcccbfffbcccccbcccccccbbbbcbbbbbdbbbbddddccddddddddddfccfcfccb4444444444444c44444444fcccccffb44bddcdcbc4fbeefbccccbbcfcccccbccccfccccccccccccccccbbeeeccccff
    ccccccfccccbfcfcfffccccccbbbbbbbbbbbbbbbbbdcccbddddddddddfbcfccfbee44444e44bee4444444dceecccfce444bddcbbbfeeeeeececccbbbcbccccccccccccccccccccceccccbeeefcfcccc
    fccccffcccccccccccbfcccccbfccbbbbbbbbbddbbbbcccbddddddddddd1bbb444ebeee44eeefe444444ecececfcce444eebddbbbeeeeeeecccccbcccbcbcccccccccfcccccfcccfcccdbfbeccccccc
    cccccffcfffcccccccccbcccccccdcccbdbbbdddbbbbccdddddddddddddddddeedebbe4ebeeee4444dffcccfcffee4444efe4ecbb4eeeeeeeebccbbcdbcbcccccccfccccccccccccccdbbceecbfcccc
    cfcccfffffccccfccccccbfffffccccbfbbbbbddbbbbfcddddddddddddddddddddebbbbefbbeb4447cfccccecce44444eefeeefbb4eeeeeeebbcb6cccbbcccccfcccccccbccccccccccbefeecebcccc
    ffccfcfccccccccccccfccccccccccccccdbbbbdbbbdbcbbdddddddddbcfdddddcd444cffbbefcbfcfccccccee444444ebeeeeecb4eeeeeeecbccccccccccccccccccccccccccccccbdbbbeecbecccc
    ffcfffccccffffcfcccccccccccccfcccccbbbbdbbbbdbdddddbbdccbbcddddbdbdd44cceeeeecfccccfccfeb444444eefebceeeb4eeeeeeef66bbccccccccccccccfffccccbcccccbe4eeeefbefcfc
    fcfffffcffcfffffffccffccbccccfbbbfcbbbfdbbbbbbddddddbbcfccdddbdddddb44fccfccccccccfccce444444beebbcdddeee4eeeeeedbbbbbccccccbcccfbcbcccccccccfccbbeccfeebeefccf
    fffffcccfffddecccffccfccccfcbbbbbbfccfcbdbbbbbbbdddddddddddbddddddfd44fceeeeccccccccfe44444eeeeefcbddbceeeeeeeeef66bbcccccbcccccfcccccccccccccccdeecbeeeeecccfc
    cfffccccffbb3bcfcfffccffcfcccbdbbbdccfdbdbbddbbbbbddddddddddddddddbc44bcccceffccccee44444eeebeeececd3bcfeeeeeeebb666bbccccccccbcfcfffccccfccfcccdbeebbbeefccfcc
    fffcccccfbcbbdccfcffccccfcccccdbbbbdbbbdbdbbddddbbbddddddddddbdddbbbd44bffffcccfeb4eb44eeeeeeeeccbcdbbccbeeeeeef6666ccccccffcebffcfccccccccccbccfbbdbbbeccccccc
    ffccccccccccbdbcccfffcccccccccddbbbbbbbbdbddbbdbbbdddddddddddccddbbbbbd4beeccccfeeeeeeeeeeeeeecccccbbbccfceeeebcb6cbbccccdbebbccfcfcccccccfccccccbcdbcbfccccccc
    fffccccfccfcbbbeccfffcccbcccccbdbbbbbdbbbbbdddbbbbdddddddddddddbbbbbbbfd4fccccfeeeeeeeeeeee4cccfccbbbcccceeeeefbccbbccccdfeecfcccccccfccccbcccccccdbffccccccccc
    ffffccfccccccbdbccfffccccccccccddbbbbbbbbbbbbbbdddbbbbbbbddddbbbbbbbdbbbfbdbeee4eeeeeeeee4bfcccbccbbbccccfeeeebbbb6ccccccccbbcbccccccccfccccccccccbbffcccccbccc
    ffffffccccfccbbdbffffcccffbcccc3dccbbbbbbbbbbbbbbbbbbccbbbbbbbbdbbbdbbbbddfbd4b444eeec44bfccccfccbdeeccccbbebbcc6b6bbccccdcdccccccfcccccccbfcccccccbccccccfcccc
    ffffcfccccccbbedbfffcccfbbdbbfc3dcccbbbbbbbbbbbbbbccccbbbcbbbbdbbddbbbbddbbbcfce444ebeffcccccbcccddbfccffbbcb6c66ccbbccccbcbccfcccfccccbccccccccccfbbcccccccccc
    ffccfcccccccebbdffccccfbbbbb1dfc3bccccbbbbbbdbbbbbbcfbbbcfbbbdbbdbbbbbddbbbcccbbd444ecccccccbbbcbdccffcfbbcbbbc6bbbbccccccfccfccccccccbccbfcccccbcccbccccfccccc
    ccfcccfccccccbbffffccccbbbbbddbfcbbccccccbbbbbdbbbbbbbbbbbbddbbbbddddddbbbccccd3cd44efccccccccccbdccccccbbbbbbb6bbccccccccbcccfcccccbbbcbccccccfbccfbcccfcccccc
    ccfcccccffccccfffcccccbbccccddbcccb3bcccccccbbbbddbbbbbbbbdbbddddddddbbbbcccbbdbccd4eccccccccccbddecbcccbbcbbbbb66ccccccccfcbfbcfccccdbffccccccbccfbccfcccccccc
    ffcccccfcccccffffcfcccbbccccccdbcccccbdbcccccbbbbdddbbdddddddddddddbbbbddcbbbdbcbbc4ecccccccbcccdbbfccccbbffbbcccbbccccccccbbbccccfccddddcfccccfccbccfcfccccfcc
    cccccccccccffccfcccccbbcccccccbccccccccbcccccbbccccccccccbbbbbbbbbbbbbbcddbddccc4eeeefccccccecfcfbcfccfcfbcbbbbcbbcbccbbcbbbbbccccccbbbbbbdfccccccbccfccccccfcc
    ccccccccfcffcfcfccccbbbbbcccccbfccccccccccfccccbbcccccccccccbbbbbccbbbcdcbddcccc4efefccccccbbcbffeecccccbbfcfffcbdebcbbbdbbbbcbccccbbbbddbbdfcccfbccccfccccfccc
    ccccccfccfffffcccccbbbfbbbcccbdccccfcccccccccccccbbbcccccccccccccbbcbcddddddccccdeeefbccccebccddbbcfcccfbbbcfcccc6bbbbcfbbbcdbcccfcc6bbbbcbbccccbcccccccccfcccc
    ccfcccccffffccfcccc3bbbfbbbbbbfcccfcfcccccccccccccccccccccccccbdbccccccdddddccccbeeeefccccbccbdbbccccccc6bccbbcfbcbbfbcbbbbb1dbccccfcccbbcccfdccbccccccfccccccc
    cccfcfffffffccccfcbd4beecfbbbfccccfcbccccccccccbbbccccccccccddccccccccbddddbccccf4eeeeefcbccbddbfcccccccbbccbcccbbfcbccbbbfdddccccccccccfcccffccccccccffcccffcf
    fcccfccccfffffccbfbbdd4bccccccccccfccccccccccccccccccccccccbcccbbcccccccdddcccccc4eeeeeeecccddbbccccffcbbcbbbfcbbfbfccbbbcddddbcccccccccccffcccccfcccffcccfffcc
    ffcccfcccffffccfccbedddbccbcccccccccccccccccccccccccccccccbbb33dbccccccccdccbcccceeeeeeeefc3ddbccccccc6fbcbbbcfbbfcbcbbbbfdddbcbccccfccccfccccccccccfffcccccccc
    ffccccbffcccccfccccbddd3bccbcccccccccccccccccccdbcccccbbddbbbcccccccccccccbbccccbf4eeeeeccccdbeffccccbcbcccbffffcfbbbcbbbdd1dbcfcccccfccccbcccfccfcfccccfcccccc
    ffffcccbccccccffcfbbbdddbccebcccccccccccccccccdbbccccccccccccccccccccccccccccccbccceeeeecccdbecccccfbbccccfffffcbbccbccccdddbbccbccfcccfccccbfccccfcccccccccccf
    cfffccccbfcccccffccbbbdddbccbbccccccccbccccccccccccccccccccfcccccccbcccfccccccbbcccdeffeebdbeccccccfbcccfcfcffbbbcccccccfdddbbcbcccccccccfccbcccccccccffccccffc
    ccfffccccffccfcfcccfccbdddebbbbccccccccccccccccccccccccccfdbbdccccccccccccccbbbccccfdfcbeddbcccccccfcfccfffffbbcbccdccccfddbbccbccccccffccfcbbccfcfcffffcccccfc
    fcffffcccffccccfcccccccfbddbdebbccccccccfccccccccccccccccbcccbdccccccccccccbbcccccbccccbdd3ecccccccccccffffcbcccccccccccfdddbbcccccfccccccccbcfffcfffffffffcfcc
    ffccfffffcfcfcccfccccccccb4dddbbbbbcccccccccccccccccccccbbccccdccccccccccbbcccccbbcccebddbbeccccccfbcccffccccccccccfcbcffdddbbbbccccfccccccbbfffccfffffccccfccf
    ffccfffccfcfffccccccccccbbbb33debececccfccfccccccbbccccccbcccbbccccccccbbccccccbcccb33ddbbbcbcfcfccccfcfffcccccccccbccccfdddbcbcccccfcfccccbbfcfcfcfffcccccccfc
    fffccffccccccccfcccfccccbbbbbbdcbdbccccccccbcccfbeccfccccbccbbbccccccbccccccccbcccbdbedbbecbccccfccccccfffccccfcccccccccfddbbfbccccccccbcccbfccbccccccffccccccc
    fffccfffffcccccfcffcccccbefbbbbbddbccccfffcccbcbcecfcfcccfbbbcfcccccccccccccbbccb3bbdc3beeecccfcccccffcccfffccffcbcccccccfdbbcbccfcfcccbccbbcccccccccfcccccffff
    ffffcffffcfffcccccccccebb7dbbbcbcccccfccccccccfccfcccccccccffccccccccccccccbeebbddccccbbeecccccccfcccfbcfffcccfcbccccfccccbdbbccccccccfcccbccccffcccfccccffffff
    ffffcffffccfcccccffcfbbbbbbdfbbbbbbcd3bcffcccfccccfccccccccccccccccccccccb3d3dddbccddbbbebccccfcfcccccbccfcfcccfcfffffccccfbdbbccfcfcccccccccccccffffccffffffff
    ffffcfcffcfccccbcccfeebbddebdbccbbeedddbeccccbcccffccccccfdcccccccccccb3dddddbbbbccbbbebccccccccccccccfbccccccccffffcfcccccfbbbbccfcccbbccccccccfccffffffffcccf
    fffffffffcfffcebfccfeebebccbdcccbbbbbddddbccbccccccccccccccbcccccccccbddddbbbbfccccbbcccfcfccfccccccccccffcccccfffffffcfcccffbcbffcccfffcfffffffccccffffffccccc
    ffffffffcffccfebdccceebeebebdebbcbeb3dbdddccccfcfcbecccccccccccccccbddddbbbbccccccbcccfcccccfccccccccccccccfcccfffcccfcfffcfcfcbccccfcccccccccccfcffffffffccccc
    ffffffffffcccfeebeffeebbebbeeeefcebbbfebfccfccffcfdd3bbbbbbbcccfb3ddd3bbbbbcccccccccccccccfccccccccccccccccbfccccfccbcfffffcccfcccfccccccfccffccccffffffffcffcc
    fffffcfccfffceeeeccfeeebbbecffcccccffcccccfffccccbdddddddcccccfddddbccccfbbffccccfcccccccffcccccbebccccccccccfcccccfccfcfffccfcccfccfcfcccfcccfccccffffffffffff
    ffffffcfcfcffceeefbfeeeebbbeffffccccccfcccfcfcfccbdddddddccceddddbccccfcbbbbacccccccccffcfccccccbcbeccccccbcccffcccccccccccfffffcccccccccfcccffffffffffffffffff
    ffffffffccfcccfeeebbbceeeecefccccccffffccfccccfcfbdbb3bcbb3d3bbfccccfbbbccccfccccfcccccccccccccebeeecccccbcccccccffccfccccccccccccccfccfffcccccfffffffffffffffc
    ffffffffccccffceeeebbbbbebbbdcfffffffccccffccfccceb4dbcccfeeeccccfccfcccccccccfcccfccfcccccccccccccccccccbcccfcccccfffffcccccccccccccffffffffffffffffffffffffcc
    ffccfffffccffffceecebbbbbbbbdcfffccfffcfccccccccccbbb3bccccceccccccccccccccccccfcccccccccccccccbbbbccccccbcccffcfccccfffffcccccffffffffffffffffffffffffffcffccc
    cccddcffffcfffffeeeeebbbbbbbdcffffffccfcccccbccccccecceccfccccccccfcccccffccfccfcccccccccccccccbbeeecccccccccccfccffccffffffffffffffffffffccffffffffffffffcccff
    ccccbcbfffffffffeefeeeebeebbdffffccccccccccccdcccccccccccfcccccccccfffcccfccccccfccccccccbccccfbccceccfccccccccccccfccfffffffffccccccccfcffccfffffffffcccccccff
    cccccccffffffffffeeefecebbbbcccccccccccccccccccffccccccccccfcbbbfcccccccfccccffccccccccccccccccfcecbccccccccfccfcccfccfcfcfcccccfcccffcfcfccccffffffcccccccffff
    ccccfffccffffffccfeeeeeeeecefcccccccffcccccfcffcfccccfffcfccbdcbbfcccccccfcfffcccccccccccfcccccccccccccccfccccccccccccfccfccccccfcccfcccfffcccfffffcccccccfcfff
    ccfcfcccccccfffffffeeeeefccccccfcbbbcfcfccfccccccccfccccccccbcccbbfffcffccccccccccccccccccfccccccccfccffccccfccccccccfcccccfbbbfcfcfccfcffffccfffffcccfcffffcff
    ffcfcccccfcccfffffffffecfccfcfcccccccbbfcccccfcfccccffccccccbcccbccccccccccccfccccccccccccbcbccccccccccfccccccccfcfffcccccfbbbbccccccccfcffcccffffccccbbfffffff
    ffffffccfcccccffffffffffffccccfcfcccccceccfccccfcccccccccccccbbbbcccccfccfccccccccffcccbccbcfcfccccccccfcfccfffccffffcccccbbccccfcccfffffcccfffffccccbbbbffffff
    ffffffffcfcccccfffffffffcfcffffffcccccccfccfccccccccccccfcccccffccccccccccccccccfccfcccccccccccfcccfccccffcccccfccccccccccccccccfcffffffcfffffffccccbbbbbbcffff
    ffffffffffcfccccfffffffffffcffffffffccccccccccccccfcccfcccccccccccccfcccccccccccccccccfccccccccccbbccccbbbccccccfcccfccffcccccccfcffffcfcffffffcfccffbbbbcfffff
    fffffffffffccccccfffffffffcfffccfffccccccffccccccfcccccfcccccccccccccffccfccccccffccccccfcfccccccccffbccccbffffcccffcfccfccccccccffffffcfffffccffcfffcbbfffffff
    ffffffffffffccccccfffffffffccfccfffcccfcbfccccccccffccccffcccccccccccfccfccccccccccccccffcccccccffccccccccccccccfffcccffccccccffffffffccccccccccccffffccfffffff
    fffffffffffffcccccfcffffffffccccffcccccccfcfcccccbcfcccfcccfffcffcccfcccfcccccccccccccfccccfcccccccccccccccfffcccffcccffcccfffffffffccccccccccccccfffffffffffff
    fffffffffffffcfccccffffffffffccfffcccccffffcccffcccfcfccccccffcccccfcccffcccccccccccccfccfcccfcccfffcfccfcccfffffffccffffffccffffffccccccccccccccccffffffffffff
    ffffffffffffffccccccfffffffffcfffcfcccccffffccfcccccfccfffffccccfffccccccccccccccccccccfcfcccfcccfccccffcfcccfffffcccfffffccccfcfffccccccccccccccffcfffffffffff
    fffffffffffffffcccccccffffffffffccfcccfcfffffffcfcccffffffffffffffccccfffccccccccccccfccccccccfcfcccfffffffcffcffcffcfffcccffcffffccccffccccccccfffffffffffffff
    fffffffffffffffffffccffffffffffccccccccfcffffffffffffffffffffffffccccccfcfcccccccccccfcccfccccccccfffffffccccccccfcccfffffffffffffccccfccccffffffffffffffffffff
    `



// ==================== COLLISION EVENTS ====================
sprites.onOverlap(SpriteKind.Player, SpriteKind.Crumb, function (plr, crumb) {
    if (!hp) return  // ← ADD THIS LINE

    hp.value = Math.min(hp.max, hp.value + 15)
    music.baDing.play()
    crumb.destroy(effects.hearts, 100)
})


function explodeEgg(egg: Sprite) {
    let directions2 = [
        [80, 0],
        [56, 56],
        [0, 80],
        [-56, 56],
        [-80, 0],
        [-56, -56],
        [0, -80],
        [56, -56],
        [40, 69],
        [-40, 69],
        [-40, -69],
        [40, -69]
    ]
    for (let l = 0; l <= 11; l++) {
        let projectile2 = sprites.createProjectileFromSprite(eggExplosion, egg, directions2[l][0], directions2[l][1])
        projectile2.setKind(SpriteKind.EnemyProjectile)
        projectile2.lifespan = 1000
    }
    egg.destroy(effects.fire, 200)
    let index2 = corruptedEggs.indexOf(egg)
    if (index2 > -1) {
        corruptedEggs.splice(index2, 1)
    }
}

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (proj, foe) {
    let isCorruptedEgg = corruptedEggs.indexOf(foe) > -1
    if (isCorruptedEgg) {
        explodeEgg(foe)
    }
    proj.destroy()
    if (!(isCorruptedEgg)) {
        let damageAmount = 1
        if (proj.data["laser"]) {
            damageAmount = 2
        }
        foe.data["hp"] -= damageAmount
        if (foe.data["hp"] <= 0) {

            soulsCollected += 1
            info.setScore(soulsCollected)
            foe.destroy(effects.disintegrate, 100)
            let index5 = enemies.indexOf(foe)
            if (index5 > -1) {
                enemies.splice(index5, 1)
            }
        }
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Crab, function (proj, crab) {
    proj.destroy()
    let damageAmount2 = 1
    if (proj.data["laser"]) {
        damageAmount2 = 2
    }
    crab.data["hp"] -= damageAmount2
    if (crab.data["hp"] <= 0) {
        // The "OOMF" Sound
        music.playTone(130, music.beat(BeatFraction.Sixteenth))

        soulsCollected += 1
        info.setScore(soulsCollected)
        crab.destroy(effects.disintegrate, 100)
        let index6 = crabs.indexOf(crab)
        if (index6 > -1) {
            crabs.splice(index6, 1)
        }
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Golem, function (proj, golem) {
    proj.destroy()
    let damageAmount3 = 1
    if (proj.data["laser"]) {
        damageAmount3 = 2
    }
    golem.data["hp"] -= damageAmount3
    if (golem.data["hp"] <= 0) {
        soulsCollected += 3
        info.setScore(soulsCollected)

        if (hasSoulBead && hp) {
            hp.value = Math.min(hp.max, hp.value + 15)
        }

        golem.destroy(effects.fire, 200)
        let index9 = golems.indexOf(golem)
        if (index9 > -1) {
            golems.splice(index9, 1)
        }
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Bubble, function (proj, bubble) {
    proj.destroy()
    explodeBubble(bubble)
})

sprites.onOverlap(SpriteKind.EnemyProjectile, SpriteKind.Player, function (proj, plr) {
    proj.destroy()
    if (shieldHits > 0) {
        music.jumpUp.play()
        shieldHits += 0 - 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 7
    }
    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {
        game.over(false, effects.melt)
        }
    }
})

sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (foe, plr) {
    if (shieldHits > 0) {
        shieldHits += 0 - 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 8
    }
    foe.destroy(effects.ashes, 100)
    let index8 = enemies.indexOf(foe)
    if (index8 > -1) {
        enemies.splice(index8, 1)
    }
    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {
        game.over(false, effects.melt)
        }
    }
})

sprites.onOverlap(SpriteKind.Crab, SpriteKind.Player, function (crab, plr) {
    if (shieldHits > 0) {
        shieldHits += 0 - 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 10
    }
    crab.destroy(effects.ashes, 100)
    let index7 = crabs.indexOf(crab)
    if (index7 > -1) {
        crabs.splice(index7, 1)
    }
    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {
        game.over(false, effects.melt)
        }
    }
})

sprites.onOverlap(SpriteKind.Golem, SpriteKind.Player, function (golem, plr) {
    if (shieldHits > 0) {
        shieldHits += 0 - 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 15
    }
    golem.destroy(effects.fire, 100)
    let index10 = golems.indexOf(golem)
    if (index10 > -1) {
        golems.splice(index10, 1)
    }
    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {

        game.over(false, effects.melt)
        }
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Bubble, function (plr, bubble) {
    explodeBubble(bubble)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.ShieldPowerup, function (plr, powerup) {
    if (shieldHits == 0) {
        shieldHits = 5
        powerup.destroy(effects.fountain, 200)
        hatSprite = sprites.create(assets.image`hat`, SpriteKind.Food)
        hatSprite.setFlag(SpriteFlag.Ghost, true)
        hatSprite.z = 100
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Exit, function (player, exit) {
    // Only allow this once and only from level 1
    if (isTransitioningLevel || currentLevel != 1) return
    isTransitioningLevel = true

    // Remove the portal so overlap can't fire again
    exit.destroy()

    // Clear all actors from level 1
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.destroy()
    }
    for (let value2 of sprites.allOfKind(SpriteKind.Crab)) {
        value2.destroy()
    }
    for (let value3 of sprites.allOfKind(SpriteKind.EnemyProjectile)) {
        value3.destroy()
    }
    for (let value4 of sprites.allOfKind(SpriteKind.Crumb)) {
        value4.destroy()
    }
    for (let value5 of sprites.allOfKind(SpriteKind.Bubble)) {
        value5.destroy()
    }

    enemies = []
    crabs = []
    corruptedEggs = []
    bubbles = []

    // Go to Level 2
    setupLevel2()
    tiles.placeOnTile(player2, tiles.getTileLocation(0, 73))
    scene.cameraFollowSprite(player2)

    isTransitioningLevel = false
})


// ==================== CONTROLLER EVENTS ====================
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (player2) {
        player2.setImage(assets.image`pipnorth`)
        facing = Facing.North
    }
})

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (player2) {
        player2.setImage(assets.image`pipsouth`)
        facing = Facing.South
    }
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (player2) {
        player2.setImage(assets.image`pipwest`)
        facing = Facing.West
    }
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (player2) {
        player2.setImage(assets.image`pipeast`)
        facing = Facing.East
    }
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (inTitleScreen) {
        inTitleScreen = false

        if (startText) {
            startText.destroy()
            startText = null
        }

        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        setupLevel1()
        return
    }

    if (!(player2)) {
        return
    }

    let speed = 800
    let vx = 0
    let vy = 0
    let proj: Sprite = null

    if (hasLaserPowerup) {
        if (facing == Facing.North) {
            proj = sprites.createProjectileFromSprite(laserVertical, player2, 0, 0 - speed)
        } else if (facing == Facing.East) {
            proj = sprites.createProjectileFromSprite(laserHorizontal, player2, speed, 0)
        } else if (facing == Facing.South) {
            proj = sprites.createProjectileFromSprite(laserVertical, player2, 0, speed)
        } else if (facing == Facing.West) {
            proj = sprites.createProjectileFromSprite(laserHorizontal, player2, 0 - speed, 0)
        }
        if (proj) {
            proj.setKind(SpriteKind.Projectile)
            proj.lifespan = 1000
            proj.setFlag(SpriteFlag.AutoDestroy, true)
            proj.data["laser"] = true
            music.zapped.play()
        }

    } else if (hasWaveShotPowerup) {
        // Wave shot upgrade - 3 projectiles in tight wave pattern
        let baseVx = 0
        let baseVy = 0
        let speed2 = 120

        if (facing == Facing.North) {
            baseVy = -speed2
        } else if (facing == Facing.South) {
            baseVy = speed2
        } else if (facing == Facing.East) {
            baseVx = speed2
        } else if (facing == Facing.West) {
            baseVx = -speed2
        }

        // Calculate angle for the facing direction
        let baseAngle = Math.atan2(baseVy, baseVx)

        // Fire 3 projectiles with tight spread
        for (let spreadIndex = -1; spreadIndex <= 1; spreadIndex++) {
            let spreadAngle = baseAngle + (spreadIndex * 0.25)  // Tight spread
            let vx = Math.cos(spreadAngle) * speed2
            let vy = Math.sin(spreadAngle) * speed2

            let waveProj = sprites.createProjectileFromSprite(img`
. . . . . . . . . . . . . . . .
. . . . . 9 9 9 9 9 . . . . . .
. . . 9 9 9 9 9 9 9 9 . . . . .
. . 9 9 9 5 5 5 5 9 9 9 . . . .
. 9 9 9 5 5 5 5 5 5 9 9 9 . . .
9 9 9 5 5 5 1 1 5 5 5 9 9 9 . .
9 9 5 5 5 1 1 1 1 5 5 5 9 9 . .
9 9 5 5 5 1 1 1 1 5 5 5 9 9 . .
9 9 9 5 5 5 1 1 5 5 5 9 9 9 . .
. 9 9 9 5 5 5 5 5 5 9 9 9 . . .
. . 9 9 9 5 5 5 5 9 9 9 . . . .
. . . 9 9 9 9 9 9 9 9 . . . . .
. . . . . 9 9 9 9 9 . . . . . .
. . . . . . . . . . . . . . . .
            `, player2, vx, vy)
            waveProj.setKind(SpriteKind.Projectile)
            waveProj.lifespan = 600
            waveProj.setFlag(SpriteFlag.AutoDestroy, true)
            music.smallCrash.play()
        }
    } else {
        if (facing == Facing.North) {
            vy = 0 - speed
        } else if (facing == Facing.East) {
            vx = speed
        } else if (facing == Facing.South) {
            vy = speed
        } else if (facing == Facing.West) {
            vx = 0 - speed
        }
        proj = sprites.createProjectileFromSprite(normalProjectile, player2, vx, vy)
        if (proj) {
            proj.setKind(SpriteKind.Projectile)
            proj.lifespan = 700
            proj.setFlag(SpriteFlag.AutoDestroy, true)
            music.pewPew.play()
        }
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (plr, powerup) {
    // 1. Turn off other weapons
    hasWaveShotPowerup = false

    // 2. Turn on Laser
    hasLaserPowerup = true

    // 3. Destroy the powerup sprite
    powerup.destroy(effects.spray, 200)
})

// ==================== UTILITY FUNCTIONS ====================
function randomPosition(): number[] {
    let cols = tiles.tilemapColumns()
    let rows = tiles.tilemapRows()
    let x = randint(2, cols - 2) * TILE_SIZE
    let y = randint(2, rows - 2) * TILE_SIZE
    return [x, y]
}

function explodeBubble(bubble: Sprite) {
    let directions = [
        [70, 0],
        [49, 49],
        [0, 70],
        [-49, 49],
        [-70, 0],
        [-49, -49],
        [0, -70],
        [49, -49]
    ]
    for (let j = 0; j <= 7; j++) {
        let projectile = sprites.createProjectileFromSprite(poisonProjectile, bubble, directions[j][0], directions[j][1])
        projectile.setKind(SpriteKind.EnemyProjectile)
        projectile.lifespan = 1500
    }
    bubble.destroy(effects.bubbles, 200)
    let index = bubbles.indexOf(bubble)
    if (index > -1) {
        bubbles.splice(index, 1)
    }
}

function spawnCrumbs(quantity: number, minDistance: number) {
    let placedCrumbs: Sprite[] = []

    for (let index3 = 0; index3 < quantity; index3++) {
        let valid = false
        let attempt = 0
        while (!valid && attempt < 20) {
            let pos = randomPosition()
            valid = true
            for (let existing of placedCrumbs) {
                let dist = Math.sqrt((existing.x - pos[0]) ** 2 + (existing.y - pos[1]) ** 2)
                if (dist < minDistance) {
                    valid = false
                    break
                }
            }
            if (valid) {
                let crumbSprite = sprites.create(crumbImage, SpriteKind.Crumb)
                crumbSprite.setPosition(pos[0], pos[1])
                placedCrumbs.push(crumbSprite)
            }
            attempt += 1
        }
    }
}

function createCorruptedEggs() {
    let portalX = tiles.tilemapColumns() * TILE_SIZE - 80
    let portalY = 80
    let eggPositions = [
        [portalX + 40, portalY],
        [portalX + 20, portalY + 35],
        [portalX - 20, portalY + 35],
        [portalX - 40, portalY],
        [portalX - 20, portalY - 35],
        [portalX + 20, portalY - 35]
    ]

    for (let k = 0; k <= 5; k++) {
        let egg = sprites.create(assets.image`corruptedEgg`, SpriteKind.Enemy)
        egg.setPosition(eggPositions[k][0], eggPositions[k][1])
        egg.setFlag(SpriteFlag.BounceOnWall, true)
        corruptedEggs.push(egg)
    }
}
// ==================== TITLE SCREEN ====================
function showTitleScreen() {
    // Play title music
    music.play(titleSong, music.PlaybackMode.LoopingInBackground)
    music.setVolume(40)

    // Standard Title Setup
    if (titleImage) {
        scene.setBackgroundImage(titleImage)
    } else {
        scene.setBackgroundColor(15)
    }

    startText = textsprite.create("Press A to start")
    startText.setOutline(1, 15)
    startText.setMaxFontHeight(8)
    startText.setPosition(80, 110)

    inTitleScreen = true
}


// ==================== LEVEL SETUP FUNCTIONS ====================
function setupLevel1() {
    music.stopAllSounds()
    music.setVolume(45)

    gameStartTime = game.runtime()
    music.play(level1Song, music.PlaybackMode.LoopingInBackground)

    currentLevel = 1
    scene.setBackgroundColor(7)
    tiles.setCurrentTilemap(tilemap`level1`)
    scene.cameraShake(4, 200)

    player2 = sprites.create(assets.image`pipeast`, SpriteKind.Player)
    controller.moveSprite(player2, 65, 65)
    player2.setStayInScreen(true)
    scene.cameraFollowSprite(player2)

    // Show dialogue FIRST, BEFORE spawning enemies
    if (!hasShownIntro) {
        hasShownIntro = true
        game.showLongText("The colors... they're all wrong. My friends don't recognize me anymore. Their eyes are empty. I'm scared, but if I don't stop this Shadow, no one will.", DialogLayout.Bottom)
    }

    // NOW set position and spawn everything AFTER dialogue
    player2.setPosition(16, tiles.tilemapRows() * TILE_SIZE - 16)

    hp = statusbars.create(20, 3, StatusBarKind.Health)
    hp.max = 100
    hp.value = 100
    hp.attachToSprite(player2, 2, 0)
    hp.setBarBorder(1, 15)

    info.setScore(soulsCollected)

    // Spawn 20 snakes
    for (let index3 = 0; index3 < 20; index3++) {
        let pos2 = randomPosition()
        let snake = sprites.create(assets.image`snake01`, SpriteKind.Enemy)
        snake.setPosition(pos2[0], pos2[1])
        snake.data["hp"] = 2
        snake.data["following"] = false
        snake.data["enemyType"] = "snake"
        snake.setFlag(SpriteFlag.BounceOnWall, true)
        enemies.push(snake)
    }

    // Spawn 25 crabs
    for (let index3 = 0; index3 < 25; index3++) {
        let pos22 = randomPosition()
        let crab = sprites.create(assets.image`crabShell`, SpriteKind.Crab)
        crab.setPosition(pos22[0], pos22[1])
        crab.data["hp"] = 6
        crab.data["following"] = false
        crab.setFlag(SpriteFlag.BounceOnWall, true)
        crabs.push(crab)
    }

    spawnCrumbs(30, 32)

    let voidPortal = sprites.create(img`
. . . . . . . . . . . . . . . .
. . . . 1 1 1 1 1 1 . . . . . .
. . . 1 1 1 1 1 1 1 1 . . . . .
. . 1 1 1 1 1 1 1 1 1 1 . . . .
. 1 1 1 1 1 1 1 1 1 1 1 1 . . .
. 1 1 1 1 1 1 1 1 1 1 1 1 . . .
. 1 1 1 1 1 1 1 1 1 1 1 1 . . .
. 1 1 1 1 1 1 1 1 1 1 1 1 . . .
. . 1 1 1 1 1 1 1 1 1 1 . . . .
. . . 1 1 1 1 1 1 1 1 . . . . .
. . . . 1 1 1 1 1 1 . . . . . .
. . . . . . . . . . . . . . . .
    `, SpriteKind.Exit)
    tiles.placeOnTile(voidPortal, tiles.getTileLocation(47, 2))

    let powerupSprite = sprites.create(img`
. . . e e e e . . .
. . e 5 5 5 5 e . .
. e 5 5 4 4 5 5 e .
e 5 5 4 5 5 4 5 5 e
e 5 4 5 5 5 5 4 5 e
e 5 4 5 5 5 5 4 5 e
e 5 5 4 4 4 4 5 5 e
. e 5 5 5 5 5 5 e .
. . e 5 5 5 5 e . .
. . . e e e e . . .
    `, SpriteKind.Food)
    tiles.placeOnTile(powerupSprite, tiles.getTileLocation(1, 2))

    createCorruptedEggs()
}



function setupLevel2() {
    music.stopAllSounds() // Stop Level 1 music
    music.play(level2Song, music.PlaybackMode.LoopingInBackground)
    currentLevel = 2

    tiles.setCurrentTilemap(tilemap`level2`)

    spawnCrumbs(25, 40)

    // Spawn 40 bats
    for (let index3 = 0; index3 < 40; index3++) {
        let pos3 = randomPosition()
        let bat = sprites.create(assets.image`bat1`, SpriteKind.Enemy)
        bat.setPosition(pos3[0], pos3[1])
        bat.data["hp"] = 2
        bat.data["following"] = false
        bat.data["enemyType"] = "bat"
        bat.setFlag(SpriteFlag.BounceOnWall, true)
        enemies.push(bat)
    }

    // Spawn 10 ghosts
    for (let index3 = 0; index3 < 10; index3++) {
        let pos4 = randomPosition()
        let ghost = sprites.create(assets.image`ghost`, SpriteKind.Enemy)
        ghost.setPosition(pos4[0], pos4[1])
        ghost.data["hp"] = 5
        ghost.data["following"] = false
        ghost.data["enemyType"] = "ghost"
        ghost.setFlag(SpriteFlag.BounceOnWall, true)
        enemies.push(ghost)
    }

    // Spawn 15 bubbles
    for (let index3 = 0; index3 < 15; index3++) {
        let validSpawn = false
        let attempts = 0
        while (!validSpawn && attempts < 30) {
            let pos5 = randomPosition()
            let loc = tiles.getTileLocation(Math.floor(pos5[0] / 16), Math.floor(pos5[1] / 16))
            if (loc && !(tiles.tileAtLocationIsWall(loc))) {
                let bubble = sprites.create(assets.image`bubble`, SpriteKind.Bubble)
                bubble.setPosition(pos5[0], pos5[1])
                bubble.data["hp"] = 1
                bubble.setFlag(SpriteFlag.BounceOnWall, true)
                bubbles.push(bubble)
                validSpawn = true
            }
            attempts += 1
        }
    }

    


    let shieldPowerup = sprites.create(assets.image`hat`, SpriteKind.ShieldPowerup)
    tiles.placeOnTile(shieldPowerup, tiles.getTileLocation(67, 70))

    // Reset mimic state for Level 2
    mimicActivated = false
    mimicSprite = null

    // Create fake treasure chest (Mimic) at tile [16, 71]
    mimicSprite = sprites.create(img`
. . . . . . . . . . . . . . . .
. . e e e e e e e e e e e . . .
. e e 5 5 5 5 5 5 5 5 5 e e . .
. e 5 5 5 5 5 5 5 5 5 5 5 e . .
. e 5 5 f f 5 5 5 5 f f 5 e . .
. e 5 5 f f 5 5 5 5 f f 5 e . .
. e 5 5 5 5 5 5 5 5 5 5 5 e . .
. e 5 5 5 5 5 5 5 5 5 5 5 e . .
. e 5 5 5 f f f f f 5 5 5 e . .
. e 5 5 5 5 5 5 5 5 5 5 5 e . .
. e e 5 5 5 5 5 5 5 5 5 e e . .
. . e e e e e e e e e e e . . .
. . . . . . . . . . . . . . . .
    `, SpriteKind.Mimic)
    tiles.placeOnTile(mimicSprite, tiles.getTileLocation(16, 71))
    mimicSprite.data["hp"] = 15
    mimicSprite.data["lastShot"] = 0
    mimicSprite.data["isTreasure"] = true  // Starts as treasure chest

    let soulRock = sprites.create(assets.tile`soulrock`, SpriteKind.SoulRock)
    tiles.placeOnTile(soulRock, tiles.getTileLocation(8, 29))
    soulRock.data["hp"] = 3  // Takes 3 hits to break
    soulRock.z = 5
}




// ==================== DINO AI ====================
function dinoAI() {
    for (let dino of dinos) {
        if (!dino || !player2) continue

        // Simple chase movement
        let dx = player2.x - dino.x
        let dy = player2.y - dino.y
        let dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 10) {
            let speed = 25
            dino.vx = (dx / dist) * speed
            dino.vy = (dy / dist) * speed

            // Update animation based on direction
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && dino.data["direction"] != "right") {
                    animation.runImageAnimation(
                        dino,
                        assets.animation`dinoright`,
                        200,
                        true
                    )
                    dino.data["direction"] = "right"
                } else if (dx < 0 && dino.data["direction"] != "left") {
                    animation.runImageAnimation(
                        dino,
                        assets.animation`dinoleft`,
                        200,
                        true
                    )
                    dino.data["direction"] = "left"
                }
            }
        }

        // Spike attack every 2 seconds
        let now = game.runtime()
        if (!dino.data["lastSpikeShot"]) dino.data["lastSpikeShot"] = now

        if (now - dino.data["lastSpikeShot"] > 2000) {
            dino.data["lastSpikeShot"] = now

            // Shoot 4 spikes in cardinal directions
            let dirs = [[0, -60], [60, 0], [0, 60], [-60, 0]]
            for (let dir of dirs) {
                let spike = sprites.createProjectileFromSprite(dinoSpike, dino, dir[0], dir[1])
                spike.setKind(SpriteKind.EnemyProjectile)
                spike.lifespan = 2000
            }
        }
    }
}


// Call dino AI every 500ms (not 100ms)
game.onUpdateInterval(500, function () {
    if (currentLevel == 3 && player2) {
        dinoAI()
    }
})



// ==================== BOSS AI ====================
function bossAI() {
    if (!bossSprite || !player2) return

    let now = game.runtime()

    // Initialize attack timers
    if (!bossSprite.data["lastFireball"]) {
        bossSprite.data["lastFireball"] = now
    }
    if (!bossSprite.data["lastWindBlast"]) {
        bossSprite.data["lastWindBlast"] = now
    }
    if (!bossSprite.data["lastFireRing"]) {
        bossSprite.data["lastFireRing"] = now
    }

    if (bossPhase == 1) {
        // PHASE 1: Stationary but shoots projectiles

        // Attack 1: Rapid Fireballs every 800ms (aim at player)
        if (now - bossSprite.data["lastFireball"] > 800) {
            bossSprite.data["lastFireball"] = now

            let dx = player2.x - bossSprite.x
            let dy = player2.y - bossSprite.y
            let angle = Math.atan2(dy, dx)

            // Fire 3 fireballs in a spread
            for (let offset of [-0.2, 0, 0.2]) {
                let fireAngle = angle + offset
                let vx = Math.cos(fireAngle) * 80
                let vy = Math.sin(fireAngle) * 80

                let fireball = sprites.createProjectileFromSprite(fireDart, bossSprite, vx, vy)
                fireball.setKind(SpriteKind.EnemyProjectile)
                fireball.lifespan = 3000
            }
        }

        // Attack 2: Wind Blasts every 1500ms (bounces off walls)
        if (now - bossSprite.data["lastWindBlast"] > 1500) {
            bossSprite.data["lastWindBlast"] = now

            // Fire 4 wind blasts in cardinal directions
            let windDirs = [[80, 0], [0, 80], [-80, 0], [0, -80]]
            for (let dir of windDirs) {
                let wind = sprites.createProjectileFromSprite(windWave, bossSprite, dir[0], dir[1])
                wind.setKind(SpriteKind.EnemyProjectile)
                wind.lifespan = 5000
                wind.setFlag(SpriteFlag.BounceOnWall, true)
            }
        }

        // Attack 3: Fire Ring every 2500ms (circle of fire)
        if (now - bossSprite.data["lastFireRing"] > 2500) {
            bossSprite.data["lastFireRing"] = now

            // Create ring of 8 fireballs
            for (let i = 0; i < 8; i++) {
                let angle = (i / 8) * Math.PI * 2
                let vx = Math.cos(angle) * 60
                let vy = Math.sin(angle) * 60

                let fire = sprites.createProjectileFromSprite(fireArc, bossSprite, vx, vy)
                fire.setKind(SpriteKind.EnemyProjectile)
                fire.lifespan = 4000
            }
        }

    } else if (bossPhase == 2) {
        // PHASE 2: FAST MOVING + SUPER AGGRESSIVE ATTACKS

        // Boss aggressively chases player
        let dx = player2.x - bossSprite.x
        let dy = player2.y - bossSprite.y
        let dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 30) {
            let speed = 30  // Fast movement
            bossSprite.vx = (dx / dist) * speed
            bossSprite.vy = (dy / dist) * speed
        } else {
            bossSprite.vx = 0
            bossSprite.vy = 0
        }

        // Attack 1: RAPID Fireballs every 500ms (much faster!)
        if (now - bossSprite.data["lastFireball"] > 500) {
            bossSprite.data["lastFireball"] = now

            let angle = Math.atan2(dy, dx)

            // Fire 5 fireballs in a WIDE spread
            for (let offset of [-0.4, -0.2, 0, 0.2, 0.4]) {
                let fireAngle = angle + offset
                let vx = Math.cos(fireAngle) * 100
                let vy = Math.sin(fireAngle) * 100

                let fireball = sprites.createProjectileFromSprite(fireDart, bossSprite, vx, vy)
                fireball.setKind(SpriteKind.EnemyProjectile)
                fireball.lifespan = 3000
            }
        }

        // Attack 2: CHAOS Wind Blasts every 900ms (8 directions!)
        if (now - bossSprite.data["lastWindBlast"] > 900) {
            bossSprite.data["lastWindBlast"] = now

            // Fire 8 wind blasts in ALL directions - TOTAL CHAOS
            for (let i = 0; i < 8; i++) {
                let angle = (i / 8) * Math.PI * 2
                let vx = Math.cos(angle) * 90
                let vy = Math.sin(angle) * 90

                let wind = sprites.createProjectileFromSprite(windWave, bossSprite, vx, vy)
                wind.setKind(SpriteKind.EnemyProjectile)
                wind.lifespan = 6000
                wind.setFlag(SpriteFlag.BounceOnWall, true)  // Bounces everywhere!
            }
        }

        // Attack 3: DOUBLE Fire Ring every 1800ms (INSANE)
        if (now - bossSprite.data["lastFireRing"] > 1800) {
            bossSprite.data["lastFireRing"] = now

            // Create TWO ROTATING rings of fireballs
            for (let ring = 0; ring < 2; ring++) {
                for (let i = 0; i < 12; i++) {
                    let angle = (i / 12) * Math.PI * 2 + (ring * 0.3)
                    let speed = 50 + (ring * 25)
                    let vx = Math.cos(angle) * speed
                    let vy = Math.sin(angle) * speed

                    let fire = sprites.createProjectileFromSprite(fireArc, bossSprite, vx, vy)
                    fire.setKind(SpriteKind.EnemyProjectile)
                    fire.lifespan = 4000
                }
            }
        }
    }
}

function minionAI() {
    if (!bossSprite) {
        // If boss is dead, destroy all minions
        for (let minion of minions) {


            
            if (minion) minion.destroy(effects.fire, 100)
        }
        minions = []
        return
    }

    let now = game.runtime()

    for (let minion of minions) {
        if (!minion) continue

        // Update angle for orbital motion
        minion.data["angle"] += minion.data["orbitSpeed"]

        // Calculate position in circle around boss
        let x = bossSprite.x + Math.cos(minion.data["angle"]) * minion.data["orbitRadius"]
        let y = bossSprite.y + Math.sin(minion.data["angle"]) * minion.data["orbitRadius"]

        // Smoothly move to orbital position
        minion.x = x
        minion.y = y

        // Shoot black flames at player every 1500ms
        if (now - minion.data["lastShot"] > 1500) {
            minion.data["lastShot"] = now

            if (player2) {
                let dx = player2.x - minion.x
                let dy = player2.y - minion.y
                let dist = Math.sqrt(dx * dx + dy * dy)

                if (dist > 0) {
                    let speed = 60
                    let vx = (dx / dist) * speed
                    let vy = (dy / dist) * speed

                    let flame = sprites.createProjectileFromSprite(blackFlame, minion, vx, vy)
                    flame.setKind(SpriteKind.EnemyProjectile)
                    flame.lifespan = 3000
                }
            }
        }
    }
}


function setupLevel3() {
    music.stopAllSounds()
    music.play(level3Song, music.PlaybackMode.LoopingInBackground)
    currentLevel = 3
    tiles.setCurrentTilemap(tilemap`level3`)
    scene.setBackgroundColor(2)
    spawnCrumbs(15, 40)

    // Spawn 10 Golems - IMAGE asset
    for (let index = 0; index < 10; index++) {
        let pos = randomPosition()
        let golem = sprites.create(assets.image`Golem`, SpriteKind.Golem)
        golem.setPosition(pos[0], pos[1])
        golem.data["hp"] = 12
        golem.data["following"] = false
        golem.setFlag(SpriteFlag.BounceOnWall, true)
        golems.push(golem)
    }

    // Spawn 8 Dinos
    for (let index = 0; index < 8; index++) {
        let pos = randomPosition()
        let dino = sprites.create(assets.image`Dino`, SpriteKind.Dino)
        dino.setPosition(pos[0], pos[1])
        dino.data["hp"] = 8
        dino.data["lastSpikeShot"] = 0
        dino.data["direction"] = "right"
        dinos.push(dino)
    }

    //revival bean powerup
    let revivalBean = sprites.create(revivalBeanImage, SpriteKind.RevivalBean)
    tiles.placeOnTile(revivalBean, tiles.getTileLocation(64, 41))
    revivalBean.z = 10

    // Speed Bean powerup at tile (67, 30)
    let speedBean = sprites.create(speedBeanImage, SpriteKind.SpeedBean)
    tiles.placeOnTile(speedBean, tiles.getTileLocation(67, 30))
    speedBean.z = 10


    // Lava Boots powerup at tile (73, 73)
    let lavaBoots = sprites.create(lavaBootsImage, SpriteKind.LavaBoots)
    tiles.placeOnTile(lavaBoots, tiles.getTileLocation(73, 73))
    lavaBoots.z = 10
}




// ==================== BOSS LEVEL SETUP ====================
function setupBossLevel1() {
    music.stopAllSounds()
    music.play(bossSong, music.PlaybackMode.LoopingInBackground)

    currentLevel = 4
    inBossFight = true
    bossPhase = 1

    // Clear Level 3 actors
    for (let g of golems) g.destroy()
    for (let d of dinos) d.destroy()
    golems = []
    dinos = []

    tiles.setCurrentTilemap(tilemap`BossLevel1`)
    scene.setBackgroundColor(0)

    // Spawn player at tile (12, 22)
    tiles.placeOnTile(player2, tiles.getTileLocation(12, 22))
    scene.cameraFollowSprite(player2)

    // Spawn boss at center (12, 11) - STATIONARY
    bossSprite = sprites.create(bossForm1, SpriteKind.Boss)
    tiles.placeOnTile(bossSprite, tiles.getTileLocation(12, 11))
    bossSprite.data["hp"] = 150
    bossSprite.data["phase"] = 1
    bossSprite.data["dialogShown"] = false  // Track if dialog shown
    bossSprite.data["fightStarted"] = false  // Fight hasn't started yet

    // Boss HP bar (hidden until fight starts)
    bossHP = statusbars.create(60, 4, StatusBarKind.EnemyHealth)
    bossHP.max = 150
    bossHP.value = 150
    bossHP.attachToSprite(bossSprite, 0, 0)
    bossHP.setBarBorder(1, 2)
    bossHP.setFlag(SpriteFlag.Invisible, true)  // Hide HP bar until fight starts
}


function setupBossLevel2() {
    music.stopAllSounds()
    music.play(bossSong, music.PlaybackMode.LoopingInBackground)

    currentLevel = 5
    inBossFight = true
    bossPhase = 2

    // Change to boss level 2 tilemap (more lava)
    tiles.setCurrentTilemap(tilemap`BossLevel2`)
    scene.setBackgroundColor(2)
    scene.cameraShake(6, 1000)

    // Spawn player
    let spawnX = Math.floor(tiles.tilemapColumns() / 2)
    let spawnY = Math.floor(tiles.tilemapRows() / 2) + 5
    tiles.placeOnTile(player2, tiles.getTileLocation(spawnX, spawnY))
    scene.cameraFollowSprite(player2)

    // Spawn PHASE 2 BOSS
    let bossX = Math.floor(tiles.tilemapColumns() / 2)
    let bossY = Math.floor(tiles.tilemapRows() / 2) - 5

    bossSprite = sprites.create(bossForm2, SpriteKind.Boss)
    tiles.placeOnTile(bossSprite, tiles.getTileLocation(bossX, bossY))
    bossSprite.data["hp"] = 200
    bossSprite.data["phase"] = 2
    bossSprite.data["fightStarted"] = true

    // Boss HP bar
    bossHP = statusbars.create(80, 6, StatusBarKind.EnemyHealth)
    bossHP.max = 200
    bossHP.value = 200
    bossHP.attachToSprite(bossSprite, 0, 0)
    bossHP.setBarBorder(1, 2)
    bossHP.setColor(2, 15)

    // SPAWN 10 FLAME WISP MINIONS IN A CIRCLE
    minions = []  // Clear any old minions
    for (let i = 0; i < 10; i++) {
        let minion = sprites.create(flameWisp, SpriteKind.Enemy)
        minion.data["hp"] = 3  // Low HP
        minion.data["angle"] = (i / 10) * Math.PI * 2  // Position in circle
        minion.data["orbitSpeed"] = 0.05  // Rotation speed
        minion.data["orbitRadius"] = 50  // Distance from boss
        minion.data["lastShot"] = 0
        minions.push(minion)
    }

    // Show warning text
    game.showLongText("PHASE 2: THE DEMON TURTLE AWAKENS!", DialogLayout.Top)
}



function showBossCutscene() {
    // Destroy first boss form with effect
    if (bossSprite) {
        bossSprite.destroy(effects.fire, 1000)
    }
    if (bossHP) {
        bossHP.destroy()
    }

    // Stop player movement during cutscene
    player2.vx = 0
    player2.vy = 0

    // Camera shake
    scene.cameraShake(8, 2000)

    // Wait for explosion effect
    pause(1500)

    // Show cutscene text
    game.showLongText("The Guardian falls...", DialogLayout.Top)
    pause(500)
    game.showLongText("But something stirs in the depths below...", DialogLayout.Top)
    pause(500)

    // Transition to Phase 2
    pause(1000)
    inBossFight = true  // Re-enable boss AI for phase 2
    setupBossLevel2()
}



// ==================== GAME UPDATE LOOPS ====================
game.onUpdateInterval(100, function () {
    if (hatSprite && player2) {
        hatSprite.setPosition(player2.x, player2.y - 10)
    }
})

game.onUpdateInterval(1000, function () {
    if (!player2 || inTitleScreen) return

    let elapsedMs = game.runtime() - gameStartTime
    let elapsedSeconds = Math.floor(elapsedMs / 1000)
    let minutes = Math.floor(elapsedSeconds / 60)
    let seconds = elapsedSeconds % 60

    let timeString = "" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds

    if (!timerText) {
        timerText = textsprite.create(timeString, 0, 15)
        timerText.setFlag(SpriteFlag.RelativeToCamera, true)
        timerText.setPosition(135, 5)
        timerText.z = 1000
    } else {
        timerText.setText(timeString)
    }
})

// ==================== MIMIC MECHANICS ====================

// Mimic transformation when player gets close
game.onUpdate(function () {
    if (mimicSprite && !mimicActivated && mimicSprite.data["isTreasure"]) {
        let distToPlayer = Math.abs(mimicSprite.x - player2.x) + Math.abs(mimicSprite.y - player2.y)
        if (distToPlayer < 40) {
            // Transform into mimic!
            mimicActivated = true
            mimicSprite.data["isTreasure"] = false
            mimicSprite.setImage(img`
. . . . . . . . . . . . . . . .
. . . f f f f f f f f f . . . .
. . f 5 5 5 5 5 5 5 5 5 f . . .
. f 5 5 f f f f f f f 5 5 f . .
. f 5 f 1 1 1 1 1 1 1 f 5 f . .
. f 5 f 1 2 2 2 2 2 1 f 5 f . .
. f 5 f 1 2 2 2 2 2 1 f 5 f . .
. f 5 f 1 2 2 2 2 2 1 f 5 f . .
. f 5 f 1 1 1 1 1 1 1 f 5 f . .
. f 5 5 f f f f f f f 5 5 f . .
. . f 5 5 5 5 5 5 5 5 5 f . . .
. . . f f f f f f f f f . . . .
. . . . . . . . . . . . . . . .
            `)
            effects.confetti.startScreenEffect(500)
        }
    }
})

// Mimic shooting pattern - fast half-moon projectiles
game.onUpdateInterval(400, function () {
    if (mimicSprite && mimicActivated && !mimicSprite.data["isTreasure"]) {
        let currentTime = game.runtime()
        if (currentTime - mimicSprite.data["lastShot"] > 350) {
            mimicSprite.data["lastShot"] = currentTime

            // Calculate angle to player
            let dx = player2.x - mimicSprite.x
            let dy = player2.y - mimicSprite.y
            let angle = Math.atan2(dy, dx)

            // Fire 3 projectiles in a wave pattern
            for (let i = -1; i <= 1; i++) {
                let spreadAngle = angle + (i * 0.3)  // 0.3 radian spread
                let vx = Math.cos(spreadAngle) * 80
                let vy = Math.sin(spreadAngle) * 80

                let proj = sprites.createProjectileFromSprite(img`
. . . . . . . . . . . . . . . .
. . . . . 1 1 1 1 1 . . . . . .
. . . 1 1 1 1 1 1 1 1 . . . . .
. . 1 1 1 1 1 1 1 1 1 1 . . . .
. 1 1 1 1 9 9 9 9 1 1 1 1 . . .
1 1 1 1 9 9 9 9 9 9 1 1 1 1 . .
1 1 1 9 9 9 9 9 9 9 9 1 1 1 . .
1 1 1 9 9 9 9 9 9 9 9 1 1 1 . .
1 1 1 1 9 9 9 9 9 9 1 1 1 1 . .
. 1 1 1 1 9 9 9 9 1 1 1 1 . . .
. . 1 1 1 1 1 1 1 1 1 1 . . . .
. . . 1 1 1 1 1 1 1 1 . . . . .
. . . . . 1 1 1 1 1 . . . . . .
. . . . . . . . . . . . . . . .
                `, mimicSprite, vx, vy)
                proj.setKind(SpriteKind.EnemyProjectile)
            }
        }
    }
})

// Mimic takes damage
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Mimic, function (proj, mimic) {
    if (mimic.data["isTreasure"]) {
        // Don't damage treasure chest form
        return
    }

    proj.destroy()
    let damageAmount = 1
    if (proj.data["laser"]) {
        damageAmount = 2
    }

    mimic.data["hp"] -= damageAmount

    if (mimic.data["hp"] <= 0) {
        mimic.destroy(effects.disintegrate, 200)

        // Drop wave shot powerup!
        let wavePowerup = sprites.create(img`
. . . . . . . . . . . . . . . .
. . . . 8 8 8 8 8 8 . . . . . .
. . . 8 8 9 9 9 9 8 8 . . . . .
. . 8 8 9 9 9 9 9 9 8 8 . . . .
. 8 8 9 9 5 5 5 5 9 9 8 8 . . .
. 8 9 9 5 5 5 5 5 5 9 9 8 . . .
. 8 9 9 5 5 1 1 5 5 9 9 8 . . .
. 8 9 9 5 5 1 1 5 5 9 9 8 . . .
. 8 9 9 5 5 5 5 5 5 9 9 8 . . .
. 8 8 9 9 5 5 5 5 9 9 8 8 . . .
. . 8 8 9 9 9 9 9 9 8 8 . . . .
. . . 8 8 9 9 9 9 8 8 . . . . .
. . . . 8 8 8 8 8 8 . . . . . .
. . . . . . . . . . . . . . . .
        `, SpriteKind.WavePowerup)
        wavePowerup.setPosition(mimic.x, mimic.y)
        wavePowerup.setVelocity(0, 30)  // Float down

        // Add souls for killing mimic (worth 3!)
        soulsCollected += 3
        info.setScore(soulsCollected)

        mimicSprite = null
    }
})

// Player collects wave shot powerup
sprites.onOverlap(SpriteKind.Player, SpriteKind.WavePowerup, function (player, powerup) {
    // 1. Turn off other weapons
    hasLaserPowerup = false

    // 2. Turn on Wave Shot
    hasWaveShotPowerup = true

    // 3. Visuals and Sound
    powerup.destroy(effects.warmRadial, 200)
    music.powerUp.play()
})

// ==================== DINO COLLISION HANDLERS ====================
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Dino, function (proj, dino) {
    proj.destroy()
    let damageAmount = 1
    if (proj.data["laser"]) {
        damageAmount = 2
    }
    dino.data["hp"] -= damageAmount
    if (dino.data["hp"] <= 0) {
        soulsCollected += 2
        info.setScore(soulsCollected)

        if (hasSoulBead && hp) {
            hp.value = Math.min(hp.max, hp.value + 10)
        }

        dino.destroy(effects.disintegrate, 100)
        let index = dinos.indexOf(dino)
        if (index > -1) {
            dinos.splice(index, 1)
        }
    }
})

sprites.onOverlap(SpriteKind.Dino, SpriteKind.Player, function (dino, plr) {
    if (shieldHits > 0) {
        shieldHits -= 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 12
    }
    dino.destroy(effects.ashes, 100)
    let index = dinos.indexOf(dino)
    if (index > -1) {
        dinos.splice(index, 1)
    }
    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {
        game.over(false, effects.melt)
        }
    }
})

sprites.onOverlap(SpriteKind.WindWave, SpriteKind.Player, function (wave, plr) {
    wave.destroy()
    if (shieldHits > 0) {
        music.jumpUp.play()
        shieldHits -= 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 10
    }
    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {
        game.over(false, effects.melt)
        }
    }
})

// ==================== BOSS COLLISION HANDLERS ====================
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (proj, boss) {

    // Only damage boss if fight has started
    if (!boss.data["fightStarted"]) {
        proj.destroy()  // Destroy projectile but don't damage boss
        return  // Exit early
    }

    proj.destroy(effects.starField, 50)
    let damageAmount = 1
    if (proj.data["laser"]) {
        damageAmount = 3
    }
    boss.data["hp"] -= damageAmount
    bossHP.value = boss.data["hp"]

    // Visual feedback
    scene.cameraShake(2, 100)

    if (boss.data["hp"] <= 0) {
        if (bossPhase == 1) {
            // Phase 1 defeated - show cutscene
            inBossFight = false  // Pause AI during cutscene
            showBossCutscene()
        } else if (bossPhase === 2) {
            // Phase 2 defeated - WIN WITH VICTORY IMAGE!
            inBossFight = false
            music.stopAllSounds()

            // Destroy all remaining minions
            for (let minion of minions) {
                minion.destroy(effects.fire, 100)
            }
            minions = []

            // Destroy boss
            boss.destroy(effects.disintegrate, 500)
            if (bossHP) {
                bossHP.setFlag(SpriteFlag.Invisible, true)
            }

            scene.setBackgroundColor(0)  // Black background

            pause(800)  // Wait for boss to finish dying

            // ✅ SHOW VICTORY IMAGE (paste your victory image here!)
            pause(500)



            let victoryImage = img`fffffffffffffffffffffffffffffffffffffffffffffffffffffcfffffffffcccccccccccccccccccccccccccbbbbb999999999999999999999999999999999999999999999992222444445555557777777777777777555555444442222d99999999999999999999999999999
fffffffffffffffffffffffffffffffffffffffffffffffffffffccfffffffccccccccccccccccccccccccccbeeebbe99999999999999999999999999999999999999999999de22244444555577777766666666666677777755555444422229999999999999999999999999999
fffffffffffffffffffffffffffffffffffffffffffffffffffffcccfffffcccccccccccccccccccccccccccbbcccccb99999999999999999999999999999999999999999932224444555577777666668888888888666666777755554444222e99999999999999999999999999
fffffffffffffffffffffffffffffffffffffffffffffffffffcccccfffccccccccccccccccccccccccccccccbbeeeeeb99999999999999999999999999999999999999993222444555777776666688888aaaaaaa8888666667777755544442249999999999999999999999999
ffffffffffffffffffffffffffffffffffffffffffffffffffffcccfffccccccccccccccccccccccccccccccccbbccccc99999999999999999999999999999999999999bb2224455777776666888aaaaaaaaaaaaaaaaaaa8866666777755444224b99999999999999999999999
fffffffffffffffffffffffffffffffffffffffffffccffffffccccfffccccccccccbbeeeeeeeeeeeeeeecccccccbcccc9999999999999999999999999999999999999b22244555777666688aaaaabbba99999999abbbaaaaa88666677775544222b9999999999999999999999
fffffffffffffffccccfffffffffffffffffffcccccccccfffccccffffffffcccccbbbeeeeeeeeeeeeeeebccccccccccc999999999999999999999999999999999999e2244455777666888aaaabbb999999999999999999baaaa8886667775554422e999999999999999999999
fffffffffffffffccccffffffffffffffffffcccccccccccccccccfffffffffffcccbbbeeeeeeeeeeeeeecbcccccccccc99999999999999999999999999999999999e224445557766888aaab999999999999999999999999999aaa8888667775544422e9999999999999999999
fffffffffffffffcccccffffffffffffffffccccccccccccccccccfffffffffffffffbbeeeeeeeeeeffffcffffffffffcffffffffffffffffffffffffff9ffffffffffff5557f66888aaac999999999999999999999999999999baaa888667775544422e999999999999999999
fffffffffffffffcccccffffffffffffffffccccccccccccccccccfffcfffffffffffccccccfcccccf11fcc1cd11111ffc111ff11111bf11111ff11111fff11fc1cf111f55776688aaac9999999999999999999999999c99999999aaaa88866775544422e9999999999999c999
fffffffffffffffccccccfffffffffffffffcccccccccccccccccccccccffffffffffcccccffcccccf11fcc1cff11fffc1cf11fff11ffd1fff11f1dff11ff11fc1cf111f5766688aac999999999999999999999999999dd9999999999ca88866775544422e999999999999c999
ffffffffffffffccccccccffffffffffffffccccccccccccccccccccccccffffffffffcccfffcccccf11ffc1ccf11fcf1bcffff9f11ccd1f9f11f1dbf11ff11fc1cf111f776688aa99999999999999999999999999999ddddddd999999aaa8886775554422b999999999dddd99
ffffffffffffffcccfccccffffffffffffffcffcccccccccccccccccccccffffffffffffffcccccccf111f11ccf11fcf1bb99999f11ccd1f9f11f1dfd11fff111bff11ff6668aac999999999999999999999999999999dddddddddddddddcc8866765554422bdddddddddddd99
fffffffffffffffccfcfcccfffffffffffffcffcccccccccccccccffffffffccfffffffcccffcccccff1111bfcf11fcf1bc99999f11ccd1f9f11f1111fff9ff11f4f11f6668aa99999999999999999999999999999999ddcdcdcddddddddddddddddddddddddddddddddcbdd99
fffffffffffffffccccffccffffffffffffccfffcccccccccccccfffffffffffccfffffcfffffcccccf1111bccf11fcf1bcffff9f11ccd1fdf11f1111ff99df11e5fd1f668aab99999999999999999999999999999999ddcdccdcbbdccddddddddddddddddddddcdcdcdbddd99
fffffffffffffffcccccfccfffffffffffccfffffccccccccccccccffffffffffffffffffffffcccccffd1bffcc11ccfcdbc1df9f11ccb1ccc1df1db11cf92f1de5fccf68aab999999999999999999999999999999999ddcbccdcccdcddddbdbdccbdcbbcbbbccdccbcdcbdd66
fffffffffffffffffcccfccfffffffffffccfffffccccccccccccccfffffffffffffffffffffffcccccffbfcfccbcccfcfcccff6fcccbfcccccffbccbccfb2fcce5fccf8aab9999999999999999999999999999999999ddbdbbbbbbdcbddbbdcdccbdcbdcdbbccdccdcdbddcff
ffffffffffffcffffcccfccffffffffffffcccfffcccccccccccccccfffffffffffffffffffffccccccccccccccccccbbcccfffffffffffffbbb6bb9bbbe22e47776688aab99999999999999999999999999999999999bddddddddddccddbcdbbdcddcddcdbdcdbdddddddefff
ffffffccffffffcfffccffccfffffffffffcccccccccccccccccccccfffffffffffffffffffffcccccccccccccccccccbbcbffffffffffffffffffffffe22445576688aa9999999999999999999999999999999999999c99ddbdddddddddddddddccdccddddddddddddde6efff
ffffffcecfffffcccccccfccfffffffffffffcccccccccccccccccccffffffffffffffffffffffccccccccccccccccccbbcbbfffffffffffffff77ffff22445577688aa9999999fffff99999999999999999999999999c9999997fffffffddddddddddddddddddd442efffefff
ffffffffffffffccecccccccfffffffffffffcccccccccccccccccccfffffffffffffffffffffccccccccccccccccccbbbccbbffffffffffffff77fffe2444557668aacffffffffffffffffff99999999999999999999c999fffffffffffffffffffffca88667554442fffefff
fffffffffffffffceeecfcccfffffffffffffccccccccccccccccccccffffffffffffffffffffcccccccceecccccceeebbcccbffffffffffffff7777722445577688acffffffffffffffffffffffff999999999999999cffffffffffffffffffffffffcaa8867755442effefff
ffffffffffffffffeeecfccccffffffffffffccccccccccccccccccccffffffffffffffffffffccccccceeeeeeecceebbccccbbffffffff7ffff777677777577688acfffffffffffffffffffffffffffffff999996fffefffffffffffffffffffffffffcaa8677755442efefff
fffffffffffffffffeefcceeeeffffffffffccccccccccccccccccccffffffffffffffffffffccccccceeeeeeeeeeeebbbccccbff77ff77777fff77ffff77577668ccffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffca8667f55442efefff
ffffffffffffffffffffcceeecffffffffffcccccccccccccccccccccfffffffffffffffffffcccccceeeeeeeeeeeeeebcccccbfff76fff777ff77ffffff77766fffffff7ffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffeca8667755442eef77
fffffffffffffffffffffceeeecffffffffffccccccccccccccccccccffffffffffffffffffffccccceeeeeeeeeeeeeeeeeeeebffff6ffff77ffffffffff77777677fffff77ffffffffffffffffffffffffffffffffffefffffffffffffffffffffffffffecc8667f744eee777
fffffffffffffffffffffeeeeeefffffffffffccccccfccccccccccccffffffffffffffffffffcccceeeeeeeeeeeeeeeeeeeeebffffffffff67ffff67ffff7766777fffffff76ffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffccf777667c77e7ff
fffffffffeeffffffffffceeeeefffffffffffffccfffccccccccccccffffffffffffffccccccccccceeeeeeeeeeeeecccccccbfffffffffff676fff6fffff6f6ff6ffffff677777776666666ffffffffffffffffffffefffffffffffffffffffffff6666ffff677767776eeff
ffffffffffffffffffffffeeeeeffffffffffffffffffcccccccccccffffffffffffffffccccccccccceeeeeeeeeeeeeeeeeeebfffffffffffff7fffffffffffff67ff7f7777777777777777777777777ffffffffffffefffffffffffff777fffff777776fffff776ff776efff
ffffffffffeffffffefffffeeeeeffffffffffffffffffcccccccccccfffffffffffffffffffccccccceeeeeeeeeeeeeeeeeeeb7fffffffffffffffffffffffffff777777777777777777777777777777777fffffffffefff7ff7f7ff7555576ffff7ffffffffeefffffffefff
cccffffffceffffffeefffffeeeecfffffffffffffffffcccccccccccfffffffffff74555447fccccccceeeeeeeeeeeeeeeeeebb7fffffffffffffff77ffffffffffff7777777777777777777777757777777777f7667e7f77777777755f5557677fffffffffceecffffffe7ff
fccccfccccceffffceefffffffeeefffffffffffffffffccccccccccccffffffffe5555555555ecccccceeeeeeeeeeeeeeeeeeebc77fffffffffffff777fffffffff777777777777777777777777f7777777777777777e77777777777555544e77ff77fffff45feef77f67e77f
ffcecfccccccefceceeefffffffcefffffffffffffffffccccccccccccfffffff5555555555d55fccccceeeeeeeeeeeeeeeeeeebcb77777777f776fff777777ff677777777777d77777777777755ff777777777777777e77777777755755424777f7ffffff75f55eff7776efff
cffcccccccccccccceeefffffffeefffffffffffffffffccccccccccccffffff55555555555dd55fcceeeeeeeeeccceeeeeeeeebeeb7777777fff77ff77777777777777777777d1777777777775577777777777777777e777771d77555555557777ffffffe444555fff6ffe777
cccfccccccccccccceeeffffffffefffffffffffffffffcccccccccccccffff45555555555555555feeeeeeeeeeeeeeeeeeeeeebeee777777ffff76ff7f777dffc7777ffff777d17777777777fff77777777777777777e77777117755555555577777fffffe445551fff67e777
fecccccccccccccccceeffffffffffffffffffffffffffffcccccccccccccff45555555555555555feeeeeeeeeeeeeeeeeecccbeeeee7777fffff7ccfffff111dfffffeeeff7d11177777777777777777777777777777777711d4e7555555555777777ff7e55555111ffffef7f
ffcccccccccccccccceeffffffffffffffffffffffffffffcccccccccccccf455555555555555555feeeeeeeeeeeeeeeeebbbbbccccc77ffffffffcccccc11111bcccccccccb11111fffff7777777777777777777776ff7771111b75555555557777777771d55111117776efff
ffccccccceecccceeceefffffffffffffffffffffffffffccccccccccccccf4555555555555555455feeeeeeeeeeeeeeeeeebbbbeeecccccccccccccccc111111111c6666ccb11111ccccccfff77777777777777fff77777fd1117f755555557777777777111ddd11d777777ff
ffccccccceeecceeeceeeffffffefffffffffffffffffffccccccccccccccf455555555555554fb45efffeeceeeeeeeeeeeeebbbeeecbccccc666669911111111dbd9999999111111166cccccccfffff77777777777777776fcc776f77777777777777776b1d7f6b7777777777
ffcccceeefeeccceefeeeffffffeeffffffffffffffccccccccccccccccccf455555555555557fc455eee4eceeeeeeeeeeeeeccbbcccbb66669999996ceeeeeeeeed99999666611666666666666cccc677bbb777777777777667777666677777777777776fc776767777777777
ffcccceeeefffffeeffeefffffeeeefffffffffffffccccfffffffffffcccf445555555555557ff4552442eceeeeeeeeebeeeeeebbecb777999996888ceeeeeecdd999999866666666899999999999776b3e37777777777777777777777777777777777777777777f777777777
fffccceeeeeefffeeffceffffee22eefffffffbbfffffffbbbbbbbbbbbffcf4455555555555554555f4444ceeeeeeeebbbeeeeeeebbcb7777799999998cccc99999999999888c888889999999999777776f77777777777777777777777777777777ff777777777777777777777
fffccceeeeeefffeeffecefffe2222eefffffcfbbbbbbbbeffbbbbeeeeeeff444555555555555555f4222ffeeeeeeeebbbeeeeeeecbbbef77777779999999999999998888cc8ccc99999999977777777777777777777777777777777777777777fff777fff67fff7f777777777
ffffceeeeeeefffefffccceffe222222efffcccfbbbbbbbbbeffccefeeeeef444455555555555555f2422feeeeeeeeeebbeeeeeeeeebbeffff777777777577777999999998cc6999997777777777777777777777777fff7777fff6774477ccccccc777ffffff555ff777777777
ffffceeeeeeeffffffffcccfee2222222ffffcefbbbbbbbbbbeeeffeeeeeeef44455555555555555f4fffefeeeeeeeeebbeeeeeeeeebbef77ff7777777ff77777777799999997777777777777777777777777777ffceeeffffeeeff4447eeeeeeeeeeeeeeef75555ff77777777
ffffffffeeeefffffffffecffe2224422fffcccfbbbbbbbbbeefffeeeeeeeeef4445555555555555f42222eceeeeeeeebbbeeeeeeeecbb7777ff7f677ff7777777777777777777777777777777777777777777fffeeffeeeeeeeee4444fccccccccccccccce555555f7fff7777
fffffffffeeeefffffffffccfe2224422efffcccfbbbbbeeeeeeeeeeeeeeeeeeff444555555555544f444efceeeeeeeeebbbeeebbbeeebbb777fff677777f7ff7777777777777777777777777777557777777feeeccccccc8cccc444444eecccccccccccce245f555cccccff77
fffffffffffeefffffffffccff2224422efffffcfbbbbeeeeeeeeeeeeffffeeeeefe444dd55555544fffffeeeeeeeeeeeebbbbbbbbbbcbbbbb7fff67757ffffff7777777777777777777777777f7757777777eee88888889999bb44444444999999998888e2445555ffccccccc
fffffffffffeeffffffffffcee2222222fffffffffeeeeeeeeeeeeeeeeeffefeeeecfffff745544effceeeeeeeeeeeeeebbbeebbbbbbbcbbbb7fff76f7fffffff7777777777777777777777777fff77777777ee69999999999b4444444444999999999999b444555574c6ccccc
fffffffffffeefeffffffffce2222222efffffffffeeeeeeeeeeebbbbeeeeeeeeeeeeecccffe4eeffefeeeeeeeeeeeeeebbeeeeeebbbbcbbbbbcff776fff677767777777777777777777777777777777777776699999999999b44444444eb999999999999d755555555796666c
ffffffffffeeecefffeffffe2222222eeefffffffffeeeefceeebbbbbbbeeeeceeeeeeeccccffe444fefeeeeeeeeeeeeebeeeeeeeebbbbebbbbbff6777777777777777777777777777777777777777777777777999999999999eeeeeeee6999999999999b5555555dd57999996
ffffffffffeeceeefeeeffee2222442efeeffffffffffeeeeeeebbbbbbbbeeeffebbbbbbbbf4445554fefeeeeeeeeeeeeeeeeeeeeeebbbff77777f67777777777777777777777777777777777777777777777777699999999ccccccccc99999999999999b555555ddd57999999
ffffffffeeffeeeefeefffee2224442effeffffffffffffeeeebbbbbbbbeeeffeeefffffff555555555feeeeeeeeeeeeeeeeeeeeeeebbbfffffff7fcf77777cccccccbbbbbbbbbbbbbbbefffff77777777777777777699998cccccc99999999999999999b55555555557999999
ffffffeeeeffee22eeefffe222444422ffeefefffffffe4fbbbbbbbbbbbeeeeeefe4444455555555d55feeeeeeeeeeeeeeeeeeeeeebbbbffffffffccccccbbeeeeeeebcbbbeeeeebeebbbbbbbbff77777777777777777777d99c99999999999999999999cc5555555557996799
ffffffeeeffffe22eeefffe224444422e2222eeffffffe44fbbbbbbfffbbbbfffffffffff55555555d55feeeeeeeeeeeeeeeeeeeeeebbcffccccccccccccccccccfffcccbeeeeeeeeeebbbcbbbbbffff67777777777777777777799999999d7799999999cce755555fc99777d9
fffffffefffffe22eeefffe2244444222222222ffffffe444fbbbff444ffff4f555dddd55ff555555d55feeeeeeeeeeeeeeeeeeeeeecbccccccccccccccccccccfffffccccccccccccccbccbbbbbbff777777777777777777777777777799777799899777f777feeef9977777d
fffffffcffffffe22eeeee224444422222222222fffffe4444fff4444444444f5555555555df555555554feeeeeeeeeeeeeeeeeeeeebbcccccccccccccccccffffffcccbbbbbeeebbbbcccccbbbbbb77777777777777777777777777777777ff67777b7776f777dd777776ff77
fffffffcffffffe2222eeebbbbbbbb222222222efcccce44444444444444444f555555555555555555555feeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeebbbbbecccbbbbbcccbbbb777777777777777777777777777777777ffff6f775776ff7777777fffff77
fffffffccfffffceeeebbbbbbbbbbbbbbbee22ebbbbbbce44ff444444444444fd55555555555555555554feeeeeeeeeeeefeeeeeeeeeeeeeeeeeeeeeeeeeeeeeefffffcccbbcccccccbbbbbbcfff7777777777777f77777777777777777fffff6ff7ff777fff777777ff5eff77
effccccceeffffeeccccccccbbccccccccbbbbbbbbbbbce44f4f444ee4444444fe4455555555555555554feeeeeeeeeefceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeffffffcccbccccccccbbbbbbcf777677ff677777ff66667f776677ffff677777766ff67fffc766f7fff77ff77
effbbbbbbbeeecbbccccccccccccccccccbbbbbbbbbbbbc44fef4f4fee444444f4ee55555555555555554fbbbeeeeeeeeffeeeeeeeeeeeeeecccccccccccccccccfffffffcccccccccccccbcccf666f6ffff6666fffffff6ff6ff77776666667766ff676fff75fff6f6fff6677
fffbcccbbbbbbbbbbbbbcbccbbbbbbbbbbbbbbbbbbbbbbbf4fb44f4e4e444444bf4555555555555555555fbcbbeeeeeeeffffeeeeeeeeeeeeeeeeeeeeeeeeeeeefffffffffffccccccccccffffffffffffffff7ffffff7fffff7777ff77ff77677ffffff76fffffff777777777
ffccccccbbbbbbbbbbbccbbbbbbbbbbbbbbbbbbbcccccccf4f444f4ffb4444444ee455555554e5555555fbbbbbbbeeeeeeffffeeeeeeeeeee2eecccccccccccccfffffffffcccffffcccccffffff7ffffffff7bbbbbbbbbb7ffffffffffffff6f777fff7ff6ffffff777777777
ffccccccbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbf4444f4c4444444444ee4444444f55555555fbbbbbbbbbbbbdeffffeeeeeeeeeeeeeeecccceeeeeeeefffffffcccfffccccccfffffffffffffffbbbbbbbbbbbbbbbb7ffffffffffff7f7fffff77fbf77777777bbbb
fbbcccbbbbbbbbbbcccccbfbbbbbbbbbbbbbbbbbbbbbbbffff44444e44444444444ffffffff55555555fbbbbbbbbbbbbbbbcffffeeeeeeeeeeeeeeeeeeeeeeeeeeefffffccccfccccccccfffbbbccfffffffbbbbbbbbbbbbbbffcfffffcffffffffffffff77fbff77bbbcfbbbb
bbbbbbbbbbbbbbbbcccbbbccccbbbbbbbbbbbbbcccccfffffff44444444444444444444444555555544fbbbbbbbbbbbbbbbbfffffeeeeeeeeeeeeeeeeeeeeeeeeeffffffcccffcccccccfffbbbbbbfffffffbbbbbbbbbbbbbefffffffffffffffffbbbffff6ffbbbbbbbfffbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccffffffffffff4444444444444444455555554444ffbbbbbbbbbbbbbbbbbfffffeeeeeeeeeeeeecceeeeeeeeeeefffffffffcccccfffffcccccbbbbbbefffbbbbbbbbbcccffffffffffffffffccccbbffffcbbbbbbbbcfffbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbcffcccccffffffffffffffffffc44444444444444444444444fffbbbbbbbbbbbbbbbbbbfffffeeeeeeeeeeeeeeeeeebbeeeeeeeffccffffcccccfffffccccccccccbeffffbbbbbcbccffffffffffffffcccccccccbbfcbbbcbbbbbbcffffb
bbbbbbbbbbbbbbbbbbbbbbbbbcccfffffccfffffffffffffffffffffffff44444444444444444effbbbbbbbbbbbbbbbccccbffffeeeeeee22eeeebbbbbbbbbeeeeecccccffffccffffffffccccccccffffffcffcfbfffffffffffffffffffccccccbbbbbbbcccccbbbbbffffff
bbbbbbbbbbbbbbbbbbbbbbbbcccccffffcfffffffffffffffffffffffffffffffffffffffffffffbbbbbbbbbbffffffecccbffffeeeeee2eeeeebbbbbbbbbbeeeeeeeeeeefcffcffffffccccccccfffffffffffffffffffffffffffffffffcccccccccccbbcbeeeebbccffffff
bbbbbbbbbbbbbbbbbbbbbbbbcccccccfcfffffffffffffffffffffffffffffffffffffffffffffcbbbbbbbbbbffffffccfceefffeeeeeeeeeeeebbbbbbbbbbbeeeeeeeeeeeefffffffffcccccccccfffffffffffecffffffffffffffffffcccccccccbbbcbbcccccfffcffffff
bbbbbbbbbbbbbbccccccccccccccccccffffffffffffffffffffffffffffffffffffffffcccbbbbbbbbbbbbbcffcffffffceeeffeeeeeeeeeeeebbbbbbbbbbbbeeeeeeeeccccfffffffccccccccccccffffffffffccffffffffffffffffffccccccccccccccffccfffffffffff
fbbbbbbccbbbbccccccccccccccccccccfffffffffffffffffffffffccccfffffffffcccbbbbbbbbbbbbbeecccccffffffeeeefeeeeeeee2eeeeebbbbbbbbbbbbbeeeeeeeeeeffffcffcccccccccffffffffffffffccfffffffffffffffffffccccccccccccfffffffcfffffff
ffcccbcccccfbccccccccccccccccccccccccffffffffffffffffffccccbbbffffffcbbbbbbbbbbbbbbdfcccccccffffffeeeefeeeeeeeee222eebbbbbbbbbbbbbbeeeeeeeeeccffffcccccccccfffffffffffffffbeffffffffffffffffffffccccccccccffcfffffefffffff
fffccccccccccccccccccfcccccccccccccfffffffffffffffffccccccbbbbbbbcffcbbbbbbbbbbbbbbffccccccfffffffeeeeeeeeeeeeeeeeeeebbbbbbbbbbbbbbbeeeeeeeccffffccccccccceffffffffffffffffcffffffffffffffffffcfffcccccfccfcfffffcefffffff
fffccbcccbbbccccccccccccccccccccccccfffffffffffccccccccbbbbbbbbbbbcfcbbccbbbbbbbeeeffcccccccfffffeeeeeeeeeeeeeeeeeeeeeebbbbbbbbbbbbbeeeeeeeeefffcccccccccc2ffffffffffffffffccfffffccffffffffffccfffcccffccfcfffffcffffffff
cfccccbbbbbcccccccccccccccccccccccffffffffffccccccccccbbbbbbbbbffbbccbbcccbbbbbecccffffcccccccfffeeeeeeeeeeeeee224eeeeeebbeebbbbbbbbbeeeeecccffcccccccccccefffffffffffffffffccffccccfffffffffffffffcccffccffffffcfffffffff
cccccccbbcccccccccccccccccccccccccffffffffccccccccccbbbcfcbbbbbffccccccccccbcffcccccfffcccfcccfffeeeeeeeeeee2222eeeeeeeeeeeeeebbbbbbbeeeeeecccccccceecccccfffffffffffffffffffccccccccfffffffffffffffccffcccffffcffffffffff
cccccccccccccccccccccccccccccccfcffffffffffffcccccbbbbbbbfffffcfffcccccccccccffcccccffccccfccceffeeeeeeeeeeee2eeeeeeeeeeeeeeeeeebeebbeeeeeccccccceeeeeeeeeffffffffffffcccccccbbbeeeeeeffffffcfffffffccffccffffeeffffffffff
ccccccccccccccccccccccccccccccfcfffffffffffccccccccfbbbbbbbbbbbbbbbeeccccccbbbffccccccccccfcccffeeeeeeeeeeeee222eeeeeeeeeeeeeeeeebeeeeeeeeeeecceeeeeeeeeeeffffffffffccceebbbbbbbbbbbbcffcfcccfccffffcccfccceeeefffffffffff
ccffccccccccccccccccceccccccccfffffffffccccccbbbbbbbbbbbbbbbbbbbbeefeeccccffcccfcccccccccfffeff22eeeeee22eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeffffffffcccceeeebbbbbbbbbbbbccffccffccfffccccccccfffffffffffffff
fffffffccccccccccccceeeecccccccffffffcccbbbbbbbbbbbbbbbbbbbbbbbceccfffffcffffcbcfccccccccfffff222eeeeeee22eeeeeeeeeeeeeeeeeeeeeeeeeeeeccffcceeeeeeeeeeeeecffffffffccceeeeeeebbbbbbbbbbbbcfcfffcfffcccccccccfffffffffffffff
fffffffccccccccccceeeeeecccccccccccccccccccbbbbbbbbbbbbbbbbbbbbfbfefffffffffccbecccccccccfffee22222eeeeeeeeee2eeeeeeeeeeeeeeeeeeeeccecfcffcccceeeeeeeeeeefffffffccceeeeeeeeeccfeebbbbbbbbfffcccccccccccccccfffffffffffffff
fffffffcccccccccceeeeeeecccbbcccbbbbcccccccbbbbbbbbbbbbbbbcfffffeeeffffffffcffccecfcccccffeeee222222222ee2222222eeeeeeeeefffeeeefcfbfccfffffcfeeeeeeeeeeeccffffcccceeeeeeeecffffeeeebbbbbccccffccccccccceecfffffffffffffff
ffffffcccccccccceeeeeeeeeebbbbbbbbbbbbbccbbbbbbbbbbbbbffffffffbceecfffffffcfffcfcffeeccffeeeeee22222222222222222eeeeeeefcccdfeefcfffbffffffffbfeeeeeeeeceeeeffcccceeeeeeeecfffffeeeeeebbbcffffffffccccceeecfffffffffffffff
cffccccceeecccceeeeeeeeeecbbbbbbbbbbbbbbcbbbbbbbbbbbbfffffffffceeecfffffffffffeffffececcf222eeeee222222224442222eeeeeeefccffbffcfffffffffffffbbfeeeeeeeceeeefccceeeeeeeeeeefffffeeeeeebbbffffffffcccccceeecfffffffffffffff
eeecccccceeeccceeeeeeeeeeebbbbbbbbbbbbbbffbbbbbbbbbbbbffffffffffeeffffffffffffeffffcfccce2222eeeee22222244444422222eeffccffffbbfffffffffffffffbbfeeeeeeffeeecceeeeeeeeeeeeeefffceeeeeeeeeffffffffcccccceeecffffffffeefffff
eeeeeeccceeeecccceeeeeeeeecccbbbbbbbbeeeffffcccfffffbbcccccccccceefffffffffffeeeffcefffe22222eeeee24444444444422222efbfcfffffffffffffffffffffffbfeeeffcfbfeeeeeeeeeeeeeeeeeeefffeeeeeeeefffffffffccccceeeecfffffffffefffff
eeeeeeeccceecccccceeeeeeeeeefffcbbbeebbffffffffffffffbbecccccccfecfffffffffffefcfcfffff2222222eeee24444444444422224ffccfffffffffffffffffffffffffbfffccfffbfeeeeeeeeeeeeeeeeeeefffeeeeeeefffffffffffccfeeecffffffffffffffff
eeeeeeecccccccccccceeeeeffffffffbbbbccfffffffffffffcccbecccceccfecfffffffffffcefeffffefe22222222ee2444444444422224fffffffffffffffffffffffffffffffccffccffbfeeeeeeeeeeeeeeeeeeeeeefeeeeefffffffffffffffeeeeccffffffffffffff
eeeeeeeecccccccccccccfffffffffffbbccceefffffffffffffffbbccfcefefefffffffffeefecfffffffce222222222224444444444224ffffffffffffffffffffffffffffffffffffffcffbfeeeeeeeeeeeeeeeeeeeeeeecfeeffffffffffcffffeeeeeeeefffffffffffff
eeeeeeeeececcccfcccccffffffffffffbeccceffffffffffffffffcecffbeeeeffffffffeffffffffffffce2222222222244444444444efcbbcffffffffffffffffffffffffffffffffffffbcbeeeeeeeeeeeeeeeeeeeeeeeeffffffffffceeeeeefeeeeeeeefffffffffffff
eeeeeeeeeeeeccffcccccffffffffffffcccfcfffffffffffffffffffecfceeeefffffffffeeefeeffffffce22222222222444444444ecfcfccbcfffffffffffffffffffffffffffffffcccfccbfeeeeeeeeeeeeeeeeeeeeeeeffffffcceeeeeeeeeeeeeeeeeeccfffffffffff
eeeeeeeeeeccecfffccccccffffffffffffeccffffffffffffffffffceccfceeeffffffffffffffffffffce22222222222ee44444444ffffffccccffffffffffffffffffffffffffffffccccfccffeecfeeeeeeeeeeeeeeeeeeeffffceeeeeeeeeeeeeeeee22eeefffffffffff
eeeeeeeeeeceeecffcccccccccfffffffffeccffffffffffffffffffffffffeeecffffffffffffffffffce22222222444effcffbbbbbcfffffccccffffffffffffffffffffffcbbfffffcccbfccfbffcceeeeeeeeeeeeeeeeeeeeefffeeeeeeeeeeeeeeeee2222efffefffffff
eeeeeeeeebbbbecffcccccccfffffffffffeeffffffffffffffffffffffffeeeeecfffffffffffeffffceb44444224bbbbeffffffbbbbbffffcccccffffffffffffcffffffffcccbffcffcccfccfbdfcfceeeeeeeeeeeeeeeeeeecceeeeeeeeeeeeeeeefee2222efffffffffff
eeeeeeeeeeeeeeccccccccccfffffffffffcefffffffffffffffffffffefeeeeeecfffffffffffffffefebbbbbbbbbbbbbcffffffffbfffcffcccccfffffffffffffcbfffffcffccbbffffccfccfbbbfceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222efffffffffff
fffffffffeeeeeccccccccccfffffffffffceffffffffffffffffffffe22efeeeecffffffffffffffefeeeeebbbbbbbbbbbcffffffffcfffffccccccfffffccccfccfccfffccffffccffffcccfcfbbbfceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222eeffffffffff
ffffffffffeeeecccccccccccffffffffffcefffffffffffffffffffff22feeeeecfffffffffffffefeeeeeeebbbbbbbbbbbfffffffccffffffccbccfffcccccccffffcbfcfffffffcffffcccfcffbbbceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee22242eeeffffcffe
ffffffffffffeeccccccccccccfffffffffceefcffffffffffffffffffefffeeeecffffffffffeefeeeeeeecfbbbbbbbbbbbbbbbffcffffffffbbbbccfffccccccfffffccfffffffffffffcccfcfbffbceeeeeeeeeeeeeeeeeeeefeeeeeeffffffffffeeeee224222eeffffeee
fffffffffffceeccccccccccccfffffffffceefffffffffffffeefffffefffeefeeeeffffffffffeeeeeeeeecbbfbbbbbbbbbbbbfcffffffffffbbbcccfefccccfccfffffffffffffffffffccfcfbbffceeeeeeeeeeeeeeeeefffeeeeeeefffffffffffeeee2244222eeffee22
fffffffffffffcccccccccccccffffffffffeeefffffffffffeeeefffefffffeeeeeeeffffffeeeeeeeeeeeecfefbbbccbbbbbbbffffffffffffcbbccccfefccccccccffffffffffffffffffcfcbbbbceeeeeeeeeeeeeeeeeeeffeeeeeeffffffffffffffee22442222eeee222
ffffffffffccecccccccccccccfffffffffffeefffffffffffeeeecfffffffffeeceeefe22fffeeffeeeeeeeeeeffbccccbbbbbfffffffffffffcbbbcccfeefcfccccccfffffffffffffffffcffcbbbfbbbbeeeeeeeeeeeeeeeffeeeeeeffffffffffffffee224442222222222
fffffffffffceccccccccccccccfffffffffcecfecffffffffceeeeffffffffeeeef2ffffe2efffffeeeeeeeeeecfcccccccbbefffffffffffcfcccbbbfeefeffccccccfcfffffffffffffffccbcfbccbbbbbeebbeeeeeeeeeeffeeeeeeeeeeeffffffffffe224442222222222
fffffffffffceccccffccccccceeffffffffeeffeefffffffcfceeeeeffffffeefefeffeee2fffffffeeeeeeeecffffcccccbbffffffffffcfeefcccbcfeefeeefffccfccccfffffffffffffcccbcfebbbbbbbbccbeeeeeeeeeffeeeeeee2eeefffffffffee222444222222222
ffffffffffffcccccffcccccccceefffffffeefceffffffefcceeeeeeffffffeefeeeeff222ffffffffeeeeeeffffffffcccfbffffffffffeefebfffffffeeeeffffffcccccccfffffffffccccccccfffffffbfffeeeee2eeeeeeeeeeee22eeeffffffffffe222244222222222
fffffffffffffccccffcccccccceeeffffffefeffffffffffffeeeeeefffffffef2eeefff2ffffffffeeebeefffffffffffffbfffffffffceeefeeeeeffffeefefffffffcccccfcbbbbfbbccfcccfcbfffffffffeeeeee22eeeeee22e222eeeffffffffffe2222244222224422
fffffffffffccccffffcccccceffeeefcfffffefffffffffeeeeeeeeeeffffffee2eebbfffffffffffeefbbeffffffffffffefcfffffffefffffffeeeefffffeffffffffffcccfccccbfccccfccfcccbffffffeeeeeeeee22eeee2222222eeeffffffffffe2222222222222422
fffffffffffccccfffffccccceefeeeccfffffeefffcfffffeeeeeeeeefffff2222eeeeffffffffffe2effceeefffffffefeeffffffffcfffffffffffeeefffffcfcfffffffccfccccbfcccccffffccccceeeeeeeeeeeee222ee222222eeebbbeffffffffe2222222322222422
ffffffffffffffffffffccccceeceeeecffffffeffffffffffeeeeeeeeeffff2f22222beffffffffeeeeffffeeeeffeeeeeffffffffffffffffffffffffeeffffccccffffffffcccccccfccfffffffcccccfeeefeeeeeeee22ee2222eeeeeeebbbbeebbbfe2222223342222442
ffffffffffffffffffffcccccceeeeeeeffffffefffffffffffeeeeeeeeff22e4fe22eeeeeefffffee2effffeeeeeeeeeefffffffffffffffffffffffffffeeffccccffffffffffffcccfcffffffffffcbfeeeeffffeeeeeeeeeeeeeeeeeeeebbbbbbbbbb42222233334222442
fffffffffffffffffffccccccceeeeeeeefffffeffffffffeeeeeeeeeee2ee24ffe2ebeeeeefffffeeeeffeefeeeeeeeeffffffffffffffffffffffffffffffffccccfffffffffffffffffeefffffffbfcfeeeeeeefffffbebeeeeeeeeeeeeebbbbbbbbbbbbbb4333333422442
ffffffffffffffffffcccccccceeeeeeeeecfffeeffffffffeeeeeeee22222effffeeeeeeeefffffe222eeeeeeeeeeffffffffffffcfffffffffffffffffffffccccccfffffffffffffeceeeefffffccccfeeeeeeeeeecebbbbebbbbbbbbbefceffebbbbbbbbbbb43342222242
fffffffffffffffffffffccccceeeeeeeeeefffeeffffffffffeeeeee222effffffeeeeeeeefffeee22e2eeeeeffefffffffffffffffffffffffffffffffffffffcccccffffffffeeeeeffcceffffffcfffcccceeeeeeeeebbeeebbbbbbbbbffeefeeebbbbccbbfe4322222244
ffffffffffffffffffccccccceeeeeeeeeeeecfeeffffffffeeeeeeeee2effffffeeeeeee2eeffee22222eeeeeefffffffffccccffccfffffffffffffffffffffffcccccccffffcceeecccffcfffffffffcccccceeeccbbeeeeeeeebbbbbbbbeeeeeeeeebecfcbfce422222244
fffffffffffffffffccceeccceeeeeeeeeeeeeeecfffffffceeeeeee2eefffffeeee22eeeee2ee222422effccccffffffcccccccffefffffffffffffffffffffffffffccccccfffffeefffffffffffffcccccccceefffceeeeeeeeeeebbbbbbeeeeeeeeeeecffcceeee2222244
fffffffffffffffffccecccfcceeeeeeeeeeeeeefffffffeeffeeee2eeffff2efffeeeeeeef2ee22242eeefffffffffffccccccfffffffffffffffffffffffffffffffffccccbbbbffffffffffffffcccccccccccffcfffffeeeeeeeeeeeeeeeeeeeeeeeeeebbceeeefee22224
fffffcfffffffffffccfcccccceeeeeeeeeeeeeeffffffeffffeeeee2ef222efffeeeeeeeee22222242eeeeefffffffffccccffffffffffffcccffffffffffffffffffffffcccbebbbbcffffffffcccccccccccccfffcffffffffeffffeeeeeeeeeeeeeeeeebbbffeeeeeeeee4
fffffffffffffffffccccccccceeeeeeeeeeee4eeffeeeefffeeefce4422ffffe2222eeee22222224422eeffffffffffeccccffffffffffccccfeefffffffffffffffffffffcccccccccffffceeefffcccccccfffffffcfffeeecceeefeffeebeeeeeeeeeebbbbbfeeffceeeee
ffffffffffffffffcccccccccceeeeeeeeeeeeeeeeee2eeffeeeefee4442ffff222222eeee2222244422efffffffffffeeecfffffffffffcccffeffcffffffffffffffffffffffccffffffffffeefffffffffffffecffeeeeeeeeeeeeeeeeeebeeeeeeeeeeeebbecffeeeeeeee
`

            let victorySprite = sprites.create(victoryImage, SpriteKind.Player)
            victorySprite.setPosition(80, 60)
            victorySprite.z = 1000

            // Show for 3 seconds
            pause(4000)

            // Victory stats
            game.splash("VICTORY!", "Pip has defeated the Demon!")
            let finalTime = Math.floor((game.runtime() - gameStartTime) / 1000)
            game.splash("Time: " + finalTime + "s", "Souls: " + soulsCollected)

            game.over(true, effects.confetti)
        }
    }
})

sprites.onOverlap(SpriteKind.Boss, SpriteKind.Player, function (boss, plr) {
    if (shieldHits > 0) {
        shieldHits -= 1
        if (shieldHits == 0 && hatSprite) {
            hatSprite.destroy(effects.disintegrate, 100)
            hatSprite = null
        }
    } else {
        hp.value -= 20  // Boss contact does heavy damage
    }

    // Knockback effect
    let dx = plr.x - boss.x
    let dy = plr.y - boss.y
    let dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > 0) {
        plr.vx = (dx / dist) * 100
        plr.vy = (dy / dist) * 100
    }

    // Screen shake on contact
    scene.cameraShake(3, 200)

    if (hp.value <= 0) {
        if (hasRevivalBean) {
            hasRevivalBean = false
            hp.value = hp.max
            effects.confetti.startScreenEffect(2000)
            scene.cameraShake(4, 500)
            music.powerUp.play()
            game.splash("Revival Bean used!", "Restored to full HP!")
        } else {
        game.over(false, effects.melt)
        }
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Dino, function (proj, dino) {
    proj.destroy()
    let damageAmount = 1
    if (proj.data["laser"]) {
        damageAmount = 2
    }
    dino.data["hp"] -= damageAmount
    if (dino.data["hp"] <= 0) {
        soulsCollected += 2
        info.setScore(soulsCollected)

        if (hasSoulBead && hp) {
            hp.value = Math.min(hp.max, hp.value + 10)
        }
        
        dino.destroy(effects.disintegrate, 100)
        let index = dinos.indexOf(dino)
        if (index > -1) {
            dinos.splice(index, 1)
        }
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (proj, minion) {
    // Check if it's a minion (has orbitSpeed property)
    if (minion.data["orbitSpeed"]) {
        proj.destroy()
        minion.data["hp"] -= 1

        if (minion.data["hp"] <= 0) {
            soulsCollected += 1
            info.setScore(soulsCollected)

            if (hasSoulBead && hp) {
                hp.value = Math.min(hp.max, hp.value + 5)
            }

            minion.destroy(effects.fire, 100)
            let index = minions.indexOf(minion)
            if (index !== -1) {
                minions.splice(index, 1)
            }
        }
    }
})


game.onUpdate(function () {
    if (!(player2)) {
        return
    }

    if (player2.vx > 0 && Math.abs(player2.vx) > Math.abs(player2.vy)) {
        facing = Facing.East
    } else if (player2.vx < 0 && Math.abs(player2.vx) > Math.abs(player2.vy)) {
        facing = Facing.West
    } else if (player2.vy > 0 && Math.abs(player2.vy) > Math.abs(player2.vx)) {
        facing = Facing.South
    } else if (player2.vy < 0 && Math.abs(player2.vy) > Math.abs(player2.vx)) {
        facing = Facing.North
    }

    for (let egg2 of corruptedEggs) {
        if (egg2 && egg2.x != undefined && egg2.y != undefined) {
            if (Math.abs(player2.x - egg2.x) < 32 && Math.abs(player2.y - egg2.y) < 32) {
                explodeEgg(egg2)
                break
            }
        }
    }

    if (hatSprite && player2) {
        hatSprite.x = player2.x
        hatSprite.y = player2.y - 4
    }

    // Level 2 -> Level 3 transition (one‑shot)
    if (currentLevel == 2 && !isTransitioningLevel) {
        let playerTileX = Math.floor(player2.x / TILE_SIZE)
        let playerTileY = Math.floor(player2.y / TILE_SIZE)

        if (playerTileX == 71 && playerTileY == 2) {
            isTransitioningLevel = true

            // Clear Level 2 actors
            for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
                value.destroy()
            }
            for (let value2 of sprites.allOfKind(SpriteKind.Crab)) {
                value2.destroy()
            }
            for (let value3 of sprites.allOfKind(SpriteKind.EnemyProjectile)) {
                value3.destroy()
            }
            for (let value4 of sprites.allOfKind(SpriteKind.Crumb)) {
                value4.destroy()
            }
            for (let value5 of sprites.allOfKind(SpriteKind.Bubble)) {
                value5.destroy()
            }

            enemies = []
            crabs = []
            corruptedEggs = []
            bubbles = []

            // Hand off to Level 3
            setupLevel3()
            tiles.placeOnTile(player2, tiles.getTileLocation(0, 36))
            scene.cameraFollowSprite(player2)

            // setupLevel3() should set currentLevel = 3
            isTransitioningLevel = false
        }
    }
})

// Lava damage on Level 2, 3, 4 (Boss1), and 5 (Boss2)
game.onUpdateInterval(500, function () {
    if (!player2) return

    // Check if on a lava level (2, 3, 4, 5)
    if (currentLevel == 2 || currentLevel == 3 || currentLevel == 4 || currentLevel == 5) {
        let playerLoc = tiles.locationOfSprite(player2)
        let isOnLava0 = tiles.tileAtLocationEquals(playerLoc, assets.tile`lava`)
        let isOnLava1 = tiles.tileAtLocationEquals(playerLoc, assets.tile`lava1`)

        // Only take damage if standing on lava AND don't have lava boots
        if ((isOnLava0 || isOnLava1) && !hasLavaBoots) {
            // Check shield first
            if (shieldHits > 0) {
                shieldHits -= 1
                if (shieldHits == 0 && hatSprite) {
                    hatSprite.destroy(effects.disintegrate, 100)
                    hatSprite = null
                }
            } else {
                // Take HP damage
                hp.value -= 5
                scene.cameraShake(2, 100)
            }

            // Check if player died
            if (hp.value <= 0) {
                // Revival Bean check
                if (hasRevivalBean) {
                    // AUTO-REVIVE! 🎉
                    hasRevivalBean = false
                    hp.value = hp.max  // Full heal to 100%
                    effects.confetti.startScreenEffect(2000)
                    scene.cameraShake(4, 500)
                    music.powerUp.play()
                    game.splash("Revival Bean used!", "Restored to full HP!")
                } else {
                    // Game over
                    game.over(false, effects.melt)
                }
            }
        }
    }
})


game.onUpdateInterval(50, function () {
    if (!(player2)) {
        return
    }

    // Regular enemy AI
    for (let enemy of enemies) {
        if (!(enemy)) {
            continue
        }
        let d = Math.sqrt((player2.x - enemy.x) ** 2 + (player2.y - enemy.y) ** 2)
        if (d < 180 && !(enemy.data["following"])) {
            enemy.data["following"] = true
        }

        if (enemy.data["following"]) {
            if (enemy.data["enemyType"] == "ghost") {
                if (Math.percentChance(12)) {
                    enemy.x += randint(-6, 6)
                    enemy.y += randint(-6, 6)
                }
            } else {
                if (Math.percentChance(22)) {
                    enemy.x += randint(-12, 12)
                    enemy.y += randint(-12, 12)
                }
            }
        }
    }

    // Crab AI
    for (let crab2 of crabs) {
        if (!(crab2)) {
            continue
        }
        let e = Math.sqrt((player2.x - crab2.x) ** 2 + (player2.y - crab2.y) ** 2)
        if (e < 90 && !(crab2.data["following"])) {
            crab2.data["following"] = true
            crab2.setImage(assets.image`crab`)
        }

        if (crab2.data["following"]) {
            if (Math.percentChance(16)) {
                crab2.x += randint(-5, 5)
                crab2.y += randint(-5, 5)
            }
        }
    }

    // Golem AI - slower movement but aggressive
    for (let golem of golems) {
        if (!(golem)) {
            continue
        }
        let gDist = Math.sqrt((player2.x - golem.x) ** 2 + (player2.y - golem.y) ** 2)
        if (gDist < 200 && !(golem.data["following"])) {
            golem.data["following"] = true
        }

        if (golem.data["following"]) {
            if (Math.percentChance(10)) {
                golem.x += randint(-8, 8)
                golem.y += randint(-8, 8)
            }
        }
    }
})

// Bat attacks
game.onUpdateInterval(1000, function () {
    if (!(player2)) {
        return
    }

    for (let bat2 of enemies) {
        if (bat2 && bat2.data["enemyType"] == "bat" && bat2.data["following"]) {
            let dx2 = player2.x - bat2.x
            let dy2 = player2.y - bat2.y
            let angle2 = Math.atan2(dy2, dx2)

            for (let spread of [-0.2, 0, 0.2]) {
                let theta = angle2 + spread
                let shotVx = Math.cos(theta) * 85
                let shotVy = Math.sin(theta) * 85
                let venom = sprites.createProjectileFromSprite(batVenom, bat2, shotVx, shotVy)
                venom.setKind(SpriteKind.EnemyProjectile)
                venom.lifespan = 900
                venom.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})

// Snake attacks
game.onUpdateInterval(1000, function () {
    if (!(player2)) {
        return
    }

    for (let snake3 of enemies) {
        if (snake3 && snake3.data["enemyType"] == "snake" && snake3.data["following"]) {
            let dx3 = player2.x - snake3.x
            let dy3 = player2.y - snake3.y
            let angle3 = Math.atan2(dy3, dx3)

            for (let spread2 of [-0.2, 0, 0.2]) {
                let theta2 = angle3 + spread2
                let shotVx2 = Math.cos(theta2) * 85
                let shotVy2 = Math.sin(theta2) * 85
                let shot = sprites.createProjectileFromSprite(snakeShot, snake3, shotVx2, shotVy2)
                shot.setKind(SpriteKind.EnemyProjectile)
                shot.lifespan = 900
                shot.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})

// Crab water attacks
game.onUpdateInterval(1500, function () {
    if (!(player2)) {
        return
    }

    for (let crab3 of crabs) {
        if (crab3 && crab3.data["following"]) {
            let dx22 = player2.x - crab3.x
            let dy22 = player2.y - crab3.y
            let angle22 = Math.atan2(dy22, dx22)

            for (let spreadDeg = -45; spreadDeg <= 45; spreadDeg += 15) {
                let spread3 = spreadDeg * Math.PI / 180
                let crescent_angle = angle22 + spread3
                let shotVx22 = Math.cos(crescent_angle) * 35
                let shotVy22 = Math.sin(crescent_angle) * 35
                let waterShot = sprites.createProjectileFromSprite(crabWater, crab3, shotVx22, shotVy22)
                waterShot.setKind(SpriteKind.EnemyProjectile)
                waterShot.lifespan = 650
                waterShot.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})

// Ghost AOE attacks
game.onUpdateInterval(1500, function () {
    if (!(player2)) {
        return
    }

    for (let ghost2 of enemies) {
        if (ghost2 && ghost2.data["enemyType"] == "ghost" && ghost2.data["following"]) {
            let dx = player2.x - ghost2.x
            let dy = player2.y - ghost2.y
            let distance = Math.sqrt(dx ** 2 + dy ** 2)

            if (distance < 60) {
                let angle = Math.atan2(dy, dx)
                let speed2 = 50
                let pulse = sprites.create(ghostPulse, SpriteKind.EnemyProjectile)
                pulse.setPosition(ghost2.x, ghost2.y)
                pulse.setVelocity(Math.cos(angle) * speed2, Math.sin(angle) * speed2)
                pulse.lifespan = 800
                pulse.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})

// Golem Heartbeat AOE Fire Dart Attack (8-directional)
game.onUpdateInterval(1200, function () {
    if (!(player2) || currentLevel != 3) {
        return
    }

    for (let golem of golems) {
        if (golem && golem.data["following"]) {
            // 8-directional heartbeat fire darts
            let dartDirections = [
                [80, 0],
                [56, 56],
                [0, 80],
                [-56, 56],
                [-80, 0],
                [-56, -56],
                [0, -80],
                [56, -56]
            ]

            for (let dir of dartDirections) {
                let dart = sprites.createProjectileFromSprite(fireDart, golem, dir[0], dir[1])
                dart.setKind(SpriteKind.EnemyProjectile)
                dart.lifespan = 1000
                dart.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})

// Golem Fire Arc Curved Projectile Attack
game.onUpdateInterval(2000, function () {
    if (!(player2) || currentLevel != 3) {
        return
    }

    for (let golem of golems) {
        if (golem && golem.data["following"]) {
            let dx = player2.x - golem.x
            let dy = player2.y - golem.y
            let angle = Math.atan2(dy, dx)

            // Fire 3 arcing projectiles with different speeds for curve effect
            for (let arcOffset of [-0.3, 0, 0.3]) {
                let arcAngle = angle + arcOffset
                let arcVx = Math.cos(arcAngle) * 60
                let arcVy = Math.sin(arcAngle) * 60

                let arcProjectile = sprites.createProjectileFromSprite(fireArc, golem, arcVx, arcVy)
                arcProjectile.setKind(SpriteKind.EnemyProjectile)
                arcProjectile.lifespan = 1500
                arcProjectile.setFlag(SpriteFlag.AutoDestroy, true)

                // Add slight acceleration for curved trajectory
                arcProjectile.ax = Math.cos(arcAngle) * 5
                arcProjectile.ay = Math.sin(arcAngle) * 5
            }
        }
    }

})

// ==================== LEVEL TRANSITION & AI UPDATES ====================
game.onUpdateInterval(100, function () {
    if (!player2) return

    // Level 3 tile check for boss transition at (74, 36)
    if (currentLevel == 3 && !isTransitioningLevel) {
        let playerTileX = Math.floor(player2.x / 16)
        let playerTileY = Math.floor(player2.y / 16)

        if (playerTileX == 74 && playerTileY == 36) {
            isTransitioningLevel = true
            setupBossLevel1()
            tiles.placeOnTile(player2, tiles.getTileLocation(12, 22))
            scene.cameraFollowSprite(player2)
            isTransitioningLevel = false
        }
    }

    // Run boss AI during boss fights
    if (inBossFight && bossSprite && bossSprite.data["fightStarted"]) {
        bossAI()
    }

    // Run minion AI during Phase 2
    if (bossPhase == 2 && minions.length > 0) {
        minionAI()
    }

    // Boss dialog trigger
    if (inBossFight && bossPhase == 1 && bossSprite && !bossSprite.data["dialogShown"]) {
        let dx = player2.x - bossSprite.x
        let dy = player2.y - bossSprite.y
        let dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 40) {
            bossSprite.data["dialogShown"] = true
            player2.vx = 0
            player2.vy = 0
            game.showLongText("FOOLISH DUCK YOU'LL NEVER LEAVE THIS PLACE ALIVE", DialogLayout.Bottom)
            bossSprite.data["fightStarted"] = true
            bossHP.setFlag(SpriteFlag.Invisible, false)
            scene.cameraShake(4, 500)
        }
    }
})


// Run dino AI SEPARATELY and LESS FREQUENTLY
game.onUpdateInterval(500, function () {
    if (currentLevel == 3 && player2) {
        dinoAI()
    }
})

// ==================== GAME INITIALIZATION ====================
showTitleScreen()

inTitleScreen = true



// ==================== POWERUP COLLISION HANDLERS ====================

// Speed Bean: +15% movement speed
sprites.onOverlap(SpriteKind.Player, SpriteKind.SpeedBean, function (plr, bean) {
    if (!hasSpeedBean) {
        hasSpeedBean = true
        let newSpeed = Math.floor(baseSpeed * 1.15)
        controller.moveSprite(player2, newSpeed, newSpeed)
        bean.destroy(effects.fountain, 200)
        music.powerUp.play()
        game.splash("Speed Bean!", "Movement +15%")
    }
})

// Soul Bead: Souls now heal +5 HP each
sprites.onOverlap(SpriteKind.Player, SpriteKind.SoulBead, function (plr, bead) {
    if (!hasSoulBead) {
        hasSoulBead = true
        bead.destroy(effects.starField, 200)
        music.powerUp.play()
        game.splash("Soul Bead!", "Souls now heal +5 HP")
    }
})

// Lava Boots: Walk on lava without damage
sprites.onOverlap(SpriteKind.Player, SpriteKind.LavaBoots, function (plr, boots) {
    if (!hasLavaBoots) {
        hasLavaBoots = true
        boots.destroy(effects.warmRadial, 200)
        music.powerUp.play()
        effects.confetti.startScreenEffect(1000)
        game.splash("Lava Boots!", "You can now walk on lava!")
    }
})
// Soul Rock - breaks after 3 hits and drops Soul Bead
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.SoulRock, function (proj, rock) {
    proj.destroy()

    // Damage the rock
    rock.data["hp"] -= 1

    // Visual feedback
    scene.cameraShake(2, 100)

    if (rock.data["hp"] <= 0) {
        // Rock breaks! Spawn Soul Bead
        let soulBead = sprites.create(soulBeadImage, SpriteKind.SoulBead)
        soulBead.setPosition(rock.x, rock.y)
        soulBead.z = 10

        // Fancy spawn effect
        soulBead.vy = -50  // Pop upward
        pause(200)
        soulBead.vy = 0

        rock.destroy(effects.disintegrate, 200)
        music.powerUp.play()
    }
})
// Revival Bean: Auto-revive to 100% HP when you die
sprites.onOverlap(SpriteKind.Player, SpriteKind.RevivalBean, function (plr, bean) {
    if (!hasRevivalBean) {
        hasRevivalBean = true
        bean.destroy(effects.hearts, 200)
        music.powerUp.play()
        effects.confetti.startScreenEffect(1000)
        game.splash("Revival Bean!", "Auto-revive at 0 HP!")
    }
})



