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

const SPRITE_CONFIG = {
  tileSize: 16,
  margin: 1,
  imagePath: 'kenney_roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png'
};

const CATEGORY_SPRITES = {
  attraction: [{ x: 1, y: 6 }, { x: 4, y: 6 }, { x: 8, y: 6 }, { x: 12, y: 6 }],
  food: [{ x: 10, y: 15 }, { x: 11, y: 15 }, { x: 12, y: 15 }],
  facility: [{ x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }],
  pet: [{ x: 6, y: 15 }, { x: 7, y: 15 }, { x: 8, y: 15 }],
  service: [{ x: 2, y: 6 }, { x: 6, y: 6 }, { x: 9, y: 6 }, { x: 14, y: 6 }],
  internet: [{ x: 13, y: 15 }, { x: 14, y: 15 }, { x: 15, y: 15 }],
  transport: [{ x: 12, y: 9 }, { x: 13, y: 9 }]
};

const WORLD_SPRITES = {
  grass: { x: 1, y: 1 },
  grassAlt: { x: 2, y: 1 },
  dirt: { x: 4, y: 1 },
  road: { x: 6, y: 1 },
  fence: { x: 8, y: 3 },
  entrance: { x: 3, y: 9 },
  exit: { x: 4, y: 9 },
  car: { x: 10, y: 9 },
  visitor: { x: 1, y: 18 },
  pet: { x: 5, y: 18 }
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

class SpriteSheet {
  constructor({ imagePath, tileSize, margin }) {
    this.image = new Image();
    this.tileSize = tileSize;
    this.margin = margin;
    this.ready = false;
    this.image.onload = () => {
      this.ready = true;
    };
    this.image.src = imagePath;
  }

  draw(ctx, tileX, tileY, x, y, size) {
    if (!this.ready) return false;
    const sourceX = this.margin + tileX * (this.tileSize + this.margin);
    const sourceY = this.margin + tileY * (this.tileSize + this.margin);
    ctx.drawImage(
      this.image,
      sourceX,
      sourceY,
      this.tileSize,
      this.tileSize,
      x,
      y,
      size,
      size
    );
    return true;
  }
}

class Building {
  constructor({ type, x, y, cost, price, petPrice, category }) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.cost = cost;
    this.price = price;
    this.petPrice = petPrice;
    this.category = category;
    const size = CATEGORY_CONFIG[category]?.size ?? 80;
    this.width = category === 'service' ? 120 : size;
    this.height = category === 'service' ? 120 : size;
  }

  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}

class Agent {
  constructor({ x, y, isPet, speed }) {
    this.x = x;
    this.y = y;
    this.isPet = isPet;
    this.speed = speed;
    this.state = 'wandering';
    this.target = null;
    this.emoji = isPet ? (Math.random() > 0.5 ? '🐕' : '🐈') : '🧍';
  }

  assignTarget(target) {
    this.target = target;
    this.state = target ? 'moving' : 'wandering';
  }

  update(delta, world) {
    if (!this.target) {
      this.assignTarget(world.pickTarget(this.isPet));
    }

    if (!this.target) {
      return false;
    }

    const targetX = this.target.x + this.target.width / 2;
    const targetY = this.target.y + this.target.height / 2;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      this.x += (dx / dist) * this.speed * delta;
      this.y += (dy / dist) * this.speed * delta;
      return false;
    }

    world.collectRevenue(this, this.target);
    this.assignTarget(world.pickTarget(this.isPet));
    return false;
  }
}

class Car {
  constructor({ x, y, speed, passengers }) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.passengers = passengers;
    this.state = 'arriving';
    this.hasDropped = false;
  }

  update(delta, world) {
    if (this.state === 'arriving') {
      const targetX = world.entrance.x + world.entrance.width / 2;
      const dx = targetX - this.x;
      if (Math.abs(dx) > 2) {
        this.x += Math.sign(dx) * this.speed * delta;
      } else {
        this.state = 'dropping';
      }
    }

    if (this.state === 'dropping' && !this.hasDropped) {
      world.spawnVisitors(this.passengers);
      this.hasDropped = true;
      this.state = 'leaving';
    }

    if (this.state === 'leaving') {
      this.x += this.speed * delta;
      if (this.x > world.worldBounds.right + 200) {
        return true;
      }
    }

    return false;
  }
}

