'use strict';

const CATEGORY_CONFIG = {
  attraction: { size: 80, color: '#4f8cff' },
  food: { size: 60, color: '#ff8b5c' },
  facility: { size: 50, color: '#9aa3ad' },
  pet: { size: 70, color: '#ffb86b' },
  service: { size: 120, color: '#8a5a44' },
  internet: { size: 90, color: '#6c5ce7' }
};

const CATEGORY_COLORS = {
  attraction: {
    pool: '#4169E1',
    splash: '#00BFFF',
    slide: '#1E90FF',
    coaster: '#FF6347',
    lazy: '#87CEEB',
    wave: '#4682B4',
    tower: '#8B0000',
    rapids: '#006994',
    mega: '#FF1493',
    ferris: '#FF69B4',
    carousel: '#FFB6C1',
    arcade: '#9370DB'
  },
  food: {
    hotdog: '#FF6B35',
    pizza: '#FFB627',
    burger: '#8B4513',
    icecream: '#FFC0CB',
    popcorn: '#FFEB3B',
    taco: '#FFD700',
    sushi: '#FF6B9D',
    coffee: '#8B4513'
  },
  facility: {
    toilet: '#E0E0E0',
    bench: '#8B4513',
    trash: '#555555',
    atm: '#228B22',
    fountain: '#4682B4'
  },
  pet: {
    dogbath: '#87CEEB',
    petpark: '#90EE90',
    petgrooming: '#FFB6C1',
    petstore: '#FFA500',
    vetclinic: '#FFFFFF',
    pethotel: '#DDA0DD',
    dogpool: '#4169E1',
    petcafe: '#D2691E'
  },
  service: {
    hotel: '#CD853F',
    luxuryhotel: '#DAA520',
    motel: '#BC8F8F',
    resort: '#20B2AA',
    spa: '#DDA0DD',
    restaurant: '#FF8C00',
    finerestaurant: '#8B0000',
    buffet: '#FFA07A',
    casino: '#FFD700',
    nightclub: '#9400D3',
    bar: '#8B4513',
    gym: '#DC143C',
    theater: '#800080',
    cinema: '#2F4F4F',
    mall: '#FF1493',
    museum: '#A0522D',
    aquarium: '#4682B4'
  },
  internet: {
    basicpc: '#4A90E2',
    gamingpc: '#E94B3C',
    vrcafe: '#9013FE',
    streamstudio: '#FF6B6B',
    moviestation: '#4ECDC4',
    anime: '#FF69B4',
    esports: '#FFD700',
    podcast: '#95E1D3',
    cybercafe: '#38ADA9',
    coding: '#6C5CE7',
    discord: '#7289DA',
    youtube: '#FF0000'
  }
};

const SAVE_KEY = 'waterpark.save.v1';

const VISITOR_EMOJI_WEIGHTS = [
  { emoji: '🧍', weight: 3 },
  { emoji: '🧍‍♀️', weight: 3 }
];

const PET_EMOJI_WEIGHTS = [
  { emoji: '🐕', weight: 1 }
];

const pickWeightedEmoji = (choices) => {
  const total = choices.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of choices) {
    roll -= item.weight;
    if (roll <= 0) return item.emoji;
  }
  return choices[choices.length - 1]?.emoji ?? '🧍';
};

const EMOJI_MAP = {
  pool: '🏊',
  splash: '💦',
  slide: '🌊',
  coaster: '🎢',
  lazy: '🛟',
  wave: '🌊',
  tower: '🗼',
  rapids: '🌀',
  mega: '🎡',
  ferris: '🎡',
  carousel: '🎠',
  arcade: '🕹️',
  hotdog: '🌭',
  pizza: '🍕',
  burger: '🍔',
  icecream: '🍦',
  popcorn: '🍿',
  taco: '🌮',
  sushi: '🍣',
  coffee: '☕',
  toilet: '🚻',
  bench: '🪑',
  trash: '🗑️',
  atm: '🏧',
  fountain: '⛲',
  dogbath: '🛁',
  petpark: '🐕',
  petgrooming: '✂️',
  petstore: '🛒',
  vetclinic: '🏥',
  pethotel: '🏨',
  dogpool: '🏊‍♂️',
  petcafe: '☕',
  hotel: '🏨',
  luxuryhotel: '🏰',
  motel: '🛏️',
  resort: '🏝️',
  spa: '💆',
  restaurant: '🍽️',
  finerestaurant: '🥂',
  buffet: '🍱',
  casino: '🎰',
  nightclub: '🎧',
  bar: '🍹',
  gym: '🏋️',
  theater: '🎭',
  cinema: '🎬',
  mall: '🛍️',
  museum: '🏺',
  aquarium: '🐠',
  basicpc: '🖥️',
  gamingpc: '🎮',
  vrcafe: '🕶️',
  streamstudio: '📹',
  moviestation: '📺',
  anime: '🈶',
  esports: '🏆',
  podcast: '🎙️',
  cybercafe: '💻',
  coding: '🧑‍💻',
  discord: '💬',
  youtube: '▶️',
  path: '🟫',
  bulldoze: '🧹'
};

class Building {
  constructor({ type, tileX, tileY, cost, price, petPrice, category, tileWidth = 1, tileHeight = 1 }) {
    this.type = type;
    this.cost = cost;
    this.price = price;
    this.petPrice = petPrice;
    this.category = category;
    this.tileX = tileX;
    this.tileY = tileY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.pathTile = null;
  }

  occupies(tileX, tileY) {
    return (
      tileX >= this.tileX &&
      tileX < this.tileX + this.tileWidth &&
      tileY >= this.tileY &&
      tileY < this.tileY + this.tileHeight
    );
  }
}

class Agent {
  constructor({ tileX, tileY, isPet, speed, emoji, isStaff = false, budget = 0, spendLimit = 0 }) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.isPet = isPet;
    this.speed = speed;
    this.isStaff = isStaff;
    this.state = 'wandering';
    this.target = null;
    this.emoji = emoji ?? (isPet ? (Math.random() > 0.5 ? '🐕' : '🐈') : '🧍');
    this.path = [];
    this.budget = budget;
    this.spendLimit = spendLimit;
    this.spent = 0;
    this.leaving = false;
  }

  assignPath(path, target) {
    this.path = path ?? [];
    this.target = target;
    this.state = this.path.length ? 'moving' : 'wandering';
  }

  update(delta, world) {
    if (this.isStaff) {
      if (!this.path.length) return true;
      const next = this.path[0];
      const dx = next.x - this.tileX;
      const dy = next.y - this.tileY;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.02) {
        this.tileX += (dx / dist) * this.speed * delta;
        this.tileY += (dy / dist) * this.speed * delta;
        return false;
      }
      this.tileX = next.x;
      this.tileY = next.y;
      this.path.shift();
      return this.path.length === 0;
    }

    if (this.leaving && !this.path.length) {
      world.handleAgentExit(this);
      return true;
    }

    if (!this.path.length) {
      if (this.target) {
        world.collectRevenue(this, this.target);
        this.target = null;
        if (this.leaving) {
          world.sendAgentToExit(this);
          return false;
        }
      }
      world.assignAgentTarget(this);
      return false;
    }

    const next = this.path[0];
    const dx = next.x - this.tileX;
    const dy = next.y - this.tileY;
    const dist = Math.hypot(dx, dy);

    if (dist > 0.02) {
      this.tileX += (dx / dist) * this.speed * delta;
      this.tileY += (dy / dist) * this.speed * delta;
      return false;
    }

    this.tileX = next.x;
    this.tileY = next.y;
    this.path.shift();
    return false;
  }
}

class Car {
  constructor({ tileX, tileY, speed, direction, stopTile, role, sprite, payload, width = 70, type, canStop = true, ignoreTraffic = false }) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.speed = speed;
    this.direction = direction;
    this.stopTile = stopTile;
    this.role = role;
    this.sprite = sprite;
    this.payload = payload;
    this.width = width;
    this.type = type;
    this.canStop = canStop;
    this.ignoreTraffic = ignoreTraffic;
    this.height = sprite ? (sprite.height / sprite.width) * width : 30;
    this.state = 'moving';
    this.stopTimer = 0;
    this.handled = false;
  }

  update(delta, world) {
    if (this.state === 'stopped') {
      this.stopTimer -= delta;
      if (this.stopTimer <= 0) {
        this.state = 'departing';
      }
      return false;
    }

    const nextX = this.tileX + this.speed * delta * this.direction.x;
    const nextY = this.tileY + this.speed * delta * this.direction.y;

    if (!this.ignoreTraffic) {
      const blocker = world.getBlockingCar(this);
      if (blocker) {
        const gap = world.carFollowDistance;
        if (this.direction.y > 0) {
          const maxY = blocker.tileY - gap;
          if (nextY > maxY) {
            this.tileX = nextX;
            this.tileY = Math.min(nextY, maxY);
            this.state = 'queued';
            return false;
          }
        } else if (this.direction.y < 0) {
          const minY = blocker.tileY + gap;
          if (nextY < minY) {
            this.tileX = nextX;
            this.tileY = Math.max(nextY, minY);
            this.state = 'queued';
            return false;
          }
        }
      }
    }

    this.state = 'moving';
    this.tileX = nextX;
    this.tileY = nextY;
    if (this.canStop && !this.handled) {
      const reachedStop =
        (this.direction.y >= 0 && this.tileY >= this.stopTile.y) ||
        (this.direction.y < 0 && this.tileY <= this.stopTile.y);
      if (reachedStop) {
        this.tileY = this.stopTile.y;
        this.state = 'stopped';
        this.stopTimer = 70;
        world.handleCarStop(this);
      }
    }

    if (this.tileY > world.roadBounds.maxY + 2) return true;
    return false;
  }

  draw(ctx, world) {
    const drawPos = world.getTileScreenCenter(this.tileX, this.tileY);
    const drawX = drawPos.x;
    const drawY = drawPos.y;

    if (this.sprite?.complete && this.sprite.naturalWidth > 0) {
      ctx.drawImage(this.sprite, drawX - this.width / 2, drawY - this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = '#333';
      ctx.fillRect(drawX - this.width / 2, drawY - this.height / 2, this.width, this.height);
    }
  }
}

