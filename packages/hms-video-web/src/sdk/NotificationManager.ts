import HMSTrack from '../media/tracks/HMSTrack';
import { HMSTrackType } from '../media/tracks/HMSTrackType';
import Peer from '../peer';
import { HMSNotificationMethod } from './models/enums/HMSNotificationMethod';
import {
  Peer as PeerNotification,
  HMSNotifications,
  PeerList,
  TrackStateNotification,
  TrackState,
} from './models/HMSNotifications';
import HMSLogger from '../utils/logger';
import HMSPeer from '../interfaces/hms-peer';
import HMSUpdateListener, { HMSTrackUpdate } from '../interfaces/update-listener';

interface TrackStateEntry {
  peerId: string;
  trackInfo: TrackState;
}

export default class NotificationManager {
  hmsPeerList: Map<string, HMSPeer> = new Map();

  private TAG: string = '[Notification Manager]:';
  private tracksToProcess: Map<string, HMSTrack> = new Map();
  private trackStateMap: Map<string, TrackStateEntry> = new Map();
  private listener!: HMSUpdateListener;

  handleNotification(method: HMSNotificationMethod, notification: HMSNotifications, listener: HMSUpdateListener) {
    this.listener = listener;
    switch (method) {
      case HMSNotificationMethod.PEER_JOIN: {
        const peer = notification as PeerNotification;
        HMSLogger.d(this.TAG, `PEER_JOIN event`, peer, notification);
        this.handlePeerJoin(peer);
        break;
      }
      case HMSNotificationMethod.PEER_LEAVE: {
        const peer = notification as PeerNotification;
        HMSLogger.d(this.TAG, `PEER_LEAVE event`, peer);
        this.handlePeerLeave(peer);
        break;
      }
      case HMSNotificationMethod.PEER_LIST: {
        const peerList = notification as PeerList;
        HMSLogger.d(this.TAG, `PEER_LIST event`, peerList);
        this.handlePeerList(peerList);
        break;
      }
      case HMSNotificationMethod.TRACK_METADATA_ADD: {
        this.handleTrackMetadataAdd(notification as TrackStateNotification);
        break;
      }
      case HMSNotificationMethod.ACTIVE_SPEAKERS:
        return;
      default:
        return;
    }
  }

  handleTrackMetadataAdd(params: TrackStateNotification) {
    HMSLogger.d(this.TAG, `TRACK_METADATA_ADD`, params);

    for (const [trackId, trackEntry] of Object.entries(params.tracks)) {
      this.trackStateMap.set(trackId, {
        peerId: params.peer.peer_id,
        trackInfo: trackEntry,
      });
    }

    this.processPendingTracks();
  }

  private processPendingTracks() {
    const tracksCopy = new Map(this.tracksToProcess);

    tracksCopy.forEach((track) => {
      const state = this.trackStateMap.get(track.trackId);
      if (!state) return;

      const hmsPeer = this.hmsPeerList.get(state.peerId);
      if (!hmsPeer) return;

      track.source = state.trackInfo.source;

      switch (track.type) {
        case HMSTrackType.AUDIO:
          if (!hmsPeer.audioTrack) {
            hmsPeer.audioTrack = track;
          }
          // @DISCUSS: Do we have auxilliary audio tracks too?
          break;

        case HMSTrackType.VIDEO:
          if (!hmsPeer.videoTrack && track.source === 'regular') {
            hmsPeer.videoTrack = track;
          } else {
            hmsPeer.auxiliaryTracks.push(track);
          }
      }

      this.listener.onTrackUpdate(HMSTrackUpdate.TRACK_ADDED, track, hmsPeer);
      this.tracksToProcess.delete(track.trackId);
    });
  }

  /**
   * Sets the tracks to peer and returns the peer
   */
  handleOnTrackAdd = (track: HMSTrack) => {
    HMSLogger.d(this.TAG, `ONTRACKADD`, track);
    this.tracksToProcess.set(track.trackId, track);
    this.processPendingTracks();
  };

  /**
   * Sets the track of corresponding peer to null and returns the peer
   */
  handleOnTrackRemove = (track: HMSTrack) => {
    HMSLogger.d(this.TAG, `ONTRACKREMOVE`, track);
    const trackStateEntry = this.trackStateMap.get(track.trackId);

    if (!trackStateEntry) return;

    const hmsPeer = this.hmsPeerList.get(trackStateEntry.peerId);

    if (hmsPeer) {
      switch (track.type) {
        case HMSTrackType.AUDIO:
          hmsPeer.audioTrack = null;
          break;
        case HMSTrackType.VIDEO: {
          const screenShareTrackIndex = hmsPeer.auxiliaryTracks.indexOf(track);

          if (screenShareTrackIndex > -1) {
            // @TODO: change this based on source
            hmsPeer.auxiliaryTracks.splice(screenShareTrackIndex, 1);
          } else {
            hmsPeer.videoTrack = null;
          }
        }
      }
      this.listener.onTrackUpdate(HMSTrackUpdate.TRACK_REMOVED, track, hmsPeer);
    }
  };

  cleanUp = () => {
    this.hmsPeerList.clear();
  };

  findPeerByUID = (uid: string) => {
    return this.hmsPeerList.get(uid);
  };

  private handlePeerJoin = (peer: PeerNotification) => {
    const hmsPeer = new Peer({
      peerId: peer.peerId,
      name: peer.info.name,
      isLocal: false,
      customerDescription: '',
    });

    this.hmsPeerList.set(peer.peerId, hmsPeer);
    HMSLogger.d(this.TAG, `adding to the peerList`, hmsPeer);

    peer.tracks.forEach((track) => {
      this.trackStateMap.set(track.track_id, {
        peerId: peer.peerId,
        trackInfo: track,
      });
    });

    this.processPendingTracks();
  };

  private handlePeerLeave = (peer: PeerNotification) => {
    this.hmsPeerList.delete(peer.peerId);
  };

  private handlePeerList = (peerList: PeerList) => {
    const peers = peerList.peers;
    peers?.forEach((peer) => this.handlePeerJoin(peer));
  };
}
