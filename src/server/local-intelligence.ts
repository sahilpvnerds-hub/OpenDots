import type { WorkspaceStore } from './workspace.js';

export function createLocalIntelligence(workspace: WorkspaceStore) {
  const threadMessagesMap = new Map<string, Array<{ role: string; content: string }>>();

  return {
    apiUrl: 'http://127.0.0.1:4310/api',
    wsUrl: 'ws://127.0.0.1:4310/api',
    ɵgetApiUrl() {
      return 'http://127.0.0.1:4310/api';
    },
    ɵgetRunnerWsUrl() {
      return 'ws://127.0.0.1:4310/api';
    },
    ɵgetClientWsUrl() {
      return 'ws://127.0.0.1:4310/api';
    },
    ɵgetChannelsWsUrl() {
      return 'ws://127.0.0.1:4310/api';
    },
    ɵgetRunnerAuthToken() {
      return 'local';
    },

    async getRuntimeEntitlements() {
      return {
        status: 'ready' as const,
        entitlement: {
          active: true,
          source: 'self-hosted',
          features: { threads: true },
          limits: {},
        },
      };
    },

    async createThread(params: {
      threadId: string;
      userId: string;
      agentId: string;
      name?: string;
    }) {
      return {
        thread: {
          id: params.threadId,
          name: params.name ?? 'A new thought',
          createdAt: Date.now(),
        },
      };
    },

    async getOrCreateThread(params: {
      threadId: string;
      userId: string;
      agentId: string;
      name?: string;
    }) {
      return {
        thread: {
          id: params.threadId,
          name: params.name ?? 'Page conversation',
          createdAt: Date.now(),
        },
      };
    },

    async listThreads(params?: { userId?: string; agentId?: string }) {
      const conversations = workspace.conversations();
      const filtered = params?.agentId
        ? conversations.filter((c) => c.dotId === params.agentId)
        : conversations;

      return {
        threads: filtered.map((c) => ({
          id: c.id,
          name: c.title,
          agentId: c.dotId,
          createdAt: new Date(c.createdAt).toISOString(),
          updatedAt: new Date(c.createdAt).toISOString(),
        })),
        nextCursor: null,
      };
    },

    async getThread(params: { threadId: string }) {
      const conv = workspace.conversations().find((c) => c.id === params.threadId);
      return {
        thread: {
          id: params.threadId,
          name: conv?.title ?? 'Conversation',
          createdAt: conv?.createdAt ?? Date.now(),
        },
      };
    },

    async getThreadMessages(params: { threadId: string; userId?: string }) {
      const messages = threadMessagesMap.get(params.threadId) ?? [];
      return { messages };
    },

    async deleteThread(params: { threadId: string; userId?: string }) {
      threadMessagesMap.delete(params.threadId);
      return { ok: true };
    },

    async getLearnedSkillsSnapshots() {
      return [];
    },

    async getInspectorLearning() {
      return null;
    },

    async ɵconnectThread() {
      return null;
    },

    async ɵgetActiveJoinCode() {
      return null;
    },

    async ɵacquireThreadLock() {
      return { ok: true };
    },

    async ɵcleanupThreadLock() {
      return { ok: true };
    },

    async ɵrenewThreadLock() {
      return { ok: true };
    },

    async ɵsubscribeToThreads() {
      return { ok: true };
    },

    async ɵsubscribeToMemories() {
      return { ok: true };
    },

    async listMemories() {
      return { memories: [] };
    },

    async createMemory() {
      return { id: 'local' };
    },

    async updateMemory() {
      return { ok: true };
    },

    async removeMemory() {
      return { ok: true };
    },

    async recallMemories() {
      return { memories: [] };
    },

    async updateThread(params: { threadId: string; name?: string }) {
      return { thread: { id: params.threadId, name: params.name } };
    },

    async archiveThread() {
      return { ok: true };
    },

    async annotate() {
      return { ok: true };
    },

    async getInspectorMetadata() {
      return {};
    },

    ɵgetApiKey() {
      return 'local';
    },

    ɵgetLearningContainerId() {
      return undefined;
    },

    ɵisEnterpriseLearningEnabled() {
      return false;
    },
  };
}
