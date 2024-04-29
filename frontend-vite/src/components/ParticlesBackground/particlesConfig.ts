const particlesConfig = {
    fullScreen: { enable: false },
    fpsLimit: 60,
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
          quantity: 105,
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
        distance: 120,
        enable: true,
        opacity: 0.4,
        width: 2,
        warp: true,
        frequency: 0.5
      },
      move: {
        vibrate: true,
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 4,
        straight: false,
        attract: { enabbled: true, rotate: {x: 3000, y: 3000} },
        trail: {enabled: true}
      },
      number: {
        density: {
          enable: true,
          area: 1000,
        },
        value: 280,
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
  }

  export default particlesConfig