class GameWorld {
  constructor({ canvas, ctx, ui, carSprites, terrainSprites, mapData }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ui = ui;
    this.camera = { x: 0, y: 0 };
    this.tileSize = 100;
    this.tileSpriteHeight = 58;
    this.tileHeight = Math.round(this.tileSpriteHeight * 0.8);
    this.tileScale = this.tileSize / 256;
    this.origin = { x: canvas.width / 2, y: 160 };
    this.money = 500;
    this.totalVisitors = 0;
    this.totalPets = 0;
    this.activeVisitors = 0;
    this.activePets = 0;
    this.completedVisits = 0;
    this.reviewScore = 0;
    this.reviewCount = 0;
    this.reviewScores = { fun: 0, food: 0, facilities: 0 };
    this.reviewRidesPerStar = 40;
    this.reviewInterval = 180000;
    this.lastReviewTime = 0;
    this.upkeepInterval = 180000;
    this.lastUpkeepTime = 0;
    this.audioReady = false;
    this.audioInitPromise = null;
    this.sleighbellThreshold = 40;
    this.sleighbellCooldown = 20000;
    this.lastSleighbellTime = 0;
    this.chimeCooldown = 20000;
    this.lastChimeTime = 0;
    this.billSoundCooldown = 20000;
    this.lastBillSoundTime = 0;
    this.buildSoundCooldown = 4000;
    this.lastBuildSoundTime = 0;
    this.errorSoundCooldown = 2000;
    this.lastErrorSoundTime = 0;
    this.joystickVector = { x: 0, y: 0 };
    this.joystickSpeed = 2.5;
    this.keySpeed = 4;
    this.zoom = 0.8;
    this.mapWidthMultiplier = 1.4;
    this.mapHeightMultiplier = 2.8;
    this.entryOffsetX = 10;
    this.mapData = mapData || null;
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.mapU = null;
    this.mapV = null;
    this.hasPositionedCamera = false;
    this.waterLaneX = null;
    this.beachLaneX = null;
    this.grassBufferLaneX = null;
    this.buildings = [];
    this.agents = [];
    this.cars = [];
    this.lastSpawn = 0;
    this.spawnInterval = 2400;
    this.lastCarSpawn = 0;
    this.baseCarSpawnInterval = 12000;
    this.minCarSpawnInterval = 7000;
    this.carSpawnRampVisits = 1200;
    this.carFollowDistance = 0.85;
    this.carLaneTolerance = 0.15;
    this.keys = { up: false, down: false, left: false, right: false };
    this.selectedItem = null;
    this.messageTimeout = null;
    this.entranceTile = { x: -6, y: -10 };
    this.exitTile = { x: -6, y: -8 };
    this.entrancePathTile = null;
    this.exitPathTile = null;
    this.roadLaneX = this.entranceTile.x;
    this.dropoffStop = { x: this.roadLaneX, y: -10 };
    this.pickupStop = { x: this.roadLaneX, y: -8 };
    this.roadBounds = { minY: -14, maxY: -2 };
    this.mapBounds = { minX: -12, maxX: 12, minY: -12, maxY: 12 };
    this.carSprites = carSprites;
    this.terrainSprites = terrainSprites;
    this.autosaveIntervalMs = 30000;
    this.autosaveTimer = null;
    this.treeDensity = 0.08;
    this.treeTiles = new Map();
    if (this.mapData) {
      this.initMapFromData(this.mapData);
    } else {
      this.pathTiles = this.createPathTiles();
      this.roadTiles = this.createRoadTiles();
    }
  }

  setSelectedItem(item) {
    this.selectedItem = item;
  }

  updateOrigin() {
    this.origin.x = this.canvas.width / 2;
    this.origin.y = 160;
  }

  getScaledTileSize() {
    return this.tileSize * this.zoom;
  }

  getScaledTileHeight() {
    return this.tileHeight * this.zoom;
  }

  getScaledSpriteHeight() {
    return this.tileSpriteHeight * this.zoom;
  }

  setMapBoundsFromScreen(
    widthMultiplier = this.mapWidthMultiplier,
    heightMultiplier = this.mapHeightMultiplier,
    marginTiles = 2
  ) {
    if (this.mapData) {
      this.setMapBoundsFromMap();
      return;
    }
    const halfW = this.getScaledTileSize() / 2;
    const halfH = this.getScaledTileHeight() / 2;
    const mapWidth = this.canvas.width * widthMultiplier;
    const mapHeight = this.canvas.height * heightMultiplier;
    const uRange = mapWidth / halfW;
    const vRange = mapHeight / halfH;
    const entryU = this.entranceTile.x - this.entranceTile.y;
    const entryV = this.entranceTile.x + this.entranceTile.y;
    const minU = entryU - marginTiles;
    const minV = entryV - marginTiles;
    const maxU = minU + uRange;
    const maxV = minV + vRange;
    this.mapU = { min: minU, max: maxU };
    this.mapV = { min: minV, max: maxV };
    this.mapBounds = this.getMapTileBounds();
    this.refreshTerrain();
  }

  refreshTerrain() {
    if (this.mapData) {
      this.buildMapIndices();
      return;
    }
    this.pathTiles = this.createPathTiles();
    this.roadLaneX = this.entranceTile.x;
    const bounds = this.getMapTileBounds();
    this.waterLaneX = this.roadLaneX - 3;
    this.beachLaneX = this.roadLaneX - 2;
    this.grassBufferLaneX = this.roadLaneX - 1;
    this.roadBounds = { minY: bounds.minY + 3, maxY: bounds.maxY };
    this.dropoffStop = { x: this.roadLaneX, y: this.entranceTile.y };
    this.pickupStop = { x: this.roadLaneX, y: this.entranceTile.y + 2 };
    this.roadTiles = this.createRoadTiles();
    this.entrancePathTile = this.findClosestPathTile(this.entranceTile) || this.entranceTile;
    this.exitPathTile = this.findClosestPathTile(this.exitTile) || this.exitTile;
  }

  setMapBoundsFromMap() {
    if (!this.mapData) return;
    this.mapBounds = {
      minX: 0,
      minY: 0,
      maxX: this.mapWidth - 1,
      maxY: this.mapHeight - 1
    };
    this.mapU = {
      min: this.mapBounds.minX - this.mapBounds.maxY,
      max: this.mapBounds.maxX - this.mapBounds.minY
    };
    this.mapV = {
      min: this.mapBounds.minX + this.mapBounds.minY,
      max: this.mapBounds.maxX + this.mapBounds.maxY
    };
  }

  initMapFromData(mapData) {
    this.mapData = mapData;
    this.mapWidth = mapData.width;
    this.mapHeight = mapData.height;
    this.setMapBoundsFromMap();
    this.buildMapIndices();
    this.generateTrees();
  }

