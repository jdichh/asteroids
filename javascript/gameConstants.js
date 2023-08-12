const FRAMERATE = 120;
const MOVEMENT_SPEED = 7;
const ROTATION_SPEED = 0.087;
const DECELERATION_RATE = 0.93;
const PROJECTILE_SPEED = 23;
const MAX_ASTEROIDS = 35; // Maximum number of asteroids allowed on screen.
const ASTEROIDS = [];
const PROJECTILES = [];
const EXPLOSIONS = [];
const KEYPRESS = {
  w_key: {
    pressed: false,
  },
  a_key: {
    pressed: false,
  },
  s_key: {
    pressed: false,
  },
  d_key: {
    pressed: false,
  },
};

export {
  FRAMERATE,
  MOVEMENT_SPEED,
  ROTATION_SPEED,
  DECELERATION_RATE,
  PROJECTILE_SPEED,
  MAX_ASTEROIDS,
  ASTEROIDS,
  PROJECTILES,
  EXPLOSIONS,
  KEYPRESS,
};
