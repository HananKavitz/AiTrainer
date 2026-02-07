/**
 * Audio player for coaching messages
 * Currently using mock implementation for development
 * To enable real audio, add MP3 files to assets/audio/encouraging/ and set MOCK_MODE to false
 */

import * as Haptics from 'expo-haptics';

const MOCK_MODE = true;

export class CoachAudioPlayer {
  private isLoaded = false;
  private isPlaying = false;
  private messageQueue: string[] = [];
  private isProcessingQueue = false;

  async load(): Promise<void> {
    if (this.isLoaded) return;
    this.isLoaded = true;
    console.log('Audio player loaded (mock mode)');
  }

  async play(key: string): Promise<void> {
    this.messageQueue.push(key);
    if (!this.isProcessingQueue) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.messageQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const key = this.messageQueue.shift();
      if (key) {
        await this.playSound(key);
      }
    }

    this.isProcessingQueue = false;
  }

  private async playSound(key: string): Promise<void> {
    // Trigger haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!MOCK_MODE) {
      // Real audio playback would go here
      // This is where we'd load and play the actual MP3 file
      console.log(`Playing audio: ${key}`);
    }

    // Simulate audio playback duration (3 seconds)
    this.isPlaying = true;
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.isPlaying = false;
  }

  loaded(): boolean {
    return this.isLoaded;
  }

  playing(): boolean {
    return this.isPlaying;
  }

  getQueueSize(): number {
    return this.messageQueue.length;
  }

  clearQueue(): void {
    this.messageQueue = [];
  }

  async stop(): Promise<void> {
    this.isPlaying = false;
    this.clearQueue();
    this.isProcessingQueue = false;
  }

  async unload(): Promise<void> {
    await this.stop();
    this.isLoaded = false;
  }
}

let globalPlayer: CoachAudioPlayer | null = null;

export function getAudioPlayer(): CoachAudioPlayer {
  if (!globalPlayer) {
    globalPlayer = new CoachAudioPlayer();
  }
  return globalPlayer;
}

export async function initAudioPlayer(): Promise<void> {
  const player = getAudioPlayer();
  await player.load();
}

export async function playRandomClimbMessage(): Promise<void> {
  const messages = ['climb_1', 'climb_2', 'climb_3', 'climb_4', 'climb_5'];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const player = getAudioPlayer();
  await player.play(randomMessage);
}
