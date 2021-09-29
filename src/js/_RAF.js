import { DOC, G, WIN } from './_globals';

let sticky = false;

function RAF() {
  G.RAF = window.requestAnimationFrame(RAF);

  // redraw mountain on each frame

  if (G.mountainGroups.length !== 0) {
    G.mountainGroups.forEach(group => {
      if (G.isAnimating) {
        group.update();
        // console.log('isAnimating mountains');
      }
      else {
        cancelAnimationFrame(G.RAF);
      }
    });
  }

  // if (G.currentMountainGroups.length !== 0) G.currentMountainGroups.forEach(group => group.update());









  // if (G.WAVES.length !== 0) {
  //   G.WAVES.forEach(wave => {
  //     if (G.isAnimating) {
  //       wave.update();
  //       console.log('isAnimating wave');
  //     }

  //   });
  // }


}

RAF();
