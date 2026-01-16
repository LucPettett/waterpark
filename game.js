'use strict';

const CATEGORY_CONFIG = {
  attraction: { size: 80, color: '#4f8cff' },
  food: { size: 60, color: '#ff8b5c' },
  facility: { size: 50, color: '#9aa3ad' },
  pet: { size: 70, color: '#ffb86b' },
  service: { size: 120, color: '#8a5a44' },
  internet: { size: 90, color: '#6c5ce7' },
  transport: { size: 140, color: '#8d6e63' }
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
    aquarium: '#4682B4',
    zoo: '#228B22'
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
  },
  transport: {
    trainstation: '#8B4513'
  }
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
  zoo: '🦁',
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
  trainstation: '🚂'
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
  constructor({ tileX, tileY, isPet, speed }) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.isPet = isPet;
    this.speed = speed;
    this.state = 'wandering';
    this.target = null;
    this.emoji = isPet ? (Math.random() > 0.5 ? '🐕' : '🐈') : '🧍';
    this.path = [];
  }

  assignPath(path, target) {
    this.path = path ?? [];
    this.target = target;
    this.state = this.path.length ? 'moving' : 'wandering';
  }

  update(delta, world) {
    if (!this.path.length) {
      if (this.target) {
        world.collectRevenue(this, this.target);
        this.target = null;
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
  constructor({ tileX, tileY, speed, direction, stopTile, role, sprite, payload, width = 70 }) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.speed = speed;
    this.direction = direction;
    this.stopTile = stopTile;
    this.role = role;
    this.sprite = sprite;
    this.payload = payload;
    this.width = width;
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
    } else {
      this.tileX += this.speed * delta * this.direction.x;
      this.tileY += this.speed * delta * this.direction.y;
      if (!this.handled) {
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
    }

    if (this.tileY > world.roadBounds.maxY + 2) return true;
    return false;
  }

  draw(ctx, world) {
    const drawPos = world.isoToScreen(this.tileX, this.tileY);
    const drawX = drawPos.x;
    const drawY = drawPos.y;

    ctx.save();
    const directionScreen = world.isoToScreen(
      this.tileX + this.direction.x,
      this.tileY + this.direction.y
    );
    const angle = Math.atan2(directionScreen.y - drawY, directionScreen.x - drawX);
    ctx.translate(drawX, drawY);
    ctx.rotate(angle);
    ctx.translate(-drawX, -drawY);

    if (this.sprite?.complete && this.sprite.naturalWidth > 0) {
      ctx.drawImage(this.sprite, drawX - this.width / 2, drawY - this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = '#333';
      ctx.fillRect(drawX - this.width / 2, drawY - this.height / 2, this.width, this.height);
    }
    ctx.restore();
  }
}

class GameWorld {
  constructor({ canvas, ctx, ui, carSprites, terrainSprites }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ui = ui;
    this.camera = { x: 0, y: 0 };
    this.tileSize = 128;
    this.tileHeight = 64;
    this.tileScale = this.tileSize / 512;
    this.origin = { x: canvas.width / 2, y: 160 };
    this.money = 500;
    this.totalVisitors = 0;
    this.totalPets = 0;
    this.activeVisitors = 0;
    this.activePets = 0;
    this.buildings = [];
    this.agents = [];
    this.cars = [];
    this.lastSpawn = 0;
    this.spawnInterval = 2400;
    this.lastCarSpawn = 0;
    this.carSpawnInterval = 2200;
    this.keys = { up: false, down: false, left: false, right: false };
    this.selectedItem = null;
    this.messageTimeout = null;
    this.entranceTile = { x: 0, y: -6 };
    this.exitTile = { x: 0, y: -4 };
    this.dropoffStop = { x: 2, y: -6 };
    this.pickupStop = { x: 2, y: -4 };
    this.roadBounds = { minY: -10, maxY: 10 };
    this.mapBounds = { minX: -12, maxX: 12, minY: -12, maxY: 12 };
    this.carSprites = carSprites;
    this.terrainSprites = terrainSprites;
    this.pathTiles = this.createPathTiles();
    this.roadTiles = this.createRoadTiles();
  }

  setSelectedItem(item) {
    this.selectedItem = item;
  }

  updateOrigin() {
    this.origin.x = this.canvas.width / 2;
    this.origin.y = 160;
  }

  tileKey(x, y) {
    return `${x},${y}`;
  }

  createPathTiles() {
    const tiles = new Set();
    for (let y = -8; y <= 8; y++) {
      tiles.add(this.tileKey(0, y));
    }
    for (let x = -5; x <= 5; x++) {
      tiles.add(this.tileKey(x, 0));
    }
    for (let x = -3; x <= 3; x++) {
      tiles.add(this.tileKey(x, 4));
    }
    return tiles;
  }

  createRoadTiles() {
    const tiles = new Set();
    for (let y = this.roadBounds.minY; y <= this.roadBounds.maxY; y++) {
      tiles.add(this.tileKey(this.dropoffStop.x, y));
    }
    return tiles;
  }

  isoToScreen(tileX, tileY) {
    const screenX = (tileX - tileY) * (this.tileSize / 2) + this.origin.x - this.camera.x;
    const screenY = (tileX + tileY) * (this.tileHeight / 2) + this.origin.y - this.camera.y;
    return { x: screenX, y: screenY };
  }

  drawTileImage(image, tileX, tileY) {
    if (!image?.complete || image.naturalWidth === 0) return;
    const screen = this.isoToScreen(tileX, tileY);
    this.ctx.drawImage(
      image,
      screen.x - this.tileSize / 2,
      screen.y - this.tileSize / 2,
      this.tileSize,
      this.tileSize
    );
  }

  drawTileLayer(drawFn) {
    const { minX, maxX, minY, maxY } = this.mapBounds;
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
    const center = this.isoToScreen(tileX, tileY);
    const halfW = this.tileSize / 2;
    const halfH = this.tileHeight / 2;
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

  getFootprint(category) {
    if (category === 'service' || category === 'transport') {
      return { tileWidth: 2, tileHeight: 2 };
    }
    return { tileWidth: 1, tileHeight: 1 };
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

  assignAgentTarget(agent) {
    const target = this.pickTarget(agent.isPet);
    if (!target) {
      agent.assignPath([], null);
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
    if (!this.ui.message) return;
    this.ui.message.textContent = text;
    this.ui.message.style.display = 'block';
    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.ui.message.style.display = 'none';
    }, 1500);
  }

  addChatMessage(text) {
    if (!this.ui.chatMessages) return;
    const message = document.createElement('div');
    message.className = 'chatMessage';
    message.textContent = text;
    this.ui.chatMessages.prepend(message);
    const messages = [...this.ui.chatMessages.querySelectorAll('.chatMessage')];
    if (messages.length > 8) {
      messages.slice(8).forEach((item) => item.remove());
    }
  }

  updateStats() {
    this.ui.money.textContent = this.money.toFixed(0);
    this.ui.visitors.textContent = this.totalVisitors;
    this.ui.pets.textContent = this.totalPets;
    this.ui.active.textContent = this.activeVisitors + this.activePets;
  }

  adjustCamera(delta) {
    const speed = 0.35 * delta * 16;
    if (this.keys.left) this.camera.x -= speed * 10;
    if (this.keys.right) this.camera.x += speed * 10;
    if (this.keys.up) this.camera.y -= speed * 10;
    if (this.keys.down) this.camera.y += speed * 10;
  }

  screenToWorld(x, y) {
    const adjustedX = x + this.camera.x - this.origin.x;
    const adjustedY = y + this.camera.y - this.origin.y;
    const tileX = (adjustedY / (this.tileHeight / 2) + adjustedX / (this.tileSize / 2)) / 2;
    const tileY = (adjustedY / (this.tileHeight / 2) - adjustedX / (this.tileSize / 2)) / 2;
    return { x: tileX, y: tileY };
  }

  placeBuilding(worldX, worldY) {
    if (!this.selectedItem) return;
    const { type, cost, price, petPrice, category } = this.selectedItem;
    if (this.money < cost) {
      this.showMessage('Not enough money!');
      return;
    }

    const { tileWidth, tileHeight } = this.getFootprint(category);
    const tileX = Math.round(worldX);
    const tileY = Math.round(worldY);
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
      return;
    }

    for (let x = building.tileX; x < building.tileX + building.tileWidth; x++) {
      for (let y = building.tileY; y < building.tileY + building.tileHeight; y++) {
        if (this.pathTiles.has(this.tileKey(x, y))) {
          this.showMessage('Cannot build on a path!');
          return;
        }
      }
    }

    const adjacentPath = this.findAdjacentPathTile(building);
    if (!adjacentPath) {
      this.showMessage('Buildings must be placed next to a path!');
      return;
    }

    this.money -= cost;
    building.pathTile = adjacentPath;
    this.buildings.push(building);
    this.showMessage(`Built ${type}!`);
  }

  pickTarget(isPet) {
    const eligible = this.buildings.filter((building) => {
      return isPet ? building.petPrice > 0 : building.price > 0;
    });
    if (!eligible.length) return null;
    const building = eligible[Math.floor(Math.random() * eligible.length)];
    return { building, pathTile: building.pathTile };
  }

  spawnAgentsAtEntrance({ visitors, pets }) {
    for (let i = 0; i < visitors; i++) {
      const agent = new Agent({
        tileX: this.entranceTile.x,
        tileY: this.entranceTile.y,
        isPet: false,
        speed: 0.04 + Math.random() * 0.02
      });
      this.agents.push(agent);
      this.totalVisitors += 1;
    }
    this.activeVisitors += visitors;

    for (let i = 0; i < pets; i++) {
      const pet = new Agent({
        tileX: this.entranceTile.x,
        tileY: this.entranceTile.y,
        isPet: true,
        speed: 0.035 + Math.random() * 0.02
      });
      this.agents.push(pet);
      this.totalPets += 1;
    }
    this.activePets += pets;
  }

  spawnCars(time) {
    if (time - this.lastCarSpawn < this.carSpawnInterval) return;
    this.lastCarSpawn = time;

    const spawnPickup = this.activeVisitors + this.activePets > 0 && Math.random() > 0.65;
    const role = spawnPickup ? 'pickup' : 'dropoff';
    const { sprite, width } = this.pickRandomCarSprite();
    const speed = 0.05 + Math.random() * 0.02;

    if (role === 'dropoff') {
      const payload = this.createArrivalPayload();
      const car = new Car({
        tileX: this.dropoffStop.x,
        tileY: this.roadBounds.minY - 2,
        speed,
        direction: { x: 0, y: 1 },
        stopTile: this.dropoffStop,
        role,
        sprite,
        payload,
        width
      });
      this.cars.push(car);
      return;
    }

    const pickupCount = Math.min(this.activeVisitors + this.activePets, Math.floor(Math.random() * 3) + 1);
    const car = new Car({
      tileX: this.pickupStop.x,
      tileY: this.roadBounds.minY - 2,
      speed,
      direction: { x: 0, y: 1 },
      stopTile: this.pickupStop,
      role,
      sprite,
      payload: { pickupCount },
      width
    });
    this.cars.push(car);
  }

  pickRandomCarSprite() {
    const weighted = [
      { key: 'sedan', weight: 5, width: 70 },
      { key: 'suv', weight: 5, width: 76 },
      { key: 'taxi', weight: 4, width: 70 },
      { key: 'motorbike', weight: 3, width: 52 },
      { key: 'truck', weight: 3, width: 90 },
      { key: 'police', weight: 1, width: 78 },
      { key: 'ambulance', weight: 1, width: 78 }
    ];
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of weighted) {
      roll -= item.weight;
      if (roll <= 0) {
        return { sprite: this.carSprites[item.key], width: item.width };
      }
    }
    return { sprite: this.carSprites.sedan, width: 70 };
  }

  createArrivalPayload() {
    const attractionLevel = Math.min(6, Math.max(1, Math.floor(this.buildings.length / 3) + 1));
    const visitors = Math.max(1, Math.ceil(Math.random() * attractionLevel));
    const petChance = Math.min(0.75, 0.2 + this.buildings.length * 0.03);
    const pets = Math.random() > 1 - petChance ? Math.floor(Math.random() * Math.max(1, Math.floor(attractionLevel / 2))) : 0;
    return { visitors, pets };
  }

  handleCarStop(car) {
    if (car.handled) return;
    if (car.role === 'dropoff') {
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
      this.money += revenue;
      const label = agent.isPet ? '🐾 Pet visit' : '🎟️ Visit';
      this.addChatMessage(`${label} +$${revenue.toFixed(0)}`);
    }
  }

  update(time, delta) {
    this.adjustCamera(delta);
    this.spawnCars(time);
    this.agents = this.agents.filter((agent) => !agent.update(delta, this));
    this.cars = this.cars.filter((car) => !car.update(delta, this));
    this.updateStats();
  }

  drawBackground() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawTileLayer((tileX, tileY) => {
      this.drawTileImage(this.terrainSprites.ground, tileX, tileY);
    });

    this.drawTileLayer((tileX, tileY) => {
      if (this.pathTiles.has(this.tileKey(tileX, tileY))) {
        this.drawTileImage(this.terrainSprites.path, tileX, tileY);
      }
    });

    this.drawTileLayer((tileX, tileY) => {
      if (this.roadTiles.has(this.tileKey(tileX, tileY))) {
        this.drawTileImage(this.terrainSprites.road, tileX, tileY);
      }
    });
  }

  drawBuildings() {
    const { ctx } = this;
    this.buildings.forEach((building) => {
      const colorMap = CATEGORY_COLORS[building.category] || {};
      const color = colorMap[building.type] || CATEGORY_CONFIG[building.category]?.color || '#4f8cff';

      for (let x = building.tileX; x < building.tileX + building.tileWidth; x++) {
        for (let y = building.tileY; y < building.tileY + building.tileHeight; y++) {
          this.drawIsoDiamond(x, y, color);
        }
      }

      ctx.fillStyle = '#222';
      const emoji = EMOJI_MAP[building.type] || '🏖️';
      const fontSize = building.category === 'service' ? 32 : building.category === 'transport' ? 36 : 24;
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const center = this.isoToScreen(
        building.tileX + (building.tileWidth - 1) / 2,
        building.tileY + (building.tileHeight - 1) / 2
      );
      ctx.fillText(emoji, center.x, center.y - 18);
    });
  }

  drawCars() {
    const { ctx } = this;
    this.cars.forEach((car) => car.draw(ctx, this));
  }

  drawAgents() {
    const { ctx } = this;
    this.agents.forEach((agent) => {
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const screen = this.isoToScreen(agent.tileX, agent.tileY);
      ctx.fillText(agent.emoji, screen.x, screen.y - 12);
    });
  }

  drawGhost() {
    if (!this.selectedItem) return;
    const { ctx } = this;
    const { category, type } = this.selectedItem;
    const { tileWidth, tileHeight } = this.getFootprint(category);
    const mouse = this.ui.mouse;
    if (!mouse) return;

    const tilePos = this.screenToWorld(mouse.x, mouse.y);
    const tileX = Math.round(tilePos.x);
    const tileY = Math.round(tilePos.y);
    const colorMap = CATEGORY_COLORS[category] || {};
    const color = colorMap[type] || CATEGORY_CONFIG[category]?.color || '#4f8cff';
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let x = tileX; x < tileX + tileWidth; x++) {
      for (let y = tileY; y < tileY + tileHeight; y++) {
        this.drawIsoDiamond(x, y, color);
      }
    }
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

function initGame() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const carSprites = {
    sedan: new Image(),
    suv: new Image(),
    taxi: new Image(),
    motorbike: new Image(),
    truck: new Image(),
    police: new Image(),
    ambulance: new Image()
  };
  const terrainSprites = {
    ground: new Image(),
    road: new Image(),
    path: new Image()
  };

  carSprites.sedan.src = 'assets/kenney_car-kit/Previews/sedan.png';
  carSprites.suv.src = 'assets/kenney_car-kit/Previews/suv.png';
  carSprites.taxi.src = 'assets/kenney_car-kit/Previews/taxi.png';
  carSprites.motorbike.src = 'assets/kenney_car-kit/Previews/race.png';
  carSprites.truck.src = 'assets/kenney_car-kit/Previews/truck.png';
  carSprites.police.src = 'assets/kenney_car-kit/Previews/police.png';
  carSprites.ambulance.src = 'assets/kenney_car-kit/Previews/ambulance.png';
  terrainSprites.ground.src = 'assets/kenney_nature-kit/Isometric/ground_grass_NW.png';
  terrainSprites.road.src = 'assets/kenney_nature-kit/Isometric/bridge_center_stone_SW.png';
  terrainSprites.path.src = 'assets/kenney_nature-kit/Isometric/ground_pathOpen_SW.png';
  const ui = {
    money: document.getElementById('money'),
    visitors: document.getElementById('visitors'),
    pets: document.getElementById('pets'),
    active: document.getElementById('active'),
    message: document.getElementById('message'),
    chatMessages: document.getElementById('chatMessages'),
    bottomPanel: document.getElementById('bottomPanel'),
    mouse: null
  };

  const world = new GameWorld({ canvas, ctx, ui, carSprites, terrainSprites });

  const resizeCanvas = () => {
    const height = window.innerHeight - ui.bottomPanel.offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = height;
    world.updateOrigin();
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const items = [...document.querySelectorAll('.shopItem')].map((item) => {
    const category = getCategory(item);
    return {
      element: item,
      type: item.dataset.type,
      cost: parseFloat(item.dataset.cost),
      price: parseFloat(item.dataset.price || 0),
      petPrice: parseFloat(item.dataset.petprice || 0),
      category,
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
  if (item.classList.contains('transport-item')) return 'transport';
  return 'attraction';
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
        const isTransport = selected === 'transport' && item.classList.contains('transport-item');

        if (isAttraction || isFood || isFacility || isPet || isService || isInternet || isTransport) {
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
    world.keys.up = false;
    world.keys.down = false;
    world.keys.left = false;
    world.keys.right = false;
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

    world.keys.left = knobX < -10;
    world.keys.right = knobX > 10;
    world.keys.up = knobY < -10;
    world.keys.down = knobY > 10;
  };

  knob.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    dragging = true;
    knob.setPointerCapture(event.pointerId);
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