class GameWorld {
  constructor({ canvas, ctx, ui, spriteSheet }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ui = ui;
    this.spriteSheet = spriteSheet;
    this.camera = { x: 0, y: 0 };
    this.joystick = { x: 0, y: 0 };
    this.cameraSpeed = 10;
    this.money = 500;
    this.totalVisitors = 0;
    this.totalPets = 0;
    this.activeVisitors = 0;
    this.activePets = 0;
    this.buildings = [];
    this.agents = [];
    this.cars = [];
    this.lastSpawn = 0;
    this.carSpawnInterval = 4200;
    this.keys = { up: false, down: false, left: false, right: false };
    this.selectedItem = null;
    this.messageTimeout = null;
    this.entrance = { x: 300, y: 80, width: 80, height: 50 };
    this.exit = { x: 520, y: 80, width: 80, height: 50 };
    this.worldBounds = { left: -400, right: 1600, top: -200, bottom: 1200 };
    this.roadY = 60;
  }

  setSelectedItem(item) {
    this.selectedItem = item;
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

  logMessage(text) {
    if (!this.ui.chatMessages) return;
    const entry = document.createElement('div');
    entry.className = 'chatMessage';
    entry.textContent = text;
    this.ui.chatMessages.prepend(entry);
    const maxEntries = 10;
    while (this.ui.chatMessages.children.length > maxEntries) {
      this.ui.chatMessages.removeChild(this.ui.chatMessages.lastChild);
    }
  }

  updateStats() {
    this.ui.money.textContent = this.money.toFixed(0);
    this.ui.visitors.textContent = this.totalVisitors;
    this.ui.pets.textContent = this.totalPets;
    this.ui.active.textContent = this.activeVisitors + this.activePets;
  }

  adjustCamera(delta) {
    const speed = this.cameraSpeed * delta;
    const keyboardX = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
    const keyboardY = (this.keys.down ? 1 : 0) - (this.keys.up ? 1 : 0);
    const moveX = keyboardX + this.joystick.x;
    const moveY = keyboardY + this.joystick.y;

    this.camera.x += moveX * speed;
    this.camera.y += moveY * speed;
  }

  screenToWorld(x, y) {
    return { x: x + this.camera.x, y: y + this.camera.y };
  }

  placeBuilding(worldX, worldY) {
    if (!this.selectedItem) return;
    const { type, cost, price, petPrice, category } = this.selectedItem;
    if (this.money < cost) {
      this.showMessage('Not enough money!');
      return;
    }

    const config = CATEGORY_CONFIG[category] ?? { size: 80 };
    const size = category === 'service' ? 120 : config.size;
    const building = new Building({
      type,
      x: worldX - size / 2,
      y: worldY - size / 2,
      cost,
      price,
      petPrice,
      category
    });

    const overlaps = this.buildings.some((other) => {
      return !(
        building.x + building.width < other.x ||
        building.x > other.x + other.width ||
        building.y + building.height < other.y ||
        building.y > other.y + other.height
      );
    });

    if (overlaps) {
      this.showMessage('Too close to another building!');
      return;
    }

    this.money -= cost;
    this.buildings.push(building);
    this.showMessage(`Built ${type}!`);
  }

  pickTarget(isPet) {
    const eligible = this.buildings.filter((building) => {
      return isPet ? building.petPrice > 0 : building.price > 0;
    });
    if (!eligible.length) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  }

  spawnVisitors({ visitors, pets }) {
    for (let i = 0; i < visitors; i++) {
      const agent = new Agent({
        x: this.entrance.x + Math.random() * this.entrance.width,
        y: this.entrance.y + this.entrance.height + Math.random() * 20,
        isPet: false,
        speed: 0.8 + Math.random() * 0.5
      });
      this.agents.push(agent);
      this.totalVisitors += 1;
    }
    this.activeVisitors += visitors;

    for (let i = 0; i < pets; i++) {
      const pet = new Agent({
        x: this.entrance.x + Math.random() * this.entrance.width,
        y: this.entrance.y + this.entrance.height + Math.random() * 20,
        isPet: true,
        speed: 0.7 + Math.random() * 0.4
      });
      this.agents.push(pet);
      this.totalPets += 1;
    }
    this.activePets += pets;
  }

  createPassengerBatch() {
    const parkLevel = Math.floor(this.buildings.length / 4);
    const baseVisitors = Math.min(6, 1 + parkLevel);
    const visitors = Math.max(1, baseVisitors + (Math.random() > 0.7 ? 1 : 0));

    const petBuildings = this.buildings.filter((building) => building.category === 'pet').length;
    const basePets = petBuildings > 0 ? Math.floor(petBuildings / 3) : 0;
    const pets = Math.min(3, basePets + (Math.random() > 0.8 ? 1 : 0));
    return { visitors, pets };
  }

  spawnCars(time) {
    if (time - this.lastSpawn < this.carSpawnInterval) return;
    this.lastSpawn = time;

    const car = new Car({
      x: this.worldBounds.left - 120,
      y: this.roadY,
      speed: 1.2 + Math.random() * 0.6,
      passengers: this.createPassengerBatch()
    });
    this.cars.push(car);
  }

  collectRevenue(agent, building) {
    if (!building) return;
    const revenue = agent.isPet ? building.petPrice : building.price;
    if (revenue > 0) {
      this.money += revenue;
      const label = agent.isPet ? '🐾 Pet visit' : '🎟️ Visit';
      this.logMessage(`${label} +$${revenue.toFixed(0)}`);
    }
  }

  update(time, delta) {
    this.adjustCamera(delta);
    this.spawnCars(time);
    this.cars = this.cars.filter((car) => !car.update(delta, this));
    this.agents = this.agents.filter((agent) => !agent.update(delta, this));
    this.updateStats();
  }

  drawBackground() {
    const { ctx } = this;
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, this.canvas.height * 0.3, this.canvas.width, this.canvas.height);

    if (this.spriteSheet.ready) {
      const tile = 48;
      const horizon = this.canvas.height * 0.3;
      const startX = Math.floor(this.camera.x / tile) * tile;
      const startY = Math.floor((this.camera.y + horizon) / tile) * tile;
      for (let x = startX; x < this.camera.x + this.canvas.width + tile; x += tile) {
        for (let y = startY; y < this.camera.y + this.canvas.height + tile; y += tile) {
          const sprite = (x + y) % (tile * 2) === 0 ? WORLD_SPRITES.grass : WORLD_SPRITES.grassAlt;
          this.spriteSheet.draw(ctx, sprite.x, sprite.y, x - this.camera.x, y - this.camera.y, tile);
        }
      }

      const pathTile = 32;
      const pathX = this.entrance.x + this.entrance.width / 2 - pathTile * 1.5;
      for (let y = this.entrance.y + this.entrance.height; y < this.worldBounds.bottom; y += pathTile) {
        for (let offset = 0; offset < 3; offset++) {
          this.spriteSheet.draw(
            ctx,
            WORLD_SPRITES.dirt.x,
            WORLD_SPRITES.dirt.y,
            pathX - this.camera.x + offset * pathTile,
            y - this.camera.y,
            pathTile
          );
        }
      }

      const fenceTile = 24;
      const fenceY = this.roadY + 40;
      for (let x = this.worldBounds.left; x < this.worldBounds.right; x += fenceTile) {
        this.spriteSheet.draw(
          ctx,
          WORLD_SPRITES.fence.x,
          WORLD_SPRITES.fence.y,
          x - this.camera.x,
          fenceY - this.camera.y,
          fenceTile
        );
      }
    }

    if (this.spriteSheet.ready) {
      const roadWidth = this.canvas.width + this.camera.x + 400;
      const roadY = this.roadY - this.camera.y;
      const tileSize = 32;
      for (let x = -this.camera.x - 200; x < roadWidth; x += tileSize) {
        this.spriteSheet.draw(ctx, WORLD_SPRITES.road.x, WORLD_SPRITES.road.y, x, roadY, tileSize);
      }
    } else {
      ctx.fillStyle = '#6b4f2a';
      const roadY = this.roadY - this.camera.y;
      ctx.fillRect(-this.camera.x, roadY, this.canvas.width + this.camera.x + 400, 40);
    }

    const entranceX = this.entrance.x - this.camera.x;
    const entranceY = this.entrance.y - this.camera.y;
    const exitX = this.exit.x - this.camera.x;
    const exitY = this.exit.y - this.camera.y;

    if (this.spriteSheet.ready) {
      this.spriteSheet.draw(ctx, WORLD_SPRITES.entrance.x, WORLD_SPRITES.entrance.y, entranceX, entranceY, this.entrance.width);
      this.spriteSheet.draw(ctx, WORLD_SPRITES.exit.x, WORLD_SPRITES.exit.y, exitX, exitY, this.exit.width);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(entranceX, entranceY, this.entrance.width, this.entrance.height);
      ctx.fillRect(exitX, exitY, this.exit.width, this.exit.height);
    }

    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Entrance', entranceX, entranceY - 8);
    ctx.fillText('Exit', exitX, exitY - 8);
  }