  buildMapIndices() {
    if (!this.mapData) return;
    this.pathTiles = new Set();
    this.roadTiles = new Set();
    const entryTiles = [];
    const roadXCounts = new Map();
    let roadMinY = Infinity;
    let roadMaxY = -Infinity;

    for (let row = 0; row < this.mapHeight; row++) {
      const line = this.mapData.grid[row] || [];
      for (let col = 0; col < this.mapWidth; col++) {
        const tileType = line[col] || 'G';
        const tileX = this.mapBounds.minX + col;
        const tileY = this.mapBounds.minY + row;
        if (tileType === 'P') {
          this.pathTiles.add(this.tileKey(tileX, tileY));
        }
        if (tileType === 'R' || tileType === 'E') {
          this.roadTiles.add(this.tileKey(tileX, tileY));
          roadXCounts.set(tileX, (roadXCounts.get(tileX) || 0) + 1);
          roadMinY = Math.min(roadMinY, tileY);
          roadMaxY = Math.max(roadMaxY, tileY);
        }
        if (tileType === 'E') {
          entryTiles.push({ x: tileX, y: tileY });
        }
      }
    }

    let roadLaneX = this.roadLaneX;
    if (roadXCounts.size) {
      roadLaneX = [...roadXCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }
    this.roadLaneX = roadLaneX;

    if (entryTiles.length) {
      entryTiles.sort((a, b) => a.y - b.y);
      this.exitTile = entryTiles[0];
      this.entranceTile = entryTiles[entryTiles.length - 1];
    } else {
      const roadEntries = [...this.roadTiles].map((key) => {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
      });
      roadEntries.sort((a, b) => a.y - b.y);
      this.exitTile = roadEntries[0] || { x: roadLaneX, y: this.mapBounds.minY };
      this.entranceTile = roadEntries[roadEntries.length - 1] || {
        x: roadLaneX,
        y: this.mapBounds.maxY
      };
    }

    if (roadMinY === Infinity) {
      roadMinY = this.mapBounds.minY;
      roadMaxY = this.mapBounds.maxY;
    }
    this.roadBounds = { minY: roadMinY, maxY: roadMaxY };
    this.dropoffStop = { x: this.entranceTile.x, y: this.entranceTile.y };
    this.pickupStop = { x: this.exitTile.x, y: this.exitTile.y };
    this.entrancePathTile = this.findClosestPathTile(this.entranceTile) || this.entranceTile;
    this.exitPathTile = this.findClosestPathTile(this.exitTile) || this.exitTile;
  }

  generateTrees() {
    if (!this.mapData) return;
    this.treeTiles.clear();
    for (let row = 0; row < this.mapHeight; row++) {
      const line = this.mapData.grid[row] || [];
      for (let col = 0; col < this.mapWidth; col++) {
        const tileType = line[col] || 'G';
        if (tileType !== 'G') continue;
        if (Math.random() > this.treeDensity) continue;
        const tileX = this.mapBounds.minX + col;
        const tileY = this.mapBounds.minY + row;
        const key = this.tileKey(tileX, tileY);
        if (this.pathTiles?.has(key) || this.roadTiles?.has(key)) continue;
        const type = Math.random() > 0.6 ? 'tall' : 'short';
        this.treeTiles.set(key, type);
      }
    }
  }

  getMapTileBounds() {
    if (this.mapData && this.mapBounds) return this.mapBounds;
    if (!this.mapU || !this.mapV) return this.mapBounds;
    const minX = Math.floor((this.mapU.min + this.mapV.min) / 2);
    const maxX = Math.ceil((this.mapU.max + this.mapV.max) / 2);
    const minY = Math.floor((this.mapV.min - this.mapU.max) / 2);
    const maxY = Math.ceil((this.mapV.max - this.mapU.min) / 2);
    return { minX, maxX, minY, maxY };
  }

  getMapTileType(tileX, tileY) {
    if (!this.mapData) return null;
    const row = tileY - this.mapBounds.minY;
    const col = tileX - this.mapBounds.minX;
    const line = this.mapData.grid[row];
    if (!line) return null;
    return line[col] || 'G';
  }

  setMapTileType(tileX, tileY, type) {
    if (!this.mapData) return;
    const row = tileY - this.mapBounds.minY;
    const col = tileX - this.mapBounds.minX;
    const line = this.mapData.grid[row];
    if (!line || col < 0 || col >= line.length) return;
    line[col] = type;
  }

  positionCameraAtTopLeft() {
    const bounds = this.getMapTileBounds();
    if (!bounds) return;
    const halfW = this.getScaledTileSize() / 2;
    const halfH = this.getScaledTileHeight() / 2;
    this.camera.x = (bounds.minX - bounds.minY) * halfW + this.origin.x;
    this.camera.y = (bounds.minX + bounds.minY) * halfH + this.origin.y;
    this.clampCamera();
  }

  positionCameraAtTile(tileX, tileY, offsetX = 0, offsetY = 0) {
    const halfW = this.getScaledTileSize() / 2;
    const halfH = this.getScaledTileHeight() / 2;
    this.camera.x = (tileX - tileY) * halfW + this.origin.x - this.canvas.width / 2 + offsetX;
    this.camera.y = (tileX + tileY) * halfH + this.origin.y - this.canvas.height / 2 + offsetY;
    this.clampCamera();
  }

  positionCameraAtEntry(offsetX = 0) {
    const entry = this.entranceTile || { x: 0, y: 0 };
    this.positionCameraAtTile(entry.x, entry.y, offsetX, 0);
  }

  clampCamera() {
    if (!this.mapU || !this.mapV) return;
    const halfW = this.getScaledTileSize() / 2;
    const halfH = this.getScaledTileHeight() / 2;
    let minX = this.mapU.min * halfW + this.origin.x;
    let maxX = this.mapU.max * halfW + this.origin.x - this.canvas.width;
    let minY = this.mapV.min * halfH + this.origin.y;
    let maxY = this.mapV.max * halfH + this.origin.y - this.canvas.height;
    if (maxX < minX) {
      const mid = (minX + maxX) / 2;
      minX = mid;
      maxX = mid;
    }
    if (maxY < minY) {
      const mid = (minY + maxY) / 2;
      minY = mid;
      maxY = mid;
    }
    this.camera.x = Math.min(Math.max(this.camera.x, minX), maxX);
    this.camera.y = Math.min(Math.max(this.camera.y, minY), maxY);
  }

  tileKey(x, y) {
    return `${x},${y}`;
  }

  getBuildingAtTile(tileX, tileY) {
    return this.buildings.find((building) => building.occupies(tileX, tileY)) ?? null;
  }

  isGrassTile(tileX, tileY) {
    if (!this.mapData) {
      const key = this.tileKey(tileX, tileY);
      return !this.pathTiles.has(key) && !this.roadTiles?.has(key);
    }
    return this.getMapTileType(tileX, tileY) === 'G';
  }

  addPathTile(tileX, tileY) {
    const key = this.tileKey(tileX, tileY);
    const tileType = this.getMapTileType(tileX, tileY);
    if (this.mapData && tileType === null) return false;
    if (tileType && tileType !== 'G' && tileType !== 'P') return false;
    this.pathTiles.add(key);
    if (this.mapData) {
      this.setMapTileType(tileX, tileY, 'P');
    }
    if (this.treeTiles) {
      this.treeTiles.delete(key);
    }
    return true;
  }

  createPathTiles() {
    const tiles = new Set();
    const bounds = this.getMapTileBounds();
    const margin = 3;
    const minX = bounds.minX + margin;
    const maxX = bounds.maxX - margin;
    const pathMinY = bounds.minY + margin + 1;
    const pathMaxY = bounds.maxY - margin;

    const entryY = pathMaxY;
    const entryX = Math.min(Math.max(minX + this.entryOffsetX, minX), maxX);
    this.entranceTile = { x: entryX, y: entryY };
    this.exitTile = { x: Math.min(entryX + 1, maxX), y: entryY };

    const entryPathLength = 3;
    for (let i = 0; i < entryPathLength; i++) {
      tiles.add(this.tileKey(entryX, entryY - i));
    }

    const blockWidth = Math.max(8, Math.floor((maxX - minX + 1) * 0.4));
    const blockHeight = Math.max(6, Math.floor((pathMaxY - pathMinY + 1) * 0.25));
    const blockCenterX = Math.min(Math.max(entryX, minX + 2), maxX - 2);
    let blockLeft = blockCenterX - Math.floor(blockWidth / 2);
    let blockRight = blockLeft + blockWidth - 1;
    if (blockLeft < minX) {
      blockRight += minX - blockLeft;
      blockLeft = minX;
    }
    if (blockRight > maxX) {
      blockLeft -= blockRight - maxX;
      blockRight = maxX;
    }
    blockLeft = Math.max(blockLeft, minX);
    blockRight = Math.min(blockRight, maxX);

    const gap = 3;
    let blockBottom = entryY - entryPathLength - gap;
    const minBlockBottom = pathMinY + blockHeight - 1;
    if (blockBottom < minBlockBottom) blockBottom = minBlockBottom;
    if (blockBottom > pathMaxY) blockBottom = pathMaxY;
    let blockTop = blockBottom - blockHeight + 1;
    if (blockTop < pathMinY) {
      blockTop = pathMinY;
      blockBottom = blockTop + blockHeight - 1;
    }

    for (let x = blockLeft; x <= blockRight; x++) {
      for (let y = blockTop; y <= blockBottom; y++) {
        tiles.add(this.tileKey(x, y));
      }
    }

    const entryPathTop = entryY - (entryPathLength - 1);
    for (let y = entryPathTop - 1; y >= blockBottom; y--) {
      tiles.add(this.tileKey(entryX, y));
    }

    const midY = Math.floor((blockTop + blockBottom) / 2);
    const midX = Math.floor((blockLeft + blockRight) / 2);
    const spurLength = 3;
    for (let i = 1; i <= spurLength; i++) {
      if (blockTop - i >= pathMinY) tiles.add(this.tileKey(midX, blockTop - i));
      if (blockLeft - i >= minX) tiles.add(this.tileKey(blockLeft - i, midY));
      if (blockRight + i <= maxX) tiles.add(this.tileKey(blockRight + i, midY));
    }

    tiles.add(this.tileKey(this.entranceTile.x, this.entranceTile.y));
    tiles.add(this.tileKey(this.exitTile.x, this.exitTile.y));
    return tiles;
  }

  createRoadTiles() {
    const tiles = new Set();
    for (let y = this.roadBounds.minY; y <= this.roadBounds.maxY; y++) {
      tiles.add(this.tileKey(this.roadLaneX, y));
    }
    return tiles;
  }

  getTileYOffset() {
    return this.getScaledTileHeight() / 2 - this.getScaledSpriteHeight() / 2;
  }

  getTileScreenCenter(tileX, tileY) {
    const screen = this.isoToScreen(tileX, tileY);
    return { x: screen.x, y: screen.y + this.getTileYOffset() };
  }

  isoToScreen(tileX, tileY) {
    const screenX = (tileX - tileY) * (this.getScaledTileSize() / 2) + this.origin.x - this.camera.x;
    const screenY = (tileX + tileY) * (this.getScaledTileHeight() / 2) + this.origin.y - this.camera.y;
    return { x: screenX, y: screenY };
  }

  drawTileImage(image, tileX, tileY) {
    if (!image?.complete || image.naturalWidth === 0) return;
    const screen = this.getTileScreenCenter(tileX, tileY);
    const trim = image.trim;
    if (trim) {
      const destW = this.getScaledTileSize();
      const scale = destW / trim.width;
      const destH = trim.height * scale;
      this.ctx.drawImage(
        image,
        trim.x,
        trim.y,
        trim.width,
        trim.height,
        screen.x - destW / 2,
        screen.y - destH / 2,
        destW,
        destH
      );
      return;
    }
    const destW = this.getScaledTileSize();
    const destH = this.getScaledSpriteHeight();
    this.ctx.drawImage(
      image,
      screen.x - destW / 2,
      screen.y - destH / 2,
      destW,
      destH
    );
  }

  drawTreeImage(image, tileX, tileY, scale) {
    if (!image?.complete || image.naturalWidth === 0) return;
    const screen = this.getTileScreenCenter(tileX, tileY);
    const trim = image.trim;
    const baseYOffset = (1 - scale) * this.getScaledSpriteHeight() * 0.25;
    if (trim) {
      const destW = this.getScaledTileSize() * scale;
      const ratio = destW / trim.width;
      const destH = trim.height * ratio;
      this.ctx.drawImage(
        image,
        trim.x,
        trim.y,
        trim.width,
        trim.height,
        screen.x - destW / 2,
        screen.y - destH / 2 + baseYOffset,
        destW,
        destH
      );
      return;
    }
    const destW = this.getScaledTileSize() * scale;
    const destH = this.getScaledSpriteHeight() * scale;
    this.ctx.drawImage(
      image,
      screen.x - destW / 2,
      screen.y - destH / 2 + baseYOffset,
      destW,
      destH
    );
  }

  getVisibleTileBounds(padding = 3) {
    const points = [
      { x: 0, y: 0 },
      { x: this.canvas.width, y: 0 },
      { x: 0, y: this.canvas.height },
      { x: this.canvas.width, y: this.canvas.height },
      { x: this.canvas.width / 2, y: 0 },
      { x: this.canvas.width / 2, y: this.canvas.height },
      { x: 0, y: this.canvas.height / 2 },
      { x: this.canvas.width, y: this.canvas.height / 2 }
    ];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    points.forEach((point) => {
      const world = this.screenToWorld(point.x, point.y);
      minX = Math.min(minX, world.x);
      maxX = Math.max(maxX, world.x);
      minY = Math.min(minY, world.y);
      maxY = Math.max(maxY, world.y);
    });
    const bounds = {
      minX: Math.floor(minX) - padding,
      maxX: Math.ceil(maxX) + padding,
      minY: Math.floor(minY) - padding,
      maxY: Math.ceil(maxY) + padding
    };
    const mapBounds = this.getMapTileBounds();
    if (!mapBounds) return bounds;
    return {
      minX: Math.max(bounds.minX, mapBounds.minX),
      maxX: Math.min(bounds.maxX, mapBounds.maxX),
      minY: Math.max(bounds.minY, mapBounds.minY),
      maxY: Math.min(bounds.maxY, mapBounds.maxY)
    };
  }

  drawTileLayer(drawFn, bounds = this.getVisibleTileBounds()) {
    const { minX, maxX, minY, maxY } = bounds;
    for (let sum = minX + minY; sum <= maxX + maxY; sum++) {
      for (let x = minX; x <= maxX; x++) {
        const y = sum - x;
        if (y < minY || y > maxY) continue;
        drawFn(x, y);
      }
    }
  }

  drawIsoDiamond(tileX, tileY, color) {
    const { ctx } = this;
    const center = this.getTileScreenCenter(tileX, tileY);
    const halfW = this.getScaledTileSize() / 2;
    const halfH = this.getScaledSpriteHeight() / 2;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y - halfH);
    ctx.lineTo(center.x + halfW, center.y);
    ctx.lineTo(center.x, center.y + halfH);
    ctx.lineTo(center.x - halfW, center.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  getFootprint(item) {
    if (item?.tileWidth && item?.tileHeight) {
      return { tileWidth: item.tileWidth, tileHeight: item.tileHeight };
    }
    if (item?.category === 'service') {
      return { tileWidth: 2, tileHeight: 2 };
    }
    return { tileWidth: 1, tileHeight: 1 };
  }

  findClosestPathTile(tile) {
    if (!tile || !this.pathTiles?.size) return null;
    const startKey = this.tileKey(tile.x, tile.y);
    if (this.pathTiles.has(startKey)) return { x: tile.x, y: tile.y };
    let closest = null;
    let minDist = Infinity;
    this.pathTiles.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      const dist = Math.abs(x - tile.x) + Math.abs(y - tile.y);
      if (dist < minDist) {
        minDist = dist;
        closest = { x, y };
      }
    });
    return closest;
  }

