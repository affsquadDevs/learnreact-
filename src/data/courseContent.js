// Rich lesson content (levels 1-2 for now). Keyed by the same ids as the
// roadmap, so course/roadmap progress in localStorage keeps working.
import content from './courseContent.json';

export const contentMeta = content.meta;

// topicId (e.g. "l1-t0") -> array of concept objects with full content.
export const topicContent = {};
// conceptId (e.g. "l1-t0-c0") -> concept object.
export const conceptById = {};

for (const level of content.levels) {
  for (const topic of level.topics) {
    topicContent[topic.id] = topic.concepts;
    for (const concept of topic.concepts) {
      conceptById[concept.id] = concept;
    }
  }
}

export function getTopicConcepts(topicId) {
  return topicContent[topicId] ?? null;
}

export function hasContent(topicId) {
  return Boolean(topicContent[topicId]?.length);
}
