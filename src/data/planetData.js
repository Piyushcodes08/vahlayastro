import plutoImg from '../assets/img/pluto.webp'
import neptuneImg from '../assets/img/2k_neptune.webp'
import uranusImg from '../assets/img/2k_uranus.webp'
import saturnImg from '../assets/img/2k_saturn.webp'
import jupiterImg from '../assets/img/2k_jupiter.webp'
import marsImg from '../assets/img/2k_mars.webp'
import earthImg from '../assets/img/earth.webp'
import venusImg from '../assets/img/2k_venus_surface.webp'
import mercuryImg from '../assets/img/2k_makemake_fictional.webp'



export const PLANETS = [
  { 
    id: 'pluto', name: 'Pluto', au: '39.5 AU', color: '#b9a794', img: plutoImg,
    desc: 'A small icy dwarf planet, once considered the ninth planet.',
    moons: [{ name: 'CHARON', angle: 210, orbit: 1 }],
    details: [
      { id: '01', title: 'Heart of Pluto', text: 'A massive heart-shaped glacier named Sputnik Planitia is made of nitrogen and methane ice.' },
      { id: '02', title: 'Icy Mountains', text: 'Pluto has mountains of water ice that can reach up to 11,000 feet (3,500 meters) high.' },
      { id: '03', title: 'Complex Atmosphere', text: 'Despite its size, Pluto has a thin atmosphere of nitrogen, methane, and carbon monoxide.' }
    ]
  },
  { 
    id: 'neptune', name: 'Neptune', au: '30.06 AU', color: '#4f83e2', img: neptuneImg, 
    desc: 'The farthest planet with the fastest winds.',
    moons: [
      { name: 'TRITON', angle: 160, orbit: 1 },
      { name: 'PROTEUS', angle: 50, orbit: 2 },
      { name: 'NEREID', angle: 300, orbit: 3 }
    ],
    details: [
      { id: '01', title: 'Supersonic Winds', text: 'Winds on Neptune can reach up to 1,500 miles per hour, the fastest recorded in the solar system.' },
      { id: '02', title: 'Ocean Planet', text: 'Beneath its atmosphere, Neptune may have a vast, hot ocean of water, ammonia, and methane.' },
      { id: '03', title: 'Faint Rings', text: 'Neptune has five main rings and four prominent ring arcs, which are clusters of dust and debris.' }
    ]
  },
  { 
    id: 'uranus', name: 'Uranus', au: '19.18 AU', color: '#8dcdd8', img: uranusImg,
    desc: 'An ice giant that rotates on its side.',
    moons: [
      { name: 'MIRANDA', angle: 90, orbit: 1 },
      { name: 'ARIEL', angle: 210, orbit: 2 },
      { name: 'UMBRIEL', angle: 330, orbit: 3 }
    ],
    details: [
      { id: '01', title: 'The Sideways Planet', text: 'Uranus is the only planet whose equator is nearly at a right angle to its orbit, likely due to a collision.' },
      { id: '02', title: 'Ice Giant', text: 'Most of its mass is a hot, dense fluid of "icy" materials above a small rocky core.' },
      { id: '03', title: 'Extreme Seasons', text: 'Because of its tilt, for nearly a quarter of each Uranian year, the sun shines directly over each pole.' }
    ]
  },
  { 
    id: 'saturn', name: 'Saturn', au: '9.539 AU', color: '#c9b99a', img:saturnImg,
    desc: 'A gas giant known for its beautiful ring system.',
    moons: [
      { name: 'TITAN', angle: 60, orbit: 1 },
      { name: 'ENCELADUS', angle: 300, orbit: 2 },
      { name: 'DIONE', angle: 180, orbit: 3 }
    ],
    details: [
      { id: '01', title: 'King of Rings', text: 'Saturn has the most spectacular ring system, made of billions of chunks of ice and rock.' },
      { id: '02', title: 'Lightest Planet', text: 'It is made mostly of hydrogen and helium, making it so light it could float in a giant bathtub.' },
      { id: '03', title: 'Many Moons', text: 'Saturn has 146 moons, including Titan, which is larger than the planet Mercury.' }
    ]
  },
  { 
    id: 'jupiter', name: 'Jupiter', au: '5.203 AU', color: '#c88b3a', img: jupiterImg,
    desc: 'The largest planet, famous for its giant storms.',
    moons: [
      { name: 'IO', angle: 45, orbit: 1 },
      { name: 'EUROPA', angle: 180, orbit: 2 },
      { name: 'GANYMEDE', angle: 290, orbit: 3 }
    ],
    details: [
      { id: '01', title: 'Vacuum Cleaner', text: 'Jupiter acts as a giant vacuum cleaner, its gravity protecting Earth by intercepting comets and asteroids.' },
      { id: '02', title: 'Short Days', text: 'Jupiter has the shortest day in the solar system, rotating once every 10 hours.' },
      { id: '03', title: 'Great Red Spot', text: 'This massive storm has been raging for at least 350 years and is twice the size of Earth.' }
    ]
  },
  { 
    id: 'mars', name: 'Mars', au: '1.524 AU', color: '#e55f45', img: marsImg,
    desc: 'The Red Planet, a key target for future human missions.',
    moons: [
      { name: 'PHOEBOS', angle: 170, orbit: 2 },
      { name: 'DEIMOS', angle: 350, orbit: 3 }
    ],
    details: [
      { id: '01', title: 'Red Planet', text: 'Its reddish color comes from iron oxide, or rust, in its soil and atmosphere.' },
      { id: '02', title: 'Giant Volcanoes', text: 'Mars is home to Olympus Mons, the largest volcano in the solar system, three times taller than Everest.' },
      { id: '03', title: 'Search for Life', text: 'Evidence of ancient water suggests Mars could have once supported life, a major focus of space missions.' }
    ]
  },
  { 
    id: 'earth', name: 'Earth', au: '1 AU', color: '#26daaa', img: earthImg,
    desc: 'The only known planet that supports life.',
    moons: [
      { name: 'MOON', angle: 260, orbit: 2 }
    ],
    details: [
      { id: '01', title: 'Perfect Distance', text: 'Earth sits in the "Goldilocks Zone," where temperatures are just right for liquid water to exist.' },
      { id: '02', title: 'Living Planet', text: 'It is the only place in the universe known to harbor life, with millions of species in diverse ecosystems.' },
      { id: '03', title: 'Dynamic Surface', text: 'Our planet is constantly changing due to plate tectonics, weather, and the influence of life.' }
    ]
  },
  { 
    id: 'venus', name: 'Venus', au: '0.723 AU', color: '#e8c46a', img: venusImg,
    desc: 'The hottest planet with a thick, toxic atmosphere.',
    moons: [],
    details: [
      { id: '01', title: 'Greenhouse World', text: 'Venus has a thick, toxic atmosphere that traps heat, making it hotter than Mercury.' },
      { id: '02', title: 'Backward Spin', text: 'Venus rotates on its axis in the opposite direction from most other planets in the solar system.' },
      { id: '03', title: 'Morning Star', text: 'It is the second brightest object in the night sky after the Moon, often called the morning or evening star.' }
    ]
  },
  { 
    id: 'mercury', name: 'Mercury', au: '0.39 AU', color: '#E8927C', img: mercuryImg,
    desc: 'The closest and smallest planet to the Sun.',
    moons: [],
    details: [
      { id: '01', title: 'Extreme Temperatures', text: 'Temperatures on Mercury can reach 800°F (430°C) during the day and drop to -290°F (-180°C) at night.' },
      { id: '02', title: 'Shrinking Planet', text: 'The planet is slowly shrinking as its large iron core cools and solidifies, creating giant cliffs.' },
      { id: '03', title: 'Sun Proximity', text: 'Mercury is so close to the Sun that it would look three times larger if you were standing on its surface.' }
    ]
  },
];
