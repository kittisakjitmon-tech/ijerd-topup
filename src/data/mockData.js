// Image imports removed to prevent crash on missing files
// import rovIcon from '../assets/games/rov.png';
// import freefireIcon from '../assets/games/freefire.png';
// import valorantIcon from '../assets/games/valorant.png';
// import pubgIcon from '../assets/games/pubg.png';

const PLACEHOLDER_ICON = "https://placehold.co/200x200/F97316/ffffff?text=Game";

// Mock Games Data
// Mock Games Data with Packages and Inputs
export const mockGames = [
  {
    id: 'rov',
    name: 'RoV: Arena of Valor',
    image: PLACEHOLDER_ICON,
    coverImage: 'https://placehold.co/1200x400/F97316/ffffff?text=RoV+Banner',
    price: 'เริ่มต้น 10 บาท',
    category: 'MOBA',
    popular: true,
    inputType: 'uid',
    inputFields: [
      { name: 'uid', label: 'OpenID / UID', placeholder: 'กรอก OpenID ของคุณ' },
    ],
    packages: [
      { id: 1, name: '11 คูปอง', price: 10, bonus: 'โบนัส 0%' },
      { id: 2, name: '38 คูปอง', price: 35, bonus: 'โบนัส 0%' },
      { id: 3, name: '77 คูปอง', price: 70, bonus: 'โบนัส 2%' },
      { id: 4, name: '215 คูปอง', price: 199, bonus: 'โบนัส 5%' },
      { id: 5, name: '440 คูปอง', price: 399, bonus: 'โบนัส 8%' },
      { id: 6, name: '792 คูปอง', price: 699, bonus: 'โบนัส 10%' },
      { id: 7, name: '1695 คูปอง', price: 1499, bonus: 'คุ้มสุด!' },
    ]
  },
  {
    id: 'freefire',
    name: 'Garena Free Fire',
    image: PLACEHOLDER_ICON,
    coverImage: 'https://placehold.co/1200x400/EA580C/ffffff?text=Free+Fire+Banner',
    price: 'เริ่มต้น 20 บาท',
    category: 'Survival',
    popular: true,
    inputType: 'uid',
    inputFields: [
      { name: 'uid', label: 'Player ID', placeholder: 'กรอก Player ID' },
    ],
    packages: [
      { id: 1, name: '100 เพชร', price: 35, bonus: 'แถม 10' },
      { id: 2, name: '310 เพชร', price: 100, bonus: 'แถม 31' },
      { id: 3, name: '520 เพชร', price: 170, bonus: 'แถม 52' },
      { id: 4, name: '1060 เพชร', price: 340, bonus: 'แถม 106' },
      { id: 5, name: '2180 เพชร', price: 700, bonus: 'แถม 218' },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    image: PLACEHOLDER_ICON,
    coverImage: 'https://placehold.co/1200x400/FF4500/ffffff?text=Valorant+Banner',
    price: 'เริ่มต้น 50 บาท',
    category: 'FPS',
    popular: true,
    inputType: 'idpass', // Example of different input type
    inputFields: [
      { name: 'username', label: 'Riot ID', placeholder: 'Example#1234' },
    ],
    packages: [
      { id: 1, name: '475 VP', price: 150, bonus: '' },
      { id: 2, name: '1000 VP', price: 300, bonus: '+50 VP' },
      { id: 3, name: '2050 VP', price: 600, bonus: '+150 VP' },
      { id: 4, name: '3650 VP', price: 1050, bonus: '+300 VP' },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    image: PLACEHOLDER_ICON,
    coverImage: 'https://placehold.co/1200x400/DAA520/ffffff?text=PUBG+Banner',
    price: 'เริ่มต้น 35 บาท',
    category: 'Battle Royale',
    popular: false,
    inputType: 'uid',
    inputFields: [
      { name: 'uid', label: 'Character ID', placeholder: 'กรอก Character ID' },
    ],
    packages: [
      { id: 1, name: '60 UC', price: 35, bonus: '' },
      { id: 2, name: '325 UC', price: 170, bonus: '' },
      { id: 3, name: '660 UC', price: 340, bonus: '' },
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    image: PLACEHOLDER_ICON,
    coverImage: 'https://placehold.co/1200x400/9370DB/ffffff?text=Genshin+Banner',
    price: 'เริ่มต้น 99 บาท',
    category: 'RPG',
    popular: false,
    inputType: 'uid',
    inputFields: [
      { name: 'uid', label: 'UID', placeholder: 'กรอก UID' },
      { name: 'server', label: 'Server', placeholder: 'Asia / America' },
    ],
    packages: [
      { id: 1, name: '60 Genesis', price: 35, bonus: '' },
      { id: 2, name: '300 Genesis', price: 170, bonus: '+ Bonus' },
      { id: 3, name: '980 Genesis', price: 500, bonus: '+ Bonus' },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    image: PLACEHOLDER_ICON,
    coverImage: 'https://placehold.co/1200x400/FF0000/ffffff?text=Roblox+Banner',
    price: 'เริ่มต้น 150 บาท',
    category: 'Sandbox',
    popular: true,
    inputType: 'idpass',
    inputFields: [
      { name: 'username', label: 'Username', placeholder: 'Roblox Username' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Roblox Password' },
    ],
    packages: [
      { id: 1, name: '400 Robux', price: 150, bonus: '' },
      { id: 2, name: '800 Robux', price: 300, bonus: '' },
      { id: 3, name: '1700 Robux', price: 600, bonus: '' },
    ]
  }
];

// Mock Promotions Data
export const mockPromotions = [
  {
    id: 1,
    title: 'ลดกระหน่ำรับซัมเมอร์! เติม ROV ลด 10%',
    image: 'https://placehold.co/800x300/F97316/ffffff?text=Summer+Sale+10%25',
    link: '#',
  },
  {
    id: 2,
    title: 'ลูกค้าใหม่! รับโบนัส 50 บาท เมื่อเติมครั้งแรก',
    image: 'https://placehold.co/800x300/EA580C/ffffff?text=New+User+Bonus',
    link: '#',
  },
];

// Mock Transaction History (10 Recent Items)
export const mockTransactions = [
  { id: 'TXN-001', userId: 'user_01', username: 'Kittisak_Top', game: 'RoV', amount: 350, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'completed' },
  { id: 'TXN-002', userId: 'user_02', username: 'Gamer_Z', game: 'Free Fire', amount: 1200, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), status: 'paid' },
  { id: 'TXN-003', userId: 'user_03', username: 'ProPlayer99', game: 'Valorant', amount: 500, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'completed' },
  { id: 'TXN-004', userId: 'user_04', username: 'NoobMaster', game: 'PUBG Mobile', amount: 150, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: 'pending' },
  { id: 'TXN-005', userId: 'user_05', username: 'Alice_Wonder', game: 'Genshin Impact', amount: 2500, timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'completed' },
  { id: 'TXN-006', userId: 'user_06', username: 'Bob_Builder', game: 'Roblox', amount: 300, timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), status: 'completed' },
  { id: 'TXN-007', userId: 'user_01', username: 'Kittisak_Top', game: 'RoV', amount: 50, timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), status: 'paid' },
  { id: 'TXN-008', userId: 'user_08', username: 'Tank_Main', game: 'RoV', amount: 1000, timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), status: 'completed' },
  { id: 'TXN-009', userId: 'user_09', username: 'Sniper_Elite', game: 'Valorant', amount: 800, timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), status: 'completed' },
  { id: 'TXN-010', userId: 'user_10', username: 'Healer_77', game: 'Free Fire', amount: 99, timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(), status: 'pending' },
];

// Simulation Helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getGames = async () => {
  await delay(1000); // 1 second delay
  return mockGames;
};

export const getGameById = async (id) => {
  await delay(500);
  return mockGames.find(g => g.id === id);
};

export const getPromotions = async () => {
  await delay(1000); // 1 second delay
  return mockPromotions;
};

export const getTransactions = async () => {
  await delay(1000); // 1 second delay
  return mockTransactions;
};
