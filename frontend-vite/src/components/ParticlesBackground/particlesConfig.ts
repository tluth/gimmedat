const particlesConfig = {
  fullScreen: {
    enable: false,
    zIndex: -1,
  },
  fpsLimit: 30,
  interactivity: {
    events: {
      onDiv: {
        enable: true,
        mode: "repulse",
        elementId: "repulse-div",
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
    reduceDuplicates: false,
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
      trail: { enabled: true, length: 2 },
      attract: {
        distance: 150,
        enable: true,
      },
    },
    number: {
      density: {
        enable: true,
        area: window.innerWidth > 700 ? 700 : 70,
        factor: 50,
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
