import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import type { Container } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import particlesConfig from "./particlesConfig"

const ParticlesBackground = () => {
  const [init, setInit] = useState(false)

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      // await loadAll(engine)
      // await loadFull(engine)
      await loadSlim(engine)
      //await loadBasic(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = (container?: Container | undefined) => {
    return new Promise<void>((resolve) => {
      resolve()
    })
  }

  return (
    <>
      {init && (
        <Particles
          className={"absolute h-[100%] w-[100%]"}
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          // @ts-expect-error particles type error
          options={particlesConfig}
        />
      )}
    </>
  )
}

export default ParticlesBackground
