const particlesConfig = {
  fullScreen: { enable: false },
  fpsLimit: 30,
  interactivity: {
    events: {
      onDiv: {
        enable: true,
        mode: "repulse",
        selectors: ["repulse-div"],
        type: "circle",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      push: {
        quantity: 50,
      },
      repulse: {
        distance: 100,
        duration: 0.5,
      },
    },
  },
  particles: {
    color: {
      value: "#659B5E",
    },
    links: {
      color: "#4d8cff",
      distance: window.innerWidth > 700 ? 150 : 110,
      enable: true,
      opacity: 0.4,
      width: 2,
      warp: true,
      frequency: window.innerWidth > 700 ? 2.7 : 10,
    },
    move: {
      vibrate: true,
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 3,
      straight: false,
      trail: { enabled: true },
    },
    number: {
      density: {
        enable: true,
        area: window.innerWidth > 700 ? 1000 : 100,
        factor: 100,
      },
      value: 180,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

export default particlesConfig;
