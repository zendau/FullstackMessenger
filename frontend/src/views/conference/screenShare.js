export default class ScreenShare {

  constructor(streams, containersRefs, peerId, mainStream, isShareScreen, store) {
    this.streams = streams
    this.containersRefs = containersRefs
    this.peerId = peerId
    this.mainStream = mainStream
    this.isShareScreen = isShareScreen
    this.store = store
  }

  async startShareScreen() {

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia()
      this.screenStream = stream
      let videoTrack = this.screenStream.getVideoTracks()[0];
      this.streams.forEach(asd => {
        let sender = asd.peerConnection.getSenders().find(function (s) {
          return s.track.kind == 'video';
        })
        sender.replaceTrack(videoTrack)

      })
      this.containersRefs.forEach(item => {
        if (item.peerId === this.peerId.value) {
          item.setStream(this.screenStream)
        }
      })

      videoTrack.addEventListener('ended', () =>
        this.#returnVideoStream()
      );
    } catch (e) {
      this.store.commit('alert/setErrorMessage', e)
    }
  }

  stopShareScreen() {
    this.screenStream.getTracks().forEach((track) => {
      track.stop();
    });
    this.#returnVideoStream()
  }

  #returnVideoStream() {

    let videoTrack = this.mainStream.value.getVideoTracks()[0];
    this.streams.forEach(asd => {
      let sender = asd.peerConnection.getSenders().find((s) => {
        return s.track.kind == 'video';
      })
      sender.replaceTrack(videoTrack)
    })

    this.containersRefs.forEach(item => {
      if (item.peerId === this.peerId.value) {
        item.setStream(this.mainStream)
      }
    })

    this.isShareScreen.value = false
  }

}



