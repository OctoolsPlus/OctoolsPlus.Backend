export type Root = Root2[]

export interface Root2 {
  mimeType: string
  qualityLabel?: string
  bitrate: number
  audioBitrate?: number
  itag: number
  url: string
  width?: number
  height?: number
  initRange?: InitRange
  indexRange?: IndexRange
  lastModified: string
  contentLength?: string
  quality: string
  fps?: number
  projectionType: string
  averageBitrate?: number
  colorInfo?: ColorInfo
  approxDurationMs: string
  hasVideo: boolean
  hasAudio: boolean
  container: string
  codecs: string
  videoCodec?: string
  audioCodec?: string
  isLive: boolean
  isHLS: boolean
  isDashMPD: boolean
  highReplication?: boolean
  audioQuality?: string
  audioSampleRate?: string
  audioChannels?: number
  loudnessDb?: number
}

export interface InitRange {
  start: string
  end: string
}

export interface IndexRange {
  start: string
  end: string
}

export interface ColorInfo {
  transferCharacteristics: string
}
