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
  constructor({ x, y, speed, direction, stopX, role, sprite, payload, width = 70 }) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = direction;
    this.stopX = stopX;
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
      this.x += this.speed * delta * this.direction;
      if (!this.handled) {
        const reachedStop =
          (this.direction > 0 && this.x >= this.stopX) || (this.direction < 0 && this.x <= this.stopX);
        if (reachedStop) {
          this.x = this.stopX;
          this.state = 'stopped';
          this.stopTimer = 70;
          world.handleCarStop(this);
        }
      }
    }

    if (this.direction > 0 && this.x - this.width > world.worldBounds.right + 200) return true;
    if (this.direction < 0 && this.x + this.width < world.worldBounds.left - 200) return true;
    return false;
  }

  draw(ctx, camera) {
    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;

    ctx.save();
    if (this.direction < 0) {
      ctx.translate(drawX, drawY);
      ctx.scale(-1, 1);
      ctx.translate(-drawX, -drawY);
    }

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
  constructor({ canvas, ctx, ui, carSprites }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ui = ui;
    this.camera = { x: 0, y: 0 };
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
    this.entrance = { x: 300, y: 80, width: 80, height: 50 };
    this.exit = { x: 520, y: 80, width: 80, height: 50 };
    this.worldBounds = { left: -400, right: 1600, top: -200, bottom: 1200 };
    this.carSprites = carSprites;
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

  spawnAgentsAtEntrance({ visitors, pets }) {
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

  spawnCars(time) {
    if (time - this.lastCarSpawn < this.carSpawnInterval) return;
    this.lastCarSpawn = time;

    const spawnPickup = this.activeVisitors + this.activePets > 0 && Math.random() > 0.65;
    const role = spawnPickup ? 'pickup' : 'dropoff';
    const { sprite, width } = this.pickRandomCarSprite();
    const speed = 1.8 + Math.random() * 0.6;

    if (role === 'dropoff') {
      const payload = this.createArrivalPayload();
      const car = new Car({
        x: this.worldBounds.left - 150,
        y: 68,
        speed,
        direction: 1,
        stopX: this.entrance.x + this.entrance.width / 2,
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
      x: this.worldBounds.right + 150,
      y: 58,
      speed,
      direction: -1,
      stopX: this.exit.x + this.exit.width / 2,
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
    const exitCenter = {
      x: this.exit.x + this.exit.width / 2,
      y: this.exit.y + this.exit.height / 2
    };
    const sortedAgents = [...this.agents].sort((a, b) => {
      const distA = Math.hypot(a.x - exitCenter.x, a.y - exitCenter.y);
      const distB = Math.hypot(b.x - exitCenter.x, b.y - exitCenter.y);
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
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, this.canvas.height * 0.3, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#6b4f2a';
    const roadY = 50 - this.camera.y;
    ctx.fillRect(-this.camera.x, roadY, this.canvas.width + this.camera.x + 400, 40);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.entrance.x - this.camera.x, this.entrance.y - this.camera.y, this.entrance.width, this.entrance.height);
    ctx.fillRect(this.exit.x - this.camera.x, this.exit.y - this.camera.y, this.exit.width, this.exit.height);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Entrance', this.entrance.x - this.camera.x, this.entrance.y - this.camera.y - 8);
    ctx.fillText('Exit', this.exit.x - this.camera.x, this.exit.y - this.camera.y - 8);
  }

  drawBuildings() {
    const { ctx } = this;
    this.buildings.forEach((building) => {
      const colorMap = CATEGORY_COLORS[building.category] || {};
      const color = colorMap[building.type] || CATEGORY_CONFIG[building.category]?.color || '#4f8cff';
      const x = building.x - this.camera.x;
      const y = building.y - this.camera.y;

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
    });
  }

  drawCars() {
    const { ctx } = this;
    this.cars.forEach((car) => car.draw(ctx, this.camera));
  }

  drawAgents() {
    const { ctx } = this;
    this.agents.forEach((agent) => {
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(agent.emoji, agent.x - this.camera.x, agent.y - this.camera.y);
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

    const colorMap = CATEGORY_COLORS[category] || {};
    const color = colorMap[type] || CATEGORY_CONFIG[category]?.color || '#4f8cff';
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.fillRect(mouse.x - ghostSize / 2, mouse.y - ghostSize / 2, ghostSize, ghostSize);
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

  carSprites.sedan.src = 'assets/kenney_car-kit/Previews/sedan.png';
  carSprites.suv.src = 'assets/kenney_car-kit/Previews/suv.png';
  carSprites.taxi.src = 'assets/kenney_car-kit/Previews/taxi.png';
  carSprites.motorbike.src = 'assets/kenney_car-kit/Previews/race.png';
  carSprites.truck.src = 'assets/kenney_car-kit/Previews/truck.png';
  carSprites.police.src = 'assets/kenney_car-kit/Previews/police.png';
  carSprites.ambulance.src = 'assets/kenney_car-kit/Previews/ambulance.png';
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

  const world = new GameWorld({ canvas, ctx, ui, carSprites });

  const resizeCanvas = () => {
    const height = window.innerHeight - ui.bottomPanel.offsetHeight;
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
