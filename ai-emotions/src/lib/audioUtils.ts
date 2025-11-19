export async function mergeAudioClips(
  audioSrcs: string[],
  gapMs: number = 500
): Promise<Blob> {
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new Ctx();

  // 1. Fetch and decode all audio clips
  const audioBuffers: AudioBuffer[] = [];
  for (const src of audioSrcs) {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    audioBuffers.push(audioBuffer);
  }

  if (audioBuffers.length === 0) {
    throw new Error("No audio buffers to merge");
  }

  // 2. Calculate total duration
  // Total duration = sum of all clips + gaps between them
  const totalDuration =
    audioBuffers.reduce((acc, buf) => acc + buf.duration, 0) +
    (audioBuffers.length > 1 ? (audioBuffers.length - 1) * (gapMs / 1000) : 0);

  // 3. Create OfflineAudioContext to render the sequence
  const offlineCtx = new OfflineAudioContext(
    audioBuffers[0].numberOfChannels,
    Math.ceil(totalDuration * audioBuffers[0].sampleRate),
    audioBuffers[0].sampleRate
  );

  // 4. Schedule sources on the timeline
  let currentTime = 0;
  for (const buffer of audioBuffers) {
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineCtx.destination);
    source.start(currentTime);
    currentTime += buffer.duration + gapMs / 1000;
  }

  // 5. Render the audio
  const renderedBuffer = await offlineCtx.startRendering();

  // 6. Convert to WAV Blob
  return bufferToWav(renderedBuffer);
}

// Helper to convert AudioBuffer to WAV Blob
function bufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  // Interleave channels if necessary
  const result = interleave(buffer);
  
  const dataLength = result.length * 2; // 2 bytes per sample (16-bit)
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, "RIFF");
  // file length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, "WAVE");
  // format chunk identifier
  writeString(view, 12, "fmt ");
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, format, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // bits per sample
  view.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(view, 36, "data");
  // data chunk length
  view.setUint32(40, dataLength, true);

  // write the PCM samples
  floatTo16BitPCM(view, 44, result);

  return new Blob([view], { type: "audio/wav" });
}

function interleave(buffer: AudioBuffer): Float32Array {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels;
  const result = new Float32Array(length);
  const input = [];

  for (let i = 0; i < numChannels; i++) {
    input.push(buffer.getChannelData(i));
  }

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    for (let i = 0; i < numChannels; i++) {
      result[index++] = input[i][inputIndex];
    }
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