  getSpriteForBuilding(building) {
    const options = CATEGORY_SPRITES[building.category];
    if (!options || !options.length) return WORLD_SPRITES.grassAlt;
    const index = hashString(building.type) % options.length;
    return options[index];
  }

  drawBuildings() {
    const { ctx } = this;
    this.buildings.forEach((building) => {
      const colorMap = CATEGORY_COLORS[building.category] || {};
      const color = colorMap[building.type] || CATEGORY_CONFIG[building.category]?.color || '#4f8cff';
      const x = building.x - this.camera.x;
      const y = building.y - this.camera.y;

      if (this.spriteSheet.ready) {
        const tileSize = 32;
        const tilesX = Math.ceil(building.width / tileSize);
        const tilesY = Math.ceil(building.height / tileSize);
        const sprite = this.getSpriteForBuilding(building);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, building.width, building.height);
        ctx.clip();
        for (let tx = 0; tx < tilesX; tx++) {
          for (let ty = 0; ty < tilesY; ty++) {
            this.spriteSheet.draw(
              ctx,
              sprite.x,
              sprite.y,
              x + tx * tileSize,
              y + ty * tileSize,
              tileSize
            );
          }
        }
        ctx.restore();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = building.category === 'service' || building.category === 'transport' ? 3 : 2;
        ctx.strokeRect(x, y, building.width, building.height);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, building.width, building.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = building.category === 'service' || building.category === 'transport' ? 3 : 2;
        ctx.strokeRect(x, y, building.width, building.height);

        ctx.fillStyle = '#222';
        const emoji = EMOJI_MAP[building.type] || '🏖️';
        const fontSize = building.category === 'service' ? 36 : building.category === 'transport' ? 44 : 28;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, x + building.width / 2, y + building.height / 2);
      }
    });
  }

  drawAgents() {
    const { ctx } = this;
    this.agents.forEach((agent) => {
      const x = agent.x - this.camera.x;
      const y = agent.y - this.camera.y;
      if (this.spriteSheet.ready) {
        const sprite = agent.isPet ? WORLD_SPRITES.pet : WORLD_SPRITES.visitor;
        this.spriteSheet.draw(ctx, sprite.x, sprite.y, x - 12, y - 12, 24);
      } else {
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(agent.emoji, x, y);
      }
    });
  }

  drawCars() {
    const { ctx } = this;
    this.cars.forEach((car) => {
      const x = car.x - this.camera.x;
      const y = car.y - this.camera.y;
      if (this.spriteSheet.ready) {
        this.spriteSheet.draw(ctx, WORLD_SPRITES.car.x, WORLD_SPRITES.car.y, x - 16, y - 8, 32);
      } else {
        ctx.fillStyle = '#222';
        ctx.fillRect(x - 18, y - 10, 36, 20);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(x - 10, y - 6, 20, 12);
      }
    });
  }

  drawGhost() {
    if (!this.selectedItem) return;
    const { ctx } = this;
    const { category, type } = this.selectedItem;
    const size = CATEGORY_CONFIG[category]?.size ?? 80;
    const ghostSize = category === 'service' ? 120 : size;
    const mouse = this.ui.mouse;
    if (!mouse) return;

    ctx.save();
    ctx.globalAlpha = 0.6;
    if (this.spriteSheet.ready) {
      const sprite = this.getSpriteForBuilding({ type, category });
      const tileSize = 32;
      const tilesX = Math.ceil(ghostSize / tileSize);
      const tilesY = Math.ceil(ghostSize / tileSize);
      ctx.beginPath();
      ctx.rect(mouse.x - ghostSize / 2, mouse.y - ghostSize / 2, ghostSize, ghostSize);
      ctx.clip();
      for (let tx = 0; tx < tilesX; tx++) {
        for (let ty = 0; ty < tilesY; ty++) {
          this.spriteSheet.draw(
            ctx,
            sprite.x,
            sprite.y,
            mouse.x - ghostSize / 2 + tx * tileSize,
            mouse.y - ghostSize / 2 + ty * tileSize,
            tileSize
          );
        }
      }
    } else {
      const colorMap = CATEGORY_COLORS[category] || {};
      const color = colorMap[type] || CATEGORY_CONFIG[category]?.color || '#4f8cff';
      ctx.fillStyle = color;
      ctx.fillRect(mouse.x - ghostSize / 2, mouse.y - ghostSize / 2, ghostSize, ghostSize);
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

async function initGame() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const ui = {
    money: document.getElementById('money'),
    visitors: document.getElementById('visitors'),
    pets: document.getElementById('pets'),
    active: document.getElementById('active'),
    message: document.getElementById('message'),
    chatMessages: document.getElementById('chatMessages'),
    bottomPanel: document.getElementById('bottomPanel'),
    shopPanel: document.getElementById('shopPanel'),
    mouse: null
  };

  const spriteSheet = new SpriteSheet(SPRITE_CONFIG);
  const world = new GameWorld({ canvas, ctx, ui, spriteSheet });

  const resizeCanvas = () => {
    const height = window.innerHeight - ui.shopPanel.offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = height;
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
    world.joystick = { x: 0, y: 0 };
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

    world.joystick = {
      x: knobX / maxDistance,
      y: knobY / maxDistance
    };
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
