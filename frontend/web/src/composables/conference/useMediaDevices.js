export async function useMediaDevices(withVideo = false) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        ...(withVideo && {
          video: { aspectRatio: 16 / 9, facingMode: "user" },
        }),
      });

      return { stream };
    } catch (e) {
      console.error("Could not start video source");
    }
  } else {
    console.error("Media devices are not supported");
  }
}