  findAdjacentPathTile(building) {
    const candidates = [];
    for (let x = building.tileX - 1; x <= building.tileX + building.tileWidth; x++) {
      for (let y = building.tileY - 1; y <= building.tileY + building.tileHeight; y++) {
        const onEdge =
          x === building.tileX - 1 ||
          x === building.tileX + building.tileWidth ||
          y === building.tileY - 1 ||
          y === building.tileY + building.tileHeight;
        if (!onEdge) continue;
        const key = this.tileKey(x, y);
        if (this.pathTiles.has(key)) {
          candidates.push({ x, y });
        }
      }
    }
    if (!candidates.length) return null;
    candidates.sort((a, b) => {
      const distA = Math.hypot(a.x - building.tileX, a.y - building.tileY);
      const distB = Math.hypot(b.x - building.tileX, b.y - building.tileY);
      return distA - distB;
    });
    return candidates[0];
  }

  handleAgentExit(agent) {
    if (agent.isStaff) return;
    if (agent.isPet) {
      this.activePets = Math.max(0, this.activePets - 1);
    } else {
      this.activeVisitors = Math.max(0, this.activeVisitors - 1);
    }
  }

  sendAgentToExit(agent) {
    agent.leaving = true;
    const exitTarget = this.exitPathTile || this.exitTile;
    const start = { x: Math.round(agent.tileX), y: Math.round(agent.tileY) };
    const path = this.findPath(start, exitTarget);
    agent.assignPath(path, null);
  }

  assignAgentTarget(agent) {
    if (agent.leaving) {
      this.sendAgentToExit(agent);
      return;
    }
    const target = this.pickTarget(agent);
    if (!target) {
      agent.leaving = true;
      this.sendAgentToExit(agent);
      return;
    }

    const start = { x: Math.round(agent.tileX), y: Math.round(agent.tileY) };
    const path = this.findPath(start, target.pathTile);
    if (!path.length && (start.x !== target.pathTile.x || start.y !== target.pathTile.y)) {
      agent.assignPath([], null);
      return;
    }
    agent.assignPath(path, target.building);
  }

  findPath(start, goal) {
    if (!start || !goal) return [];
    const startKey = this.tileKey(start.x, start.y);
    const goalKey = this.tileKey(goal.x, goal.y);
    if (!this.pathTiles.has(startKey) || !this.pathTiles.has(goalKey)) return [];

    const queue = [start];
    const cameFrom = new Map();
    cameFrom.set(startKey, null);

    while (queue.length) {
      const current = queue.shift();
      const currentKey = this.tileKey(current.x, current.y);
      if (currentKey === goalKey) break;

      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];
      neighbors.forEach((neighbor) => {
        const key = this.tileKey(neighbor.x, neighbor.y);
        if (!this.pathTiles.has(key) || cameFrom.has(key)) return;
        cameFrom.set(key, current);
        queue.push(neighbor);
      });
    }

    if (!cameFrom.has(goalKey)) return [];

