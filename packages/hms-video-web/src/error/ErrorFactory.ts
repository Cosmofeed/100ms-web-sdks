/*
 * ErrorFactory.ts
 *
 * Created by codegen
 * Copyright © 2021 100ms. All rights reserved.
 */

import { ErrorCodes } from './ErrorCodes';
import { HMSException } from './HMSException';

export enum HMSAction {
  NONE = 'NONE',
  TRACK = 'TRACK',
  INIT = 'INIT',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  JOIN = 'JOIN',
  SUBSCRIBE = 'SUBSCRIBE',
  DATA_CHANNEL_SEND = 'DATA_CHANNEL_SEND',
  RESTART_ICE = 'RESTART_ICE',
  VIDEO_PLUGINS = 'VIDEO_PLUGINS',
  AUDIO_PLUGINS = 'AUDIO_PLUGINS',
  AUTOPLAY = 'AUTOPLAY',
  RECONNECT_SIGNAL = 'RECONNECT_SIGNAL',
  VALIDATION = 'VALIDATION',
  PLAYLIST = 'PLAYLIST',
}

export const ErrorFactory = {
  WebSocketConnectionErrors: {
    GenericConnect(action: HMSAction, description: string = '') {
      return new HMSException(1000, 'GenericConnect', action, `Something went wrong`, description);
    },

    WebSocketConnectionLost(action: HMSAction, description: string = '') {
      return new HMSException(1003, 'WebSocketConnectionLost', action, `Network connection lost `, description);
    },
  },

  InitAPIErrors: {
    ServerErrors(code: number, action: HMSAction, description: string = '') {
      return new HMSException(code, 'ServerErrors', action, `[INIT]: Server error`, description);
    },

    ConnectionLost(action: HMSAction, description: string = '') {
      return new HMSException(2001, 'ConnectionLost', action, `[INIT]: Network error`, description);
    },

    HTTPError(code: number, action: HMSAction, description: string = '') {
      return new HMSException(code, 'HTTPError', action, `[INIT]: Bad Request`, description);
    },

    InvalidEndpointURL(action: HMSAction, description: string = '') {
      return new HMSException(2002, 'InvalidEndpointURL', action, `Endpoint URL is invalid`, description);
    },

    EndpointUnreachable(action: HMSAction, description: string = '') {
      return new HMSException(2003, 'EndpointUnreachable', action, `Endpoint is not reachable.`, description);
    },

    InvalidTokenFormat(action: HMSAction, description: string = '') {
      return new HMSException(2004, 'InvalidTokenFormat', action, `Token is not in proper JWT format`, description);
    },
  },

  TracksErrors: {
    GenericTrack(action: HMSAction, description: string = '') {
      return new HMSException(3000, 'GenericTrack', action, `[PUBLISH]: Something went wrong`, description);
    },

    CantAccessCaptureDevice(action: HMSAction, deviceInfo: string, description: string = '') {
      return new HMSException(
        3001,
        'CantAccessCaptureDevice',
        action,
        `[PUBLISH]: No permission to access capture device - ${deviceInfo}`,
        description,
      );
    },

    DeviceNotAvailable(action: HMSAction, deviceInfo: string, description: string = '') {
      return new HMSException(
        3002,
        'DeviceNotAvailable',
        action,
        `[PUBLISH]: Capture device is no longer available - ${deviceInfo}`,
        description,
      );
    },

    DeviceInUse(action: HMSAction, deviceInfo: string, description: string = '') {
      return new HMSException(
        3003,
        'DeviceInUse',
        action,
        `[PUBLISH]: Capture device is in use by another application - ${deviceInfo}`,
        description,
      );
    },

    DeviceLostMidway(action: HMSAction, deviceInfo: string, description: string = '') {
      return new HMSException(
        3008,
        'DeviceLostMidway',
        action,
        `Lost access to capture device midway - ${deviceInfo}`,
        description,
      );
    },

    NothingToReturn(action: HMSAction, description: string = '') {
      return new HMSException(
        3005,
        'NothingToReturn',
        action,
        `There is no media to return. Please select either video or audio or both.`,
        description,
      );
    },

    InvalidVideoSettings(action: HMSAction, description: string = '') {
      return new HMSException(
        3006,
        'InvalidVideoSettings',
        action,
        `Cannot enable simulcast when no video settings are provided`,
        description,
      );
    },

    AutoplayBlocked(action: HMSAction, description: string = '') {
      return new HMSException(
        ErrorCodes.TracksErrors.AUTOPLAY_ERROR,
        'AutoplayBlocked',
        action,
        "Autoplay blocked because the user didn't interact with the document first",
        description,
      );
    },

    CodecChangeNotPermitted(action: HMSAction, description: string = '') {
      return new HMSException(3007, 'CodecChangeNotPermitted', action, `Codec can't be changed mid call.`, description);
    },
  },

  WebrtcErrors: {
    CreateOfferFailed(action: HMSAction, description: string = '') {
      return new HMSException(
        4001,
        'CreateOfferFailed',
        action,
        `[${action.toString()}]: Failed to create offer. `,
        description,
      );
    },

    CreateAnswerFailed(action: HMSAction, description: string = '') {
      return new HMSException(
        4002,
        'CreateAnswerFailed',
        action,
        `[${action.toString()}]: Failed to create answer. `,
        description,
      );
    },

    SetLocalDescriptionFailed(action: HMSAction, description: string = '') {
      return new HMSException(
        4003,
        'SetLocalDescriptionFailed',
        action,
        `[${action.toString()}]: Failed to set offer. `,
        description,
      );
    },

    SetRemoteDescriptionFailed(action: HMSAction, description: string = '') {
      return new HMSException(
        4004,
        'SetRemoteDescriptionFailed',
        action,
        `[${action.toString()}]: Failed to set answer. `,
        description,
      );
    },

    ICEFailure(action: HMSAction, description: string = '') {
      return new HMSException(
        4005,
        'ICEFailure',
        action,
        `[${action.toString()}]: Ice connection state FAILED`,
        description,
      );
    },
  },

  WebsocketMethodErrors: {
    ServerErrors(code: number, action: HMSAction, description: string) {
      return new HMSException(code, 'ServerErrors', action, description, description);
    },

    AlreadyJoined(action: HMSAction, description: string = '') {
      return new HMSException(5001, 'AlreadyJoined', action, `[JOIN]: You have already joined this room.`, description);
    },

    CannotJoinPreviewInProgress(action: HMSAction, description: string = '') {
      return new HMSException(
        5002,
        'CannotJoinPreviewInProgress',
        action,
        `[JOIN]: Cannot join if preview is in progress`,
        description,
      );
    },
  },

  GenericErrors: {
    NotConnected(action: HMSAction, description: string = '') {
      return new HMSException(6000, 'NotConnected', action, `Client is not connected`, description);
    },

    Signalling(action: HMSAction, description: string) {
      return new HMSException(
        6001,
        'Signalling',
        action,
        `Unknown signalling error: ${action.toString()} ${description} `,
        description,
      );
    },

    Unknown(action: HMSAction, description: string) {
      return new HMSException(6002, 'Unknown', action, `Unknown exception: ${description}`, description);
    },

    NotReady(action: HMSAction, description: string = '') {
      return new HMSException(6003, 'NotReady', action, `WebRTC engine is not ready yet`, description);
    },

    JsonParsingFailed(action: HMSAction, jsonMessage: string, description: string = '') {
      return new HMSException(
        6004,
        'JsonParsingFailed',
        action,
        `Failed to parse JSON message - ${jsonMessage}`,
        description,
      );
    },

    TrackMetadataMissing(action: HMSAction, description: string = '') {
      return new HMSException(6005, 'TrackMetadataMissing', action, `Track Metadata Missing`, description);
    },

    RTCTrackMissing(action: HMSAction, description: string = '') {
      return new HMSException(6006, 'RTCTrackMissing', action, `RTC Track missing`, description);
    },

    PeerMetadataMissing(action: HMSAction, description: string = '') {
      return new HMSException(6007, 'PeerMetadataMissing', action, `Peer Metadata Missing`, description);
    },

    ValidationFailed(message: string, entity?: any) {
      return new HMSException(
        6008,
        'ValidationFailed',
        HMSAction.VALIDATION,
        message,
        entity ? JSON.stringify(entity) : '',
      );
    },

    InvalidRole(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.GenericErrors.INVALID_ROLE,
        'InvalidRole',
        action,
        `Invalid role. Join with valid role`,
        description,
        true,
      );
    },
  },

  MediaPluginErrors: {
    PlatformNotSupported(action: HMSAction, description: string = '') {
      return new HMSException(
        7001,
        'PlatformNotSupported',
        action,
        'Check HMS Docs to see the list of supported platforms',
        description,
      );
    },

    InitFailed(action: HMSAction, description: string = '') {
      return new HMSException(7002, 'InitFailed', action, 'Plugin init failed', description);
    },

    ProcessingFailed(action: HMSAction, description: string = '') {
      return new HMSException(7003, 'ProcessingFailed', action, 'Plugin processing failed', description);
    },

    AddAlreadyInProgress(action: HMSAction, description: string = '') {
      return new HMSException(7004, 'AddAlreadyInProgress', action, 'Plugin add already in progress', description);
    },
  },

  PlaylistErrors: {
    NoEntryToPlay(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.PlaylistErrors.NO_ENTRY_TO_PLAY,
        'NoEntryToPlay',
        action,
        'Reached end of playlist',
        description,
      );
    },
    NoEntryPlaying(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.PlaylistErrors.NO_ENTRY_IS_PLAYING,
        'NoEntryIsPlaying',
        action,
        'No entry is playing at this time',
        description,
      );
    },
  },
};
