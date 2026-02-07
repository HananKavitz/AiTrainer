# Audio Files

This directory contains voice coaching messages for the AI Running Coach.

## Encouraging Messages

Add the following MP3 files to this directory:

1. `climb_1.mp3` - "Ease the pace. Shorten your stride. You're doing fine."
2. `climb_2.mp3` - "This climb counts. Breathe steady."
3. `climb_3.mp3` - "Slow is strong. Stay tall."
4. `climb_4.mp3` - "You didn't come this far to stop."
5. `climb_5.mp3` - "Control the effort, not the hill."

## Audio Requirements

- Format: MP3
- Quality: 128 kbps or higher
- Duration: 3-6 seconds each
- Voice: Clear, encouraging female or male voice
- Volume: Consistent levels across all messages

## Recording Tips

1. Speak clearly and at a moderate pace
2. Use an encouraging, supportive tone
3. Keep the energy level consistent
4. Consider adding a brief pause after the message

## Temporary Setup

For development/testing, the app currently uses placeholder require statements. When you add the actual audio files, the require statements in `constants/coach.ts` will automatically reference them.
