import { useCallback, useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import { options } from "./options";
import React from "react";

const MemoizedParticles = React.memo(({ particlesLoaded, options }: { particlesLoaded: (container?: Container) => Promise<void>, options: ISourceOptions }) => {
  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute size-full z-0"
    />
  );
})

export default function Background() {

  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container): Promise<void> => {
    console.log(container);
  }, []);

  const memoized_options: ISourceOptions = useMemo(() => (options), []);

  if (init) 
    return (
      <MemoizedParticles particlesLoaded={particlesLoaded} options={memoized_options} />
    );
}