    const path = [];
    let current = goal;
    while (current) {
      const key = this.tileKey(current.x, current.y);
      const prev = cameFrom.get(key);
      if (prev) {
        path.unshift({ x: current.x, y: current.y });
      }
      current = prev;
    }
    return path;
  }

  showMessage(text) {
    this.addChatMessage(text);
  }

  addChatMessage(text) {
    if (!this.ui.chatMessages) return;
    const message = document.createElement('div');
    message.className = 'chatMessage';
    message.textContent = text;
    this.ui.chatMessages.append(message);
    setTimeout(() => {
      message.classList.add('fading');
    }, 10000);
    setTimeout(() => {
      message.remove();
    }, 11000);
  }

  addReviewMessage(text) {
    if (!this.ui.reviewMessages) return;
    const message = document.createElement('div');
    message.className = 'reviewMessage';
    message.textContent = text;
    this.ui.reviewMessages.append(message);
    setTimeout(() => {
      message.classList.add('fading');
    }, 14000);
    setTimeout(() => {
      message.remove();
    }, 20000);
  }

  spawnBusinessStaff(tile) {
    const target = this.findClosestPathTile(tile);
    const staff = new Agent({
      tileX: tile.x,
      tileY: tile.y,
      isPet: false,
      speed: 0.035,
      emoji: '💼',
      isStaff: true
    });
    if (target) {
      staff.path = [target];
    }
    this.agents.push(staff);
  }

  getSoundFn() {
    if (typeof window.s === 'function') return window.s;
    if (typeof window.sound === 'function') return window.sound;
    if (typeof window.strudel?.s === 'function') return window.strudel.s;
    if (typeof window.strudel?.sound === 'function') return window.strudel.sound;
    return null;
  }

  async waitForSoundFn() {
    const start = performance.now();
    while (performance.now() - start < 4000) {
      if (this.getSoundFn()) return true;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return false;
  }

  async initAudio() {
    if (this.audioReady) return true;
    if (this.audioInitPromise) return this.audioInitPromise;
    if (typeof window.initStrudel !== 'function') return false;

    this.audioInitPromise = (async () => {
      window.initStrudel({
        prebake: async () => {
          if (typeof window.samples === 'function') {
            await window.samples(
              'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json'
            );
          }
        }
      });

      const ready = await this.waitForSoundFn();
      this.audioReady = ready;
      return ready;
    })();

    const ready = await this.audioInitPromise;
    if (!ready) this.audioInitPromise = null;
    return ready;
  }

  playSoundPattern(name, cooldown, lastTimeKey, hushDelay) {
    if (!this.audioReady) {
      this.initAudio();
      return;
    }
    const now = performance.now();
    if (now - this[lastTimeKey] < cooldown) return;
    const soundFn = this.getSoundFn();
    if (!soundFn) return;
    try {
      const pattern = soundFn(name);
      if (!pattern?.play) return;
      pattern.play();
      this[lastTimeKey] = now;
      if (typeof window.hush === 'function') {
        setTimeout(() => {
          window.hush();
        }, hushDelay);
      }
    } catch (error) {
      console.warn('Sound playback failed', error);
      this.audioReady = false;
      this.audioInitPromise = null;
    }
  }

  playSleighbells() {
    this.playSoundPattern('anvil', this.sleighbellCooldown, 'lastSleighbellTime', 1200);
  }

  playHandchimes() {
    this.playSoundPattern('handchimes(19)', this.chimeCooldown, 'lastChimeTime', 1200);
  }

  playBillSound() {
    this.playSoundPattern('harmonica', this.billSoundCooldown, 'lastBillSoundTime', 1200);
  }

  playBuildSound() {
    this.playSoundPattern('ratchet', this.buildSoundCooldown, 'lastBuildSoundTime', 700);
  }

  playErrorSound() {
    this.playSoundPattern('didgeridoo(12)', this.errorSoundCooldown, 'lastErrorSoundTime', 900);
  }

  updateStats() {
    this.ui.money.textContent = this.money.toFixed(0);
    this.ui.visitors.textContent = this.totalVisitors;
    this.ui.pets.textContent = this.totalPets;
    this.ui.active.textContent = this.activeVisitors + this.activePets;
    const reviewScore = this.calculateReviewScore();
    if (this.ui.reviewScore) {
      this.ui.reviewScore.textContent = reviewScore.toFixed(1);
    }
    if (this.ui.reviewStars) {
      this.ui.reviewStars.textContent = this.formatStars(reviewScore);
    }
    if (this.ui.reviewFun) {
      this.ui.reviewFun.textContent = (this.reviewScores.fun || 0).toFixed(1);
    }
    if (this.ui.reviewFood) {
      this.ui.reviewFood.textContent = (this.reviewScores.food || 0).toFixed(1);
    }
    if (this.ui.reviewFacilities) {
      this.ui.reviewFacilities.textContent = (this.reviewScores.facilities || 0).toFixed(1);
    }
    if (this.ui.reviewFunStars) {
      this.ui.reviewFunStars.textContent = this.formatStars(this.reviewScores.fun || 0);
    }
    if (this.ui.reviewFoodStars) {
      this.ui.reviewFoodStars.textContent = this.formatStars(this.reviewScores.food || 0);
    }
    if (this.ui.reviewFacilitiesStars) {
      this.ui.reviewFacilitiesStars.textContent = this.formatStars(this.reviewScores.facilities || 0);
    }
  }

  formatStars(score) {
    const fullStars = Math.floor(score);
    const emptyStars = Math.max(0, 5 - fullStars);
    return `${'★'.repeat(fullStars)}${'☆'.repeat(emptyStars)}`;
  }

  pickVisitorEmoji() {
    return pickWeightedEmoji(VISITOR_EMOJI_WEIGHTS);
  }

  pickPetEmoji() {
    return pickWeightedEmoji(PET_EMOJI_WEIGHTS);
  }

  getPaidRideCount() {
    return this.buildings.filter((building) => building.price > 0 || building.petPrice > 0).length;
  }

  getParkSpendScore() {
    if (!this.buildings.length) return 0;
    const paidOptions = this.getPaidRideCount();
    const paidTypes = new Set(
      this.buildings
        .filter((building) => building.price > 0 || building.petPrice > 0)
        .map((building) => building.type)
    ).size;
    const totalSize = this.buildings.reduce((sum, building) => sum + building.tileWidth * building.tileHeight, 0);
    const sizeScore = Math.min(1, totalSize / 80);
    const optionScore = Math.min(1, paidOptions / 10);
    const varietyScore = Math.min(1, paidTypes / 6);
    let score = sizeScore * 0.5 + optionScore * 0.35 + varietyScore * 0.15;
    if (paidOptions <= 3) {
      score *= 0.5;
    }
    return Math.min(1, Math.max(0, score));
  }

  generateAgentBudget(isPet) {
    const spendScore = this.getParkSpendScore();
    const reviewBoost = this.calculateReviewScore() / 5;
    const combined = Math.min(1, spendScore + reviewBoost * 0.1);
    const maxBudget = isPet ? 70 : 120;
    const maxBase = isPet ? 22 : 32;
    const minBase = isPet ? 6 : 8;
    const min = minBase + combined * 12;
    const max = maxBase + combined * (maxBudget - maxBase);
    const budget = Math.round(min + Math.random() * (max - min));
    const spendFactor = 0.4 + combined * 0.35 + Math.random() * 0.15;
    const spendLimit = Math.max(2, Math.round(budget * Math.min(0.95, spendFactor)));
    return { budget, spendLimit };
  }

  getReviewCap() {
    const paidRides = this.buildings.filter((building) => building.price > 0 || building.petPrice > 0);
    const uniqueTypes = new Set(paidRides.map((building) => building.type)).size;
    const baseScore = Math.floor(Math.sqrt(paidRides.length + uniqueTypes));
    return Math.min(5, baseScore);
  }

  startAutosave() {
    if (typeof localStorage === 'undefined') return;
    if (this.autosaveTimer) return;
    this.autosaveTimer = setInterval(() => this.saveGame(), this.autosaveIntervalMs);
    window.addEventListener('beforeunload', () => this.saveGame());
  }

  saveGame() {
    if (typeof localStorage === 'undefined') return;
    const data = {
      version: 1,
      savedAt: Date.now(),
      money: this.money,
      totalVisitors: this.totalVisitors,
      totalPets: this.totalPets,
      completedVisits: this.completedVisits,
      reviewScore: this.reviewScore,
      reviewCount: this.reviewCount,
      reviewScores: this.reviewScores,
      pathTiles: this.mapData ? [...this.pathTiles] : [],
      buildings: this.buildings.map((building) => ({
        type: building.type,
        tileX: building.tileX,
        tileY: building.tileY,
        cost: building.cost,
        price: building.price,
        petPrice: building.petPrice,
        category: building.category,
        tileWidth: building.tileWidth,
        tileHeight: building.tileHeight
      }))
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Autosave failed', error);
    }
  }

  loadGame() {
    if (typeof localStorage === 'undefined') return false;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      if (!data || data.version !== 1) return false;
      this.money = Number.isFinite(data.money) ? data.money : this.money;
      this.totalVisitors = Number.isFinite(data.totalVisitors) ? data.totalVisitors : this.totalVisitors;
      this.totalPets = Number.isFinite(data.totalPets) ? data.totalPets : this.totalPets;
      this.completedVisits = Number.isFinite(data.completedVisits) ? data.completedVisits : this.completedVisits;
      this.reviewScore = Number.isFinite(data.reviewScore) ? data.reviewScore : this.reviewScore;
      this.reviewCount = Number.isFinite(data.reviewCount) ? data.reviewCount : this.reviewCount;
      if (data.reviewScores) {
        this.reviewScores = {
          fun: Number.isFinite(data.reviewScores.fun) ? data.reviewScores.fun : this.reviewScores.fun,
          food: Number.isFinite(data.reviewScores.food) ? data.reviewScores.food : this.reviewScores.food,
          facilities: Number.isFinite(data.reviewScores.facilities) ? data.reviewScores.facilities : this.reviewScores.facilities
        };
      }

      this.buildings = Array.isArray(data.buildings)
        ? data.buildings.map(
            (building) =>
              new Building({
                type: building.type,
                tileX: building.tileX,
                tileY: building.tileY,
                cost: building.cost,
                price: building.price,
                petPrice: building.petPrice,
                category: building.category,
                tileWidth: building.tileWidth,
                tileHeight: building.tileHeight
              })
          )
        : [];

      if (Array.isArray(data.pathTiles) && this.mapData) {
        data.pathTiles.forEach((key) => {
          if (typeof key !== 'string') return;
          const [x, y] = key.split(',').map(Number);
          if (!Number.isFinite(x) || !Number.isFinite(y)) return;
          this.addPathTile(x, y);
        });
      }
      this.buildings.forEach((building) => {
        building.pathTile = this.findAdjacentPathTile(building);
      });

      this.agents = [];
      this.cars = [];
      this.activeVisitors = 0;
      this.activePets = 0;

      const now = performance.now();
      const elapsed = Number.isFinite(data.savedAt) ? Date.now() - data.savedAt : 0;
      const reviewLag = Math.min(Math.max(0, elapsed), this.reviewInterval - 1000);
      const upkeepLag = Math.min(Math.max(0, elapsed), this.upkeepInterval - 1000);
      this.lastReviewTime = now - reviewLag;
      this.lastUpkeepTime = now - upkeepLag;
      this.updateStats();
      return true;
    } catch (error) {
      console.warn('Failed to load save', error);
      return false;
    }
  }

  clearSavedGame() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(SAVE_KEY);
  }

  calculateReviewScore() {
    return Math.max(0, Math.min(this.reviewScore, 5));
  }

  getParkBalanceScore() {
    if (!this.buildings.length) return { fun: 0, food: 0, facilities: 0, overall: 0 };
    const guests = Math.max(1, this.activeVisitors + this.activePets);
    let funUnits = 0;
    let foodUnits = 0;
    let essentialUnits = 0;
    const uniqueTypes = new Set();
    let totalSize = 0;
    let paidOptions = 0;

    this.buildings.forEach((building) => {
      const size = building.tileWidth * building.tileHeight;
      uniqueTypes.add(building.type);
      totalSize += size;
      if (building.price > 0 || building.petPrice > 0) {
        paidOptions += 1;
      }
      if (building.category === 'food') {
        foodUnits += size;
      } else if (building.category === 'facility') {
        essentialUnits += size;
      } else if (building.category === 'attraction' || building.category === 'service' || building.category === 'internet') {
        funUnits += size;
      } else if (building.category === 'pet') {
        funUnits += size * 0.5;
        foodUnits += size * 0.3;
      }
    });

    const parkScaleRaw = (totalSize / 24 + paidOptions / 8 + uniqueTypes.size / 10) / 3;
    const parkScale = Math.min(1, Math.max(0, parkScaleRaw));
    const funNeeded = Math.max(6, guests / 4);
    const foodNeeded = Math.max(4, guests / 8);
    const essentialNeeded = Math.max(3, guests / 10);
    const varietyNeeded = Math.max(4, guests / 8);

    const funScore = Math.min(1, funUnits / funNeeded) * parkScale;
    const foodScore = Math.min(1, foodUnits / foodNeeded) * parkScale;
    const facilitiesScore = Math.min(1, essentialUnits / essentialNeeded) * parkScale;
    const varietyScore = Math.min(1, uniqueTypes.size / varietyNeeded) * parkScale;

    const overall = funScore * 0.6 + foodScore * 0.2 + facilitiesScore * 0.15 + varietyScore * 0.05;
    return { fun: funScore, food: foodScore, facilities: facilitiesScore, overall, scale: parkScale };
  }

  generateReview() {
    if (!this.buildings.length) return;
    const balanceScore = this.getParkBalanceScore();
    const noise = (Math.random() - 0.5) * 0.35 * Math.max(0.3, balanceScore.scale ?? 0.3);
    const funReview = Math.max(0, Math.min(5, balanceScore.fun * 5 + noise));
    const foodReview = Math.max(0, Math.min(5, balanceScore.food * 5 + noise));
    const facilitiesReview = Math.max(0, Math.min(5, balanceScore.facilities * 5 + noise));
    const overallReview = Math.max(0, Math.min(5, balanceScore.overall * 5 + noise));
    this.reviewScores = {
      fun: (this.reviewScores.fun * this.reviewCount + funReview) / (this.reviewCount + 1),
      food: (this.reviewScores.food * this.reviewCount + foodReview) / (this.reviewCount + 1),
      facilities: (this.reviewScores.facilities * this.reviewCount + facilitiesReview) / (this.reviewCount + 1)
    };
    this.reviewScore = (this.reviewScore * this.reviewCount + overallReview) / (this.reviewCount + 1);
    this.reviewCount += 1;
    this.addReviewMessage(
      `Review: ${this.formatStars(overallReview)} (Fun ${funReview.toFixed(1)}, Food ${foodReview.toFixed(1)}, Facilities ${facilitiesReview.toFixed(1)})`
    );
    this.playHandchimes();
  }

  calculateUpkeepCost() {
    if (!this.buildings.length) return 0;
    let cost = 25;
    this.buildings.forEach((building) => {
      const size = building.tileWidth * building.tileHeight;
      let rate = 4;
      if (building.category === 'facility') rate = 3;
      if (building.category === 'food') rate = 4;
      if (building.category === 'service') rate = 7;
      if (building.category === 'internet') rate = 5;
      if (building.category === 'pet') rate = 4;
      cost += rate * size;
    });
    const total = Math.round(cost);
    const water = Math.round(total * 0.4);
    const electricity = Math.round(total * 0.35);
    const wages = Math.max(0, total - water - electricity);
    return { total, water, electricity, wages };
  }

  applyUpkeepCost(breakdown) {
    if (!breakdown?.total) return;
    this.money = Math.max(0, this.money - breakdown.total);
    this.addChatMessage(
      `⚙️ Operating costs: -$${breakdown.total} (Water $${breakdown.water}, Electricity $${breakdown.electricity}, Wages $${breakdown.wages})`
    );
    this.playBillSound();
  }

  adjustCamera(delta) {
    const speed = 0.35 * delta * 16;
    if (this.keys.left) this.camera.x -= speed * this.keySpeed;
    if (this.keys.right) this.camera.x += speed * this.keySpeed;
    if (this.keys.up) this.camera.y -= speed * this.keySpeed;
    if (this.keys.down) this.camera.y += speed * this.keySpeed;
    this.camera.x += this.joystickVector.x * speed * this.joystickSpeed;
    this.camera.y += this.joystickVector.y * speed * this.joystickSpeed;
    this.clampCamera();
  }

  screenToWorld(x, y) {
    const adjustedX = x + this.camera.x - this.origin.x;
    const adjustedY = y + this.camera.y - this.origin.y - this.getTileYOffset();
    const tileX = (adjustedY / (this.getScaledTileHeight() / 2) + adjustedX / (this.getScaledTileSize() / 2)) / 2;
    const tileY = (adjustedY / (this.getScaledTileHeight() / 2) - adjustedX / (this.getScaledTileSize() / 2)) / 2;
    return { x: tileX, y: tileY };
  }

  placeBuilding(worldX, worldY) {
    if (!this.selectedItem) return;
    const { type, cost, price, petPrice, category } = this.selectedItem;
    const tileX = Math.round(worldX);
    const tileY = Math.round(worldY);
    if (type === 'path') {
      this.placePathTile(tileX, tileY, cost);
      return;
    }
    if (type === 'bulldoze') {
      this.removeAttraction(tileX, tileY, cost);
      return;
    }
    if (this.money < cost) {
      this.showMessage('Not enough money!');
      this.playErrorSound();
      return;
    }

    const { tileWidth, tileHeight } = this.getFootprint(this.selectedItem);
    const building = new Building({
      type,
      tileX,
      tileY,
      cost,
      price,
      petPrice,
      category,
      tileWidth,
      tileHeight
    });

    const overlaps = this.buildings.some((other) => {
      for (let x = building.tileX; x < building.tileX + building.tileWidth; x++) {
        for (let y = building.tileY; y < building.tileY + building.tileHeight; y++) {
          if (other.occupies(x, y)) {
            return true;
          }
        }
      }
      return false;
    });

    if (overlaps) {
      this.showMessage('Too close to another building!');
      this.playErrorSound();
      return;
    }

    for (let x = building.tileX; x < building.tileX + building.tileWidth; x++) {
      for (let y = building.tileY; y < building.tileY + building.tileHeight; y++) {
        if (this.pathTiles.has(this.tileKey(x, y))) {
          this.showMessage('Cannot build on a path!');
          this.playErrorSound();
          return;
        }
      }
    }

    const adjacentPath = this.findAdjacentPathTile(building);
    if (!adjacentPath) {
      this.showMessage('Buildings must be placed next to a path!');
      this.playErrorSound();
      return;
    }

    this.money -= cost;
    building.pathTile = adjacentPath;
    this.buildings.push(building);
    this.showMessage(`Built ${type}!`);
    this.playBuildSound();
  }

  placePathTile(tileX, tileY, cost) {
    if (this.money < cost) {
      this.showMessage('Not enough money!');
      this.playErrorSound();
      return;
    }

    const key = this.tileKey(tileX, tileY);
    if (this.pathTiles.has(key)) {
      this.showMessage('There is already a path here!');
      this.playErrorSound();
      return;
    }

    if (!this.isGrassTile(tileX, tileY)) {
      this.showMessage('Paths can only be built on green grass!');
      this.playErrorSound();
      return;
    }

    if (this.getBuildingAtTile(tileX, tileY)) {
      this.showMessage('Cannot build on an existing attraction!');
      this.playErrorSound();
      return;
    }

    if (!this.addPathTile(tileX, tileY)) {
      this.showMessage('Cannot build a path here!');
      this.playErrorSound();
      return;
    }

    this.money -= cost;
    this.showMessage('Built a path!');
    this.playBuildSound();
  }

  removeAttraction(tileX, tileY, cost) {
    const building = this.getBuildingAtTile(tileX, tileY);
    if (!building) {
      this.showMessage('No attraction to remove!');
      this.playErrorSound();
      return;
    }

    if (building.category !== 'attraction') {
      this.showMessage('Only attractions can be removed!');
      this.playErrorSound();
      return;
    }

    if (this.money < cost) {
      this.showMessage('Not enough money!');
      this.playErrorSound();
      return;
    }

    this.money -= cost;
    this.buildings = this.buildings.filter((entry) => entry !== building);
    this.agents.forEach((agent) => {
      if (agent.target === building) {
        agent.assignPath([], null);
      }
    });
    this.showMessage(`Removed ${building.type}!`);
    this.playBuildSound();
  }

  pickTarget(agent) {
    const remaining = Math.max(0, (agent.budget || 0) - (agent.spent || 0));
    const eligible = this.buildings.filter((building) => {
      const price = agent.isPet ? building.petPrice : building.price;
      return price > 0 && price <= remaining;
    });
    if (!eligible.length) return null;
    const building = eligible[Math.floor(Math.random() * eligible.length)];
    return { building, pathTile: building.pathTile };
  }

  spawnAgentsAtEntrance({ visitors, pets }) {
    const spawnTile = this.entrancePathTile || this.entranceTile;
    for (let i = 0; i < visitors; i++) {
      const { budget, spendLimit } = this.generateAgentBudget(false);
      const agent = new Agent({
        tileX: spawnTile.x,
        tileY: spawnTile.y,
        isPet: false,
        speed: 0.04 + Math.random() * 0.02,
        emoji: this.pickVisitorEmoji(),
        budget,
        spendLimit
      });
      this.agents.push(agent);
      this.totalVisitors += 1;
    }
    this.activeVisitors += visitors;

    for (let i = 0; i < pets; i++) {
      const { budget, spendLimit } = this.generateAgentBudget(true);
      const pet = new Agent({
        tileX: spawnTile.x,
        tileY: spawnTile.y,
        isPet: true,
        speed: 0.035 + Math.random() * 0.02,
        emoji: this.pickPetEmoji(),
        budget,
        spendLimit
      });
      this.agents.push(pet);
      this.totalPets += 1;
    }
    this.activePets += pets;
  }

  spawnCars(time) {
    const interval = this.getCarSpawnInterval();
    if (time - this.lastCarSpawn < interval) return;
    this.lastCarSpawn = time;

    const spawnPickup = this.activeVisitors + this.activePets > 0 && Math.random() > 0.65;
    const role = spawnPickup ? 'pickup' : 'dropoff';
    const { sprite, width, type, speedMultiplier, canStop, ignoreTraffic } = this.pickRandomCarSprite();
    const speed = (0.05 + Math.random() * 0.02) * (speedMultiplier || 1);

    if (!canStop) {
      const car = new Car({
        tileX: this.roadLaneX,
        tileY: this.roadBounds.minY,
        speed,
        direction: { x: 0, y: 1 },
        stopTile: { x: this.roadLaneX, y: this.roadBounds.maxY + 2 },
        role: 'pass',
        sprite,
        payload: null,
        width,
        type,
        canStop,
        ignoreTraffic
      });
      this.cars.push(car);
      return;
    }

    if (role === 'dropoff') {
      const payload = this.createArrivalPayload();
      if (payload.visitors + payload.pets === 0) {
        return;
      }
      const car = new Car({
        tileX: this.dropoffStop.x,
        tileY: this.roadBounds.minY,
        speed,
        direction: { x: 0, y: 1 },
        stopTile: this.dropoffStop,
        role,
        sprite,
        payload,
        width,
        type,
        canStop,
        ignoreTraffic
      });
      this.cars.push(car);
      return;
    }

    const pickupCount = Math.min(this.activeVisitors + this.activePets, Math.floor(Math.random() * 3) + 1);
    const car = new Car({
      tileX: this.pickupStop.x,
      tileY: this.roadBounds.minY,
      speed,
      direction: { x: 0, y: 1 },
      stopTile: this.pickupStop,
      role,
      sprite,
      payload: { pickupCount },
      width,
      type,
      canStop,
      ignoreTraffic
    });
    this.cars.push(car);
  }

  spawnBillCar(breakdown) {
    if (!breakdown?.total || !this.mapData) return;
    if (this.cars.some((car) => car.role === 'bill')) return;
    const car = new Car({
      tileX: this.roadLaneX,
      tileY: this.roadBounds.minY,
      speed: 0.045,
      direction: { x: 0, y: 1 },
      stopTile: this.dropoffStop,
      role: 'bill',
      sprite: this.carSprites.delivery,
      payload: { breakdown },
      width: 84,
      type: 'delivery',
      canStop: true,
      ignoreTraffic: false
    });
    this.cars.push(car);
  }

  pickRandomCarSprite() {
    const weighted = [
      { key: 'sedan', weight: 6, width: 70 },
      { key: 'suv', weight: 5, width: 76 },
      { key: 'taxi', weight: 4, width: 70 },
      { key: 'motorbike', weight: 3, width: 52 },
      { key: 'truck', weight: 3, width: 90 },
      { key: 'police', weight: 1, width: 78, canStop: false, ignoreTraffic: true },
      { key: 'ambulance', weight: 1, width: 78, canStop: false, ignoreTraffic: true },
      { key: 'formula', weight: 1, width: 72, canStop: false, ignoreTraffic: true, speedMultiplier: 1.6 }
    ];
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of weighted) {
      roll -= item.weight;
      if (roll <= 0) {
        return {
          sprite: this.carSprites[item.key],
          width: item.width,
          type: item.key,
          canStop: item.canStop !== false,
          ignoreTraffic: item.ignoreTraffic === true,
          speedMultiplier: item.speedMultiplier || 1
        };
      }
    }
    return { sprite: this.carSprites.sedan, width: 70, type: 'sedan', canStop: true, ignoreTraffic: false, speedMultiplier: 1 };
  }

  createArrivalPayload() {
    const paidRideCount = this.getPaidRideCount();
    if (paidRideCount < 2) {
      return { visitors: 0, pets: 0 };
    }

    const hasPetService = this.buildings.some((building) => building.category === 'pet');
    const reviewScore = this.calculateReviewScore();
    const reviewFactor = 0.25 + (reviewScore / 5) * 1.75;
    const totalSize = this.buildings.reduce((sum, building) => sum + building.tileWidth * building.tileHeight, 0);
    const attractionLevel = Math.min(10, Math.max(1, Math.floor((paidRideCount + totalSize / 3) / 3) + 1));
    const visitors = Math.max(1, Math.ceil(Math.random() * attractionLevel * reviewFactor));
    let pets = 0;
    if (hasPetService && visitors > 0) {
      const petChance = Math.min(0.85, 0.15 + paidRideCount * 0.02) * Math.min(2, reviewFactor);
      pets = Math.random() > 1 - petChance ? Math.floor(Math.random() * Math.max(1, Math.floor(attractionLevel / 2))) : 0;
      pets = Math.min(pets, visitors);
    }
    return { visitors, pets };
  }

  handleCarStop(car) {
    if (car.handled) return;
    if (car.role === 'bill') {
      this.spawnBusinessStaff({ x: car.tileX, y: car.tileY });
      this.applyUpkeepCost(car.payload?.breakdown);
    } else if (car.role === 'dropoff') {
      this.spawnAgentsAtEntrance(car.payload);
    } else {
      this.pickupAgentsAtExit(car.payload.pickupCount);
    }
    car.handled = true;
  }

  pickupAgentsAtExit(count) {
    if (!count || this.agents.length === 0) return;
    const exitCenter = this.exitTile;
    const sortedAgents = [...this.agents].sort((a, b) => {
      const distA = Math.hypot(a.tileX - exitCenter.x, a.tileY - exitCenter.y);
      const distB = Math.hypot(b.tileX - exitCenter.x, b.tileY - exitCenter.y);
      return distA - distB;
    });

    const toRemove = new Set(sortedAgents.slice(0, count));
    this.agents = this.agents.filter((agent) => {
      if (!toRemove.has(agent)) return true;
      if (agent.isPet) {
        this.activePets = Math.max(0, this.activePets - 1);
      } else {
        this.activeVisitors = Math.max(0, this.activeVisitors - 1);
      }
      return false;
    });
  }

  collectRevenue(agent, building) {
    if (!building) return;
    const revenue = agent.isPet ? building.petPrice : building.price;
    if (revenue > 0) {
      const remaining = Math.max(0, (agent.budget || 0) - (agent.spent || 0));
      if (remaining < revenue) {
        agent.leaving = true;
        return;
      }
      agent.spent = (agent.spent || 0) + revenue;
      this.money += revenue;
      this.completedVisits += 1;
      const label = agent.isPet ? '🐾 Pet visit' : '🎟️ Visit';
      this.addChatMessage(`${label} +$${revenue.toFixed(0)}`);
      if (revenue >= this.sleighbellThreshold) {
        this.playSleighbells();
      }
      if (agent.spent >= (agent.spendLimit || agent.budget || 0)) {
        agent.leaving = true;
      }
    }
  }

  update(time, delta) {
    this.adjustCamera(delta);
    this.spawnCars(time);
    this.agents = this.agents.filter((agent) => !agent.update(delta, this));
    this.cars = this.cars.filter((car) => !car.update(delta, this));
    if (time - this.lastReviewTime >= this.reviewInterval) {
      this.lastReviewTime = time;
      this.generateReview();
    }
    if (time - this.lastUpkeepTime >= this.upkeepInterval) {
      this.lastUpkeepTime = time;
      const breakdown = this.calculateUpkeepCost();
      if (breakdown?.total) {
        this.spawnBillCar(breakdown);
      }
    }
    this.updateStats();
  }

  getCarSpawnInterval() {
    const ramp = Math.min(1, this.completedVisits / this.carSpawnRampVisits);
    const baseInterval = this.baseCarSpawnInterval - ramp * (this.baseCarSpawnInterval - this.minCarSpawnInterval);
    const reviewBoost = 1 - (this.calculateReviewScore() / 5) * 0.45;
    return Math.max(this.minCarSpawnInterval * 0.55, baseInterval * reviewBoost);
  }

  getBlockingCar(car) {
    if (!this.cars.length) return null;
    let closest = null;
    let minDist = Infinity;
    for (const other of this.cars) {
      if (other === car) continue;
      if (other.ignoreTraffic) continue;
      if (Math.abs(other.tileX - car.tileX) > this.carLaneTolerance) continue;
      if (car.direction.y > 0 && other.tileY <= car.tileY) continue;
      if (car.direction.y < 0 && other.tileY >= car.tileY) continue;
      const dist = Math.abs(other.tileY - car.tileY);
      if (dist < minDist) {
        minDist = dist;
        closest = other;
      }
    }
    return minDist <= this.carFollowDistance * 2 ? closest : null;
  }

  drawBackground() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const bounds = this.getVisibleTileBounds();

    if (this.mapData) {
      this.drawTileLayer((tileX, tileY) => {
        const tileType = this.getMapTileType(tileX, tileY);
        if (tileType === 'W') {
          this.drawTileImage(this.terrainSprites.water, tileX, tileY);
        } else if (tileType === 'B') {
          this.drawTileImage(this.terrainSprites.beach, tileX, tileY);
        } else if (tileType === 'R') {
          this.drawTileImage(this.terrainSprites.road, tileX, tileY);
        } else if (tileType === 'P') {
          this.drawTileImage(this.terrainSprites.path, tileX, tileY);
        } else if (tileType === 'E') {
          this.drawTileImage(this.terrainSprites.entry, tileX, tileY);
        } else {
          this.drawTileImage(this.terrainSprites.ground, tileX, tileY);
        }
      }, bounds);
      return;
    }

    this.drawTileLayer((tileX, tileY) => {
      if (this.waterLaneX !== null && tileX <= this.waterLaneX) {
        this.drawTileImage(this.terrainSprites.water, tileX, tileY);
      } else if (this.beachLaneX !== null && tileX === this.beachLaneX) {
        this.drawTileImage(this.terrainSprites.beach, tileX, tileY);
      } else {
        this.drawTileImage(this.terrainSprites.ground, tileX, tileY);
      }

      if (this.pathTiles.has(this.tileKey(tileX, tileY))) {
        this.drawTileImage(this.terrainSprites.path, tileX, tileY);
      }

      if (this.roadTiles.has(this.tileKey(tileX, tileY))) {
        this.drawTileImage(this.terrainSprites.road, tileX, tileY);
      }

      if (tileX === this.entranceTile.x && tileY === this.entranceTile.y) {
        this.drawTileImage(this.terrainSprites.entry, tileX, tileY);
      } else if (this.exitTile && tileX === this.exitTile.x && tileY === this.exitTile.y) {
        this.drawTileImage(this.terrainSprites.entry, tileX, tileY);
      }
    }, bounds);
  }

  drawBuildings() {
    const { ctx } = this;
    const bounds = this.getVisibleTileBounds();
    const drawables = [];

    this.buildings.forEach((building) => {
      drawables.push({
        kind: 'building',
        building,
        depth: building.tileX + building.tileY + (building.tileWidth - 1) + (building.tileHeight - 1),
        sortX: building.tileX,
        sortY: building.tileY
      });
    });

    if (this.treeTiles.size) {
      for (let y = bounds.minY; y <= bounds.maxY; y++) {
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
          const treeType = this.treeTiles.get(this.tileKey(x, y));
          if (!treeType) continue;
          drawables.push({
            kind: 'tree',
            tileX: x,
            tileY: y,
            treeType,
            depth: x + y,
            sortX: x,
            sortY: y
          });
        }
      }
    }

    drawables.sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      if (a.sortY !== b.sortY) return a.sortY - b.sortY;
      return a.sortX - b.sortX;
    });

    drawables.forEach((item) => {
      if (item.kind === 'tree') {
        const sprite =
          item.treeType === 'tall' ? this.terrainSprites.treeTall : this.terrainSprites.treeShort;
        const scale = item.treeType === 'tall' ? 0.3 : 0.2;
        this.drawTreeImage(sprite, item.tileX, item.tileY, scale);
        return;
      }

      const building = item.building;
      const colorMap = CATEGORY_COLORS[building.category] || {};
      const color = colorMap[building.type] || CATEGORY_CONFIG[building.category]?.color || '#4f8cff';

      const baseImage = this.terrainSprites.buildingBase;
      const minX = building.tileX;
      const maxX = building.tileX + building.tileWidth - 1;
      const minY = building.tileY;
      const maxY = building.tileY + building.tileHeight - 1;
      for (let sum = minX + minY; sum <= maxX + maxY; sum++) {
        for (let x = minX; x <= maxX; x++) {
          const y = sum - x;
          if (y < minY || y > maxY) continue;
          if (baseImage?.complete && baseImage.naturalWidth > 0) {
            this.drawTileImage(baseImage, x, y);
          } else {
            this.drawIsoDiamond(x, y, color);
          }
        }
      }

      ctx.fillStyle = '#222';
      const emoji = EMOJI_MAP[building.type] || '🏖️';
      const footprint = Math.max(building.tileWidth, building.tileHeight);
      const fontSize = Math.round(this.getScaledTileSize() * (footprint > 1 ? 0.75 : 0.6));
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const center = this.getTileScreenCenter(
        building.tileX + (building.tileWidth - 1) / 2,
        building.tileY + (building.tileHeight - 1) / 2
      );
      const yOffset = this.getScaledSpriteHeight() * (footprint > 1 ? 0.45 : 0.6);
      ctx.fillText(emoji, center.x, center.y - yOffset);
    });
  }

  drawCars() {
    const { ctx } = this;
    this.cars.forEach((car) => car.draw(ctx, this));
  }

  drawAgents() {
    const { ctx } = this;
    this.agents.forEach((agent) => {
      const fontSize = Math.round(this.getScaledTileSize() * (agent.isPet ? 0.38 : 0.5));
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const screen = this.getTileScreenCenter(agent.tileX, agent.tileY);
      const yOffset = this.getScaledSpriteHeight() * (agent.isPet ? 0.45 : 0.5);
      ctx.fillText(agent.emoji, screen.x, screen.y - yOffset);
    });
  }

  drawGhost() {
    if (!this.selectedItem) return;
    const { ctx } = this;
    const { category, type } = this.selectedItem;
    const { tileWidth, tileHeight } = this.getFootprint(this.selectedItem);
    const mouse = this.ui.mouse;
    if (!mouse) return;

    const tilePos = this.screenToWorld(mouse.x, mouse.y);
    const tileX = Math.round(tilePos.x);
    const tileY = Math.round(tilePos.y);
    if (type === 'path') {
      ctx.save();
      ctx.globalAlpha = 0.6;
      for (let x = tileX; x < tileX + tileWidth; x++) {
        for (let y = tileY; y < tileY + tileHeight; y++) {
          if (this.terrainSprites.path?.complete && this.terrainSprites.path.naturalWidth > 0) {
            this.drawTileImage(this.terrainSprites.path, x, y);
          } else {
            this.drawIsoDiamond(x, y, '#b58a5a');
          }
        }
      }
      ctx.restore();
      return;
    }

    if (type === 'bulldoze') {
      ctx.save();
      ctx.globalAlpha = 0.55;
      for (let x = tileX; x < tileX + tileWidth; x++) {
        for (let y = tileY; y < tileY + tileHeight; y++) {
          this.drawIsoDiamond(x, y, '#c0392b');
        }
      }
      const fontSize = Math.round(this.getScaledTileSize() * 0.6);
      ctx.fillStyle = '#fff';
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const center = this.getTileScreenCenter(tileX, tileY);
      ctx.fillText(EMOJI_MAP.bulldoze || '🧹', center.x, center.y - this.getScaledSpriteHeight() * 0.6);
      ctx.restore();
      return;
    }
    const colorMap = CATEGORY_COLORS[category] || {};
    const color = colorMap[type] || CATEGORY_CONFIG[category]?.color || '#4f8cff';
    const baseImage = this.terrainSprites.buildingBase;
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let x = tileX; x < tileX + tileWidth; x++) {
      for (let y = tileY; y < tileY + tileHeight; y++) {
        if (baseImage?.complete && baseImage.naturalWidth > 0) {
          this.drawTileImage(baseImage, x, y);
        } else {
          this.drawIsoDiamond(x, y, color);
        }
      }
    }
    const emoji = EMOJI_MAP[type] || '🏖️';
    const fontSize = Math.round(this.getScaledTileSize() * 0.6);
    ctx.fillStyle = '#222';
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const center = this.getTileScreenCenter(
      tileX + (tileWidth - 1) / 2,
      tileY + (tileHeight - 1) / 2
    );
    ctx.fillText(emoji, center.x, center.y - this.getScaledSpriteHeight() * 0.6);
    ctx.restore();
  }

  render() {
    this.drawBackground();
    this.drawCars();
    this.drawBuildings();
    this.drawAgents();
    this.drawGhost();
  }
}

