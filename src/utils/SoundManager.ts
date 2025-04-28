class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {};
  private static initialized: boolean = false;
  private static muted: boolean = false;

  // Define sound sources
  private static soundSources = {
    hit: '/sounds/hit.mp3',
    miss: '/sounds/miss.mp3',
    damage: '/sounds/damage.mp3',
    gameOver: '/sounds/game-over.mp3',
    start: '/sounds/start.mp3',
  };

  // Initialize all sounds
  static initialize(): void {
    if (this.initialized) return;
    
    // Create audio elements for each sound
    Object.entries(this.soundSources).forEach(([name, src]) => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';
      this.sounds[name] = audio;
    });
    
    this.initialized = true;
  }

  // Play a sound by name
  static play(name: keyof typeof SoundManager.soundSources): void {
    if (this.muted || !this.sounds[name]) return;
    
    // Create a new audio instance to allow overlapping sounds
    const sound = this.sounds[name].cloneNode() as HTMLAudioElement;
    sound.volume = 0.5; // Set volume to 50%
    sound.play().catch(e => console.log('Audio play error:', e));
  }

  // Set mute state
  static setMuted(muted: boolean): void {
    this.muted = muted;
  }

  // Toggle mute state
  static toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }
}

export default SoundManager;