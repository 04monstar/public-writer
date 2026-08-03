import type { Story } from '@/types/story';
import { ALL_STORIES, storyById } from './stories';

/** Simulated network + typesetting latency so the loading experience feels real. */
const simulateLatency = (ms = 700) =>
  new Promise<void>((resolve) => setTimeout(resolve, 420 + Math.random() * ms));

export async function fetchStory(id: string): Promise<Story> {
  await simulateLatency();
  const story = storyById(id);
  if (!story) {
    throw new Error(`The volume "shelf-${id}" could not be located in the library.`);
  }
  return story;
}

export async function fetchStories(): Promise<Story[]> {
  await simulateLatency(500);
  return ALL_STORIES;
}

export async function fetchCoverHue(id: string): Promise<number> {
  await simulateLatency(150);
  return storyById(id)?.meta.coverHue ?? 200;
}