function calculateSpriteTrim(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha === 0) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX === -1) return null;
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

function applySpriteTrim(image) {
  image.addEventListener('load', () => {
    const trim = calculateSpriteTrim(image);
    if (trim) image.trim = trim;
  });
}

function parseMapCsv(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(',').map((cell) => cell.trim().toUpperCase()).filter(Boolean));
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  rows.forEach((row) => {
    while (row.length < width) row.push('G');
  });
  return { grid: rows, width, height: rows.length };
}

async function loadMapData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load map: ${url}`);
  }
  const text = await response.text();
  return parseMapCsv(text);
}

async function initGame() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const carSprites = {
    sedan: new Image(),
    suv: new Image(),
    taxi: new Image(),
    motorbike: new Image(),
    truck: new Image(),
    police: new Image(),
    ambulance: new Image(),
    formula: new Image(),
    delivery: new Image()
  };
  const terrainSprites = {
    ground: new Image(),
    road: new Image(),
    path: new Image(),
    entry: new Image(),
    water: new Image(),
    beach: new Image(),
    buildingBase: new Image(),
    treeTall: new Image(),
    treeShort: new Image()
  };

  carSprites.sedan.src = 'assets/kenney_car-kit/Previews/sedan.png';
  carSprites.suv.src = 'assets/kenney_car-kit/Previews/suv.png';
  carSprites.taxi.src = 'assets/kenney_car-kit/Previews/taxi.png';
  carSprites.motorbike.src = 'assets/kenney_car-kit/Previews/race.png';
  carSprites.truck.src = 'assets/kenney_car-kit/Previews/truck.png';
  carSprites.police.src = 'assets/kenney_car-kit/Previews/police.png';
  carSprites.ambulance.src = 'assets/kenney_car-kit/Previews/ambulance.png';
  carSprites.formula.src = 'assets/kenney_car-kit/Previews/race-future.png';
  carSprites.delivery.src = 'assets/kenney_car-kit/Previews/delivery.png';
  terrainSprites.ground.src = 'assets/kenney_isometric-roads/png/grassWhole.png';
  terrainSprites.road.src = 'assets/kenney_isometric-roads/png/roadEW.png';
  terrainSprites.path.src = 'assets/kenney_isometric-roads/png/dirt.png';
  terrainSprites.entry.src = 'assets/kenney_isometric-roads/png/exitS.png';
  terrainSprites.water.src = 'assets/kenney_isometric-roads/png/water.png';
  terrainSprites.beach.src = 'assets/kenney_isometric-roads/png/beachS.png';
  terrainSprites.buildingBase.src = 'assets/kenney_isometric-roads/png/dirtDouble.png';
  terrainSprites.treeTall.src = 'assets/kenney_isometric-roads/png/treeTall.png';
  terrainSprites.treeShort.src = 'assets/kenney_isometric-roads/png/treeShort.png';

  applySpriteTrim(terrainSprites.treeTall);
  applySpriteTrim(terrainSprites.treeShort);
    const ui = {
    money: document.getElementById('money'),
    visitors: document.getElementById('visitors'),
    pets: document.getElementById('pets'),
    active: document.getElementById('active'),
    reviewScore: document.getElementById('reviewScore'),
    reviewStars: document.getElementById('reviewStars'),
    reviewFun: document.getElementById('reviewFun'),
    reviewFood: document.getElementById('reviewFood'),
    reviewFacilities: document.getElementById('reviewFacilities'),
    reviewFunStars: document.getElementById('reviewFunStars'),
    reviewFoodStars: document.getElementById('reviewFoodStars'),
    reviewFacilitiesStars: document.getElementById('reviewFacilitiesStars'),
    reviewMessages: document.getElementById('reviewMessages'),
    message: document.getElementById('message'),
    chatMessages: document.getElementById('chatMessages'),
    bottomPanel: document.getElementById('bottomPanel'),
    mouse: null
  };

  const world = new GameWorld({ canvas, ctx, ui, carSprites, terrainSprites, mapData: null });
  void world.initAudio();

  loadMapData('assets/maps/default.csv')
    .then((data) => {
      if (!data?.width || !data?.height) return;
      world.initMapFromData(data);
      world.updateOrigin();
      world.setMapBoundsFromScreen();
      world.positionCameraAtEntry(220);
      world.hasPositionedCamera = true;
      world.loadGame();
    })
    .catch((error) => {
      console.error(error);
    });

  const resizeCanvas = () => {
    const height = window.innerHeight - ui.bottomPanel.offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = height;
    world.updateOrigin();
    world.setMapBoundsFromScreen();
    if (!world.hasPositionedCamera) {
      if (world.mapData) {
        world.positionCameraAtEntry(220);
      } else {
        world.positionCameraAtTopLeft();
      }
      world.hasPositionedCamera = true;
    } else {
      world.clampCamera();
    }
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const orderedItems = sortShopItemsByCost();
  const items = orderedItems.map((item) => {
    const category = getCategory(item);
    const width = parseInt(item.dataset.width, 10);
    const height = parseInt(item.dataset.height, 10);
    const defaultSize = category === 'service' ? 2 : 1;
    const tileWidth = Number.isFinite(width) ? width : defaultSize;
    const tileHeight = Number.isFinite(height) ? height : defaultSize;
    return {
      element: item,
      type: item.dataset.type,
      cost: parseFloat(item.dataset.cost),
      price: parseFloat(item.dataset.price || 0),
      petPrice: parseFloat(item.dataset.petprice || 0),
      category,
      tileWidth,
      tileHeight,
      emoji: item.querySelector('.itemName')?.textContent?.trim()?.charAt(0) ?? '🏖️'
    };
  });

  items.forEach((item) => {
    item.element.addEventListener('click', () => {
      if (item.cost > world.money) {
        world.showMessage('Not enough money!');
        return;
      }
      document.querySelectorAll('.shopItem').forEach((el) => el.classList.remove('selected'));
      item.element.classList.add('selected');
      world.setSelectedItem(item);
    });
  });

  const unlockAudio = () => {
    world.initAudio().then((ready) => {
      if (!ready) return;
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    });
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  const resetButton = document.getElementById('resetGame');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (!window.confirm('Reset your park? This clears the autosave.')) return;
      world.clearSavedGame();
      window.location.reload();
    });
  }

  world.startAutosave();

  canvas.addEventListener('mousemove', (event) => {
    ui.mouse = { x: event.offsetX, y: event.offsetY };
  });

  canvas.addEventListener('mouseleave', () => {
    ui.mouse = null;
  });

  canvas.addEventListener('click', (event) => {
    const worldPoint = world.screenToWorld(event.offsetX, event.offsetY);
    world.placeBuilding(worldPoint.x, worldPoint.y);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') world.keys.up = true;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') world.keys.down = true;
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') world.keys.left = true;
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') world.keys.right = true;
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') world.keys.up = false;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') world.keys.down = false;
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') world.keys.left = false;
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') world.keys.right = false;
  });

  setupTabs();
  setupJoystick(world);

  let lastTime = performance.now();
  const loop = (time) => {
    const delta = (time - lastTime) / 16;
    lastTime = time;
    world.update(time, delta);
    world.render();
    updateShopAffordability(items, world.money);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function updateShopAffordability(items, money) {
  items.forEach((item) => {
    if (item.cost > money) {
      item.element.classList.add('disabled');
    } else {
      item.element.classList.remove('disabled');
    }
  });
}

function getCategory(item) {
  if (item.classList.contains('food-item')) return 'food';
  if (item.classList.contains('facility-item')) return 'facility';
  if (item.classList.contains('pet-item')) return 'pet';
  if (item.classList.contains('service-item')) return 'service';
  if (item.classList.contains('internet-item')) return 'internet';
  return 'attraction';
}

function sortShopItemsByCost() {
  const shop = document.getElementById('shopItems');
  if (!shop) return [];
  const items = [...shop.querySelectorAll('.shopItem')];
  items.sort((a, b) => {
    const costA = parseFloat(a.dataset.cost || '0');
    const costB = parseFloat(b.dataset.cost || '0');
    return costA - costB;
  });
  items.forEach((item) => shop.appendChild(item));
  return items;
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const shopItems = document.querySelectorAll('.shopItem');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const selected = tab.dataset.tab;
      shopItems.forEach((item) => {
        const isAttraction = selected === 'attractions' && item.classList.contains('attraction-item');
        const isFood = selected === 'food' && item.classList.contains('food-item');
        const isFacility = selected === 'facilities' && item.classList.contains('facility-item');
        const isPet = selected === 'pet' && item.classList.contains('pet-item');
        const isService = selected === 'service' && item.classList.contains('service-item');
        const isInternet = selected === 'internet' && item.classList.contains('internet-item');
        if (isAttraction || isFood || isFacility || isPet || isService || isInternet) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function setupJoystick(world) {
  const joystick = document.getElementById('joystick');
  const knob = document.getElementById('joystickKnob');
  if (!joystick || !knob) return;

  let dragging = false;
  const center = { x: joystick.offsetWidth / 2, y: joystick.offsetHeight / 2 };
  const maxDistance = joystick.offsetWidth / 2 - knob.offsetWidth / 2;

  const resetKnob = () => {
    knob.style.transform = 'translate(-50%, -50%)';
    world.joystickVector.x = 0;
    world.joystickVector.y = 0;
  };

  const handleMove = (clientX, clientY) => {
    const rect = joystick.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const dx = x - center.x;
    const dy = y - center.y;
    const dist = Math.min(Math.hypot(dx, dy), maxDistance);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * dist;
    const knobY = Math.sin(angle) * dist;
    knob.style.transform = `translate(${knobX - knob.offsetWidth / 2}px, ${knobY - knob.offsetHeight / 2}px)`;

    world.joystickVector.x = knobX / maxDistance;
    world.joystickVector.y = knobY / maxDistance;
  };

  knob.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    dragging = true;
    knob.setPointerCapture(event.pointerId);
    handleMove(event.clientX, event.clientY);
  });

  knob.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    handleMove(event.clientX, event.clientY);
  });

  knob.addEventListener('pointerup', () => {
    dragging = false;
    resetKnob();
  });

  knob.addEventListener('pointercancel', () => {
    dragging = false;
    resetKnob();
  });
}

document.addEventListener('DOMContentLoaded', initGame);
